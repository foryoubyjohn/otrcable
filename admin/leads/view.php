<?php
declare(strict_types=1);

require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/../../config/db.php';

admin_require_login();

$id = (string)($_GET['id'] ?? '');
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $id)) {
	http_response_code(400);
	echo 'Invalid lead id.';
	exit;
}

$pdo = null;
$dbError = null;
try {
	$pdo = get_pdo();
} catch (Throwable $e) {
	$dbError = $e->getMessage();
	log_soft_error('admin_lead_view_connect', ['error' => $e->getMessage()]);
}

if ($pdo && $_SERVER['REQUEST_METHOD'] === 'POST') {
	$status = trim((string)($_POST['status'] ?? ''));
	$allowed = ['new', 'contacted', 'qualified', 'closed', 'spam'];
	if (in_array($status, $allowed, true)) {
		try {
			$u = $pdo->prepare('UPDATE `Lead` SET `status` = :s, `updatedAt` = NOW(3) WHERE `id` = :id');
			$u->execute([':s' => $status, ':id' => $id]);
			header('Location: view.php?id=' . urlencode($id) . '&saved=1', true, 302);
			exit;
		} catch (Throwable $e) {
			$dbError = $e->getMessage();
		}
	}
}

$lead = null;
if ($pdo && !$dbError) {
	try {
		$stmt = $pdo->prepare('SELECT * FROM `Lead` WHERE `id` = :id LIMIT 1');
		$stmt->execute([':id' => $id]);
		$lead = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
	} catch (Throwable $e) {
		$dbError = $e->getMessage();
	}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="robots" content="noindex, nofollow">
	<title>Lead detail - OTR Cable admin</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen">
	<header class="bg-slate-900 text-white">
		<div class="max-w-3xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
			<h1 class="text-lg font-semibold">Lead detail</h1>
			<nav class="flex flex-wrap items-center gap-4 text-sm">
				<a href="../dashboard.php" class="text-slate-300 hover:text-white">Dashboard</a>
				<a href="index.php" class="text-slate-300 hover:text-white">← Leads</a>
				<a href="../logout.php" class="text-slate-300 hover:text-white">Sign out</a>
			</nav>
		</div>
	</header>

	<main class="max-w-3xl mx-auto px-4 py-8">
		<?php if ($dbError): ?>
			<p class="text-red-600 text-sm"><?php echo htmlspecialchars($dbError, ENT_QUOTES); ?></p>
		<?php elseif (!$lead): ?>
			<p class="text-slate-600">Lead not found.</p>
			<p class="mt-4"><a href="index.php" class="text-blue-600 hover:underline">Back to list</a></p>
		<?php else: ?>
			<?php if (!empty($_GET['saved'])): ?>
				<p class="text-green-700 bg-green-50 border border-green-200 rounded px-4 py-2 text-sm mb-6">Status updated.</p>
			<?php endif; ?>
			<dl class="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 text-sm">
				<div class="px-4 py-3 grid grid-cols-3 gap-2"><dt class="text-slate-500">Name</dt><dd class="col-span-2 font-medium text-slate-900"><?php echo htmlspecialchars((string)$lead['name'], ENT_QUOTES); ?></dd></div>
				<div class="px-4 py-3 grid grid-cols-3 gap-2"><dt class="text-slate-500">Email</dt><dd class="col-span-2"><a class="text-blue-600 hover:underline" href="mailto:<?php echo htmlspecialchars((string)$lead['email'], ENT_QUOTES); ?>"><?php echo htmlspecialchars((string)$lead['email'], ENT_QUOTES); ?></a></dd></div>
				<div class="px-4 py-3 grid grid-cols-3 gap-2"><dt class="text-slate-500">Phone</dt><dd class="col-span-2"><?php echo htmlspecialchars((string)$lead['phone'], ENT_QUOTES); ?></dd></div>
				<div class="px-4 py-3 grid grid-cols-3 gap-2"><dt class="text-slate-500">Company</dt><dd class="col-span-2"><?php echo htmlspecialchars((string)($lead['company'] ?? ''), ENT_QUOTES); ?></dd></div>
				<div class="px-4 py-3 grid grid-cols-3 gap-2"><dt class="text-slate-500">Service</dt><dd class="col-span-2"><?php echo htmlspecialchars((string)$lead['service'], ENT_QUOTES); ?></dd></div>
				<div class="px-4 py-3 grid grid-cols-3 gap-2"><dt class="text-slate-500">Submitted</dt><dd class="col-span-2 text-slate-700"><?php echo htmlspecialchars((string)$lead['createdAt'], ENT_QUOTES); ?></dd></div>
				<div class="px-4 py-3 grid grid-cols-3 gap-2"><dt class="text-slate-500">Message</dt><dd class="col-span-2 text-slate-800 whitespace-pre-wrap"><?php echo htmlspecialchars((string)$lead['message'], ENT_QUOTES); ?></dd></div>
			</dl>

			<form method="post" class="mt-8 bg-white border border-slate-200 rounded-lg p-6">
				<h2 class="font-semibold text-slate-900 mb-3">Update status</h2>
				<label class="block text-sm text-slate-600 mb-2">Status</label>
				<select name="status" class="border border-slate-300 rounded px-3 py-2 w-full max-w-xs mb-4">
					<?php foreach (['new', 'contacted', 'qualified', 'closed', 'spam'] as $s): ?>
						<option value="<?php echo htmlspecialchars($s, ENT_QUOTES); ?>" <?php echo ($lead['status'] === $s) ? 'selected' : ''; ?>><?php echo htmlspecialchars($s, ENT_QUOTES); ?></option>
					<?php endforeach; ?>
				</select>
				<button type="submit" class="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700">Save status</button>
			</form>
		<?php endif; ?>
	</main>
</body>
</html>
