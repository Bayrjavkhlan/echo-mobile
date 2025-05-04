PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_flashcards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`easyness_factor` real DEFAULT 2.5,
	`review_count` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_by` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_flashcards`("id", "group_id", "question", "answer", "easyness_factor", "review_count", "created_at", "updated_by") SELECT "id", "group_id", "question", "answer", "easyness_factor", "review_count", "created_at", "updated_by" FROM `flashcards`;--> statement-breakpoint
DROP TABLE `flashcards`;--> statement-breakpoint
ALTER TABLE `__new_flashcards` RENAME TO `flashcards`;--> statement-breakpoint
PRAGMA foreign_keys=ON;