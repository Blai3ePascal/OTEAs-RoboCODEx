// SPDX-License-Identifier: MIT
// Live smoke test with ephemeral rooms; never print credentials or tank source.
import assert from 'node:assert/strict';
import {ROOM_SERVICE} from '../src/rooms.js';
import {starterBlocks} from '../src/core.js';
const name='QA-'+Date.now()+'-'+crypto.randomUUID().slice(0,8),password=crypto.randomUUID();
const tank=n=>({name:n,creator:'Prueba OTEA',code:'',language:'blocks',color:'#ffb347',skin:'vanguard',colors:{radar:'#abcdef'},blocks:starterBlocks()});
async function request(path,body,session){const r=await fetch(ROOM_SERVICE+path,{method:body===undefined?'GET':'POST',headers:{'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',Origin:'https://blai3epascal.github.io',...(body?{'Content-Type':'application/json'}:{}),...(session?{Authorization:'Bearer '+session.token}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(30000)});let data;try{data=await r.json();}catch{throw Error('El servicio no devolvió JSON · HTTP '+r.status);}return {status:r.status,data};}
let host;
try {
 const health=await request('/health');assert.equal(health.status,200);assert.equal(health.data.storage,true);
 const created=await request('/rooms',{action:'create',name,password,config:{map:'crates',theme:'space',maxTicks:100,autoStart:2}});assert.equal(created.status,201,created.data.error);host=created.data;
 const wrong=await request('/rooms',{action:'join',name,password:'incorrect-password'});assert.equal(wrong.status,401);
 const joined=await request('/rooms',{action:'join',name,password});assert.equal(joined.status,200);const guest=joined.data;
 const path='/rooms/'+host.room;
 await request(path+'/submit',{tank:tank('QA-Nova')},host);await request(path+'/submit',{tank:tank('QA-Echo')},guest);
 assert.equal((await request(path,undefined,host)).data.participants.length,2);
 assert.equal((await request(path,undefined,guest)).data.participants[0].tank,undefined);
 assert.equal((await request(path+'/start',{},guest)).status,403);
 assert.equal((await request(path+'/start',{},host)).data.status,'running');
 assert.equal((await request(path+'/submit',{tank:tank('Late')},guest)).status,409);
 assert.equal((await request(path+'/frame',{frame:{tick:50,robots:[],bullets:[],map:[],effects:[]}},host)).status,200);
 assert.equal((await request(path,undefined,guest)).data.frame.tick,50);
 assert.equal((await request(path+'/result',{result:{draw:true,winner:null,scores:[],winnerCreator:'Prueba OTEA'}},host)).data.status,'finished');
 assert.equal((await request(path,undefined,guest)).data.result.winnerCreator,'Prueba OTEA');
 const reset=(await request(path+'/reset',{},host)).data;assert.equal(reset.status,'waiting');assert.equal(reset.config.autoStart,0);
 console.log('Salas publicadas: acceso, contraseña, permisos, inscripción, emisión, resultado y reapertura correctos.');
}finally{if(host)await request('/rooms/'+host.room+'/close',{},host);}
