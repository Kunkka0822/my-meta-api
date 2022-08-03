/*
  Warnings:

  - You are about to drop the column `latlng` on the `Parcel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Parcel` DROP COLUMN `latlng`,
    ADD COLUMN `longlat` VARCHAR(191) NULL,
    ADD COLUMN `regionCode` VARCHAR(191) NULL;
