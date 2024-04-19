import { hasApiAccess, response } from '@/app/api/utils';

import ApiUtils from '@/lib/services/ApiUtils';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { editDatasetColumnSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'EditDatasetColumn',
});

export async function POST(request: Request) {
  const startTime = performance.now();
  if (!(await hasApiAccess(request))) {
    logger.warn('Unauthorized request');
    return response('Unauthorized', 401);
  }

  try {
    const requestBody = await request.json();
    const { columnId, type, name } = editDatasetColumnSchema.parse(requestBody);

    const updatedColumnId = await ApiUtils.editDatasetColumn({
      name,
      type,
      columnId,
    });

    logger.info('Dataset column edited', {
      elapsedTimeMs: performance.now() - startTime,
      type,
      name,
      columnId,
    });

    return Response.json({ id: updatedColumnId });
  } catch (error) {
    logger.error('Error edditing dataset column:', error);
    return response('Error processing request', 500);
  }
}
