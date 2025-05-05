CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flashcard_id` integer,
	`group_id` integer,
	`correct` integer,
	`time_to_answer` real,
	`user_answer` text,
	`created_at` text DEFAULT '2025-05-05T06:43:09.957Z',
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `flashcards` ADD `last_reviewed_at` text;