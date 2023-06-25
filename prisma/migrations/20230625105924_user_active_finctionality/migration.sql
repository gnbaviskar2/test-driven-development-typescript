-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationCode" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
