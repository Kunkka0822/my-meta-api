/*
  Warnings:

  - You are about to drop the `TempHash` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TempHash` DROP FOREIGN KEY `TempHash_userId_fkey`;

-- DropTable
DROP TABLE `TempHash`;
