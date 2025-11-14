ALTER TABLE `messages` ADD `status` text DEFAULT 'SENDING';--> statement-breakpoint
ALTER TABLE `outbox` ADD `status` text DEFAULT 'SENDING';