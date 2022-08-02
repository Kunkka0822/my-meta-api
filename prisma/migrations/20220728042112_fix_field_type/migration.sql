/*
  Warnings:

  - You are about to alter the column `miles` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `speed` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `miles` VARCHAR(191) NOT NULL DEFAULT '0',
    MODIFY `speed` VARCHAR(191) NOT NULL;
