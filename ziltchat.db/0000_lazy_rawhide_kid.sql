CREATE TABLE `chat_members` (
	`id` text PRIMARY KEY NOT NULL,
	`chatId` text,
	`userId` text,
	`joinedAt` integer,
	`role` text DEFAULT 'MEMBER',
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `profile`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`isGroup` integer DEFAULT 0,
	`status` text DEFAULT 'PENDING',
	`lastMessageId` text,
	`createdBy` text,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chats_lastMessageId_unique` ON `chats` (`lastMessageId`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chatId` text,
	`senderId` text,
	`seen` integer DEFAULT 0,
	`type` text,
	`content` text,
	`media` text,
	`createdAt` integer,
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`senderId`) REFERENCES `profile`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `outbox` (
	`localId` text PRIMARY KEY NOT NULL,
	`chatId` text,
	`senderId` text,
	`type` text,
	`content` text,
	`media` text,
	`createdAt` integer
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`avatar` text
);
