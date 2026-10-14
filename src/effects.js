// SPDX-License-Identifier: MIT
export const EFFECT_DEFAULTS={fireColor:'#ff9d32',blastColor:'#ff6038',sparkColor:'#fff2aa',smokeColor:'#87949e',effectStyle:'nova',fireStyle:'flame',effectSize:1,effectDuration:1,showFire:true,showExplosions:true,burning:true};
export function effectOptions(settings={}){const s={...EFFECT_DEFAULTS,...settings};for(const k of ['fireColor','blastColor','sparkColor','smokeColor'])if(!/^#[a-f0-9]{6}$/i.test(s[k]))s[k]=EFFECT_DEFAULTS[k];if(!['nova','rings','pixel'].includes(s.effectStyle))s.effectStyle='nova';if(!['flame','plasma','pixel'].includes(s.fireStyle))s.fireStyle='flame';s.effectSize=Math.max(.5,Math.min(2,Number(s.effectSize)||1));s.effectDuration=Math.max(.5,Math.min(2.5,Number(s.effectDuration)||1));return s;}
export class EffectTimeline {
 constructor(){this.reset();}
 reset(){this.seen=new Set();this.previous=new Map();this.particles=[];this.serial=0;this.round=null;this.lastTick=null;}
 add(kind,x,y,now,heading=0){this.particles.push({kind,x,y,start:now,heading,seed:++this.serial});if(this.particles.length>180)this.particles.shift();}
 ingest(state,now){if((this.round!==null&&state.round!==undefined&&state.round!==this.round)||(this.lastTick!==null&&Number.isFinite(state.tick)&&state.tick<this.lastTick))this.reset();this.round=state.round??this.round;this.lastTick=state.tick??this.lastTick;
  const cues=state.effects||[],has=(kind,r)=>cues.some(e=>e.kind===kind&&Math.hypot(e.x-r.x,e.y-r.y)<30);
  for(const e of cues){const key=(state.round||0)+':'+(e.id??[e.kind,e.x,e.y,state.tick-e.life].join(':'));if(this.seen.has(key))continue;this.seen.add(key);this.add(e.kind,e.x,e.y,now,e.heading||0);}
  for(const r of state.robots||[]){const id=r.modelId||r.fullName||r.id,old=this.previous.get(id);if(r.alive===false&&(!old||old.alive)&&!has('death',r))this.add('death',r.x,r.y,now);if(old){if(r.heat>old.heat+.5&&r.alive&&!has('fire',r))this.add('fire',r.x,r.y,now,r.gun);if(r.alive&&old.energy-r.energy>3&&!has('hit',r))this.add('hit',r.x,r.y,now);}this.previous.set(id,{alive:r.alive,heat:r.heat,energy:r.energy});}
  if(this.seen.size>2000)this.seen=new Set([...this.seen].slice(-1000));
 }
 active(now,settings){const s=effectOptions(settings);this.particles=this.particles.filter(e=>now-e.start<(e.kind==='death'&&s.burning?5200: e.kind==='death'?1700:e.kind==='fire'?350:650)*s.effectDuration);return this.particles;}
}
const wave=(seed,n)=>Math.sin(seed*7.31+n*12.7)*.5+.5;
export function paintEffects(c,timeline,now,settings){if(!settings.effects)return;const s=effectOptions(settings),motion=settings.reducedMotion? .35:1,density=settings.reducedMotion?6:settings.effects===2?32:16;
 for(const e of timeline.active(now,s)){const elapsed=(now-e.start)/s.effectDuration,t=elapsed/1700,size=s.effectSize*motion;c.save();c.translate(e.x,800-e.y);c.globalCompositeOperation='lighter';
  if(e.kind==='death'&&s.showExplosions&&elapsed<1700){const alpha=Math.max(0,1-t),radius=(8+105*Math.sqrt(t))*size;c.globalAlpha=alpha;
   if(s.effectStyle==='pixel'){for(let n=0;n<density;n++){const a=n*2.4,r=radius*wave(e.seed,n);c.fillStyle=n%3?s.blastColor:s.sparkColor;c.fillRect(Math.cos(a)*r,Math.sin(a)*r,Math.max(2,(12-8*t)*size),Math.max(2,(12-8*t)*size));}}
   else {if(s.effectStyle==='nova'){const g=c.createRadialGradient(0,0,0,0,0,radius);g.addColorStop(0,s.sparkColor);g.addColorStop(.25,s.blastColor);g.addColorStop(1,s.blastColor+'00');c.fillStyle=g;c.beginPath();c.arc(0,0,radius,0,Math.PI*2);c.fill();}for(let k=0;k<(s.effectStyle==='rings'?4:2);k++){c.strokeStyle=k%2?s.sparkColor:s.blastColor;c.lineWidth=(5-k)*size;c.beginPath();c.arc(0,0,Math.max(1,radius-k*13*size),0,Math.PI*2);c.stroke();}}
   for(let n=0;n<density;n++){const a=n*2.399+e.seed,d=(15+135*t)*size*(.3+wave(e.seed,n));c.strokeStyle=n%2?s.sparkColor:s.blastColor;c.lineWidth=2*size;c.beginPath();c.moveTo(Math.cos(a)*d,Math.sin(a)*d);c.lineTo(Math.cos(a)*(d+12*size),Math.sin(a)*(d+12*size));c.stroke();}
  }
  if(e.kind==='death'&&s.burning&&elapsed<5200){c.globalCompositeOperation='source-over';c.globalAlpha=Math.max(0,1-elapsed/5200)*.3;c.fillStyle=s.smokeColor;for(let n=0;n<5;n++){const phase=(elapsed/1000+n*.24)%1.6;c.beginPath();c.arc(Math.sin(e.seed+n+phase)*14*size,-phase*40*size,Math.max(1,(10+phase*14)*size),0,Math.PI*2);c.fill();}}
  if((e.kind==='fire'&&s.showFire&&elapsed<350)||(e.kind==='death'&&s.burning&&elapsed<4000)){const life=e.kind==='fire'?1-elapsed/350:Math.max(0,1-elapsed/4000),length=(e.kind==='fire'?25:34)*size;c.globalAlpha=life;c.globalCompositeOperation='lighter';if(e.kind==='fire'){const a=e.heading*Math.PI/180;c.translate(Math.sin(a)*32,-Math.cos(a)*32);c.rotate(a);}
   for(let n=0;n<5;n++){const flicker=.6+.4*Math.sin(now*.013+n+e.seed),x=(n-2)*4*size;c.fillStyle=n%2?s.sparkColor:s.fireColor;if(s.fireStyle==='pixel'){c.fillRect(x,-length*flicker,5*size,length*flicker);}else if(s.fireStyle==='plasma'){c.strokeStyle=s.fireColor;c.lineWidth=4*size;c.beginPath();c.arc(x,-10*size,Math.max(1,length*flicker*.6),0,Math.PI*2);c.stroke();}else{c.beginPath();c.moveTo(x-5*size,5*size);c.quadraticCurveTo(x-8*size,-length*.5,x,-length*flicker);c.quadraticCurveTo(x+8*size,-length*.4,x+5*size,5*size);c.fill();}}
  }
  if(e.kind==='hit'&&elapsed<650){c.globalAlpha=1-elapsed/650;c.strokeStyle=s.sparkColor;c.lineWidth=2;c.beginPath();c.arc(0,0,(4+elapsed*.055)*size,0,Math.PI*2);c.stroke();}c.restore();
 }
}

// Leave the blast visible before a result overlay or the next tournament encounter.
export function destructionDelay(timeline,now,settings){const s=effectOptions(settings);if(!settings.effects||settings.reducedMotion||(!s.showExplosions&&!s.burning))return 0;const latest=timeline.particles.filter(p=>p.kind==='death').at(-1);if(!latest)return 0;return Math.max(0,Math.min(4500,(s.showExplosions?1800:1200)*s.effectDuration-(now-latest.start)));}
