-- AlterTable
ALTER TABLE "User" ADD COLUMN     "freezed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "freezedAt" TIMESTAMP(3);
