/*
  Warnings:

  - You are about to drop the column `applicationYear` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `formId` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Applicant` table. All the data in the column will be lost.
  - Added the required column `responseID` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "applicationYear",
DROP COLUMN "firstName",
DROP COLUMN "formId",
DROP COLUMN "lastName",
ADD COLUMN     "responseID" TEXT NOT NULL;
