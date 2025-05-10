-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdWith" TEXT NOT NULL DEFAULT 'email',
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
