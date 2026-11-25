import { createHmac, randomBytes, timingSafeEqual, createHash } from 'node:crypto';

const kinds = new Set(['demo', 'quote', 'contact', 'partner']);
const choices = {
  segment: ['Training provider', 'Certification body', 'Corporate academy', 'Education institution', 'Technology partner', 'Other'],
  volume: ['', 'Under 1,000', '1,000–5,000', '5,000–20,000', 'Over 20,000', 'Not yet known'],
  deployment: ['Customer infrastructure', 'Need technical guidance', 'Exploring options'],
  timeline: ['', 'Within 3 months', '3–6 months', '6–12 months', 'Research stage'],
  partnerType: ['Referral', 'Implementation', 'Reseller', 'Technology'],
};
const allowed = new Set(['name','email','organization','role','country','segment','volume','deployment','timeline','partnerType','message','website','consent','kind','source','csrf']);

export function loadConfig(env = process.env) {
  let origin, webhook;
  try { origin = new URL(env.SITE_URL || 'http://127.0.0.1:4321').origin; } catch { origin = ''; }
  try { webhook = new URL(env.CRM_WEBHOOK_URL || ''); } catch { webhook = null; }
  const secret = env.FORM_SECRET || '';
  const enabled = env.LEAD_FORMS_ENABLED === 'true' && env.PRIVACY_NOTICE_APPROVED === 'true' && env.LEGAL_ENTITY_APPROVED === 'true' && !!origin && secret.length >= 32 && webhook?.protocol === 'https:' && !webhook.username && !webhook.password && !!env.CRM_WEBHOOK_TOKEN;
  return { enabled: !!enabled, origin, secret, webhook: webhook?.href || '', token: env.CRM_WEBHOOK_TOKEN || '', secure: origin.startsWith('https://') };
}

function mac(value, secret) { return createHmac('sha256', secret).update(value).digest('base64url'); }
function equal(a, b) { const av = Buffer.from(a); const bv = Buffer.from(b); return av.length === bv.length && timingSafeEqual(av, bv); }
export function issueCsrf(secret, now = Date.now()) { const payload = `${now}.${randomBytes(20).toString('hex')}`; return `${payload}.${mac(payload, secret)}`; }
export function validCsrf(value, cookie, secret, now = Date.now(), minimumAge = 3000) {
  if (typeof value !== 'string' || value.length > 200 || !cookie || !equal(value,cookie)) return false;
  const [ts, nonce, signature, ...extra] = value.split('.');
  if (extra.length || !/^\d{13}$/.test(ts) || !/^[0-9a-f]{40}$/.test(nonce || '') || !signature) return false;
  const age = now - Number(ts);
  return age >= minimumAge && age <= 30*60*1000 && equal(signature, mac(`${ts}.${nonce}`, secret));
}

export function validateLead(raw) {
  if (!raw || Array.isArray(raw) || typeof raw !== 'object' || Object.keys(raw).some(k=>!allowed.has(k))) return { error: 'Invalid request fields.' };
  if (raw.website !== '' && raw.website !== undefined) return { error: 'Request validation failed.' };
  if (!kinds.has(raw.kind) || raw.consent !== true) return { error: 'Please confirm the inquiry type and privacy acknowledgment.' };
  const lead = { kind: raw.kind, consent: true };
  const limits = { name:[2,100], email:[5,254], organization:[2,160], role:[2,100], country:[2,80], message:[10,2000] };
  for (const [key,[min,max]] of Object.entries(limits)) {
    if (typeof raw[key] !== 'string') return { error: `Please provide a valid ${key}.` };
    const value = raw[key].trim();
    if (value.length<min || value.length>max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value) || (key!=='message' && /[\r\n]/.test(value))) return { error: `Please provide a valid ${key}.` };
    lead[key] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: 'Please provide a valid email address.' };
  for (const [key,list] of Object.entries(choices)) {
    const value = raw[key] ?? '';
    if (key === 'partnerType' && raw.kind !== 'partner') { if(value) return {error:'Invalid partnership field.'}; continue; }
    if (!list.includes(value)) return { error: `Please select a valid ${key}.` };
    lead[key] = value;
  }
  const validSources = ['/request-demo/','/request-quote/','/contact/','/partners/'];
  if (!validSources.includes(raw.source)) return { error: 'Invalid inquiry source.' };
  lead.source = raw.source;
  return { lead };
}

