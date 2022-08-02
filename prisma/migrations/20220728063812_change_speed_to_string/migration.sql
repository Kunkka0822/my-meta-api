/*
  Warnings:

  - You are about to alter the column `speed` on the `UserTravel` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `UserTravel` MODIFY `speed` VARCHAR(191) NOT NULL;
