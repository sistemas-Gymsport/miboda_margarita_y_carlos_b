-- AlterTable
ALTER TABLE "WhatsappConfig" ADD COLUMN "phoneSecondary" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "WeddingTheme" ALTER COLUMN "palette" SET DEFAULT 'dorado',
ALTER COLUMN "fontBody" SET DEFAULT 'Montserrat';
