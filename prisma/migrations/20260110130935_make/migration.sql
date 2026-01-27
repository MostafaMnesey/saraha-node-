-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('delivered', 'pending', 'flagged', 'deleted');

-- CreateEnum
CREATE TYPE "MessageVisibility" AS ENUM ('visible', 'shadow_hidden');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "recipient_user_id" TEXT NOT NULL,
    "sender_user_id" TEXT,
    "content" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'delivered',
    "visibility" "MessageVisibility" NOT NULL DEFAULT 'visible',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    "read_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_msg_recipient_created" ON "messages"("recipient_user_id", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "idx_msg_status" ON "messages"("status");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
