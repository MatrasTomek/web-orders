<?php
header('Access-Control-Allow-Origin: https://www.zlecenia.developerweb.pl');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Dozwolona tylko metoda POST']);
    exit;
}

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'Błąd przesyłania pliku']);
    exit;
}

$allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
$allowedExts  = ['pdf', 'jpg', 'jpeg', 'png'];

$file     = $_FILES['file'];
$mimeType = mime_content_type($file['tmp_name']);
$origExt  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($mimeType, $allowedMimes) || !in_array($origExt, $allowedExts)) {
    echo json_encode(['error' => 'Niedozwolony typ pliku. Akceptowane: PDF, JPG, PNG']);
    exit;
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$baseName = isset($_POST['filename']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '_', $_POST['filename']) : uniqid('doc_');
$filename  = $baseName . '.' . $origExt;
$destPath  = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    echo json_encode(['error' => 'Nie udało się zapisać pliku na serwerze']);
    exit;
}

$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host      = $_SERVER['HTTP_HOST'];
$baseUrl   = $protocol . '://' . $host . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
$fileUrl   = $baseUrl . '/uploads/' . $filename;

echo json_encode(['url' => $fileUrl]);
