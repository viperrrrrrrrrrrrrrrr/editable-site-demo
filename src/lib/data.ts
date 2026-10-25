import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../tina/__generated__/client';

export const getLanding = () =>
	requestWithMetadata(client.queries.landing({ relativePath: 'home.json' }), { priority: 'primary' });

export type CmsLanding = Awaited<ReturnType<typeof getLanding>>['data']['landing'];
