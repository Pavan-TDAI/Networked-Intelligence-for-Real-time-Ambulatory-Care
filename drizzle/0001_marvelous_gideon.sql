CREATE TABLE `abhaConsent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`abhaId` varchar(100) NOT NULL,
	`consentStatus` enum('pending','granted','revoked') DEFAULT 'pending',
	`consentToken` varchar(500),
	`consentExpiresAt` datetime,
	`linkedAt` datetime,
	`revokedAt` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `abhaConsent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int NOT NULL,
	`appointmentDateTime` datetime NOT NULL,
	`status` enum('scheduled','checked_in','in_progress','completed','cancelled','no_show') DEFAULT 'scheduled',
	`appointmentType` enum('booked','walk_in') DEFAULT 'booked',
	`queuePosition` int,
	`chiefComplaint` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int NOT NULL,
	`status` enum('started','in_progress','completed','cancelled') DEFAULT 'started',
	`startedAt` datetime NOT NULL,
	`completedAt` datetime,
	`duration` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diagnoses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientId` int NOT NULL,
	`icd10Code` varchar(10) NOT NULL,
	`diagnosisName` varchar(255) NOT NULL,
	`aiSuggested` boolean DEFAULT false,
	`confidence` decimal(3,2),
	`status` enum('suggested','approved','rejected') DEFAULT 'suggested',
	`isPrimary` boolean DEFAULT false,
	`approvedBy` int,
	`approvedAt` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `diagnoses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`licenseNumber` varchar(100),
	`specialization` varchar(100),
	`qualifications` text,
	`registrationNumber` varchar(100),
	`clinicName` varchar(200),
	`clinicAddress` text,
	`consultationFee` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `doctors_id` PRIMARY KEY(`id`),
	CONSTRAINT `doctors_licenseNumber_unique` UNIQUE(`licenseNumber`)
);
--> statement-breakpoint
CREATE TABLE `drugInteractions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`drug1` varchar(255) NOT NULL,
	`drug2` varchar(255) NOT NULL,
	`severity` enum('none','low','moderate','high','critical') DEFAULT 'moderate',
	`description` text,
	`recommendation` text,
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `drugInteractions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `editLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`doctorId` int NOT NULL,
	`fieldName` varchar(100) NOT NULL,
	`originalValue` text,
	`editedValue` text,
	`reason` text,
	`confidence` decimal(3,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `editLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `examinationNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientId` int NOT NULL,
	`generalExamination` text,
	`systemicExamination` text,
	`localExamination` text,
	`findings` text,
	`recordedBy` int,
	`recordedAt` datetime NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `examinationNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dateOfBirth` datetime,
	`gender` enum('M','F','O'),
	`phoneNumber` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`pincode` varchar(10),
	`abhaId` varchar(100),
	`abhaStatus` enum('not_linked','linking','linked','consent_pending') DEFAULT 'not_linked',
	`preferredLanguage` enum('en','hi') DEFAULT 'en',
	`emergencyContact` varchar(20),
	`emergencyContactName` varchar(100),
	`allergies` text,
	`chronicConditions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patients_abhaId_unique` UNIQUE(`abhaId`)
);
--> statement-breakpoint
CREATE TABLE `preCharts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`interviewId` int NOT NULL,
	`subjective` text,
	`subjectiveConfidence` decimal(3,2),
	`objective` text,
	`objectiveConfidence` decimal(3,2),
	`assessment` text,
	`assessmentConfidence` decimal(3,2),
	`plan` text,
	`planConfidence` decimal(3,2),
	`status` enum('draft','reviewed','approved','rejected') DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `preCharts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescriptionItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`prescriptionId` int NOT NULL,
	`drugName` varchar(255) NOT NULL,
	`genericName` varchar(255),
	`strength` varchar(50),
	`form` varchar(50),
	`frequency` varchar(100),
	`duration` varchar(100),
	`instructions` text,
	`quantity` int,
	`ddiRisk` enum('none','low','moderate','high','critical') DEFAULT 'none',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prescriptionItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int NOT NULL,
	`status` enum('draft','reviewed','approved','rejected','dispensed') DEFAULT 'draft',
	`ddiCheckPassed` boolean DEFAULT true,
	`ddiWarnings` text,
	`approvedAt` datetime,
	`approvedBy` int,
	`expiresAt` datetime,
	`pdfUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prescriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `symptomInterviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientId` int NOT NULL,
	`language` enum('en','hi') DEFAULT 'en',
	`status` enum('started','in_progress','completed','abandoned') DEFAULT 'started',
	`transcript` text,
	`duration` int,
	`completedAt` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `symptomInterviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vitals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` int NOT NULL,
	`patientId` int NOT NULL,
	`systolicBP` int,
	`diastolicBP` int,
	`heartRate` int,
	`temperature` decimal(4,2),
	`respiratoryRate` int,
	`spO2` int,
	`weight` decimal(6,2),
	`height` decimal(5,2),
	`bmi` decimal(5,2),
	`recordedBy` int,
	`recordedAt` datetime NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vitals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('patient','doctor','nurse','admin') NOT NULL DEFAULT 'patient';