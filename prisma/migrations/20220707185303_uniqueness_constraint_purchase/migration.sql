/*
  Warnings:

  - A unique constraint covering the columns `[goodId,dateRecieved,supplierId]` on the table `Purchase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Purchase_goodId_dateRecieved_supplierId_key" ON "Purchase"("goodId", "dateRecieved", "supplierId");
