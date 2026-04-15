-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS otr_cable CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Switch to the database
USE otr_cable;

-- Create the Lead table
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
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
