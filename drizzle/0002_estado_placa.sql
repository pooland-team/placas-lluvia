-- Migration: v2 — Remove description column, rename locationApprox to estadoPlaca
-- Applied manually via webdev_execute_sql (ALTER TABLE plates)
-- This file documents the schema changes for Drizzle history tracking.

ALTER TABLE `plates` DROP COLUMN `description`;
ALTER TABLE `plates` CHANGE COLUMN `locationApprox` `estadoPlaca` VARCHAR(100) NULL;
