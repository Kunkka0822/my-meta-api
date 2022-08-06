-- CreateTable
CREATE TABLE `ParcelPurchase` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `buyerId` BIGINT NULL,
    `sellerId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParcelPurchase` ADD CONSTRAINT `ParcelPurchase_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParcelPurchase` ADD CONSTRAINT `ParcelPurchase_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
