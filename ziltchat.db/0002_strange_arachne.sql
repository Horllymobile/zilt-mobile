ALTER TABLE `messages` ADD `recipientId` text REFERENCES profile(id);--> statement-breakpoint
ALTER TABLE `outbox` ADD `recipientId` text;