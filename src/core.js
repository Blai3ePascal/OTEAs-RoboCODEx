// SPDX-License-Identifier: MIT
export const COLORS=['#ffb347','#80f5d0','#b69bff','#fb799a','#9ddbff','#f3ee83','#fe986c','#ffffff'];
export const COMMANDS={scan:{label:'Escanear ahora',unit:'',value:0,color:'green'},ahead:{label:'Avanzar',unit:'px',value:100,color:'blue'},back:{label:'Retroceder',unit:'px',value:50,color:'blue'},turnRight:{label:'Girar cuerpo ↻',unit:'°',value:90,color:'blue'},turnLeft:{label:'Girar cuerpo ↺',unit:'°',value:90,color:'blue'},turnGunRight:{label:'Girar cañón ↻',unit:'°',value:90,color:'pink'},turnGunLeft:{label:'Girar cañón ↺',unit:'°',value:90,color:'pink'},turnRadarRight:{label:'Girar radar ↻',unit:'°',value:360,color:'green'},turnRadarLeft:{label:'Girar radar ↺',unit:'°',value:360,color:'green'},fire:{label:'Disparar',unit:'energía',value:2,color:'pink'},wait:{label:'Esperar',unit:'turnos',value:10,color:'gold'},repeat:{label:'Repetir',unit:'veces',value:4,color:'gold'},forever:{label:'Para siempre',value:0,color:'gold'},ifEnergy:{label:'Si energía >',unit:'puntos',value:30,color:'gold'}};
// Event keys retain the original run/scan/wall/hit project format.
export const EVENTS={run:{label:'empieza la partida',method:'run',javaType:null,priority:0},scan:{label:'detecta otro tanque',method:'onScannedRobot',javaType:'ScannedRobotEvent',priority:10},robot:{label:'golpea otro tanque',method:'onHitRobot',javaType:'HitRobotEvent',priority:20},wall:{label:'golpea una pared u obstáculo',method:'onHitWall',javaType:'HitWallEvent',priority:30},hit:{label:'recibe un disparo',method:'onHitByBullet',javaType:'HitByBulletEvent',priority:40},bulletHit:{label:'su bala golpea un tanque',method:'onBulletHit',javaType:'BulletHitEvent',priority:50},bulletHitBullet:{label:'su bala choca con otra bala',method:'onBulletHitBullet',javaType:'BulletHitBulletEvent',priority:55},bulletMissed:{label:'su bala alcanza una pared',method:'onBulletMissed',javaType:'BulletMissedEvent',priority:60}};
export const EVENT_KEYS=Object.keys(EVENTS);
export const emptyBlocks=()=>Object.fromEntries(EVENT_KEYS.map(k=>[k,[]]));
export function freshMetrics(){return {distance:0,backDistance:0,bodyTurn:0,gunTurn:0,radarTurn:0,shots:0,hits:0,damage:0,scans:0,wallHits:0,robotHits:0,receivedHits:0,misses:0,bulletClashes:0,interruptions:0,conditionsTrue:0,conditionsFalse:0,eventsSeen:{},eventsHandled:{},eventsCompleted:{}};}
export function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=Math.imul(s^s>>>15,1|s);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
export function dateSeed(date=new Date()){return Number(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(date).replaceAll('-',''));}
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const angle=v=>((v%360)+360)%360;
export const relative=v=>((v+540)%360)-180;
export const starterBlocks=()=>({run:[{type:'forever',value:0,children:[{type:'ahead',value:100},{type:'turnRight',value:90},{type:'turnGunRight',value:360}]}],scan:[{type:'fire',value:2}],wall:[{type:'back',value:40},{type:'turnRight',value:90}],hit:[]});
export function className(n){let s=String(n).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_]/g,'');return /^[A-Za-z_]/.test(s)?s:'Tank'+(s||'OTEA');}
export function blocksJava(blocks,name='Nova',color='#ffb347'){
 const rgb=/^#[a-f0-9]{6}$/i.test(color)?color.slice(1):'ffb347';
 const render=(list,depth)=>list.map(b=>{const i='  '.repeat(depth);if(b.type==='forever')return i+'while (true) {\n'+render(b.children||[],depth+1)+'\n'+i+'}';if(b.type==='repeat')return i+`for (int i${depth} = 0; i${depth} < ${Math.floor(b.value)}; i${depth}++) {\n`+render(b.children||[],depth+1)+'\n'+i+'}';if(b.type==='ifEnergy')return i+`if (getEnergy() > ${b.value}) {\n`+render(b.children||[],depth+1)+'\n'+i+'}';if(b.type==='wait')return i+`for (int t${depth} = 0; t${depth} < ${Math.floor(b.value)}; t${depth}++) doNothing();`;if(b.type==='scan')return i+'scan();';return i+`${b.type}(${Number(b.value)});`;}).join('\n');
 return `package otea.robots;\nimport robocode.*;\nimport java.awt.Color;\n\npublic class ${className(name)} extends Robot {\n  public void run() {\n    setColors(new Color(0x${rgb}), Color.DARK_GRAY, Color.CYAN);\n${render(blocks.run,2)}\n  }\n`+Object.entries(EVENTS).filter(([k,e])=>k!=='run'&&blocks[k]?.length).map(([k,e])=>`  public void ${e.method}(${e.javaType} e) {\n${render(blocks[k],2)}\n  }\n`).join('')+'}\n';
}
export function validateBlocks(blocks){let count=0;const walk=(list,depth)=>{if(!Array.isArray(list)||depth>10)throw Error('Máximo 10 niveles de bloques.');for(const b of list){if(++count>400)throw Error('Máximo 400 bloques.');if(!COMMANDS[b.type])throw Error('Bloque desconocido: '+b.type);if(!Number.isFinite(Number(b.value))||Math.abs(Number(b.value))>100000)throw Error('Valor de bloque inválido.');if(b.type==='fire'&&(b.value<0.1||b.value>3))throw Error('La potencia del disparo debe estar entre 0,1 y 3.');if(b.type==='repeat'&&(b.value<1||b.value>1000))throw Error('Repite entre 1 y 1000 veces.');if(['forever','repeat','ifEnergy'].includes(b.type)){if(!b.children?.length)throw Error('Añade una acción dentro del bloque '+COMMANDS[b.type].label);walk(b.children,depth+1);}}};for(const k of EVENT_KEYS)walk(blocks[k]||[],0);if(!blocks.run.length)throw Error('Añade al menos una acción al iniciar.');return count;}
export function* blockProgram(list,robot,budget={n:0}){for(const b of list){if(++budget.n>20000)throw Error('Demasiadas operaciones sin avanzar un turno.');if(b.type==='forever'||b.type==='repeat'){let n=b.type==='forever'?Infinity:b.value;while(n-->0){yield* blockProgram(b.children,robot,budget);}}else if(b.type==='ifEnergy'){if(robot.energy>b.value){robot.metrics&&(robot.metrics.conditionsTrue++);yield* blockProgram(b.children,robot,budget);}else robot.metrics&&(robot.metrics.conditionsFalse++);}else{budget.n=0;yield {type:b.type,value:Number(b.value)};}}}
export const MAP_PRESETS=[
 ['classic','01 · Campo libre',[]],
 ['cross','02 · Cruce',[[180,180,90,90],[530,180,90,90],[180,530,90,90],[530,530,90,90],[355,355,90,90]]],
 ['lanes','03 · Pasillos',[[230,180,45,440],[520,180,45,440]]],
 ['bunker','04 · Búnker abierto',[[330,250,140,70],[330,480,140,70]]],
 ['islands','05 · Islas',[[160,170,120,90],[470,500,140,100],[450,170,80,80]]],
 ['slalom','06 · Eslalon',[[210,150,60,180],[530,390,60,180],[360,400,60,80]]],
 ['stairs','07 · Escalera',[[160,180,100,60],[300,310,100,60],[440,440,100,60],[580,570,60,60]]],
 ['columns','08 · Columnas',[[180,220,50,330],[375,220,50,330],[570,220,50,330]]],
 ['zigzag','09 · Zigzag',[[170,180,190,50],[440,350,190,50],[170,520,190,50]]],
 ['corners','10 · Esquinas abiertas',[[160,160,180,50],[160,210,50,110],[480,580,180,50],[610,480,50,100]]],
 ['twin','11 · Dos fortalezas',[[170,300,140,180],[490,300,140,180]]],
 ['crates','12 · Almacén',[[180,180,70,70],[360,180,70,70],[540,180,70,70],[180,360,70,70],[360,360,70,70],[540,360,70,70],[180,540,70,70],[360,540,70,70],[540,540,70,70]]],
 ['t','13 · Cruce en T',[[270,260,260,50],[375,310,50,230]]],
 ['l','14 · Muelle en L',[[230,220,60,320],[290,220,250,60]]],
 ['h','15 · Puente en H',[[220,220,50,360],[530,220,50,360],[270,375,260,50]]],
 ['diagonal','16 · Diagonal',[[160,160,70,70],[290,290,70,70],[420,420,70,70],[550,550,70,70]]],
 ['runway','17 · Pista',[[200,220,400,50],[200,530,400,50]]],
 ['plaza','18 · Plaza',[[320,320,160,160],[140,170,70,70],[590,560,70,70]]],
 ['gates','19 · Compuertas',[[160,220,190,50],[450,220,190,50],[160,530,190,50],[450,530,190,50]]],
 ['scatter','20 · Carga dispersa',[[140,170,100,60],[320,130,60,100],[540,220,100,60],[200,420,60,100],[400,380,100,60],[520,570,100,60],[170,620,100,60]]]
].map(([id,name,boxes])=>({id,name,map:boxes.map(([x,y,w,h])=>({x,y,w,h}))}));
export function mapPreset(name){const preset=MAP_PRESETS.find(p=>p.id===name);if(!preset)throw Error('Escenario desconocido.');return preset.map.map(o=>({...o}));}
// Conservative connectivity certificate: 10px cells with 22px tank clearance.
// Every free cell must connect to the field perimeter; closed pockets are rejected.
export function mapConnected(map){const n=75,blocked=new Uint8Array(n*n);let total=0,start=-1;for(let j=0;j<n;j++)for(let i=0;i<n;i++){const x=30+i*10,y=30+j*10,k=j*n+i;blocked[k]=map.some(o=>inside(x,y,o,22))?1:0;if(!blocked[k]){total++;start=k;}}if(total<100)return false;const seen=new Uint8Array(n*n),q=[start];seen[start]=1;for(let p=0;p<q.length;p++){const k=q[p],x=k%n,y=Math.floor(k/n);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,v=b*n+a;if(a>=0&&a<n&&b>=0&&b<n&&!seen[v]&&!blocked[v]){seen[v]=1;q.push(v);}}}return q.length===total;}
export const TANK_PARTS={body:'Carrocería',tracks:'Orugas',tread:'Dibujo de las orugas',hull:'Cubierta',turret:'Torreta',barrel:'Cañón',muzzle:'Boca del cañón',radar:'Radar',trim:'Bordes'};
export function tankColors(t){return {body:t.color||'#ffb347',tracks:'#101b29',tread:'#6a7981',hull:'#263744',turret:'#17212e',barrel:t.color||'#ffb347',muzzle:'#faf2db',radar:'#80f5d0',trim:t.color||'#ffb347',...t.colors};}
export function validateTank(t){if(!t||typeof t.name!=='string'||!t.name.trim()||t.name.length>40||typeof t.code!=='string'||t.code.length>100000||!['blocks','java','javascript','python'].includes(t.language))throw Error('Tanque no válido.');if(t.creator!==undefined&&(typeof t.creator!=='string'||t.creator.length>60))throw Error('Autor no válido.');if(t.color!==undefined&&!/^#[a-f0-9]{6}$/i.test(t.color))throw Error('Color no válido.');if(t.colors!==undefined){if(!t.colors||typeof t.colors!=='object')throw Error('Colores no válidos.');for(const [k,v] of Object.entries(t.colors))if(!TANK_PARTS[k]||typeof v!=='string'||!/^#[a-f0-9]{6}$/i.test(v))throw Error('Color de pieza no válido.');}validateDraftBlocks(t.blocks);return t;}
export function validateMap(map){if(!Array.isArray(map)||map.length>40)throw Error('Máximo 40 obstáculos.');return map.map(o=>{for(const k of ['x','y','w','h'])if(!Number.isFinite(o[k]))throw Error('Coordenadas de mapa inválidas.');if(o.w<20||o.h<20||o.x<40||o.y<40||o.x+o.w>760||o.y+o.h>760)throw Error('Los obstáculos deben quedar dentro del área central de 800 × 800.');return {x:o.x,y:o.y,w:o.w,h:o.h};});}
const inside=(x,y,o,pad=0)=>x>=o.x-pad&&x<=o.x+o.w+pad&&y>=o.y-pad&&y<=o.y+o.h+pad;
export class Battle {
 constructor(tanks,{seed=1,map=[],maxTicks=2400,cooling=.1,practice=false,positions}={}){
  if(tanks.length<1||tanks.length>8)throw Error('Entre 1 y 8 tanques.');this.random=rng(seed);this.seed=seed;this.map=validateMap(map);if(!mapConnected(this.map))throw Error("El mapa contiene una zona cerrada: abre un paso de al menos 60 píxeles.");this.maxTicks=clamp(maxTicks,50,20000);this.cooling=clamp(cooling,.01,1);this.practice=practice;this.tick=0;this.bullets=[];this.effects=[];this.done=false;this.robots=[];this.effectSerial=0;this.bulletSerial=0;
  for(const [id,t] of tanks.entries()){let x,y,ok=false;for(let n=0;n<500;n++){x=40+this.random()*720;y=40+this.random()*720;if(!this.map.some(o=>inside(x,y,o,24))&&!this.robots.some(r=>Math.hypot(r.x-x,r.y-y)<80)){ok=true;break;}}if(positions?.[id]){({x,y}=positions[id]);if(!Number.isFinite(x)||!Number.isFinite(y)||x<40||x>760||y<40||y>760||this.map.some(o=>inside(x,y,o,24))||this.robots.some(r=>Math.hypot(r.x-x,r.y-y)<80))throw Error('Posiciones de entrenamiento inválidas.');ok=true;}if(!ok)throw Error('El mapa no deja espacio para los tanques.');const r={id,modelId:t.id,name:t.name,creator:t.creator||'',colors:tankColors(t),color:t.color||COLORS[id],skin:t.skin||'vanguard',x,y,heading:this.random()*360,gun:0,radar:0,energy:100,heat:0,alive:true,velocity:0,pending:null,stacks:[],suspended:[],priority:0,eventType:'run',externalToken:0,completedRequests:[],trace:[],events:[],external:!!t.external,blocks:t.blocks||starterBlocks(),metrics:freshMetrics(),trail:[],score:0};if(positions?.[id])r.heading=angle(positions[id].heading||0);r.gun=r.radar=r.heading;r.stacks=[blockProgram(r.blocks.run,r)];this.robots.push(r);}
 }
 trace(r,entry){r.trace.push({tick:this.tick,...entry});if(r.trace.length>100)r.trace.shift();}
 effect(kind,r,extra={}){this.effects.push({id:++this.effectSerial,x:r.x,y:r.y,color:r.color,life:kind==='death'?100:kind==='fire'?14:30,kind,...extra});}
 kill(r,cause='energy'){if(!r.alive)return;r.alive=false;this.effect('death',r,{cause});}
 queue(id,command){const r=this.robots[id];if(!r?.alive||this.done)return false;if(r.pending)throw Error('El tanque ya tiene una orden activa.');if(r.external&&command.token!==undefined&&command.token!==r.externalToken)throw Error('Orden de un evento suspendido.');r.pending={...command,remaining:command.value??0,event:r.eventType};return true;}
 beginExternalEvent(id,token,type){const r=this.robots[id],priority=EVENTS[type]?.priority;if(!r?.alive||!r.external||!priority||priority<=r.priority)throw Error('Interrupción inválida.');r.suspended.push({pending:r.pending,priority:r.priority,eventType:r.eventType,token:r.externalToken});if(r.pending)r.metrics.interruptions++;r.pending=null;r.priority=priority;r.eventType=type;r.externalToken=token;r.metrics.eventsHandled[type]=(r.metrics.eventsHandled[type]||0)+1;this.trace(r,{type:'event',event:type});}
 endExternalEvent(id,token){const r=this.robots[id];if(!r?.external||r.externalToken!==token||r.pending)throw Error('El evento no ha terminado.');r.metrics.eventsCompleted[r.eventType]=(r.metrics.eventsCompleted[r.eventType]||0)+1;const saved=r.suspended.pop();if(saved){r.pending=saved.pending;r.priority=saved.priority;r.eventType=saved.eventType;r.externalToken=saved.token;}}
 schedule(r){
  // Re-check queued events whenever a completed handler restores a lower priority.
  // Otherwise its suspended movement gets one unwanted turn before the next scan.
  for(let guard=0;guard<40;guard++){
   const e=r.events.filter(e=>EVENTS[e.type]?.priority>r.priority).sort((a,b)=>EVENTS[b.type].priority-EVENTS[a.type].priority)[0];
   if(e){r.events.splice(r.events.indexOf(e),1);if(!r.blocks[e.type]?.length)continue;r.suspended.push({pending:r.pending,priority:r.priority,eventType:r.eventType});if(r.pending)r.metrics.interruptions++;r.pending=null;r.priority=EVENTS[e.type].priority;r.eventType=e.type;r.stacks.push(blockProgram(r.blocks[e.type],r));r.metrics.eventsHandled[e.type]=(r.metrics.eventsHandled[e.type]||0)+1;this.trace(r,{type:'event',event:e.type});}
   if(r.pending||!r.stacks.length)return;
   const v=r.stacks.at(-1).next();if(!v.done){r.pending={...v.value,remaining:v.value.value,event:r.eventType};return;}
   r.stacks.pop();const saved=r.suspended.pop();if(saved){r.metrics.eventsCompleted[r.eventType]=(r.metrics.eventsCompleted[r.eventType]||0)+1;r.pending=saved.pending;r.priority=saved.priority;r.eventType=saved.eventType;}
  }
 }
 fire(r,c){const power=clamp(c.value,.1,3);if(r.heat<=.000001&&r.energy>power){r.energy-=power;r.heat=1+power/5;r.metrics.shots++;this.bullets.push({id:++this.bulletSerial,x:r.x,y:r.y,heading:r.gun,power,owner:r.id});this.effect('fire',r,{heading:r.gun});}c.remaining=0;}
 complete(r,c){this.trace(r,{type:'command',command:c.type,event:c.event||r.eventType,value:c.value,radarTurn:r.metrics.radarTurn});if(c.request!==undefined)r.completedRequests.push(c.request);r.pending=null;r.lastCommand=c.type;}
 dispatchEvents(r){
  if(!r.alive||r.external||!r.events.some(e=>EVENTS[e.type]?.priority>r.priority&&r.blocks[e.type]?.length))return;
  try{this.schedule(r);const c=r.pending;
   // Instant fire can answer in this detection turn. Movement/turn/wait commands
   // start next turn: never advance physical time twice or re-enter equal priority.
   if(c?.type==='fire'){this.fire(r,c);this.complete(r,c);}
  }catch(e){r.error=e.message;this.kill(r,'error');}
 }
 scan(r,old){for(const target of this.robots){if(target===r||!target.alive)continue;const a=angle(Math.atan2(target.x-r.x,target.y-r.y)*180/Math.PI);const delta=relative(a-old),sweep=relative(r.radar-old);if(Math.abs(relative(a-r.radar))<4||(sweep>=0?delta>=0&&delta<=sweep:delta<=0&&delta>=sweep)){r.metrics.scans++;this.event(r,'scan',{bearing:relative(a-r.heading),distance:Math.hypot(target.x-r.x,target.y-r.y),energy:target.energy,name:target.name});}}}
 event(r,type,data={}){if(!EVENTS[type])return;r.metrics.eventsSeen[type]=(r.metrics.eventsSeen[type]||0)+1;const old=r.events.find(e=>e.type===type);if(old)Object.assign(old,data,{tick:this.tick});else if(r.events.length<20)r.events.push({type,tick:this.tick,...data});}
 finish(){this.done=true;const alive=this.robots.filter(r=>r.alive);const scores=this.robots.map(r=>({id:r.id,name:r.name,creator:r.creator,score:Math.round(r.metrics.damage+r.energy+(r.alive?50:0)),damage:Math.round(r.metrics.damage),energy:Math.max(0,Math.round(r.energy)),alive:r.alive})).sort((a,b)=>b.score-a.score);let winner=alive.length===1&&!this.practice?alive[0].id:null;return this.result={type:'result',scores,winner,draw:winner===null,ticks:this.tick,seed:this.seed};}
 step(){if(this.done)return this.result;this.tick++;this.effects=this.effects.filter(e=>--e.life>0);
  for(const r of this.robots){if(!r.alive)continue;r.heat=Math.max(0,r.heat-this.cooling);r.velocity=0;
   if(!r.external){try{this.schedule(r);}catch(e){r.error=e.message;this.kill(r,'error');continue;}}
   const c=r.pending;if(!c)continue;const oldRadar=r.radar;
   if(c.type==='ahead'||c.type==='back'){const dir=c.type==='back'?-1:1;const d=Math.sign(c.remaining)*Math.min(8,Math.abs(c.remaining))*dir;const rad=r.heading*Math.PI/180,nx=r.x+Math.sin(rad)*d,ny=r.y+Math.cos(rad)*d;const wall=nx<18||nx>782||ny<18||ny>782||this.map.some(o=>inside(nx,ny,o,18));const other=this.robots.find(t=>t!==r&&t.alive&&Math.hypot(t.x-nx,t.y-ny)<36);
    if(wall||other){r.energy-=wall?Math.max(0,Math.abs(d)*.5-1):.6;c.remaining=0;if(wall){r.metrics.wallHits++;this.event(r,'wall',{bearing:0,obstacle:!!this.map.some(o=>inside(nx,ny,o,18))});}else{r.metrics.robotHits++;this.event(r,'robot',{name:other.name,bearing:relative(Math.atan2(other.x-r.x,other.y-r.y)*180/Math.PI-r.heading),energy:other.energy});other.energy-=.6;other.metrics.robotHits++;this.event(other,'robot',{name:r.name,energy:r.energy});if(other.energy<=0)this.kill(other,'collision');}}else{r.x=nx;r.y=ny;r.velocity=d;r.metrics.distance+=Math.abs(d);if(dir<0)r.metrics.backDistance+=Math.abs(d);c.remaining-=d*dir;if(this.tick%4===0){r.trail.push({x:r.x,y:r.y});if(r.trail.length>30)r.trail.shift();}}
   }else if(/^turn/.test(c.type)){const left=c.type.endsWith('Left'),part=c.type.includes('Gun')?'gun':c.type.includes('Radar')?'radar':'heading';let d=Math.sign(c.remaining)*Math.min(part==='heading'?10:part==='gun'?20:45,Math.abs(c.remaining));c.remaining-=d;d*=left?-1:1;r[part]=angle(r[part]+d);r.metrics[part==='heading'?'bodyTurn':part==='gun'?'gunTurn':'radarTurn']+=Math.abs(d);if(part==='heading'){r.gun=angle(r.gun+d);r.radar=angle(r.radar+d);}if(part==='gun')r.radar=angle(r.radar+d);
   }else if(c.type==='fire'){this.fire(r,c);
   }else if(c.type==='scan'){this.scan(r,oldRadar);c.remaining=0;}else if(c.type==='wait'){c.remaining--;}else{r.error='Orden no reconocida: '+c.type;c.remaining=0;}
   if(c.type==='ahead'||c.type==='back'||/^turn/.test(c.type))this.scan(r,oldRadar);if(Math.abs(c.remaining)<.0001)this.complete(r,c);if(r.energy<=0)this.kill(r,'collision');
  }
  for(const b of this.bullets){const speed=20-3*b.power,rad=b.heading*Math.PI/180;b.ox=b.x;b.oy=b.y;b.x+=Math.sin(rad)*speed;b.y+=Math.cos(rad)*speed;}
  // Swept relative trajectories detect opposing bullets even between turns.
  for(let i=0;i<this.bullets.length;i++)for(let j=i+1;j<this.bullets.length;j++){const a=this.bullets[i],b=this.bullets[j];if(a.dead||b.dead||a.owner===b.owner)continue;const x=a.ox-b.ox,y=a.oy-b.oy,dx=(a.x-a.ox)-(b.x-b.ox),dy=(a.y-a.oy)-(b.y-b.oy),t=clamp(-(x*dx+y*dy)/(dx*dx+dy*dy||1),0,1);if(Math.hypot(x+dx*t,y+dy*t)<=4){a.dead=b.dead=true;for(const p of [a,b]){const owner=this.robots[p.owner];owner.metrics.bulletClashes++;this.event(owner,'bulletHitBullet',{power:p.power});}this.effect('hit',{x:(a.x+b.x)/2,y:(a.y+b.y)/2,color:'#fff2c5'});}}
  for(const b of this.bullets){if(b.dead)continue;let hit=null;for(let k=1;k<=4&&!hit;k++){const x=b.ox+(b.x-b.ox)*k/4,y=b.oy+(b.y-b.oy)*k/4;hit=this.robots.find(r=>r.alive&&r.id!==b.owner&&Math.hypot(r.x-x,r.y-y)<=20);}const owner=this.robots[b.owner];if(hit){const d=4*b.power+2*Math.max(0,b.power-1);hit.energy-=d;owner.energy+=3*b.power;owner.metrics.damage+=d;owner.metrics.hits++;hit.metrics.receivedHits++;this.event(hit,'hit',{power:b.power,name:owner.name,bearing:relative(b.heading+180-hit.heading)});this.event(owner,'bulletHit',{name:hit.name,power:b.power,energy:hit.energy});b.dead=true;this.effect('hit',hit);if(hit.energy<=0)this.kill(hit,'bullet');}else if(b.x<0||b.x>800||b.y<0||b.y>800||this.map.some(o=>inside(b.x,b.y,o))){b.dead=true;owner.metrics.misses++;this.event(owner,'bulletMissed',{power:b.power});this.effect('hit',{x:clamp(b.x,0,800),y:clamp(b.y,0,800),color:owner.color});}}
  this.bullets=this.bullets.filter(b=>!b.dead);for(const r of this.robots)this.dispatchEvents(r);const alive=this.robots.filter(r=>r.alive);if(this.tick>=this.maxTicks||(!this.practice&&alive.length<=1)||alive.length===0)return this.finish();return null;
 }
 snapshot(){return {tick:this.tick,robots:this.robots,bullets:this.bullets,effects:this.effects,map:this.map};}
}
export function roundRobin(ids){const pairs=[];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)pairs.push([ids[i],ids[j]]);return pairs;}
export function swissPair(rows,history,byeHistory=new Set()){
 const pool=[...rows].sort((a,b)=>b.points-a.points||b.buchholz-a.buchholz||a.id-b.id);let bye=null;if(pool.length%2){let i=pool.findLastIndex(r=>!byeHistory.has(r.id));if(i<0)i=pool.length-1;bye=pool.splice(i,1)[0].id;}
 const key=(a,b)=>[a,b].sort((a,b)=>a-b).join(':');
 function search(p){if(!p.length)return[];for(let i=1;i<p.length;i++){if(history.has(key(p[0].id,p[i].id)))continue;const rest=p.filter((_,n)=>n!==0&&n!==i),next=search(rest);if(next)return[[p[0].id,p[i].id],...next];}return null;}
 const clean=search(pool),pairs=clean||pool.filter((_,i)=>i%2===0).map((r,i)=>[r.id,pool[2*i+1].id]);return {pairs,bye,rematches:!clean};
}
export function validateProject(p){if(!p||p.version!==1||!Array.isArray(p.tanks)||p.tanks.length<1||p.tanks.length>32)throw Error('Proyecto RoboCODEx no válido.');for(const t of p.tanks)validateTank(t);validateMap(p.map||[]);return p;}

export function validateDraftBlocks(blocks){let count=0;function walk(list,depth){if(!Array.isArray(list)||depth>10)throw Error('Estructura de bloques inválida.');for(const b of list){if(++count>400||!b||!COMMANDS[b.type]||!Number.isFinite(Number(b.value)))throw Error('Borrador de bloques inválido.');if(['forever','repeat','ifEnergy'].includes(b.type))walk(b.children||[],depth+1);}}if(!blocks)throw Error('Faltan los bloques.');for(const k of EVENT_KEYS)walk(blocks[k]||[],0);return count;}
