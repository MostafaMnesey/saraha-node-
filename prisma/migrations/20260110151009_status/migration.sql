/*
  Warnings:

  - The values [delivered,pending,flagged,deleted] on the enum `MessageStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [shadow_hidden] on the enum `MessageVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageStatus_new" AS ENUM ('unread', 'read');
ALTER TABLE "public"."messages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "messages" ALTER COLUMN "status" TYPE "MessageStatus_new" USING ("status"::text::"MessageStatus_new");
ALTER TYPE "MessageStatus" RENAME TO "MessageStatus_old";
ALTER TYPE "MessageStatus_new" RENAME TO "MessageStatus";
DROP TYPE "public"."MessageStatus_old";
ALTER TABLE "messages" ALTER COLUMN "status" SET DEFAULT 'unread';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MessageVisibility_new" AS ENUM ('visible', 'hidden');
ALTER TABLE "public"."messages" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "messages" ALTER COLUMN "visibility" TYPE "MessageVisibility_new" USING ("visibility"::text::"MessageVisibility_new");
ALTER TYPE "MessageVisibility" RENAME TO "MessageVisibility_old";
ALTER TYPE "MessageVisibility_new" RENAME TO "MessageVisibility";
DROP TYPE "public"."MessageVisibility_old";
ALTER TABLE "messages" ALTER COLUMN "visibility" SET DEFAULT 'hidden';
COMMIT;

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "status" SET DEFAULT 'unread',
ALTER COLUMN "visibility" SET DEFAULT 'hidden';
