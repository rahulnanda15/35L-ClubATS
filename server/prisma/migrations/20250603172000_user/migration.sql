/*
  Warnings:

  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropTable
DROP TABLE "Application";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "graduationClass" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "responseID" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "graduationYear" TEXT NOT NULL,
    "isTransferStudent" BOOLEAN NOT NULL,
    "priorCollegeYears" TEXT,
    "cumulativeGpa" DECIMAL(3,2) NOT NULL,
    "majorGpa" DECIMAL(3,2) NOT NULL,
    "major1" TEXT NOT NULL,
    "major2" TEXT,
    "gender" TEXT,
    "isFirstGeneration" BOOLEAN NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "blindResumeUrl" TEXT,
    "headshotUrl" TEXT NOT NULL,
    "coverLetterUrl" TEXT,
    "videoUrl" TEXT,
    "rawResponses" JSONB,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_cycles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "assignedTo" TEXT,
    "applicationId" TEXT,
    "cycleId" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "applications_responseID_key" ON "applications"("responseID");
