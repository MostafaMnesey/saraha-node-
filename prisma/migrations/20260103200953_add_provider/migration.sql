-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('local', 'google');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'local';
