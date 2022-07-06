-- CreateEnum
CREATE TYPE "Category" AS ENUM ('BEER', 'ALCOPOP', 'CIDER', 'WINE', 'SPIRITS', 'OTHER', 'CONTAINER');

-- CreateTable
CREATE TABLE "Good" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "Good_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Good_name_brand_volume_key" ON "Good"("name", "brand", "volume");
