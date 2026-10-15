// SPDX-License-Identifier: MIT
// The same controls/telemetry nodes are used in both views; event handlers,
// spectator permissions and the running engine stay attached and untouched.
export function setupBattleView(doc,win){
 const root=doc.querySelector('#battle-view'),button=doc.querySelector('#battle-fullscreen'),toggle=doc.querySelector('#battle-sidebar-toggle'),dock=doc.querySelector('#battle-dock');
 const moves=[],originals=[['#start-battle','#dock-controls'],['.arena-config .small-actions','#dock-controls'],['#speed','#dock-controls'],['#battle-roster','#dock-roster'],['#telemetry','#dock-telemetry']];
 let expanded=false,collapsed=false,previousFocus=null,scrollY=0,nativeAttempt=0;
 function fit(){if(!expanded)return;const viewport=root.querySelector('.battle-viewport'),stage=root.querySelector('.battle-stage'),header=stage.querySelector('.stage-head');root.style.setProperty('--battle-size',Math.max(1,Math.floor(Math.min(viewport.clientWidth-2,viewport.clientHeight-header.offsetHeight-2)))+'px');}
 const observer=typeof win.ResizeObserver==='function'?new win.ResizeObserver(fit):null;observer?.observe(root.querySelector('.battle-viewport'));win.addEventListener('resize',fit);
 function sidebar(){dock.hidden=collapsed;root.classList.toggle('sidebar-hidden',collapsed);toggle.textContent=collapsed?'Mostrar panel':'Ocultar panel';toggle.setAttribute('aria-expanded',String(!collapsed));fit();}
 function restore(){if(!expanded)return;expanded=false;nativeAttempt++;for(const {node,marker} of moves.splice(0)){marker.replaceWith(node);}root.classList.remove('battle-expanded','sidebar-hidden');doc.body.classList.remove('battle-focused');root.style.removeProperty('--battle-size');dock.hidden=true;toggle.hidden=true;button.textContent='⛶ Pantalla completa';button.setAttribute('aria-pressed','false');win.scrollTo({top:scrollY,behavior:'instant'});(previousFocus?.isConnected?previousFocus:button).focus({preventScroll:true});}
 async function close(){if(doc.fullscreenElement===root){try{await doc.exitFullscreen();}catch{}}restore();}
 async function open(){if(expanded)return;expanded=true;previousFocus=doc.activeElement;scrollY=win.scrollY;for(const [selector,target] of originals){let node=doc.querySelector(selector);if(selector==='#speed')node=node.closest('label');const marker=doc.createComment('battle view return');node.before(marker);moves.push({node,marker});root.querySelector(target).append(node);}root.classList.add('battle-expanded');doc.body.classList.add('battle-focused');toggle.hidden=false;button.textContent='↙ Salir';button.setAttribute('aria-pressed','true');sidebar();button.focus({preventScroll:true});fit();const attempt=++nativeAttempt;
  // Embedded/school browsers can disallow the Fullscreen API. The fitted window
  // view remains fully usable, with the same Exit and Escape controls.
  try{await root.requestFullscreen?.({navigationUI:'hide'});if(attempt!==nativeAttempt&&doc.fullscreenElement===root)await doc.exitFullscreen();}catch{}
 }
 button.addEventListener('click',()=>expanded?close():open());toggle.addEventListener('click',()=>{collapsed=!collapsed;sidebar();});doc.addEventListener('fullscreenchange',()=>{if(expanded&&doc.fullscreenElement!==root)restore();else fit();});doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded){event.preventDefault();void close();}});
 return {open,close,get expanded(){return expanded;}};
}
