// Prepares dist/client as a pure static site for Cloudflare Pages (`wrangler pages deploy dist/client`).
// - removes the local-mode Tina admin (it only works against a local dev server)
// - /admin -> walkthrough page, plus cache + security headers
import { rmSync, writeFileSync, existsSync } from 'node:fs';
const out = new URL('../dist/client/', import.meta.url);
rmSync(new URL('admin/', out), { recursive: true, force: true });
writeFileSync(new URL('_redirects', out), '/admin /edit-it-yourself/ 302\n/admin/* /edit-it-yourself/ 302\n');
writeFileSync(new URL('_headers', out), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/uploads/*
  Cache-Control: public, max-age=86400

/edit-demo/*
  Cache-Control: public, max-age=86400
`);
const site = (process.env.SITE_URL || 'https://editable-site-demo.pages.dev').replace(/\/$/, '');
writeFileSync(new URL('robots.txt', out), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap-index.xml\n`);
console.log('postbuild: static site ready in dist/client', existsSync(new URL('index.html', out)) ? '(index.html ok)' : '(index.html MISSING)');
