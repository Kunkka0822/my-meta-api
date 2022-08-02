/*
  Warnings:

  - You are about to alter the column `loc0` on the `UserTravel` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `loc1` on the `UserTravel` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `UserTravel` MODIFY `loc0` VARCHAR(191) NOT NULL,
    MODIFY `loc1` VARCHAR(191) NOT NULL;
