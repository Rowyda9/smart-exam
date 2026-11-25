import type { APIRoute } from 'astro';
export const GET: APIRoute = () => new Response(import.meta.env.SITE_INDEXABLE === 'true' ? 'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://smart-exam.net/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
