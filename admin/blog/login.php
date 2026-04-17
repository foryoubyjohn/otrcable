<?php
declare(strict_types=1);

require_once __DIR__ . '/../auth.php';

if (admin_logged_in()) {
	header('Location: index.php', true, 302);
	exit;
}

$target = admin_base_path() . '/login.php?next=' . rawurlencode(admin_base_path() . '/blog/index.php');
header('Location: ' . $target, true, 302);
exit;
