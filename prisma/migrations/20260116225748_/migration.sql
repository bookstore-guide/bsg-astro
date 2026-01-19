/*
  Warnings:

  - Made the column `name` on table `PlaceType` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `PlaceType` MODIFY `name` VARCHAR(255) NOT NULL;


-- Manual migration

INSERT INTO PlaceType (name, description, internalNotes, updatedAt)
VALUES ('Book Store','a place which primarily sells books','', CURRENT_TIMESTAMP());

INSERT INTO `_PlaceToPlaceType` (A, B)
SELECT `id`, 1 FROM Place;