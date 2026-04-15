<?php
// Database connection using PDO with safe defaults for XAMPP
// Environment-aware configuration with graceful fallbacks

declare(strict_types=1);

// Ensure timezone is set to avoid warnings in date operations
if (!ini_get('date.timezone')) {
	date_default_timezone_set('UTC');
}

/**
 * Returns a configured PDO instance connected to MySQL.
 */
function get_pdo(): PDO
{
	$host = getenv('DB_HOST') ?: '127.0.0.1';
	$port = getenv('DB_PORT') ?: '3306';
	$db   = getenv('DB_DATABASE') ?: 'otr_cable';
	$user = getenv('DB_USERNAME') ?: 'root';
	$pass = getenv('DB_PASSWORD') ?: '';
	$charset = 'utf8mb4';

	$dsn = "mysql:host={$host};port={$port};dbname={$db};charset={$charset}";
	$options = [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	];

	return new PDO($dsn, $user, $pass, $options);
}

/**
 * Sends a JSON response with appropriate headers if possible.
 */
function send_json(array $payload, int $statusCode = 200): void
{
	if (php_sapi_name() !== 'cli' && !headers_sent()) {
		http_response_code($statusCode);
		header('Content-Type: application/json; charset=utf-8');
		// Basic caching guard for API responses
		header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
		header('Pragma: no-cache');
	}
	echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

/**
 * Generates a UUID v4 string.
 */
function uuidv4(): string
{
	$bytes = random_bytes(16);
	$bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40); // version 4
	$bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80); // variant
	return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
}

/**
 * Minimal logger that writes to logs/app.log
 */
function log_soft_error(string $message, array $context = []): void
{
	$logDir = __DIR__ . '/../logs';
	if (!is_dir($logDir)) {
		@mkdir($logDir, 0775, true);
	}
	$line = sprintf(
		"%s\t%s\t%s\n",
		date('c'),
		$message,
		json_encode($context, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
	);
	@file_put_contents($logDir . '/app.log', $line, FILE_APPEND);
}


