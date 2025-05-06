PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_calendar` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`date` text NOT NULL,
	`minutes_spent` integer DEFAULT 0,
	`words_memorized` integer DEFAULT 0,
	`app_opened` integer DEFAULT 0,
	`is_sync` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_calendar`("id", "user_id", "date", "minutes_spent", "words_memorized", "app_opened", "is_sync") SELECT "id", "user_id", "date", "minutes_spent", "words_memorized", "app_opened", "is_sync" FROM `calendar`;--> statement-breakpoint
DROP TABLE `calendar`;--> statement-breakpoint
ALTER TABLE `__new_calendar` RENAME TO `calendar`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flashcard_id` integer,
	`group_id` integer,
	`user_id` integer,
	`correct` integer,
	`time_to_answer` real,
	`user_answer` text,
	`repetitions` integer DEFAULT 0,
	`interval` integer DEFAULT 1,
	`next_review` text,
	`easyness_factor` real DEFAULT 2.5,
	`last_review_date` text,
	`response_time` integer,
	`last_score` integer,
	`is_sync` integer DEFAULT 0,
	`created_at` text DEFAULT '2025-05-06T08:14:19.662Z',
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "flashcard_id", "group_id", "user_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "last_review_date", "response_time", "last_score", "is_sync", "created_at") SELECT "id", "flashcard_id", "group_id", "user_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "last_review_date", "response_time", "last_score", "is_sync", "created_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;