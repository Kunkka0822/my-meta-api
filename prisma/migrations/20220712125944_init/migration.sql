-- CreateTable
CREATE TABLE `Parcel` (
    `id` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `square` DOUBLE NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `ownerAddress` VARCHAR(191) NOT NULL,
    `contractAddress` VARCHAR(191) NOT NULL,
    `tokenId` VARCHAR(191) NOT NULL,
    `onSale` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT NOT NULL,
    `wallet` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
