/*
  Warnings:

  - Made the column `sold` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "sold" SET NOT NULL,
ALTER COLUMN "sold" SET DEFAULT 0;
