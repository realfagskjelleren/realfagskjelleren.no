-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'BOARD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';