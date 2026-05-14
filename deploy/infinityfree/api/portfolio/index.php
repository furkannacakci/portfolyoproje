<?php

require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(405, ['error' => 'Method not allowed.']);
}

$db = pdo();
$profile = $db->query('SELECT name, title, location, email, summary, availability FROM profile WHERE id = 1')->fetch();
$skills = $db->query('SELECT id, name, category, `level` AS level FROM skills ORDER BY id ASC')->fetchAll();
$projects = $db->query('
    SELECT id, title, type, status, description, featured, source_path AS sourcePath, repository
    FROM projects
    ORDER BY sort_order ASC, title ASC
')->fetchAll();
$techRows = $db->query('SELECT project_id AS projectId, tech FROM project_tech ORDER BY sort_order ASC')->fetchAll();
$messages = $db->query('
    SELECT id, name, email, message, DATE_FORMAT(created_at, "%Y-%m-%dT%H:%i:%s.000Z") AS createdAt
    FROM messages
    ORDER BY created_at DESC
')->fetchAll();

$techByProject = [];
foreach ($techRows as $row) {
    $techByProject[$row['projectId']][] = $row['tech'];
}

foreach ($projects as &$project) {
    $project['featured'] = (bool) $project['featured'];
    $project['tech'] = $techByProject[$project['id']] ?? [];
}

json_response(200, [
    'profile' => $profile,
    'skills' => $skills,
    'projects' => $projects,
    'messages' => $messages,
]);
