/*
  Warnings:

  - The primary key for the `Parcel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Parcel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.
  - Added the required column `handleId` to the `Parcel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Parcel` DROP PRIMARY KEY,
    ADD COLUMN `handleId` VARCHAR(191) NOT NULL,
    MODIFY `id` BIGINT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `email` VARCHAR(191) NOT NULL;
