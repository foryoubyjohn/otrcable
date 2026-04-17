<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/posts.php';

blog_admin_require_login();

$slugs = blog_admin_post_slugs();
$titles = [
	'structured-cabling-basics' => 'Structured Cabling: The Backbone of Every Modern Business',
	'business-security-systems' => 'Security Systems for Businesses: More Than Just Cameras',
	'data-center-basics-for-business' => 'Data Center Basics: What Every Business Should Know',
	'audio-visual-systems-that-work' => 'Audio Visual Systems That Actually Work (And Why Most Don’t)',
	'low-voltage-safety-contractors' => 'Low Voltage Safety: What Contractors and Businesses Need to Know',
	'future-proofing-technology-infrastructure' => 'Future-Proofing Your Business Technology Infrastructure',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Blog admin - OTR Cable</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen p-6">
	<div class="max-w-3xl mx-auto">
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-2xl font-bold text-slate-900">Blog posts</h1>
			<div class="flex gap-3">
				<a href="../../blog/index.html" class="text-blue-600 hover:underline text-sm">View blog</a>
				<a href="logout.php" class="text-slate-600 hover:underline text-sm">Sign out</a>
			</div>
		</div>
		<p class="text-slate-600 mb-6 text-sm">Edit the main article HTML between <code class="bg-slate-200 px-1 rounded">&lt;!--otr-blog-content-start--&gt;</code> and <code class="bg-slate-200 px-1 rounded">&lt;!--otr-blog-content-end--&gt;</code>. Title, meta, featured image, and CTA are outside that region—change those in the file or ask your developer.</p>
		<ul class="space-y-2">
			<?php foreach ($slugs as $slug): ?>
				<li class="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center">
					<span class="font-medium text-slate-800"><?php echo htmlspecialchars($titles[$slug] ?? $slug, ENT_QUOTES); ?></span>
					<a href="edit.php?slug=<?php echo urlencode($slug); ?>" class="text-blue-600 font-medium text-sm hover:underline">Edit</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</body>
</html>
