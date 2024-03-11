import { ApiEndpoints, PayloadSchemaType } from '@/lib/routes/routes';
import PrismaClient, { Prisma } from '../../prisma';

// TODO: may need to expand to include labelkit specific columns common for all datasets
export async function saveDatasetDetailsAsTable(
  dataset: PayloadSchemaType[ApiEndpoints.datasetUploadAsTable],
) {
  const columnDefinitions = dataset.datasetRows[0]
    .map((column) => `"${column.columnName}" TEXT`)
    .join(', ');
  const createTabelQuery = Prisma.sql`CREATE TABLE IF NOT EXISTS ${Prisma.raw(`"${dataset.datasetName}"`)} (${Prisma.raw(columnDefinitions)})`;

  await PrismaClient.$executeRaw(createTabelQuery);
  const columns = dataset.datasetRows[0]
    .map((column) => `"${column.columnName}"`)
    .join(', ');

  const values = dataset.datasetRows.map(
    (row) => `(${row.map((column) => `"${column.columnValue}"`).join(', ')})`,
  );

  const insertRowsQuery = Prisma.sql`INSERT INTO ${Prisma.raw(`"${dataset.datasetName}"`)} (${Prisma.raw(columns)}) VALUES ${Prisma.raw(values.join(',\n'))}`;
  await PrismaClient.$executeRaw(insertRowsQuery);
}
