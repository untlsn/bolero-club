CREATE TABLE `comments` (
	`flavor_id` text PRIMARY KEY NOT NULL,
	`comment` text NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`flavor_id`) REFERENCES `flavors`(`id`) ON UPDATE no action ON DELETE cascade
);
