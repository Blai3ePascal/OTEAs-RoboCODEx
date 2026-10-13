// SPDX-License-Identifier: MIT
export const ROOM_SERVICE='https://otea-robocodex-salas.jammy-mochi-4804.chatgpt.site';
const KEY='otea-room-session-v1';
export class RoomClient {
 constructor(onState,onError){this.onState=onState;this.onError=onError;this.session=null;this.timer=null;this.frameBusy=false;this.version=0;try{const v=JSON.parse(sessionStorage.getItem(KEY));if(v&&/^[a-f0-9]{64}$/.test(v.room)&&/^[a-f0-9]{64}$/.test(v.token))this.session=v;}catch{}}
 async request(path,body,authenticated=true){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);try{const response=await fetch(ROOM_SERVICE+path,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(authenticated&&this.session?{Authorization:'Bearer '+this.session.token}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal,credentials:'omit',cache:'no-store'});const data=await response.json();if(!response.ok)throw Object.assign(Error(data.error||'El servicio de salas no respondió.'),{status:response.status});return data;}catch(e){if(e.name==='AbortError')throw Error('La sala no ha respondido a tiempo. Comprueba la conexión.');throw e;}finally{clearTimeout(timer);}}
 async enter(action,name,password,config){const data=await this.request('/rooms',{action,name,password,config},false);this.session={room:data.room,token:data.token};try{sessionStorage.setItem(KEY,JSON.stringify(this.session));}catch{}this.version=0;this.accept(data);this.poll();return data;}
 accept(data){if(data.version<this.version)return;this.version=data.version;this.onState(data);}
 async refresh(){if(!this.session)return;const data=await this.request('/rooms/'+this.session.room);this.accept(data);return data;}
 poll(){clearTimeout(this.timer);this.timer=setTimeout(async()=>{try{await this.refresh();}catch(e){this.onError(e);if([401,410].includes(e.status)){this.forget();return;}}if(this.session)this.poll();},1500);}
 async action(action,body={}){if(!this.session)throw Error('Crea una sala o únete primero.');const data=await this.request('/rooms/'+this.session.room+'/'+action,body);if(!['close','leave'].includes(action))this.accept(data);return data;}
 async pushFrame(frame){if(this.frameBusy||!this.session)return;this.frameBusy=true;try{await this.request('/rooms/'+this.session.room+'/frame',{frame});}catch(e){if(e.status!==409)this.onError(e);}finally{this.frameBusy=false;}}
 forget(){clearTimeout(this.timer);this.session=null;try{sessionStorage.removeItem(KEY);}catch{}}
}
