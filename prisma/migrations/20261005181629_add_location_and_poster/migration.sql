-- AlterTable
ALTER TABLE "Event" ADD COLUMN "location" TEXT;
ALTER TABLE "Event" ADD COLUMN "posterUrl" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nim" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MAHASISWA',
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isDefaultPassword" BOOLEAN NOT NULL DEFAULT true,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "isSuperAdmin", "name", "nim", "password", "points", "role", "updatedAt") SELECT "createdAt", "id", "isSuperAdmin", "name", "nim", "password", "points", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
