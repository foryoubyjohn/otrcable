<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/posts.php';

admin_require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo 'Method not allowed';
	exit;
}

if (!admin_csrf_verify($_POST['csrf_token'] ?? null)) {
	http_response_code(403);
	echo 'Invalid security token. Refresh the editor and try again.';
	exit;
}

$slug = (string)($_POST['slug'] ?? '');
$html = (string)($_POST['html'] ?? '');

if (!in_array($slug, blog_admin_post_slugs(), true)) {
	http_response_code(400);
	echo 'Invalid slug';
	exit;
}

$path = blog_post_file_path($slug);
$raw = is_readable($path) ? file_get_contents($path) : '';
$start = '<!--otr-blog-content-start-->';
$end = '<!--otr-blog-content-end-->';
$posA = strpos($raw, $start);
$posB = strpos($raw, $end);
if ($posA === false || $posB === false || $posB <= $posA) {
	http_response_code(500);
	echo 'Markers missing';
	exit;
}

$before = substr($raw, 0, $posA + strlen($start));
$after = substr($raw, $posB);
$newBody = "\n" . $html . "\n";
$newFile = $before . $newBody . $after;

if (file_put_contents($path, $newFile) === false) {
	http_response_code(500);
	echo 'Write failed';
	exit;
}

admin_csrf_rotate();

header('Location: edit.php?slug=' . urlencode($slug) . '&saved=1', true, 302);
exit;
