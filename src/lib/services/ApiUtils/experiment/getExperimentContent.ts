import DatabaseUtils from '../../DatabaseUtils';

export default async function getExperimentContent(
  experimentTableName: string,
) {
  if (!experimentTableName) {
    throw new Error('experimentTableName is required');
  }

  try {
    const result =
      await DatabaseUtils.select<Record<string, string>>(experimentTableName);
    return result;
  } catch (error) {
    // Check if the error is because the table doesn't exist
    if (error instanceof Error && 'code' in error && error.code === 'P2010') {
      return [];
    } else {
      throw error;
    }
  }
}
