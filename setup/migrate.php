<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

// Read DB credentials (same defaults as get_pdo)
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$db   = getenv('DB_DATABASE') ?: 'otr_cable';
$user = getenv('DB_USERNAME') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$charset = 'utf8mb4';

// Connect without selecting a DB first to create it if missing
$dsnServer = "mysql:host={$host};port={$port};charset={$charset}";
$options = [
	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	PDO::ATTR_EMULATE_PREPARES => false,
];

$messages = [];

try {
	$pdoServer = new PDO($dsnServer, $user, $pass, $options);
	$pdoServer->exec("CREATE DATABASE IF NOT EXISTS `{$db}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
	$messages[] = "Database '{$db}' ensured.";

	$pdo = get_pdo();
	$sql = <<<SQL
CREATE TABLE IF NOT EXISTS `Lead` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `service` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `formType` varchar(50) DEFAULT 'general-contact',
  `source` varchar(100) DEFAULT 'website-contact-form',
  `status` varchar(50) DEFAULT 'new',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
SQL;
	$pdo->exec($sql);
	$messages[] = "Table 'Lead' ensured.";

	$status = 'success';
} catch (Throwable $e) {
	$status = 'error';
	$messages[] = 'Migration failed: ' . $e->getMessage();
	log_soft_error('migration_failed', ['error' => $e->getMessage()]);
}

if (php_sapi_name() !== 'cli') {
?>
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>OTR Cable Migration</title></head>
<body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 2rem;">
  <h1>Database Migration</h1>
  <p>Status: <strong><?php echo htmlspecialchars($status, ENT_QUOTES); ?></strong></p>
  <ul>
    <?php foreach ($messages as $m): ?>
      <li><?php echo htmlspecialchars($m, ENT_QUOTES); ?></li>
    <?php endforeach; ?>
  </ul>
  <p><a href="/">Go to site</a></p>
</body></html>
<?php
} else {
	echo $status . PHP_EOL;
	echo implode(PHP_EOL, $messages) . PHP_EOL;
}


