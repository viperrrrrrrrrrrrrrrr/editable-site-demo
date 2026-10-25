// Cloudflare Pages Function → POST /api/contact
import { handleContact, type ContactEnv } from '../_lib/contact-handler';

export const onRequestPost = async (context: { request: Request; env: ContactEnv }) =>
	handleContact(context.request, context.env);

export const onRequest = async () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
