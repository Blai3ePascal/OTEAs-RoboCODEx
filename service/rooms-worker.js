// SPDX-License-Identifier: MIT
// Stateless Worker; one optimistic-CAS record per room in D1.
const ORIGIN='https://blai3epascal.github.io';
const encoder=new TextEncoder();
const hex=b=>Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');
const hash=async s=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(s)));
const token=()=>hex(crypto.getRandomValues(new Uint8Array(32)));
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
export async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256));}
function equal(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
export function normalizeRoom(name){if(typeof name!=='string')fail('Escribe un nombre de sala.');name=name.trim().normalize('NFKC').toLocaleLowerCase('es');if(name.length<3||name.length>60)fail('Nombre de sala: entre 3 y 60 caracteres.');return name;}
export function sanitizeTank(t){
 if(!t||typeof t.name!=='string'||!t.name.trim()||t.name.length>40||typeof t.code!=='string'||t.code.length>100000||!['blocks','java','javascript','python'].includes(t.language))fail('Tanque no válido.');
 if(typeof t.creator!=='string'||t.creator.length>60)fail('Escribe el nombre o alias del creador (máximo 60 caracteres).');
 const color=v=>typeof v==='string'&&/^#[a-f0-9]{6}$/i.test(v);
 if(!color(t.color))fail('Color no válido.');const colors={};
 for(const [k,v] of Object.entries(t.colors||{})){if(!['body','tracks','tread','hull','turret','barrel','muzzle','radar','trim'].includes(k)||!color(v))fail('Color de pieza no válido.');colors[k]=v;}
 let count=0;const allowed=['ahead','back','turnRight','turnLeft','turnGunRight','turnGunLeft','turnRadarRight','turnRadarLeft','fire','wait','repeat','forever','ifEnergy'];
 const clean=(list,depth=0)=>{if(!Array.isArray(list)||depth>10)fail('Bloques no válidos.');return list.map(b=>{if(++count>400||!b||!allowed.includes(b.type)||!Number.isFinite(Number(b.value)))fail('Bloques no válidos.');const r={type:b.type,value:Number(b.value)};if(['repeat','forever','ifEnergy'].includes(b.type))r.children=clean(b.children||[],depth+1);return r;});};
 const blocks={};for(const k of ['run','scan','wall','hit'])blocks[k]=clean(t.blocks?.[k]||[]);
 return {id:token(),name:t.name.trim(),creator:t.creator.trim(),color:t.color,colors,skin:t.skin==='wisp'?'wisp':'vanguard',language:t.language,code:t.code,blocks};
}
function config(c={}){const integer=(v,d,min,max)=>Number.isInteger(v)&&v>=min&&v<=max?v:d;const maps=['classic','cross','lanes','bunker','islands','slalom','stairs','columns','zigzag','corners','twin','crates','t','l','h','diagonal','runway','plaza','gates','scatter'];return {engine:c.engine==='jvm'?'jvm':'web',map:maps.includes(c.map)?c.map:'classic',theme:['night','sand','ice','forest','space','lava','ocean','neon'].includes(c.theme)?c.theme:'night',maxTicks:integer(c.maxTicks,1800,100,10000),seed:integer(c.seed,137,0,4294967295),autoStart:integer(c.autoStart,0,2,8)};}
function publicRoom(row,state,session){return {name:state.name,status:state.status,config:state.config,version:row.version,expires:row.expires,host:session.host,memberId:session.id,participants:state.participants.map(p=>({id:p.id,name:p.tank.name,creator:p.tank.creator,language:p.tank.language,color:p.tank.color,ready:p.ready,...(session.host?{tank:p.tank}:{})})),frame:state.frame||null,result:state.result||null};}
async function throttle(db,key,now,limit){const bucket=Math.floor(now/300000);const r=await db.prepare('INSERT INTO room_limits (key,bucket,n) VALUES (?,?,1) ON CONFLICT(key,bucket) DO UPDATE SET n=n+1 RETURNING n').bind(key,bucket).first();if(r.n>limit)fail('Demasiados intentos. Espera cinco minutos.',429);}
export default {async fetch(request,env){
 const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
 try{
  const url=new URL(request.url);if(url.pathname==='/')return new Response('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>OTEA · Servicio de salas</title><style>body{background:#111923;color:#eef2ec;font:18px system-ui;margin:10vh auto;max-width:650px;padding:30px}a{color:#ffb347}</style><h1>OTEA’s RoboCODEx</h1><p>Servicio de salas para los torneos del aula.</p><p><a href="https://blai3epascal.github.io/OTEAs-RoboCODEx/#tournament">Abrir Torneos →</a></p><p>Las salas caducan a las seis horas. La inscripción comparte tu tanque y alias con el organizador.</p></html>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});if(url.pathname==='/health')return reply({ok:true,storage:!!env.DB});
  if(request.headers.get('Origin')&&request.headers.get('Origin')!==ORIGIN)fail('Origen no permitido.',403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(!env.DB)fail('El servicio de salas no dispone de almacenamiento.',503);
  const now=Date.now();
  if(url.pathname==='/rooms'&&request.method==='POST'){
   const text=await request.text();if(text.length>2000)fail('Solicitud demasiado grande.',413);const body=JSON.parse(text),name=normalizeRoom(body.name);
   if(typeof body.password!=='string'||body.password.length<6||body.password.length>128)fail('Contraseña: entre 6 y 128 caracteres.');
   const key=await hash(name),ip=await hash(request.headers.get('CF-Connecting-IP')||'unknown');await throttle(env.DB,ip,now,30);await throttle(env.DB,ip+key,now,12);
   await env.DB.batch([env.DB.prepare('DELETE FROM rooms WHERE id IN (SELECT id FROM rooms WHERE expires < ? LIMIT 100)').bind(now),env.DB.prepare('DELETE FROM room_limits WHERE bucket < ?').bind(Math.floor(now/300000)-2)]);
   let row=await env.DB.prepare('SELECT * FROM rooms WHERE id=?').bind(key).first();const rawToken=token(),tokenHash=await hash(rawToken);
   if(body.action==='create'){
    if(row)fail('Ya existe una sala con ese nombre. Elige otro o únete.',409);
    const salt=token(),password=await passwordHash(body.password,salt),session={id:token(),host:true,tokenHash};const state={name:body.name.trim(),status:'waiting',config:config(body.config),sessions:[session],participants:[],frame:null,result:null};
    const inserted=await env.DB.prepare('INSERT OR IGNORE INTO rooms (id,salt,password,expires,version,state) VALUES (?,?,?,?,1,?)').bind(key,salt,password,now+21600000,JSON.stringify(state)).run();if(!inserted.meta.changes)fail('Ya existe esa sala.',409);
    return reply({room:key,token:rawToken,...publicRoom({version:1,expires:now+21600000},state,session)},201);
   }
   if(body.action!=='join')fail('Acción no válida.');
   if(!row||!equal(await passwordHash(body.password,row.salt),row.password))fail('Sala o contraseña incorrectas.',401);
   for(let attempt=0;attempt<6;attempt++){
    row=await env.DB.prepare('SELECT * FROM rooms WHERE id=?').bind(key).first();if(!row||row.expires<now)fail('Sala caducada.',410);const state=JSON.parse(row.state);if(state.sessions.length>=40)fail('Sala llena (40 conexiones).',409);
    const session={id:token(),host:false,tokenHash};state.sessions.push(session);const saved=await env.DB.prepare('UPDATE rooms SET state=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(state),key,row.version).run();if(saved.meta.changes)return reply({room:key,token:rawToken,...publicRoom({...row,version:row.version+1},state,session)});
   }fail('La sala está ocupada. Vuelve a intentarlo.',409);
  }
  const match=url.pathname.match(/^\/rooms\/([a-f0-9]{64})(?:\/(submit|remove|config|start|frame|result|reset|leave|close))?$/);if(!match)fail('Ruta no encontrada.',404);
  const [,key,action]=match,authorization=request.headers.get('Authorization')||'';if(!authorization.startsWith('Bearer '))fail('Acceso no autorizado.',401);const sessionHash=await hash(authorization.slice(7));
  const text=request.method==='POST'?await request.text():'';if(text.length>950000)fail('Solicitud demasiado grande.',413);const body=text?JSON.parse(text):{};
  for(let attempt=0;attempt<8;attempt++){
   const row=await env.DB.prepare('SELECT * FROM rooms WHERE id=?').bind(key).first();if(!row||row.expires<now)fail('La sala ha caducado.',410);const state=JSON.parse(row.state),session=state.sessions.find(s=>equal(s.tokenHash,sessionHash));if(!session)fail('Acceso no autorizado.',401);
   if(request.method==='GET'&&!action)return reply(publicRoom(row,state,session));if(request.method!=='POST'||!action)fail('Método no permitido.',405);
   if(!['submit','leave'].includes(action)&&!session.host)fail('Sólo puede hacerlo el organizador.',403);
   if(action==='close'){const deleted=await env.DB.prepare('DELETE FROM rooms WHERE id=? AND version=?').bind(key,row.version).run();if(deleted.meta.changes)return reply({closed:true});continue;}
   if(action==='submit'){
    if(state.status!=='waiting')fail('La inscripción está cerrada.',409);const t=sanitizeTank(body.tank);if(state.config.engine==='jvm'?!['java','blocks'].includes(t.language):t.language==='java')fail('El tanque no es compatible con el motor de la sala.');
    const slot=session.host&&body.automatic?token():session.id;const index=state.participants.findIndex(p=>p.id===slot);if(index<0&&state.participants.length>=8)fail('Máximo ocho tanques.',409);
    if(body.automatic&&!session.host)fail('Sólo el organizador añade competidores automáticos.',403);const participant={id:slot,tank:t,ready:true};if(index<0)state.participants.push(participant);else state.participants[index]=participant;
   }else if(action==='leave'){if(state.status==='waiting')state.participants=state.participants.filter(p=>p.id!==session.id);if(session.host)fail('El organizador debe cerrar la sala.');state.sessions=state.sessions.filter(s=>s.id!==session.id);
   }else if(action==='remove'){if(state.status!=='waiting')fail('La inscripción está cerrada.',409);state.participants=state.participants.filter(p=>p.id!==body.id);
   }else if(action==='config'){if(state.status!=='waiting')fail('La partida ya ha empezado.',409);const c=config(body.config);if(state.participants.some(p=>c.engine==='jvm'?!['java','blocks'].includes(p.tank.language):p.tank.language==='java'))fail('Retira los tanques incompatibles antes de cambiar el motor.');state.config=c;
   }else if(action==='start'){if(state.status!=='waiting'||state.participants.length<2)fail('Se necesitan al menos dos tanques y una sala en espera.',409);state.status='running';state.frame=null;state.result=null;
   }else if(action==='frame'){if(state.status!=='running')fail('No hay partida en marcha.',409);const f=body.frame;if(!f||!Number.isInteger(f.tick)||!Array.isArray(f.robots)||f.robots.length>8||!Array.isArray(f.bullets)||f.bullets.length>1000||JSON.stringify(f).length>150000)fail('Fotograma no válido.');state.frame=f;
   }else if(action==='result'){if(state.status!=='running')fail('No hay partida en marcha.',409);if(!body.result||!Array.isArray(body.result.scores)||body.result.scores.length>8)fail('Resultado no válido.');state.result=body.result;state.status=body.result.cancelled?'cancelled':'finished';
   }else if(action==='reset'){if(state.status==='running')fail('Detén la batalla antes de reabrir la sala.',409);state.status='waiting';state.frame=null;state.result=null;
   }
   const saved=await env.DB.prepare('UPDATE rooms SET state=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(state),key,row.version).run();if(saved.meta.changes)return reply(publicRoom({...row,version:row.version+1},state,session));
  }fail('La sala está ocupada. Vuelve a intentarlo.',409);
 }catch(e){return reply({error:e.status?e.message:'El servicio no pudo completar la solicitud.'},e.status||500);}
}};
