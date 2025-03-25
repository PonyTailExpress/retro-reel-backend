/*
  Warnings:

  - The `genre` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[imdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `director` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imdbId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "director" TEXT NOT NULL,
ADD COLUMN     "imdbId" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION,
DROP COLUMN "genre",
ADD COLUMN     "genre" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Movie_imdbId_key" ON "Movie"("imdbId");
