/*
  Warnings:

  - Added the required column `pkey` to the `Key` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Key` ADD COLUMN `pkey` VARCHAR(191) NOT NULL;
