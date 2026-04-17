<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

admin_logout();
if (session_status() === PHP_SESSION_ACTIVE) {
	session_destroy();
}
header('Location: ' . admin_base_path() . '/login.php', true, 302);
exit;
