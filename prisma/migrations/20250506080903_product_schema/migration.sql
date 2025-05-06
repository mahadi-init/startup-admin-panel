/*
  Warnings:

  - The `images` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `discount_percentage` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sold` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "discount_percentage" SET NOT NULL,
ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "sold" SET NOT NULL,
DROP COLUMN "images",
ADD COLUMN     "images" TEXT[];
