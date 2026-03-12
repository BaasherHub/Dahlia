-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE IF NOT EXISTS "Painting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" DOUBLE PRECISION,
    "images" TEXT[],
    "dimensions" TEXT NOT NULL DEFAULT '',
    "medium" TEXT NOT NULL DEFAULT 'Oil on canvas',
    "year" INTEGER,
    "sold" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Painting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "shipName" TEXT NOT NULL,
    "shipStreet" TEXT NOT NULL,
    "shipCity" TEXT NOT NULL,
    "shipState" TEXT NOT NULL,
    "shipZip" TEXT NOT NULL,
    "shipCountry" TEXT NOT NULL,
    "shipPhone" TEXT,
    "trackingCode" TEXT,
    "labelUrl" TEXT,
    "carrier" TEXT,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paintingId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Order_stripePaymentId_key" ON "Order"("stripePaymentId");
CREATE UNIQUE INDEX IF NOT EXISTS "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_paintingId_fkey" FOREIGN KEY ("paintingId") REFERENCES "Painting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
