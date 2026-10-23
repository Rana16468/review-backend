-- CreateTable
CREATE TABLE "assignmentsts" (
    "id" TEXT NOT NULL,
    "batch" VARCHAR(255) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "userId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignmentsts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assignmentsts_userId_title_idx" ON "assignmentsts"("userId", "title");

-- AddForeignKey
ALTER TABLE "assignmentsts" ADD CONSTRAINT "assignmentsts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
