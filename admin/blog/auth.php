<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
	session_start();
}

function blog_admin_hash(): string
{
	$path = __DIR__ . '/../../config/blog_admin_hash.php';
	if (!is_readable($path)) {
		return '';
	}
	/** @var string $h */
	$h = require $path;
	return is_string($h) ? $h : '';
}

function blog_admin_logged_in(): bool
{
	return !empty($_SESSION['blog_admin_ok']) && $_SESSION['blog_admin_ok'] === true;
}

function blog_admin_require_login(): void
{
	if (!blog_admin_logged_in()) {
		header('Location: login.php', true, 302);
		exit;
	}
}
