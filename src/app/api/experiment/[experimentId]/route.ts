import ApiUtils from '@/lib/services/ApiUtils';
import { response } from '../../utils';
import { experimentViewResponseSchema } from './schema';

/**
 * @swagger
 * /api/experiment/[experimentId]:
 *   get:
 *     tags:
 *      - experiment
 *     description: Gets the experiment details (TODO - add rest body, response and rest of data - ex [https://editor.swagger.io/](https://editor.swagger.io/) )
 */
export async function GET(
  request: Request,
  { params }: { params: { experimentId: string } },
) {
  try {
    const experimentId = params.experimentId;
    if (!experimentId) {
      return response('Invalid experiment id', 400);
    }
    const result = await ApiUtils.getExperiment(experimentId);

    if (!experimentViewResponseSchema.safeParse(result)) {
      return response('Invalid response experiment view type', 500);
    }

    const res = JSON.stringify(result);
    return Response.json(res);
  } catch (error) {
    console.error('Error in GET experiment view:', error);
    return response('Error processing request', 500);
  }
}
