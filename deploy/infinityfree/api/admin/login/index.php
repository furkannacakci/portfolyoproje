<?php

require __DIR__ . '/../../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['error' => 'Method not allowed.']);
}

$payload = request_body();
$password = (string) ($payload['password'] ?? '');

if (!hash_equals(app_config()['admin_password'], $password)) {
    json_response(401, ['error' => 'Admin sifresi hatali.']);
}

json_response(200, ['token' => auth_token($password)]);
