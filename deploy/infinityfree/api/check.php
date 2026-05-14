<?php

require __DIR__ . '/bootstrap.php';

$db = pdo();
$tables = ['profile', 'skills', 'projects', 'project_tech', 'messages'];
$counts = [];

foreach ($tables as $table) {
    try {
        $counts[$table] = (int) $db->query('SELECT COUNT(*) AS total FROM `' . $table . '`')->fetch()['total'];
    } catch (Throwable $error) {
        json_response(500, [
            'ok' => false,
            'error' => $table . ' tablosu okunamadi.',
        ]);
    }
}

json_response(200, [
    'ok' => true,
    'database' => 'connected',
    'counts' => $counts,
]);
