PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`age` integer,
	`email` text,
	`password` text,
	`created_at` integer DEFAULT 1 NOT NULL,
	`updated_by` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "username", "age", "email", "password", "created_at", "updated_by") SELECT "id", "username", "age", "email", "password", "created_at", "updated_by" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;