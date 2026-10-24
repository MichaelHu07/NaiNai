import 'dotenv/config';
import {mkdirSync,existsSync,readFileSync,writeFileSync,openSync,closeSync,unlinkSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
import {homedir} from 'node:os';
import {join,resolve} from 'node:path';
import {createApp} from './app';

if(process.env.NAINAI_PROVIDER_MODE&&process.env.NAINAI_PROVIDER_MODE!=='fixture')throw new Error('This build supports fixture mode only. Live integrations have not been implemented.');
if(process.env.NAINAI_CONTACT_ENABLED==='true')throw new Error('Supplier contact is not implemented or authorized in this build.');
const dataDir=resolve(process.env.NAINAI_DATA_DIR??join(process.env.LOCALAPPDATA??join(homedir(),'.local','share'),'NaiNai','cal-hacks'));
mkdirSync(dataDir,{recursive:true});
const lockPath=join(dataDir,'server.lock');
if(existsSync(lockPath)){
 const pid=Number(readFileSync(lockPath,'utf8'));let alive=false;
 if(Number.isSafeInteger(pid)&&pid>0){try{process.kill(pid,0);alive=true;}catch{alive=false;}}
 if(alive)throw new Error('Another NaiNai process owns this data directory. Use that server or choose a different NAINAI_DATA_DIR.');
 unlinkSync(lockPath);
}
const lock=openSync(lockPath,'wx');writeFileSync(lock,String(process.pid));closeSync(lock);
const keyPath=join(dataDir,'local-access-key.txt');
let passphrase=process.env.NAINAI_PASSPHRASE;
if(!passphrase){if(!existsSync(keyPath))writeFileSync(keyPath,randomBytes(24).toString('base64url'),{mode:0o600});passphrase=readFileSync(keyPath,'utf8').trim();}
const port=Number(process.env.PORT??3001);
const runtime=createApp({dataDir,passphrase,allowedOrigins:[`http://127.0.0.1:${port}`,`http://localhost:${port}`,'http://127.0.0.1:5173','http://localhost:5173']});
runtime.core.recoverSessions();
const server=runtime.app.listen(port,'127.0.0.1',()=>{
 console.log(`NaiNai: http://127.0.0.1:${port} | fixture mode, no external contact`);
 console.log(process.env.NAINAI_PASSPHRASE?'Use your NAINAI_PASSPHRASE to unlock.':`Local access key is stored at: ${keyPath}`);
 console.log(`Data directory: ${dataDir}`);
});
function release(){try{if(existsSync(lockPath)&&readFileSync(lockPath,'utf8')===String(process.pid))unlinkSync(lockPath);}catch{/* never remove another process's lock */}}
process.on('exit',release);
for(const signal of ['SIGINT','SIGTERM'] as const)process.once(signal,()=>server.close(()=>{runtime.core.close();process.exit(0);}));
server.on('error',()=>{release();runtime.core.close();process.exitCode=1;});
