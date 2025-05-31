/*
  Warnings:

  - You are about to drop the `Applicant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Applicant";

-- DropTable
DROP TABLE "TestMessage";

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "responseID" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "responses" JSONB NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_email_key" ON "Application"("email");
