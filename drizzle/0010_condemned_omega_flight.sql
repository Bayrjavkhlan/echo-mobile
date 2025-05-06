PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flashcard_id` integer,
	`group_id` integer,
	`correct` integer,
	`time_to_answer` real,
	`user_answer` text,
	`repetitions` integer DEFAULT 0,
	`interval` integer DEFAULT 1,
	`next_review` text,
	`easyness_factor` real DEFAULT 2.5,
	`created_at` text DEFAULT '2025-05-06T05:28:54.252Z',
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "flashcard_id", "group_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "created_at") SELECT "id", "flashcard_id", "group_id", "correct", "time_to_answer", "user_answer", "repetitions", "interval", "next_review", "easyness_factor", "created_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_wrong_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flashcard_id` integer NOT NULL,
	`text` text,
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_wrong_answers`("id", "flashcard_id", "text") SELECT "id", "flashcard_id", "text" FROM `wrong_answers`;--> statement-breakpoint
DROP TABLE `wrong_answers`;--> statement-breakpoint
ALTER TABLE `__new_wrong_answers` RENAME TO `wrong_answers`;