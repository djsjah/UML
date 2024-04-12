/*
  Warnings:

  - A unique constraint covering the columns `[type,value]` on the table `ClientContact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type,value]` on the table `UserContact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClientContact_type_value_key" ON "ClientContact"("type", "value");

-- CreateIndex
CREATE UNIQUE INDEX "UserContact_type_value_key" ON "UserContact"("type", "value");
