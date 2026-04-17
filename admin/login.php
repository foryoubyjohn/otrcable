<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (admin_logged_in()) {
	header('Location: ' . admin_base_path() . '/dashboard.php', true, 302);
	exit;
}

$error = '';
$hash = admin_password_hash_value();

$allowedNext = [
	admin_base_path() . '/dashboard.php',
	admin_base_path() . '/leads/index.php',
	admin_base_path() . '/blog/index.php',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$pass = (string)($_POST['password'] ?? '');
	if ($hash === '' || !password_verify($pass, $hash)) {
		$error = 'Invalid password.';
	} else {
		$_SESSION['otr_admin'] = true;
		$next = (string)($_POST['next'] ?? '');
		if (in_array($next, $allowedNext, true)) {
			header('Location: ' . $next, true, 302);
		} else {
			header('Location: ' . admin_base_path() . '/dashboard.php', true, 302);
		}
		exit;
	}
}

$next = (string)($_GET['next'] ?? '');
if (!in_array($next, $allowedNext, true)) {
	$next = '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex, nofollow">
	<title>Admin sign in - OTR Cable</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center p-4">
	<form method="post" class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-slate-200">
		<input type="hidden" name="next" value="<?php echo htmlspecialchars($next, ENT_QUOTES); ?>">
		<h1 class="text-xl font-bold text-slate-900 mb-2">OTR Cable admin</h1>
		<p class="text-sm text-slate-600 mb-6">Sign in to manage leads and blog content.</p>
		<?php if ($error): ?>
			<p class="text-red-600 text-sm mb-4"><?php echo htmlspecialchars($error, ENT_QUOTES); ?></p>
		<?php endif; ?>
		<?php if ($hash === ''): ?>
			<p class="text-amber-700 text-sm mb-4">Missing <code class="bg-slate-100 px-1 rounded">config/admin_password_hash.php</code>.</p>
		<?php endif; ?>
		<label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
		<input type="password" name="password" required class="w-full border border-slate-300 rounded px-3 py-2 mb-4" autocomplete="current-password">
		<button type="submit" class="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700">Sign in</button>
	</form>
</body>
</html>
