import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLeadHandler, loadConfig } from './lead-handler.mjs';

const root=resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.pdf':'application/pdf'};

export function createApp(env=process.env, options={}) {
  const config=loadConfig(env); const leads=createLeadHandler(config,options);
  return http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options','DENY'); res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    if(env.SITE_INDEXABLE!=='true') res.setHeader('X-Robots-Tag','noindex, nofollow');
    try {
      const url=new URL(req.url,'http://preview.local');
      if(await leads(req,res,url.pathname)) return;
      if(!['GET','HEAD'].includes(req.method)) { req.resume(); res.writeHead(405,{Allow:'GET, HEAD'}); res.end(); return; }
      let decoded; try{decoded=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end('Invalid path');return;}
      if(decoded.includes('\\') || decoded.includes('\0') || decoded.split('/').some(segment=>segment.startsWith('.'))) {res.writeHead(404);res.end('Not found');return;}
      let target=resolve(root,`.${decoded}`);
      if(target!==root && !target.startsWith(root+sep)) {res.writeHead(404);res.end('Not found');return;}
      let status=200;
      try{const item=await stat(target);if(item.isDirectory()) target=resolve(target,'index.html');await stat(target);}catch{target=resolve(root,'404.html');status=404;}
      const data=await readFile(target);
      res.setHeader('Content-Type',mime[extname(target)]||'application/octet-stream');
      res.setHeader('Cache-Control',url.pathname.startsWith('/_astro/')?'public, max-age=31536000, immutable':'no-cache');
      res.writeHead(status);res.end(req.method==='HEAD'?undefined:data);
    }catch{if(!res.headersSent)res.writeHead(500,{'Content-Type':'text/plain'});res.end('Request could not be completed.');}
  });
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const host=process.env.HOST||'127.0.0.1';const port=Number(process.env.PORT||4321);
  const server=createApp();server.requestTimeout=15000;server.headersTimeout=10000;
  server.listen(port,host,()=>{console.log(`Smart Exam local preview: http://${host}:${port}`);console.log(`Lead delivery: ${loadConfig().enabled?'configured':'disabled (no submissions sent)'}. Indexing: ${process.env.SITE_INDEXABLE==='true'?'release setting enabled':'blocked'}.`);});
}
