import type { APIRoute } from 'astro';
import { productPages } from '../data/site';
import { articles } from '../data/articles';
const routes = ['', ...productPages.map(p=>p.slug), 'solutions', 'licensing', 'resources', 'faq', 'demo', 'request-demo', 'request-quote', 'contact', 'partners', 'ar', ...articles.map(a=>`resources/${a.slug}`)];
export const GET: APIRoute = () => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${import.meta.env.SITE_INDEXABLE === 'true' ? routes.map(route=>`<url><loc>https://smart-exam.net/${route ? route+'/' : ''}</loc></url>`).join('') : ''}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
