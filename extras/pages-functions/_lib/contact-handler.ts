import { sendEmail, type EmailEnv } from './email';

export interface ContactEnv extends EmailEnv {
	TURNSTILE_SECRET_KEY?: string; // Cloudflare test secret "1x0000000000000000000000000000000AA" always passes
	CONTACT_TO_EMAIL?: string;     // where the client wants enquiries delivered
	CONTACT_FROM_EMAIL?: string;   // a verified sender on the client's domain
}

const TEST_SECRET = '1x0000000000000000000000000000000AA';
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? '').trim().slice(0, n);

export async function verifyTurnstile(secret: string, token: string, ip?: string | null) {
	const body = new FormData();
	body.append('secret', secret);
	body.append('response', token);
	if (ip) body.append('remoteip', ip);
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
	return (await res.json()) as { success: boolean; 'error-codes'?: string[] };
}

export async function handleContact(request: Request, env: ContactEnv): Promise<Response> {
	const wantsJson = (request.headers.get('accept') || '').includes('application/json');
	const reply = (status: number, payload: Record<string, unknown>) =>
		wantsJson || status !== 200
			? Response.json(payload, { status })
			: Response.redirect(new URL('/?sent=1#contact', request.url).toString(), 303);

	let form: FormData;
	try { form = await request.formData(); } catch { return reply(400, { ok: false, error: 'Invalid form data.' }); }

	// 1. Honeypot — silently "succeed" so bots learn nothing
	if (clip(form.get('website'), 200)) return reply(200, { ok: true });

	// 2. Validation
	const name = clip(form.get('name'), 100);
	const email = clip(form.get('email'), 200);
	const organisation = clip(form.get('organisation'), 200);
	const message = clip(form.get('message'), 5000);
	if (!name || !isEmail(email) || message.length < 2) return reply(422, { ok: false, error: 'Please provide your name, a valid email and a message.' });

	// 3. Turnstile spam check (server-side, required)
	const token = clip(form.get('cf-turnstile-response'), 4096);
	if (!token) return reply(400, { ok: false, error: 'Spam check missing — please wait for it to finish.' });
	const verdict = await verifyTurnstile(env.TURNSTILE_SECRET_KEY || TEST_SECRET, token, request.headers.get('CF-Connecting-IP'));
	if (!verdict.success) return reply(403, { ok: false, error: `Spam check failed (${(verdict['error-codes'] || []).join(', ')}).` });

	// 4. Notification email to the client
	const sent = await sendEmail(env, {
		to: env.CONTACT_TO_EMAIL || 'contact@example.org',
		from: env.CONTACT_FROM_EMAIL || 'Website <no-reply@example.org>',
		replyTo: email,
		subject: `New website enquiry from ${name}`,
		text: `Name: ${name}\nEmail: ${email}\nOrganisation: ${organisation || '-'}\n\n${message}`,
	});
	if (!sent.ok) {
		console.error('[contact] email failed', sent.error);
		return reply(502, { ok: false, error: 'Email service unavailable.' });
	}
	return reply(200, { ok: true, id: sent.id });
}
