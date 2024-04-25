-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "external_id" TEXT NOT NULL UNIQUE,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" TEXT
);

-- CreateTable
CREATE TABLE "API_key" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "revoked_at" DATETIME,
    CONSTRAINT "API_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dataset_column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataset_uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL CHECK ( "type" IN (
        'GROUND_TRUTH',
        'GROUND_TRUTH_STATUS',
        'INPUT',
        'IDENTIFIER'
    ) ),
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Column_dataset_id_fkey" FOREIGN KEY ("dataset_uuid") REFERENCES "Dataset" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dataset" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_by" TEXT,
    "logs_uuid" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Dataset_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Dataset_logs_id_fkey" FOREIGN KEY ("logs_uuid") REFERENCES "Logs"("uuid") ON DELETE SET NULL ON UPDATE CASCADE
);
