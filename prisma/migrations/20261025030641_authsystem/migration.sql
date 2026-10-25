-- DropIndex
DROP INDEX "users_email_status_role_isDeleted_idx";

-- CreateIndex
CREATE INDEX "users_email_status_role_isDeleted_os_idx" ON "users"("email", "status", "role", "isDeleted", "os");
