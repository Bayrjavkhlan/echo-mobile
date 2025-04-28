ALTER TABLE `flashcards` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `flashcards` ADD `updated_by` text NOT NULL;--> statement-breakpoint
ALTER TABLE `labels` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `labels` ADD `updated_by` text NOT NULL;