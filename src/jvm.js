// SPDX-License-Identifier: MIT
const status=document.querySelector('#status');let bridge,cp,initPromise;
const emit=data=>parent.postMessage({channel:'otea-jvm',...data},location.origin);
async function init(){if(initPromise)return initPromise;initPromise=(async()=>{
 status.textContent='Cargando JVM Java 17 en el navegador…';emit({type:'status',message:status.textContent});
 if(typeof cheerpjInit!=='function')throw Error('No se ha podido cargar CheerpJ desde su CDN. Comprueba la conexión.');
 await cheerpjInit({version:17,status:'none',javaProperties:['java.awt.headless=true','robocode.security.off=true'],natives:{async Java_otea_ArenaBridge_emit(lib,json){let frame=JSON.parse(json);emit(frame);if(frame.type==='frame')await new Promise(r=>setTimeout(r,4));}}});
 cheerpjCreateDisplay(800,800,document.querySelector('#java-display'));
 const jars=await fetch('runtime/jars.json').then(r=>{if(!r.ok)throw Error('Faltan los archivos JVM.');return r.json();});
 const base='/app'+location.pathname.slice(0,location.pathname.lastIndexOf('/')+1)+'runtime/';cp=[base+'arena-bridge.jar',...jars.map(n=>base+n)].join(':');
 const lib=await cheerpjRunLibrary(cp);const System=await lib.java.lang.System;await System.setProperty('otea.symbols',base+'jdk17-symbols.jar');bridge=await lib.otea.ArenaBridge;await bridge.boot(base+'robocode-home.zip','/files/otea-robocode',true);status.textContent='JVM y motor Robocode 1.11.1 listos.';emit({type:'ready'});return bridge;
 })();return initPromise;}
window.addEventListener('message',async({data,source,origin})=>{if(source!==parent||origin!==location.origin||data.channel!=='otea-jvm')return;try{if(data.type==='init'){await init();return;}await init();if(data.type==='compile'){const results=[];for(const item of data.sources)results.push({id:item.id,result:await bridge.compile(item.code,cp)});emit({type:'compiled',request:data.request,results});}else if(data.type==='battle'){await bridge.battle(data.names,data.rounds||1,800,800,data.maxTicks||3000,data.cooling||.1,data.inactivity||450);emit({type:'ended'});}else if(data.type==='abort'){await bridge.abort();}}catch(e){status.textContent=String(e.message||e);emit({type:'error',request:data.request,message:status.textContent});}});
