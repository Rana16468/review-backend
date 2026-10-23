-- DropIndex
DROP INDEX "assignmentsts_userId_title_idx";

-- DropIndex
DROP INDEX "submissions_studentId_assignmentId_idx";

-- CreateIndex
CREATE INDEX "assignmentsts_userId_title_isDeleted_idx" ON "assignmentsts"("userId", "title", "isDeleted");

-- CreateIndex
CREATE INDEX "submissions_studentId_assignmentId_isDeleted_idx" ON "submissions"("studentId", "assignmentId", "isDeleted");
