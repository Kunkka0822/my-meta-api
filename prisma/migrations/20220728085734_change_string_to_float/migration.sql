/*
  Warnings:

  - You are about to alter the column `miles` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `rank` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `speed` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `loc0` on the `UserOnline` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `loc1` on the `UserOnline` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `loc0` on the `UserTravel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `loc1` on the `UserTravel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `speed` on the `UserTravel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `MMC` INTEGER NOT NULL DEFAULT 0,
    MODIFY `miles` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `rank` INTEGER NOT NULL,
    MODIFY `speed` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `UserOnline` MODIFY `loc0` DOUBLE NOT NULL,
    MODIFY `loc1` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `UserTravel` MODIFY `isTravel` INTEGER NOT NULL DEFAULT 0,
    MODIFY `loc0` DOUBLE NOT NULL,
    MODIFY `loc1` DOUBLE NOT NULL,
    MODIFY `speed` DOUBLE NOT NULL;
