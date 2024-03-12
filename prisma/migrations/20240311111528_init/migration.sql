-- CreateTable
CREATE TABLE "Column" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataset_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "type" TEXT NOT NULL CHECK ( "type" IN (
        'GROUND_TRUTH',
        'PREDICTIVE_LABEL',
        'INPUT'
    ) ),
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    CONSTRAINT "Column_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "Dataset_list" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dataset_list" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME,
    "updated_at" DATETIME NOT NULL
);
