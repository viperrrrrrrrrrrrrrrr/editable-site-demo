import { defineConfig } from 'tinacms';
import { LandingCollection } from './collections/landing';

// Your hosting provider exposes the branch as an environment variable
const branch =
	process.env.GITHUB_BRANCH ||
	process.env.WORKERS_CI_BRANCH || // Cloudflare Workers Builds
	process.env.CF_PAGES_BRANCH || // Cloudflare Pages
	process.env.HEAD ||
	'main';

export default defineConfig({
	telemetry: 'disabled',
	branch,
	// Only needed in production (TinaCloud). Local mode needs neither.
	clientId: process.env.PUBLIC_TINA_CLIENT_ID,
	token: process.env.TINA_TOKEN,
	build: { outputFolder: 'admin', publicFolder: 'public' },
	media: { tina: { mediaRoot: 'uploads', publicFolder: 'public' } },
	schema: { collections: [LandingCollection] },
});
