<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function app_config(): array
{
    static $config = null;
    if ($config === null) {
        $config = require __DIR__ . '/config.php';
    }
    return $config;
}

function json_response(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function pdo(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $config = app_config();
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['db_host'],
        $config['db_name']
    );

    try {
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (Throwable $error) {
        json_response(500, ['error' => 'Database baglantisi kurulamadi. config.php bilgilerini kontrol et.']);
    }

    return $pdo;
}

function request_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(400, ['error' => 'Gecersiz JSON body.']);
    }
    return $data;
}

function require_text(array $payload, string $key, string $label, int $maxLength): string
{
    $value = isset($payload[$key]) ? trim((string) $payload[$key]) : '';
    if ($value === '') {
        json_response(400, ['error' => $label . ' zorunludur.']);
    }
    return substr($value, 0, $maxLength);
}

function create_id(string $prefix): string
{
    return $prefix . '-' . bin2hex(random_bytes(5));
}

function auth_token(string $password): string
{
    $payload = (string) time();
    $signature = hash_hmac('sha256', $payload, $password);
    return base64_encode($payload . '.' . $signature);
}

function is_admin_request(): bool
{
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $authorization = $headers['Authorization']
        ?? $headers['authorization']
        ?? $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (substr($authorization, 0, 7) !== 'Bearer ') {
        return false;
    }

    $token = substr($authorization, 7);
    $decoded = base64_decode($token, true);
    if ($decoded === false || strpos($decoded, '.') === false) {
        return false;
    }

    [$timestamp, $signature] = explode('.', $decoded, 2);
    if (!ctype_digit($timestamp) || ((int) $timestamp) < time() - 86400) {
        return false;
    }

    $expected = hash_hmac('sha256', $timestamp, app_config()['admin_password']);
    return hash_equals($expected, $signature);
}

function require_admin(): void
{
    if (!is_admin_request()) {
        json_response(401, ['error' => 'Admin girisi gerekli.']);
    }
}

function normalize_project(array $payload): array
{
    $tech = [];
    if (isset($payload['tech']) && is_array($payload['tech'])) {
        $tech = $payload['tech'];
    } else {
        $tech = explode(',', (string) ($payload['tech'] ?? ''));
    }

    $tech = array_values(array_slice(array_filter(array_map(
        function ($item) {
            return trim((string) $item);
        },
        $tech
    )), 0, 8));

    return [
        'id' => create_id('project'),
        'title' => require_text($payload, 'title', 'Proje basligi', 80),
        'type' => require_text($payload, 'type', 'Proje turu', 40),
        'status' => require_text($payload, 'status', 'Proje durumu', 40),
        'description' => require_text($payload, 'description', 'Proje aciklamasi', 420),
        'featured' => !empty($payload['featured']) ? 1 : 0,
        'tech' => $tech,
    ];
}
