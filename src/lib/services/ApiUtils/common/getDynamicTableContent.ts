import DatabaseUtils from '../../DatabaseUtils';
import { ENUM_ORDER_DIRECTION } from '../../DatabaseUtils/types';

export async function getDynamicTableContent(
  tableName: string,
  sortBy?: { field: string; direction: ENUM_ORDER_DIRECTION },
): Promise<Record<string, string>[]> {
  if (!tableName) {
    throw new Error('experimentTableName is required');
  }

  try {
    const result = await DatabaseUtils.select<Record<string, unknown>>({
      tableName,
      orderBy: sortBy ?? { field: 'id', direction: ENUM_ORDER_DIRECTION.ASC },
    });
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
