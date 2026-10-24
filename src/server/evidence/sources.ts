import type {CaseRequest,EvidenceRef} from '../../shared/contracts';
import {isIP} from 'node:net';
function publicTarget(raw:string):boolean {
 try {
  const u=new URL(raw),host=u.hostname.toLowerCase().replace(/^\[|\]$/g,'').replace(/\.$/,'');
  if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port&&u.port!=='443'&&u.port!=='80')return false;
  if(host==='localhost'||!host.includes('.')||/\.(?:local|internal|localhost|test|invalid)$/.test(host))return false;
  const ip=isIP(host);
  // IPv6 literals are conservatively unsupported, including mapped private IPv4.
  if(ip===6||host.includes(':'))return false;
  if(ip===4){const [a,b]=host.split('.').map(Number);if(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&(b===168||b===0)||a===100&&b>=64&&b<=127||a===198&&(b===18||b===19||b===51)||a===203&&b===0)return false;}
  return true;
 }catch{return false;}
}
/** Metadata validation only: any future fetch must resolve/pin public DNS addresses and recheck each redirect. */
export function isSafePublicUrl(url:string,redirect?:string):boolean {try{return publicTarget(url)&&(redirect===undefined||publicTarget(new URL(redirect,url).href));}catch{return false;}}
export async function researchOffers(_request:CaseRequest,signal:AbortSignal):Promise<EvidenceRef[]> {
 if(signal.aborted)throw new DOMException('Research aborted','AbortError');
 throw new Error('INTEGRATION_UNAVAILABLE: public research is a placeholder; no provider or network was called.');
}
