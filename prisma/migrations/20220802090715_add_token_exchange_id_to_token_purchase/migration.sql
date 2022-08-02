/*
  Warnings:

  - Made the column `status` on table `TokenPurchase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `TokenPurchase` ADD COLUMN `invoiceId` VARCHAR(191) NULL,
    ADD COLUMN `tokenExchangeId` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'INIT';
