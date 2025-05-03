CREATE TABLE `wrong_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`flashcard_id` integer NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` ADD `server_id` integer;