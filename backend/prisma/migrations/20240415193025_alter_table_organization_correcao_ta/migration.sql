/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "organizations_description_key" ON "organizations"("description");
