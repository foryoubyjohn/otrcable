<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../../config/db.php';

admin_require_login();

$rows = [];
$dbError = null;
try {
	$pdo = get_pdo();
	$stmt = $pdo->query('SELECT `id`, `name`, `email`, `phone`, `company`, `service`, `status`, `createdAt` FROM `Lead` ORDER BY `createdAt` DESC LIMIT 200');
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $e) {
	$dbError = $e->getMessage();
	log_soft_error('admin_leads_list', ['error' => $e->getMessage()]);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex, nofollow">
	<title>Leads - OTR Cable admin</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen">
	<header class="bg-slate-900 text-white">
		<div class="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
			<h1 class="text-lg font-semibold">Leads</h1>
			<nav class="flex flex-wrap items-center gap-4 text-sm">
				<a href="../dashboard.php" class="text-slate-300 hover:text-white">Dashboard</a>
				<a href="index.php" class="text-white font-medium border-b-2 border-orange-400 pb-0.5">Leads</a>
				<a href="../blog/index.php" class="text-slate-300 hover:text-white">Blog</a>
				<a href="../logout.php" class="text-slate-300 hover:text-white">Sign out</a>
			</nav>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4 py-8">
		<?php if ($dbError): ?>
			<div class="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 mb-6 text-sm">
				Could not load leads: <?php echo htmlspecialchars($dbError, ENT_QUOTES); ?>
			</div>
		<?php elseif (count($rows) === 0): ?>
			<p class="text-slate-600">No leads yet. Submissions from the contact form will appear here.</p>
		<?php else: ?>
			<div class="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
				<table class="min-w-full text-sm text-left">
					<thead class="bg-slate-100 text-slate-700">
						<tr>
							<th class="px-4 py-3 font-semibold">Date</th>
							<th class="px-4 py-3 font-semibold">Name</th>
							<th class="px-4 py-3 font-semibold">Email</th>
							<th class="px-4 py-3 font-semibold">Service</th>
							<th class="px-4 py-3 font-semibold">Status</th>
							<th class="px-4 py-3 font-semibold"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						<?php foreach ($rows as $r): ?>
							<tr class="hover:bg-slate-50">
								<td class="px-4 py-3 text-slate-600 whitespace-nowrap"><?php echo htmlspecialchars(substr((string)$r['createdAt'], 0, 19), ENT_QUOTES); ?></td>
								<td class="px-4 py-3 font-medium text-slate-900"><?php echo htmlspecialchars((string)$r['name'], ENT_QUOTES); ?></td>
								<td class="px-4 py-3"><a href="mailto:<?php echo htmlspecialchars((string)$r['email'], ENT_QUOTES); ?>" class="text-blue-600 hover:underline"><?php echo htmlspecialchars((string)$r['email'], ENT_QUOTES); ?></a></td>
								<td class="px-4 py-3 text-slate-700"><?php echo htmlspecialchars((string)$r['service'], ENT_QUOTES); ?></td>
								<td class="px-4 py-3"><span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs"><?php echo htmlspecialchars((string)$r['status'], ENT_QUOTES); ?></span></td>
								<td class="px-4 py-3"><a href="view.php?id=<?php echo urlencode((string)$r['id']); ?>" class="text-blue-600 font-medium hover:underline">View</a></td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			</div>
		<?php endif; ?>
	</main>
</body>
</html>
