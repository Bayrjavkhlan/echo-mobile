PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
	`created_at` text DEFAULT '2025-05-06T08:15:51.926Z',
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "flashcard_id", "group_id", "user_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "last_review_date", "response_time", "last_score", "is_sync", "created_at") SELECT "id", "flashcard_id", "group_id", "user_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "last_review_date", "response_time", "last_score", "is_sync", "created_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;