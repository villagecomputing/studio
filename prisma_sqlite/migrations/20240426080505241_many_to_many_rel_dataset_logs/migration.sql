-- CreateTable
CREATE TABLE "_DatasetToLogs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DatasetToLogs_A_fkey" FOREIGN KEY ("A") REFERENCES "Dataset" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DatasetToLogs_B_fkey" FOREIGN KEY ("B") REFERENCES "Logs" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_DatasetToLogs_AB_unique" ON "_DatasetToLogs"("A", "B");

-- CreateIndex
CREATE INDEX "_DatasetToLogs_B_index" ON "_DatasetToLogs"("B");

