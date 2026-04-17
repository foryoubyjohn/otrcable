<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (blog_admin_logged_in()) {
	header('Location: index.php', true, 302);
	exit;
}

$error = '';
$hash = blog_admin_hash();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$pass = (string)($_POST['password'] ?? '');
	$hash = blog_admin_hash();
	if ($hash === '' || !password_verify($pass, $hash)) {
		$error = 'Invalid password.';
	} else {
		$_SESSION['blog_admin_ok'] = true;
		header('Location: index.php', true, 302);
		exit;
	}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Blog admin login - OTR Cable</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-4">
	<form method="post" class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-slate-200">
		<h1 class="text-xl font-bold text-slate-900 mb-2">Blog admin</h1>
		<p class="text-sm text-slate-600 mb-6">Sign in to edit article HTML (between markers in each post file).</p>
		<?php if ($error): ?>
			<p class="text-red-600 text-sm mb-4"><?php echo htmlspecialchars($error, ENT_QUOTES); ?></p>
		<?php endif; ?>
		<?php if ($hash === ''): ?>
			<p class="text-amber-700 text-sm mb-4">Admin hash missing. Add <code class="bg-slate-100 px-1">config/blog_admin_hash.php</code>.</p>
		<?php endif; ?>
		<label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
		<input type="password" name="password" required class="w-full border border-slate-300 rounded px-3 py-2 mb-4" autocomplete="current-password">
		<button type="submit" class="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700">Sign in</button>
		<p class="text-xs text-slate-500 mt-4">Rotate the hash in <code class="bg-slate-100 px-1">config/blog_admin_hash.php</code> after first deploy.</p>
	</form>
</body>
</html>
