CREATE TABLE `calendar` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`date` text NOT NULL,
	`minutes_spend` integer DEFAULT 0,
	`words_memorized` integer DEFAULT 0,
	`is_active` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `flashcard_review` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`group_id` integer NOT NULL,
	`flashcard_id` integer NOT NULL,
	`last_review_date` text NOT NULL,
	`next_review` text NOT NULL,
	`repetitions` integer NOT NULL,
	`response_time` integer,
	`easyness_factor` real NOT NULL,
	`interval` integer NOT NULL,
	`last_score` integer,
	`created_at` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `flashcards` ADD `easyness_factor` real DEFAULT 2.5 NOT NULL;--> statement-breakpoint
ALTER TABLE `flashcards` ADD `review_count` integer DEFAULT 0;