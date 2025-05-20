PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_wrong_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flashcard_id` integer NOT NULL,
	`wrong_text` text NOT NULL,
	`correct_text` text NOT NULL,
	`user_id` integer,
	`server_id` integer,
	`is_sync` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s', 'now') * 1000),
	`updated_at` integer,
	`updated_by` text
);
--> statement-breakpoint
INSERT INTO `__new_wrong_answers`("id", "flashcard_id", "wrong_text", "correct_text", "user_id", "server_id", "is_sync", "created_at", "updated_at", "updated_by") SELECT "id", "flashcard_id", "wrong_text", "correct_text", "user_id", "server_id", "is_sync", "created_at", "updated_at", "updated_by" FROM `wrong_answers`;--> statement-breakpoint
DROP TABLE `wrong_answers`;--> statement-breakpoint
ALTER TABLE `__new_wrong_answers` RENAME TO `wrong_answers`;--> statement-breakpoint
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
	`created_at` text DEFAULT '2025-05-19T09:54:29.081Z',
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "flashcard_id", "group_id", "user_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "last_review_date", "response_time", "last_score", "is_sync", "created_at") SELECT "id", "flashcard_id", "group_id", "user_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "last_review_date", "response_time", "last_score", "is_sync", "created_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;