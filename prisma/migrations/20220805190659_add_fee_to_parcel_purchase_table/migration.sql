/*
  Warnings:

  - You are about to drop the column `price` on the `ParcelPurchase` table. All the data in the column will be lost.
  - Added the required column `fee` to the `ParcelPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ParcelPurchase` DROP COLUMN `price`,
    ADD COLUMN `fee` INTEGER NOT NULL;
