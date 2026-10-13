// SPDX-License-Identifier: MIT
let pending=new Map(), serial=0, state={}, events=[],handlers={};
function rpc(type,value){const id=++serial;return new Promise((resolve,reject)=>{pending.set(id,{resolve,reject});postMessage({type:'command',id,command:{type,value}});});}
async function command(type,value){if(!Number.isFinite(value)||Math.abs(value)>100000)throw Error('Valor de orden inválido.');const e=events.splice(0);for(const event of e)if(handlers[event.type])await handlers[event.type](event);return rpc(type,value);}
const robot={};for(const type of ['ahead','back','turnRight','turnLeft','turnGunRight','turnGunLeft','turnRadarRight','turnRadarLeft','fire','wait'])robot[type]=(v=1)=>command(type,Number(v));
for(const [method,prop] of Object.entries({getEnergy:'energy',getX:'x',getY:'y',getHeading:'heading',getGunHeading:'gun',getRadarHeading:'radar',getGunHeat:'heat',getTime:'tick'}))robot[method]=()=>state[prop]||0;
robot.onScannedRobot=fn=>handlers.scan=fn;robot.onHitWall=fn=>handlers.wall=fn;robot.onHitByBullet=fn=>handlers.hit=fn;
onmessage=async({data})=>{if(data.type==='ack'){state=data.state||state;events.push(...(data.events||[]));const p=pending.get(data.id);if(p){pending.delete(data.id);data.error?p.reject(Error(data.error)):p.resolve(data.state);}return;}if(data.type!=='start')return;state=data.state||{};try{
 if(data.language==='javascript'){
  const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
  const run=await new AsyncFunction(data.code+'\nreturn typeof run === "function" ? run : null;')();if(!run)throw Error('Define async function run(robot).');postMessage({type:'ready'});await run(robot);
 }else if(data.language==='python'){
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
  self.otea_command=command;self.otea_get=k=>state[k]||0;
  py.runPython(`import js\nclass Robot:\n    async def ahead(self, n): await js.otea_command('ahead', float(n))\n    async def back(self, n): await js.otea_command('back', float(n))\n    async def turnRight(self, n): await js.otea_command('turnRight', float(n))\n    async def turnLeft(self, n): await js.otea_command('turnLeft', float(n))\n    async def turnGunRight(self, n): await js.otea_command('turnGunRight', float(n))\n    async def turnGunLeft(self, n): await js.otea_command('turnGunLeft', float(n))\n    async def turnRadarRight(self, n): await js.otea_command('turnRadarRight', float(n))\n    async def turnRadarLeft(self, n): await js.otea_command('turnRadarLeft', float(n))\n    async def fire(self, n): await js.otea_command('fire', float(n))\n    async def wait(self, n=1): await js.otea_command('wait', float(n))\n    def getEnergy(self): return float(js.otea_get('energy'))\n    def getX(self): return float(js.otea_get('x'))\n    def getY(self): return float(js.otea_get('y'))\n    def getHeading(self): return float(js.otea_get('heading'))\n    def getGunHeading(self): return float(js.otea_get('gun'))\n    def getRadarHeading(self): return float(js.otea_get('radar'))\n    def getTime(self): return int(js.otea_get('tick'))\nrobot = Robot()`);
  py.runPython(data.code);for(const [key,fn] of Object.entries({scan:'onScannedRobot',wall:'onHitWall',hit:'onHitByBullet'})){const cb=py.globals.get(fn);if(cb)handlers[key]=async e=>{self.otea_event=e;await py.runPythonAsync(`await ${fn}(js.otea_event)`);};}
  postMessage({type:'ready'});await py.runPythonAsync('await run(robot)');
 }else throw Error('Lenguaje no reconocido.');postMessage({type:'finished'});
 }catch(e){postMessage({type:'error',message:String(e.message||e)});}};
