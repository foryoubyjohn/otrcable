<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
	session_start();
}

/**
 * Base URL path for admin (no trailing slash). Override if the site lives in a subdirectory.
 * Example: /otrcable/admin
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
}
