CREATE TABLE `test_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`test_number` integer NOT NULL,
	`test_text` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `test_table_test_text_unique` ON `test_table` (`test_text`);