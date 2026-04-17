<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/rate_limit.php';

/**
 * Base URL path for admin (no trailing slash). Override if the site lives in a subdirectory.
 */
function admin_base_path(): string
{
	$env = getenv('OTR_ADMIN_BASE');
	if (is_string($env) && $env !== '') {
		return rtrim($env, '/');
	}
	return '/admin';
}

function admin_password_hash_value(): string
{
	$path = __DIR__ . '/../config/admin_password_hash.php';
	if (!is_readable($path)) {
		return '';
	}
	/** @var string $h */
	$h = require $path;
	return is_string($h) ? $h : '';
}

function admin_https_detected(): bool
{
	if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
		return true;
	}
	$f = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '';
	return is_string($f) && strtolower($f) === 'https';
}

function admin_configure_session(): void
{
	if (session_status() !== PHP_SESSION_NONE) {
		return;
	}
	ini_set('session.use_strict_mode', '1');
	session_name('OTRADMINSESSID');
	$secure = admin_https_detected();
	$path = admin_base_path();
	if ($path === '') {
		$path = '/';
	}
	session_set_cookie_params([
		'lifetime' => 0,
		'path' => $path,
		'domain' => '',
		'secure' => $secure,
		'httponly' => true,
		'samesite' => 'Lax',
	]);
	session_start();
}

admin_configure_session();

function admin_csrf_token(): string
{
	if (empty($_SESSION['_csrf'])) {
		$_SESSION['_csrf'] = bin2hex(random_bytes(32));
	}
	return (string)$_SESSION['_csrf'];
}

function admin_csrf_verify(?string $token): bool
{
	return is_string($token) && !empty($_SESSION['_csrf']) && hash_equals((string)$_SESSION['_csrf'], $token);
}

function admin_csrf_rotate(): void
{
	unset($_SESSION['_csrf']);
}

function admin_logged_in(): bool
{
	return !empty($_SESSION['otr_admin']) && $_SESSION['otr_admin'] === true;
}

function admin_require_login(): void
{
	if (!admin_logged_in()) {
		$target = admin_base_path() . '/login.php';
		header('Location: ' . $target, true, 302);
		exit;
	}
}

function admin_logout(): void
{
	unset($_SESSION['otr_admin']);
	admin_csrf_rotate();
}
