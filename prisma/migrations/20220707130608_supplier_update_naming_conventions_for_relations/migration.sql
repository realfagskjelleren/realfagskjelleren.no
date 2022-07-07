/*
  Warnings:

  - Added the required column `supplierId` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "orgNum" INTEGER NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_orgNum_key" ON "Supplier"("orgNum");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
