<?php
declare(strict_types=1);

/**
 * Send HTTP security headers for admin PHP pages (call before any output).
 */
function otr_admin_security_headers(): void
{
	if (headers_sent()) {
		return;
	}
	header('X-Content-Type-Options: nosniff');
	header('X-Frame-Options: DENY');
	header('Referrer-Policy: strict-origin-when-cross-origin');
	header('Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
	$csp = implode('; ', [
		"default-src 'self'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'",
		"script-src 'self' https://cdn.tailwindcss.com 'unsafe-inline' 'unsafe-eval'",
		"style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
		"img-src 'self' data: https:",
		"font-src 'self' data:",
		"connect-src 'self' https://cdn.tailwindcss.com",
	]);
	header('Content-Security-Policy: ' . $csp);
}
