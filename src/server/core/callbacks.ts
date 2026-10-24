import {createHmac,timingSafeEqual} from 'node:crypto';
import {z} from 'zod';
import {AppError} from './store';
import type {DispatchJournal} from './dispatch';
const EventSchema=z.object({provider:z.string().min(1).max(80),eventId:z.string().min(1).max(160),sessionId:z.string().min(1).max(160),payloadHash:z.string().min(1).max(160),kind:z.enum(['started','ended','failed','action_acknowledged'])}).strict();
/** Local normalized protocol exercised with fixtures, NOT a vendor signature implementation. */
export function createCallbacks(journal:DispatchJournal,secret:string){
 if(secret.length<32)throw new Error('Callback secret must have at least 32 characters.');
 return {ingestProviderEvent(rawBody:string,signature:string){
  if(rawBody.length>65536||!/^[a-f0-9]{64}$/.test(signature))throw new AppError('BAD_SIGNATURE','Invalid callback signature.',401);
  const expected=createHmac('sha256',secret).update(rawBody).digest('hex');if(!timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(signature,'hex')))throw new AppError('BAD_SIGNATURE','Invalid callback signature.',401);
  return journal.ingestAuthenticatedEvent(EventSchema.parse(JSON.parse(rawBody)));
 }};
}
