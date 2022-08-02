-- AlterTable
ALTER TABLE `Parcel` ADD COLUMN `createdBy` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Parcel` ADD CONSTRAINT `Parcel_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
