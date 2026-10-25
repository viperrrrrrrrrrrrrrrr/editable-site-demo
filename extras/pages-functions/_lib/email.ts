/**
 * Email provider abstraction. Swap the provider with the EMAIL_PROVIDER env var.
 *  - "log"    (default / local): just logs the email, sends nothing.
 *  - "resend": POST https://api.resend.com/emails with RESEND_API_KEY.
 * Any other HTTP email API (Postmark, Brevo, SendGrid…) is ~15 lines more.
 */
export interface EmailMessage { to: string; from: string; replyTo?: string; subject: string; text: string }
export interface EmailEnv { EMAIL_PROVIDER?: string; RESEND_API_KEY?: string }

export async function sendEmail(env: EmailEnv, msg: EmailMessage): Promise<{ ok: boolean; id?: string; error?: string }> {
	const provider = (env.EMAIL_PROVIDER || 'log').toLowerCase();
	if (provider === 'log') {
		console.log('[email:log] would send →', JSON.stringify(msg));
		return { ok: true, id: 'logged-locally' };
	}
	if (provider === 'resend') {
		if (!env.RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY missing' };
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ from: msg.from, to: [msg.to], reply_to: msg.replyTo, subject: msg.subject, text: msg.text }),
		});
		const json: any = await res.json().catch(() => ({}));
		return res.ok ? { ok: true, id: json.id } : { ok: false, error: json.message || `HTTP ${res.status}` };
	}
	return { ok: false, error: `Unknown EMAIL_PROVIDER "${provider}"` };
}
