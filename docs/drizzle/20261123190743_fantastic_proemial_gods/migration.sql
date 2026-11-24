CREATE TABLE `session_address` (
	`id` text PRIMARY KEY,
	`session_id` text NOT NULL,
	`user_id` text NOT NULL,
	`ip_address` text NOT NULL,
	`user_agent` text,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_session_address_session_id_session_id_fk` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_session_address_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE INDEX `session_address_user_id_idx` ON `session_address` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_address_session_ip_idx` ON `session_address` (`session_id`,`ip_address`);