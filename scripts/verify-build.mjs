import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist');
async function walk(dir){let out=[];for(const item of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,item.name);out.push(...item.isDirectory()?await walk(path):[path]);}return out;}
const files=await walk(root), pages=files.filter(p=>p.endsWith('.html'));const failures=[];
for(const page of pages){const text=await readFile(page,'utf8');const label=page.slice(root.length+1);const checks=[[(text.match(/<h1(?:\s|>)/g)||[]).length===1,'exactly one h1'],[/<title>.+<\/title>/.test(text),'title'],[/name="description" content="[^"]+"/.test(text),'description'],[/rel="canonical" href="https:\/\/smart-exam.net\//.test(text),'canonical'],[/name="robots" content="noindex, nofollow"/.test(text),'preview noindex'],[/id="main"/.test(text),'skip target']];for(const [ok,name]of checks)if(!ok)failures.push(`${label}: ${name}`);
  for(const match of text.matchAll(/(?:href|src)="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)){let target=resolve(root,'.'+decodeURI(match[1]));try{if((await stat(target)).isDirectory())target=resolve(target,'index.html');await stat(target);}catch{failures.push(`${label}: missing local target ${match[1]}`);}}
  if(/(?:\bAED\s*\d{2,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{20,}|Bearer\s+[A-Za-z0-9_-]{20}|(?:api_key|client_secret)\s*[:=])/i.test(text)) failures.push(`${label}: confidential/unsafe pattern`);
}
const robots=await readFile(resolve(root,'robots.txt'),'utf8');assert.ok(robots.includes('Disallow: /'));assert.equal(files.filter(p=>p.endsWith('.map')).length,0,'no source maps');
assert.deepEqual(failures,[]);console.log(JSON.stringify({pages:pages.length,files:files.length,internalLinks:'passed',metadata:'passed',previewNoindex:'passed',publicPatternScan:'passed',sourceMaps:0},null,2));
