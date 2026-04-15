<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

// Static services list aligned with UI usage in src/App.jsx
$services = [
	['id' => 'structured-cabling', 'name' => 'Structured Cabling', 'description' => 'Fiber optics, copper cabling, and certification.', 'icon' => 'cable'],
	['id' => 'audio-visual', 'name' => 'Audio Visual Systems', 'description' => 'Conference rooms, digital signage, and wireless presentation.', 'icon' => 'monitor'],
	['id' => 'data-centers', 'name' => 'Data Centers', 'description' => 'Server room design, racks, and monitoring.', 'icon' => 'server'],
	['id' => 'security-systems', 'name' => 'Security Systems', 'description' => 'CCTV, intrusion detection, fire alarms.', 'icon' => 'shield'],
	['id' => 'access-control', 'name' => 'Access Control', 'description' => 'Card readers, biometrics, visitor management.', 'icon' => 'lock'],
	['id' => 'telecommunications', 'name' => 'Telecommunications', 'description' => 'VoIP, unified communications, wireless.', 'icon' => 'wifi'],
];

send_json($services);


