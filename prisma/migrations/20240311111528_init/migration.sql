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
        'PREDICTIVE_LABEL',
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
    "name" TEXT NOT NULL UNIQUE,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "updated_at" DATETIME NOT NULL
);
