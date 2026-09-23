CREATE TABLE `businessSettings` (
	`id` int NOT NULL DEFAULT 1,
	`businessName` varchar(160) NOT NULL,
	`instagramHandle` varchar(120) NOT NULL,
	`whatsappNumber` varchar(40) NOT NULL,
	`contactName` varchar(120) NOT NULL,
	`address` varchar(255) NOT NULL,
	`city` varchar(120) NOT NULL,
	`hours` text NOT NULL,
	`mapsUrl` text,
	`heroEyebrow` varchar(160) NOT NULL,
	`heroTitle` varchar(200) NOT NULL,
	`heroSubtitle` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businessSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `productImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`url` text NOT NULL,
	`storageKey` text NOT NULL,
	`altText` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`sku` varchar(80),
	`categoryId` int,
	`shortDescription` varchar(255),
	`description` text,
	`priceBase` int NOT NULL,
	`priceCustom` int,
	`minQuantity` int NOT NULL DEFAULT 1,
	`publicationStatus` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`availability` enum('available','customizable','made_to_order','check_stock','sold_out','coming_soon') NOT NULL DEFAULT 'available',
	`sizes` text,
	`colors` text,
	`material` varchar(160),
	`productionTime` varchar(160),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote` text NOT NULL,
	`authorName` varchar(120) NOT NULL,
	`authorType` varchar(120),
	`rating` int NOT NULL DEFAULT 5,
	`isPublished` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `productImages` ADD CONSTRAINT `productImages_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;