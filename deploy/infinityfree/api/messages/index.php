<?php

require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['error' => 'Method not allowed.']);
}

$payload = request_body();
$message = [
    'id' => create_id('msg'),
    'name' => require_text($payload, 'name', 'Ad Soyad', 80),
    'email' => require_text($payload, 'email', 'E-posta', 120),
    'message' => require_text($payload, 'message', 'Mesaj', 600),
];

$statement = pdo()->prepare('
    INSERT INTO messages (id, name, email, message, created_at)
    VALUES (?, ?, ?, ?, NOW())
');
$statement->execute([$message['id'], $message['name'], $message['email'], $message['message']]);

$message['createdAt'] = gmdate('Y-m-d\TH:i:s.000\Z');
json_response(201, $message);
