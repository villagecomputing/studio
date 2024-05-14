import { response } from '@/app/api/utils';

import ApiUtils from '@/lib/services/ApiUtils';
import { withAuthMiddleware } from '@/lib/services/ApiUtils/user/withAuthMiddleware';
import loggerFactory, { LOGGER_TYPE } from '@/lib/services/Logger';
import { editDatasetColumnSchema } from './schema';

const logger = loggerFactory.getLogger({
  type: LOGGER_TYPE.WINSTON,
  source: 'EditDatasetColumn',
});

export async function POST(request: Request) {
  return withAuthMiddleware(request, async () => {
    const startTime = performance.now();
    let requestBody: string | undefined;
    try {
      requestBody = await request.json();
      const { columnId, type, name } =
        editDatasetColumnSchema.parse(requestBody);

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
      logger.error('Error edditing dataset column:', error, {
        requestBody,
      });
      return response('Error processing request', 500);
    }
  });
}
