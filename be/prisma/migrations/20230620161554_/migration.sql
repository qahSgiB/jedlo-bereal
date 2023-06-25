/*
  Warnings:

  - A unique constraint covering the columns `[fyzioId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[goalsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[socialId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fyzioId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalsId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fyzioId" INTEGER NOT NULL,
ADD COLUMN     "goalsId" INTEGER NOT NULL,
ADD COLUMN     "socialId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserFyzio" (
    "id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,

    CONSTRAINT "UserFyzio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGoals" (
    "id" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "fats" INTEGER NOT NULL,
    "proteins" INTEGER NOT NULL,

    CONSTRAINT "UserGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSocial" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "UserSocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_fyzioId_key" ON "User"("fyzioId");

-- CreateIndex
CREATE UNIQUE INDEX "User_goalsId_key" ON "User"("goalsId");

-- CreateIndex
CREATE UNIQUE INDEX "User_socialId_key" ON "User"("socialId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fyzioId_fkey" FOREIGN KEY ("fyzioId") REFERENCES "UserFyzio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_goalsId_fkey" FOREIGN KEY ("goalsId") REFERENCES "UserGoals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_socialId_fkey" FOREIGN KEY ("socialId") REFERENCES "UserSocial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
