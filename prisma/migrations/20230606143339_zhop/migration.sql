/*
  Warnings:

  - You are about to drop the column `cover` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `zhopa` on the `Post` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "url" TEXT NOT NULL,
    "postWithCoverId" INTEGER,
    "postId" INTEGER,
    CONSTRAINT "Image_postWithCoverId_fkey" FOREIGN KEY ("postWithCoverId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("postId", "url") SELECT "postId", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");
CREATE UNIQUE INDEX "Image_postWithCoverId_key" ON "Image"("postWithCoverId");
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT DEFAULT '',
    "content" TEXT DEFAULT '',
    "published" BOOLEAN DEFAULT false,
    "authorName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    CONSTRAINT "Post_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "User" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorName", "content", "createdAt", "id", "path", "published", "title", "updatedAt") SELECT "authorName", "content", "createdAt", "id", "path", "published", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_path_key" ON "Post"("path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
