<?php
declare(strict_types=1);

/**
 * Blog slugs (filename without .html) allowed for admin edit.
 */
function blog_admin_post_slugs(): array
{
	return [
		'structured-cabling-basics',
		'business-security-systems',
		'data-center-basics-for-business',
		'audio-visual-systems-that-work',
		'low-voltage-safety-contractors',
		'future-proofing-technology-infrastructure',
	];
}

function blog_post_file_path(string $slug): string
{
	return __DIR__ . '/../../blog/' . $slug . '.html';
}
