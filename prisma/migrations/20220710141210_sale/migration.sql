-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "goodId" INTEGER NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "units" INTEGER NOT NULL,
    "dateSold" TIMESTAMP(3) NOT NULL,
    "responsibleId" TEXT NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sale_goodId_dateSold_key" ON "Sale"("goodId", "dateSold");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
