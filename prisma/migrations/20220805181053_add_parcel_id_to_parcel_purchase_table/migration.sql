/*
  Warnings:

  - Added the required column `parcelId` to the `ParcelPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ParcelPurchase` ADD COLUMN `parcelId` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `ParcelPurchase` ADD CONSTRAINT `ParcelPurchase_parcelId_fkey` FOREIGN KEY (`parcelId`) REFERENCES `Parcel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
