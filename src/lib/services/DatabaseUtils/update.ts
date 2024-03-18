import PrismaClient from '../prisma';
import { assertTableExists } from './common';

export async function update<T>(
  tableName: string,
  setValues: { [key: string]: string },
  whereConditions?: { [key: string]: string },
): Promise<number> {
  await assertTableExists(tableName);

  const setKeys = Object.keys(setValues);
  const setParams = setKeys
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(', ');
  const setValuesArray = Object.values(setValues);

  let sqlQuery = `UPDATE "${tableName}" SET ${setParams}`;
  let queryParams = [...setValuesArray];

  if (whereConditions && Object.keys(whereConditions).length > 0) {
    const whereKeys = Object.keys(whereConditions);
    const whereParams = whereKeys
      .map((key, index) => `"${key}" = $${setValuesArray.length + index + 1}`)
      .join(' AND ');
    const whereValuesArray = Object.values(whereConditions);

    sqlQuery += ` WHERE ${whereParams}`;
    queryParams = [...queryParams, ...whereValuesArray];
  }

  try {
    // TODO change to executeRaw
    const result = await PrismaClient.$executeRawUnsafe<T>(
      sqlQuery,
      ...queryParams,
    );
    return result;
  } catch (error) {
    console.error('Error executing raw SQL update:', error);
    throw error;
  }
}
