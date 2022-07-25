-- AlterTable
ALTER TABLE `Parcel` ADD COLUMN `ownerId` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Parcel` ADD CONSTRAINT `Parcel_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
