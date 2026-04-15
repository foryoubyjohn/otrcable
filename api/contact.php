<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	send_json(['error' => 'Method not allowed'], 405);
	exit;
}

// Read JSON body safely
$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '[]', true);
if (!is_array($data)) {
	send_json(['success' => false, 'error' => 'Invalid JSON body'], 400);
	exit;
}

// Basic validation mirroring the JS expectations
$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$company = trim((string)($data['company'] ?? ''));
$service = trim((string)($data['service'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$formType = 'general-contact';
$source = 'website-contact-form';

$errors = [];
if (strlen($name) < 2) $errors['name'] = 'Name must be at least 2 characters.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Please enter a valid email address.';
if ($service === '') $errors['service'] = 'Please select a service.';
if (strlen($message) < 10) $errors['message'] = 'Please enter a detailed message.';

if ($errors) {
	send_json(['success' => false, 'error' => 'Validation failed', 'details' => $errors], 400);
	exit;
}

try {
	$pdo = get_pdo();
	$sql = 'INSERT INTO `Lead` (id, name, email, phone, company, service, message, formType, source, status, createdAt, updatedAt)
		VALUES (:id, :name, :email, :phone, :company, :service, :message, :formType, :source, :status, NOW(3), NOW(3))';
	$stmt = $pdo->prepare($sql);
	$id = uuidv4();
	$stmt->execute([
		':id' => $id,
		':name' => $name,
		':email' => $email,
		':phone' => $phone,
		':company' => $company !== '' ? $company : null,
		':service' => $service,
		':message' => $message,
		':formType' => $formType,
		':source' => $source,
		':status' => 'new',
	]);

	send_json(['success' => true, 'message' => 'Message received successfully!']);
} catch (Throwable $e) {
	log_soft_error('contact_insert_failed', ['error' => $e->getMessage()]);
	send_json(['success' => false, 'error' => 'Internal server error'], 500);
}


