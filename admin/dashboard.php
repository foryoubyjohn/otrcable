<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config/db.php';

admin_require_login();

$leadCount = null;
$recentCount = null;
try {
	$pdo = get_pdo();
	$leadCount = (int)$pdo->query('SELECT COUNT(*) FROM `Lead`')->fetchColumn();
	$recentCount = (int)$pdo->query('SELECT COUNT(*) FROM `Lead` WHERE `createdAt` > DATE_SUB(NOW(), INTERVAL 7 DAY)')->fetchColumn();
} catch (Throwable $e) {
	log_soft_error('admin_dashboard_lead_count', ['error' => $e->getMessage()]);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex, nofollow">
	<title>Admin dashboard - OTR Cable</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen">
	<header class="bg-slate-900 text-white">
		<div class="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
			<h1 class="text-lg font-semibold">OTR Cable admin</h1>
			<nav class="flex flex-wrap items-center gap-4 text-sm">
				<a href="dashboard.php" class="text-white font-medium border-b-2 border-orange-400 pb-0.5">Dashboard</a>
				<a href="leads/index.php" class="text-slate-300 hover:text-white">Leads</a>
				<a href="blog/index.php" class="text-slate-300 hover:text-white">Blog</a>
				<a href="../index.html" class="text-slate-300 hover:text-white">View site</a>
				<a href="logout.php" class="text-slate-300 hover:text-white">Sign out</a>
			</nav>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4 py-10">
		<p class="text-slate-600 mb-8">Manage contact form submissions and blog article bodies from one place.</p>

		<div class="grid md:grid-cols-2 gap-6">
			<a href="leads/index.php" class="block bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition">
				<h2 class="text-xl font-bold text-slate-900 mb-2">Leads</h2>
				<p class="text-slate-600 text-sm mb-4">Website contact form submissions stored in the database.</p>
				<?php if ($leadCount !== null): ?>
					<p class="text-2xl font-bold text-blue-600"><?php echo $leadCount; ?> <span class="text-sm font-normal text-slate-500">total</span></p>
					<p class="text-sm text-slate-500 mt-1"><?php echo (int)$recentCount; ?> in the last 7 days</p>
				<?php else: ?>
					<p class="text-amber-700 text-sm">Database unavailable. Check MySQL and <code class="bg-slate-100 px-1 rounded">config/db.php</code>.</p>
				<?php endif; ?>
				<span class="inline-block mt-4 text-blue-600 font-medium text-sm">Open leads →</span>
			</a>

			<a href="blog/index.php" class="block bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-400 hover:shadow-md transition">
				<h2 class="text-xl font-bold text-slate-900 mb-2">Blog</h2>
				<p class="text-slate-600 text-sm mb-4">Edit article HTML between markers for each published post.</p>
				<p class="text-slate-500 text-sm">6 articles · links to public <code class="bg-slate-100 px-1 rounded text-xs">/blog/</code></p>
				<span class="inline-block mt-4 text-blue-600 font-medium text-sm">Manage blog →</span>
			</a>
		</div>
	</main>
</body>
</html>
