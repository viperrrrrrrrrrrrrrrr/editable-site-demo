/** DEMO contact form: validates in the browser and shows a confirmation.
 *  It makes NO network request and stores nothing — the portfolio demo must never send real data.
 *  (The production version with a Cloudflare Pages Function + Turnstile lives in /extras.)
 *  Uses event delegation so it survives Tina's live re-render of the page while editing. */
export function initContactForm() {
	document.addEventListener('submit', (event) => {
		const form = event.target as HTMLFormElement;
		if (form?.id !== 'contact-form') return;
		event.preventDefault();
		const status = form.querySelector<HTMLElement>('#contact-status')!;
		const email = form.querySelector<HTMLInputElement>('#cf-email')!;

		if (!form.checkValidity() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
			const firstInvalid = form.querySelector<HTMLElement>(':invalid') ?? email;
			status.textContent = 'Please fill in your name, a valid email and a message.';
			status.className = 'min-h-6 font-semibold text-red-700';
			firstInvalid?.focus();
			return;
		}

		form.reset();
		status.className = 'min-h-6 font-semibold text-olive';
		status.textContent = form.dataset.success || 'Demo form: your message was not sent.';
	});
}
