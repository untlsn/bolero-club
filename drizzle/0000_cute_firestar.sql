CREATE TABLE `flavors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`original_name` text NOT NULL,
	`family` text NOT NULL,
	`emoji` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`flavor_id` text NOT NULL,
	`person` text NOT NULL,
	`tastes_good` integer DEFAULT false NOT NULL,
	`exceptional` integer DEFAULT false NOT NULL,
	`awful` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`flavor_id`, `person`),
	FOREIGN KEY (`flavor_id`) REFERENCES `flavors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tastings` (
	`flavor_id` text PRIMARY KEY NOT NULL,
	`tried` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`flavor_id`) REFERENCES `flavors`(`id`) ON UPDATE no action ON DELETE cascade
);
