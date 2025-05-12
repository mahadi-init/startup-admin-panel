-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "orderId" TEXT;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "delivery_cost" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "last_message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" TEXT NOT NULL,
    "deliveryInfoId" TEXT,
    "paymentInfoId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "secondPhone" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "full_address" TEXT,
    "method" TEXT,
    "messages" TEXT[],
    "expectedDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentInfo" (
    "id" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'Cash',
    "total_paid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryInfo_id_key" ON "DeliveryInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentInfo_id_key" ON "PaymentInfo"("id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryInfoId_fkey" FOREIGN KEY ("deliveryInfoId") REFERENCES "DeliveryInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentInfoId_fkey" FOREIGN KEY ("paymentInfoId") REFERENCES "PaymentInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
