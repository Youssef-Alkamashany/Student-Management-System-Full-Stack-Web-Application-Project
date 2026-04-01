<?php
// config.php
// عدل هذه القيم حسب الإعدادات عندك
$DB_HOST = '127.0.0.1';
$DB_NAME = 'project';    // غيّر لاسم قاعدة بياناتك
$DB_USER = 'root';
$DB_PASS = '';           // كلمة المرور إن وجدت
$DB_CHAR = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$DB_CHAR}";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
    // لا تعرض هذا في production بدون تحكم
    http_response_code(500);
    echo json_encode(['success'=>false, 'message'=>'DB connection failed: '.$e->getMessage()]);
    exit;
}
