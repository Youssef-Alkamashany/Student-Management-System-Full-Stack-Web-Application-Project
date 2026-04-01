<?php
// delete.php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['id'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'id required']);
    exit;
}

$id = (int)$input['id'];

try {
    $stmt = $pdo->prepare("DELETE FROM students WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success'=>true, 'deleted_rows' => $stmt->rowCount()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}