function send(res, status, body, extra = {}) { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', ...extra }); res.end(JSON.stringify(body)); }
function cookieValue(header) { return (header || '').split(';').map(v=>v.trim()).find(v=>v.startsWith('se_csrf='))?.slice(8) || ''; }
async function readJson(req) {
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(req.headers['content-type'] || '')) { req.resume(); return { status:415 }; }
  const length = Number(req.headers['content-length']);
  if (Number.isFinite(length) && length>16384) { req.resume(); return {status:413}; }
  let bytes=0, parts=[];
  for await (const chunk of req) { bytes+=chunk.length; if(bytes>16384) return {status:413}; parts.push(chunk); }
  try { return {data:JSON.parse(Buffer.concat(parts).toString('utf8'))}; } catch { return {status:400}; }
}

export function createLeadHandler(config, { fetcher = fetch, clock = Date.now } = {}) {
  const limits = new Map(); const deliveries = new Map();
  function prune(now) { for(const [key,entry] of limits) if(entry.until<now) limits.delete(key); for(const [key,entry] of deliveries) if(entry.until<now) deliveries.delete(key); }
  return async function handler(req,res,pathname) {
    if (!['/api/form-config','/api/leads'].includes(pathname)) return false;
    if (pathname === '/api/form-config') {
      if(req.method!=='GET') { send(res,405,{message:'Method not allowed.'},{Allow:'GET'}); return true; }
      if(!config.enabled) { send(res,200,{enabled:false}); return true; }
      const existing=cookieValue(req.headers.cookie);
      const csrf=validCsrf(existing,existing,config.secret,clock(),0)?existing:issueCsrf(config.secret,clock());
      send(res,200,{enabled:true,csrf},{'Set-Cookie':`se_csrf=${csrf}; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=1800${config.secure?'; Secure':''}`}); return true;
    }
    if(req.method!=='POST') { send(res,405,{message:'Method not allowed.'},{Allow:'POST'}); return true; }
    if(!config.enabled) { req.resume(); send(res,503,{message:'Request delivery is not configured. No inquiry has been sent.'}); return true; }
    if(req.headers.origin!==config.origin) { req.resume(); send(res,403,{message:'Request origin could not be verified.'}); return true; }
    const now=clock(); prune(now);
    const ip=req.socket.remoteAddress || 'unknown'; const entry=limits.get(ip) || {count:0,until:now+60000};
    if(limits.size>10000 || ++entry.count>5) { req.resume(); send(res,429,{message:'Too many requests. Please try again in a minute.'},{'Retry-After':'60'}); return true; }
    limits.set(ip,entry);
    let input; try { input=await readJson(req); } catch { send(res,400,{message:'Invalid request body.'}); return true; }
    if(input.status) { send(res,input.status,{message:'Invalid request format or body size.'}); return true; }
    if(!validCsrf(input.data?.csrf,cookieValue(req.headers.cookie),config.secret,now)) { send(res,403,{message:'Please reload the form, wait a moment, and try again.'}); return true; }
    const {lead,error}=validateLead(input.data);
    if(error) { send(res,422,{message:error}); return true; }
    const fingerprint=createHash('sha256').update(JSON.stringify(lead)).digest('hex');
    const key=mac(`${input.data.csrf}.${fingerprint}`,config.secret);
    const prior=deliveries.get(key);
    if(prior?.reference) { send(res,200,{reference:prior.reference}); return true; }
    if(prior?.pending) { send(res,409,{message:'This inquiry is being delivered. Please wait before retrying.'}); return true; }
    deliveries.set(key,{pending:true,until:now+30*60*1000});
    try {
      const reference=`SE-${createHash('sha256').update(key).digest('hex').slice(0,12).toUpperCase()}`;
      const response=await fetcher(config.webhook,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.token}`,'Idempotency-Key':key},body:JSON.stringify({schemaVersion:1,reference,receivedAt:new Date(now).toISOString(),qualificationStatus:'new_inquiry',...lead}),signal:AbortSignal.timeout(8000)});
      if(!response.ok) throw new Error('crm_not_acknowledged');
      deliveries.set(key,{reference,until:now+30*60*1000});
      send(res,201,{reference});
    } catch {
      deliveries.delete(key);
      send(res,502,{message:'Delivery could not be confirmed. Please try again later. No meeting has been booked.'});
    }
    return true;
  };
}
