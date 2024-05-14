import { arraysEqual } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import PrismaClient from '../prisma';

export async function insert(
  tableName: string,
  rows: Record<string, string | Date | null | number>[],
): Promise<number> {
  if (rows.length === 0) {
    return 0;
  }

  const firstRowColumns: string[] = Object.keys(rows[0]);
  const rowValuesArray = rows.map((row) => {
    const columns = Object.keys(row);
    if (!arraysEqual(firstRowColumns, columns)) {
      throw new Error(
        'Invalid dataset schema: all rows must have the same columns',
      );
    }
    return columns.map((column) => row[column]);
  });
  const sqlQuery = Prisma.sql`INSERT INTO "${Prisma.raw(tableName)}" (${Prisma.raw(firstRowColumns.join(', '))}) 
    VALUES ${Prisma.join(
      rowValuesArray.map(
        (rowValues) => Prisma.sql`(${Prisma.join(rowValues)})`,
      ),
    )}`;

  try {
    const result = await PrismaClient.$executeRaw(sqlQuery);
    return result;
  } catch (error) {
    console.error('Error executing raw SQL insert:', error);
    throw error;
  }
}
