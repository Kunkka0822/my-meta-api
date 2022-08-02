/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wallet` on the `User` table. All the data in the column will be lost.
  - Added the required column `chainAccount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coupon` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `online` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speed` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `username`,
    DROP COLUMN `wallet`,
    ADD COLUMN `chainAccount` VARCHAR(191) NOT NULL,
    ADD COLUMN `coupon` VARCHAR(191) NOT NULL,
    ADD COLUMN `invites` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `isReferral` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lineNumber` INTEGER NOT NULL,
    ADD COLUMN `miles` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `milesMax` DOUBLE NOT NULL DEFAULT 500,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `online` BOOLEAN NOT NULL,
    ADD COLUMN `rank` BIGINT NOT NULL,
    ADD COLUMN `speed` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `UserOnline` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `loc0` VARCHAR(191) NOT NULL,
    `loc1` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `userId` BIGINT NOT NULL,

    UNIQUE INDEX `UserOnline_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSkin` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `color` INTEGER NOT NULL,
    `hat` INTEGER NOT NULL,
    `shoes` INTEGER NOT NULL,
    `torso` INTEGER NOT NULL,
    `userId` BIGINT NOT NULL,

    UNIQUE INDEX `UserSkin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTravel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dateEnd` INTEGER NOT NULL DEFAULT 0,
    `dateStart` INTEGER NOT NULL DEFAULT 0,
    `distance` DOUBLE NOT NULL DEFAULT 0,
    `gasStart` DOUBLE NOT NULL DEFAULT 0,
    `isTravel` BOOLEAN NOT NULL DEFAULT false,
    `loc0` VARCHAR(191) NOT NULL,
    `loc1` VARCHAR(191) NOT NULL,
    `speed` DOUBLE NOT NULL,
    `userId` BIGINT NOT NULL,

    UNIQUE INDEX `UserTravel_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOnline` ADD CONSTRAINT `UserOnline_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkin` ADD CONSTRAINT `UserSkin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTravel` ADD CONSTRAINT `UserTravel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
