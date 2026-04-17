<?php
declare(strict_types=1);

/**
 * Client IP for rate limiting (server-visible address only).
 */
function otr_client_ip(): string
{
	$ip = trim((string)($_SERVER['REMOTE_ADDR'] ?? ''));
	if ($ip === '' || $ip === '::1') {
		return '0.0.0.0';
	}
	return $ip;
}

function otr_rate_state_path(string $prefix): string
{
	$dir = __DIR__ . '/../logs';
	if (!is_dir($dir)) {
		@mkdir($dir, 0775, true);
	}
	$key = hash('sha256', $prefix . '|' . otr_client_ip());
	return $dir . '/rate_' . $key . '.json';
}

/**
 * Sliding window: true if under the cap (does not record a hit).
 */
function otr_rate_limit_peek(string $prefix, int $maxEvents, int $windowSeconds): bool
{
	$path = otr_rate_state_path($prefix);
	$now = microtime(true);
	$timestamps = [];
	if (is_readable($path)) {
		$raw = file_get_contents($path);
		$decoded = json_decode((string)$raw, true);
		if (is_array($decoded) && isset($decoded['t']) && is_array($decoded['t'])) {
			foreach ($decoded['t'] as $t) {
				if (is_numeric($t) && ($now - (float)$t) < $windowSeconds) {
					$timestamps[] = (float)$t;
				}
			}
		}
	}
	return count($timestamps) < $maxEvents;
}

/**
 * Record one event in the sliding window (call after successful action).
 */
function otr_rate_limit_hit(string $prefix, int $windowSeconds): void
{
	$path = otr_rate_state_path($prefix);
	$now = microtime(true);
	$timestamps = [];
	if (is_readable($path)) {
		$raw = file_get_contents($path);
		$decoded = json_decode((string)$raw, true);
		if (is_array($decoded) && isset($decoded['t']) && is_array($decoded['t'])) {
			foreach ($decoded['t'] as $t) {
				if (is_numeric($t) && ($now - (float)$t) < $windowSeconds) {
					$timestamps[] = (float)$t;
				}
			}
		}
	}
	$timestamps[] = $now;
	@file_put_contents($path, json_encode(['t' => $timestamps]), LOCK_EX);
}

function otr_contact_rate_max(): int
{
	return max(1, (int)(getenv('OTR_CONTACT_RATE_MAX') ?: '10'));
}

function otr_contact_rate_window(): int
{
	return max(60, (int)(getenv('OTR_CONTACT_RATE_WINDOW') ?: '3600'));
}

function otr_contact_rate_peek(): bool
{
	return otr_rate_limit_peek('contact', otr_contact_rate_max(), otr_contact_rate_window());
}

function otr_contact_rate_record(): void
{
	otr_rate_limit_hit('contact', otr_contact_rate_window());
}

function otr_login_failures_path(): string
{
	return otr_rate_state_path('admin_login_fail');
}

/**
 * @return string|null Error message if login is temporarily blocked
 */
function otr_login_throttle_check(): ?string
{
	$path = otr_login_failures_path();
	if (!is_readable($path)) {
		return null;
	}
	$data = json_decode((string)file_get_contents($path), true);
	if (!is_array($data)) {
		return null;
	}
	$lockUntil = isset($data['lock_until']) ? (float)$data['lock_until'] : 0.0;
	if ($lockUntil > microtime(true)) {
		$mins = max(1, (int)ceil(($lockUntil - microtime(true)) / 60));
		return 'Too many failed attempts. Try again in about ' . $mins . ' minute(s).';
	}
	return null;
}

function otr_login_throttle_register_failure(): void
{
	$path = otr_login_failures_path();
	$now = microtime(true);
	$window = 900.0; // 15 minutes
	$maxFails = 6;
	$lockDuration = 900.0; // 15 minutes lockout after threshold

	$fails = [];
	if (is_readable($path)) {
		$data = json_decode((string)file_get_contents($path), true);
		if (is_array($data) && isset($data['fails']) && is_array($data['fails'])) {
			foreach ($data['fails'] as $t) {
				if (is_numeric($t) && ($now - (float)$t) < $window) {
					$fails[] = (float)$t;
				}
			}
		}
	}
	$fails[] = $now;
	$out = ['fails' => $fails, 'lock_until' => 0.0];
	if (count($fails) >= $maxFails) {
		$out['lock_until'] = $now + $lockDuration;
		$out['fails'] = []; // reset after lock
	}
	@file_put_contents($path, json_encode($out), LOCK_EX);
}

function otr_login_throttle_clear(): void
{
	$p = otr_login_failures_path();
	if (is_file($p)) {
		@unlink($p);
	}
}
