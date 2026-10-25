import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { LandingQuery } from '../../tina/__generated__/types';
import type { CmsLanding } from './data';
import LandingBody from '../components/LandingBody.astro';
import { getLanding } from './data';

export const islands: IslandRegistry = {
	landing: {
		fetch: () => getLanding(),
		component: LandingBody,
		wrapper: { tag: 'div' },
		propsFromData: (data) => ({
			data: (data as QueryResult<LandingQuery>).data?.landing as CmsLanding | undefined,
		}),
	},
};
