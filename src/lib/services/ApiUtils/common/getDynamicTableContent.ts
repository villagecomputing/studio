import DatabaseUtils from '../../DatabaseUtils';

export default async function getDynamicTableContent(
  tableName: string,
): Promise<Record<string, string>[]> {
  if (!tableName) {
    throw new Error('experimentTableName is required');
  }

  try {
    const result =
      await DatabaseUtils.select<Record<string, unknown>>(tableName);
    // Convert all values in each record to strings
    const stringifiedResult = result.map((record) =>
      Object.fromEntries(
        Object.entries(record).map(([key, value]) => [key, String(value)]),
      ),
    ) as Record<string, string>[];
    return stringifiedResult;
  } catch (error) {
    // Check if the error is because the table doesn't exist
    if (error instanceof Error && 'code' in error && error.code === 'P2010') {
      return [];
    } else {
      throw error;
    }
  }
}
