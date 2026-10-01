-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('CEREMONY', 'RECEPTION', 'OTHER');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wedding" (
    "id" TEXT NOT NULL,
    "partnerOne" TEXT NOT NULL,
    "partnerTwo" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "eventTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/Mexico_City',
    "weddingDate" TIMESTAMP(3) NOT NULL,
    "content" JSONB NOT NULL,
    "sections" JSONB NOT NULL,
    "introEnabled" BOOLEAN NOT NULL DEFAULT true,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingTheme" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "palette" TEXT NOT NULL DEFAULT 'olivo',
    "colorBackground" TEXT NOT NULL,
    "colorSurface" TEXT NOT NULL,
    "colorPrimary" TEXT NOT NULL,
    "colorSecondary" TEXT NOT NULL,
    "colorAccent" TEXT NOT NULL,
    "colorText" TEXT NOT NULL,
    "colorMuted" TEXT NOT NULL,
    "colorButton" TEXT NOT NULL,
    "colorButtonText" TEXT NOT NULL,
    "colorLine" TEXT NOT NULL,
    "heroOverlay" TEXT NOT NULL,
    "heroOverlayOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.45,
    "fontHeading" TEXT NOT NULL DEFAULT 'Cormorant Garamond',
    "fontBody" TEXT NOT NULL DEFAULT 'Manrope',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingLocation" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "type" "LocationType" NOT NULL DEFAULT 'OTHER',
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "time" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "mapUrl" TEXT NOT NULL DEFAULT '',
    "buttonText" TEXT NOT NULL DEFAULT 'Ver ubicación',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'sparkles',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftRegistry" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "buttonText" TEXT NOT NULL DEFAULT 'Ver mesa de regalos',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsappConfig" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "countryCode" TEXT NOT NULL DEFAULT '52',
    "phone" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL DEFAULT 'Confirmar asistencia',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "deadline" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankInfo" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "bankName" TEXT NOT NULL DEFAULT '',
    "beneficiary" TEXT NOT NULL DEFAULT '',
    "accountNumber" TEXT NOT NULL DEFAULT '',
    "clabe" TEXT NOT NULL DEFAULT '',
    "cardNumber" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingTheme_weddingId_key" ON "WeddingTheme"("weddingId");

-- CreateIndex
CREATE INDEX "WeddingLocation_weddingId_sortOrder_idx" ON "WeddingLocation"("weddingId", "sortOrder");

-- CreateIndex
CREATE INDEX "ScheduleItem_weddingId_sortOrder_idx" ON "ScheduleItem"("weddingId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_publicId_key" ON "GalleryImage"("publicId");

-- CreateIndex
CREATE INDEX "GalleryImage_weddingId_sortOrder_idx" ON "GalleryImage"("weddingId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GiftRegistry_weddingId_key" ON "GiftRegistry"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappConfig_weddingId_key" ON "WhatsappConfig"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "BankInfo_weddingId_key" ON "BankInfo"("weddingId");

-- AddForeignKey
ALTER TABLE "WeddingTheme" ADD CONSTRAINT "WeddingTheme_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingLocation" ADD CONSTRAINT "WeddingLocation_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftRegistry" ADD CONSTRAINT "GiftRegistry_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsappConfig" ADD CONSTRAINT "WhatsappConfig_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankInfo" ADD CONSTRAINT "BankInfo_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

