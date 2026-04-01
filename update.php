<?php
// save.php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

// حقل اسم الطالب مطلوب كأقل شرط (يمكن تعديله حسب حاجتك)
$name = isset($input['name']) ? trim($input['name']) : null;
$roll = isset($input['roll']) ? trim($input['roll']) : null;
$dept = isset($input['dept']) ? trim($input['dept']) : null;
$gpa  = isset($input['gpa'])  ? trim($input['gpa'])  : null;

if (!$name) {
    http_response_code(400);
    echo json_encode(['success'=>false, 'message'=>'name required']);
    exit;
}

try {
    if (!empty($input['id'])) {
        // Update existing
        $id = (int)$input['id'];
        $sql = "UPDATE students
                SET name = :name, roll = :roll, dept = :dept, gpa = :gpa
                WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':roll' => $roll,
            ':dept' => $dept,
            ':gpa'  => $gpa,
            ':id'   => $id
        ]);
        echo json_encode(['success'=>true, 'action'=>'update', 'rows'=>$stmt->rowCount()]);
    } else {
        // Insert new
        $sql = "INSERT INTO students (name, roll, dept, gpa)
                VALUES (:name, :roll, :dept, :gpa)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':roll' => $roll,
            ':dept' => $dept,
            ':gpa'  => $gpa
        ]);
        echo json_encode(['success'=>true, 'action'=>'insert', 'id'=>$pdo->lastInsertId()]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'message'=>$e->getMessage()]);
}
