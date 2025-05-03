CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`mode` text NOT NULL,
	`language` text NOT NULL,
	`created_at` integer DEFAULT 1 NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_user_id_unique` ON `settings` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`age` integer,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT 1 NOT NULL,
	`updated_by` text NOT NULL
);
