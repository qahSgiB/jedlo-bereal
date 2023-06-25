/*
  Warnings:

  - You are about to drop the column `postPic` on the `Post` table. All the data in the column will be lost.
  - Added the required column `picture` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE "Post" DROP COLUMN "postPic",
-- ADD COLUMN     "picture" TEXT NOT NULL;

ALTER TABLE "Post" RENAME COLUMN "postPic" TO "picture"
