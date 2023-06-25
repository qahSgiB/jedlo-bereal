/*
  Warnings:

  - Added the required column `userId` to the `FoodDiary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodDiary" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FoodDiary" ADD CONSTRAINT "FoodDiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
