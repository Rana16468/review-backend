/*
  Warnings:

  - You are about to drop the column `ipAddress` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isOnline` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `complaints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meter_readings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `units` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_currentSubId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_unitId_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_currentSubId_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_parentUnitId_fkey";

-- DropForeignKey
ALTER TABLE "units" DROP CONSTRAINT "units_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_planId_fkey";

-- DropForeignKey
ALTER TABLE "user_subscriptions" DROP CONSTRAINT "user_subscriptions_userId_fkey";

-- DropIndex
DROP INDEX "users_ipAddress_idx";

-- DropIndex
DROP INDEX "users_phone_email_status_os_browser_device_isDeleted_isVeri_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "ipAddress",
DROP COLUMN "isOnline",
DROP COLUMN "password",
DROP COLUMN "phone";

-- DropTable
DROP TABLE "complaints";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "meter_readings";

-- DropTable
DROP TABLE "payment_transactions";

-- DropTable
DROP TABLE "properties";

-- DropTable
DROP TABLE "subscription_plans";

-- DropTable
DROP TABLE "tenants";

-- DropTable
DROP TABLE "units";

-- DropTable
DROP TABLE "user_subscriptions";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PlanTier";

-- DropEnum
DROP TYPE "TicketStatus";

-- DropEnum
DROP TYPE "UnitStatus";

-- DropEnum
DROP TYPE "UnitType";

-- CreateIndex
CREATE INDEX "users_email_status_os_browser_device_isDeleted_isVerify_cre_idx" ON "users"("email", "status", "os", "browser", "device", "isDeleted", "isVerify", "createdAt");
