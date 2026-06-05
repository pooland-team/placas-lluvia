CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`foundPlateId` int NOT NULL,
	`lostPlateId` int,
	`initiatorId` int NOT NULL,
	`responderId` int NOT NULL,
	`status` enum('open','closed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversationId` int NOT NULL,
	`senderId` int NOT NULL,
	`content` text NOT NULL,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('lost','found') NOT NULL,
	`plateNumber` varchar(20) NOT NULL,
	`description` text,
	`incidentDate` timestamp NOT NULL,
	`photoUrl` text,
	`photoKey` text,
	`locationApprox` varchar(255),
	`status` enum('active','claimed','closed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plates_id` PRIMARY KEY(`id`)
);
