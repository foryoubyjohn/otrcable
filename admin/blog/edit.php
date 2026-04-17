<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/posts.php';

admin_require_login();

$slug = (string)($_GET['slug'] ?? '');
if (!in_array($slug, blog_admin_post_slugs(), true)) {
	http_response_code(404);
	echo 'Unknown post.';
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
	echo 'Markers missing in post file.';
	exit;
}
$inner = substr($raw, $posA + strlen($start), $posB - $posA - strlen($start));
$inner = trim($inner, "\r\n");
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Edit <?php echo htmlspecialchars($slug, ENT_QUOTES); ?> - OTR Cable</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen p-6">
	<div class="max-w-5xl mx-auto">
		<div class="flex flex-wrap justify-between items-center gap-4 mb-6">
			<a href="index.php" class="text-blue-600 hover:underline text-sm">← All posts</a>
			<a href="../dashboard.php" class="text-slate-600 hover:underline text-sm">Dashboard</a>
		</div>
		<h1 class="text-xl font-bold text-slate-900 mb-4">Edit: <?php echo htmlspecialchars($slug, ENT_QUOTES); ?>.html</h1>
		<?php if (!empty($_GET['saved'])): ?>
			<p class="text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2 text-sm mb-4">Saved successfully.</p>
		<?php endif; ?>
		<form method="post" action="save.php" class="space-y-4">
			<input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(admin_csrf_token(), ENT_QUOTES); ?>">
			<input type="hidden" name="slug" value="<?php echo htmlspecialchars($slug, ENT_QUOTES); ?>">
			<label class="block text-sm font-medium text-slate-700">Article body (HTML)</label>
			<textarea name="html" rows="28" class="w-full font-mono text-sm border border-slate-300 rounded p-3"><?php echo htmlspecialchars($inner, ENT_QUOTES); ?></textarea>
			<button type="submit" class="bg-blue-600 text-white font-medium px-6 py-2 rounded hover:bg-blue-700">Save</button>
		</form>
	</div>
</body>
</html>
