<?php

require __DIR__ . '/../bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = pdo();

if ($method === 'POST') {
    require_admin();
    $project = normalize_project(request_body());

    $minSort = (int) $db->query('SELECT COALESCE(MIN(sort_order), 0) AS sort_order FROM projects')->fetch()['sort_order'];
    $db->beginTransaction();
    try {
        $statement = $db->prepare('
            INSERT INTO projects (id, title, type, status, description, featured, source_path, repository, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?)
        ');
        $statement->execute([
            $project['id'],
            $project['title'],
            $project['type'],
            $project['status'],
            $project['description'],
            $project['featured'],
            $minSort - 1,
        ]);

        $techStatement = $db->prepare('INSERT INTO project_tech (project_id, tech, sort_order) VALUES (?, ?, ?)');
        foreach ($project['tech'] as $index => $tech) {
            $techStatement->execute([$project['id'], $tech, $index]);
        }
        $db->commit();
    } catch (Throwable $error) {
        $db->rollBack();
        json_response(400, ['error' => 'Proje kaydedilemedi.']);
    }

    $project['featured'] = (bool) $project['featured'];
    json_response(201, $project);
}

if ($method === 'DELETE') {
    require_admin();
    $projectId = trim((string) ($_GET['id'] ?? ''));
    if ($projectId === '') {
        json_response(404, ['error' => 'Proje bulunamadi.']);
    }

    $statement = $db->prepare('DELETE FROM projects WHERE id = ?');
    $statement->execute([$projectId]);
    if ($statement->rowCount() === 0) {
        json_response(404, ['error' => 'Proje bulunamadi.']);
    }
    json_response(200, ['ok' => true]);
}

json_response(405, ['error' => 'Method not allowed.']);
