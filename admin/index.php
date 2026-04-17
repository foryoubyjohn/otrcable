<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/auth.php';

if (admin_logged_in()) {
	header('Location: ' . admin_base_path() . '/dashboard.php', true, 302);
} else {
	header('Location: ' . admin_base_path() . '/login.php', true, 302);
}
exit;
