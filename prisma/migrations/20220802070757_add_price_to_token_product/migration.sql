/*
  Warnings:

  - Added the required column `currency` to the `TokenProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `TokenProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TokenProduct` ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` INTEGER NOT NULL;
