<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__.'/config.php';
try{
    $stmt=$pdo->query("SELECT * FROM students");
    echo json_encode(['success'=>true,'data'=>$stmt->fetchAll()]);
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}