<?php
// create.php (الإصدار المصحح)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No JSON input received']);
    exit;
}

try {
    // 1. حذف حقل 'id' من الاستعلام - لترك قاعدة البيانات تقوم بتوليده
    $sql = "INSERT INTO students (name, roll, dept, gpa) 
            VALUES (:name, :roll, :dept, :gpa)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $input['name'] ?? null,
        ':roll' => $input['roll'] ?? null,
        ':dept' => $input['dept'] ?? null,
        ':gpa' => $input['gpa'] ?? 0 // افتراض 0 للـ GPA إذا كان غير متوفر
    ]);
    
    // 2. الحصول على الـ ID الذي تم إدخاله حديثاً
    $newId = $pdo->lastInsertId();
    
    // 3. إرجاع الـ ID الجديد إلى الواجهة الأمامية في الصيغة المتوقعة
    echo json_encode([
        'success' => true, 
        'data' => [
            'id' => $newId // هذا يفي بشرط: apiResponse.data.id في script.js
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB error: '.$e->getMessage()]);
}
?>