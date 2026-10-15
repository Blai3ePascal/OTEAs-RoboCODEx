// SPDX-License-Identifier: MIT
import test from 'node:test';import assert from 'node:assert/strict';import {setupBattleView} from '../src/battle-view.js';
// Minimal DOM adapter to verify node identity/permissions and native/fallback
// fullscreen lifecycle; real layout is checked in the deployed browser.
function fixture({native=false}={}){
 class Node{
  constructor(name){this.name=name;this.children=[];this.handlers={};this.attributes={};this.hidden=false;this.isConnected=true;this.classes=new Set();this.classList={add:(...a)=>a.forEach(x=>this.classes.add(x)),remove:(...a)=>a.forEach(x=>this.classes.delete(x)),toggle:(x,on)=>on?this.classes.add(x):this.classes.delete(x)};this.style={setProperty:(k,v)=>this.attributes[k]=v,removeProperty:k=>delete this.attributes[k]};}
  append(n){if(n.parent)n.parent.children.splice(n.parent.children.indexOf(n),1);this.children.push(n);n.parent=this;}
  before(n){const p=this.parent;p.children.splice(p.children.indexOf(this),0,n);n.parent=p;}
  replaceWith(n){if(n.parent)n.parent.children.splice(n.parent.children.indexOf(n),1);const p=this.parent;p.children.splice(p.children.indexOf(this),1,n);n.parent=p;this.parent=null;}
  addEventListener(k,fn){this.handlers[k]=fn;}setAttribute(k,v){this.attributes[k]=v;}closest(){return label;}focus(){doc.activeElement=this;}querySelector(s){return nodes[s];}
 }
 const nodes=Object.fromEntries(['#battle-view','#battle-fullscreen','#battle-sidebar-toggle','#battle-dock','#start-battle','.arena-config .small-actions','#speed','#battle-roster','#telemetry','#dock-controls','#dock-roster','#dock-telemetry','.battle-viewport','.battle-stage','.stage-head'].map(x=>[x,new Node(x)])),normal=new Node('normal'),label=new Node('label'),body=new Node('body'),doc=new Node('document');
 for(const k of ['#start-battle','.arena-config .small-actions','#battle-roster','#telemetry'])normal.append(nodes[k]);normal.append(label);label.append(nodes['#speed']);nodes['#start-battle'].disabled=true;const originalOrder=[...normal.children];doc.querySelector=s=>nodes[s];doc.createComment=()=>new Node('marker');doc.body=body;doc.activeElement=nodes['#battle-fullscreen'];doc.exitFullscreen=async()=>{doc.fullscreenElement=null;doc.handlers.fullscreenchange();};nodes['#battle-view'].requestFullscreen=async()=>{if(!native)throw Error('Fullscreen denied');doc.fullscreenElement=nodes['#battle-view'];doc.handlers.fullscreenchange();};nodes['.battle-viewport'].clientWidth=1000;nodes['.battle-viewport'].clientHeight=700;nodes['.stage-head'].offsetHeight=36;
 let position;const win={scrollY:234,scrollTo:p=>position=p,addEventListener(){}};return {view:setupBattleView(doc,win),nodes,doc,normal,originalOrder,get position(){return position;}};
}
for(const native of [false,true])test('Fullscreen '+(native?'native':'fallback')+' preserves live controls, sidebar and exact return positions',async()=>{
 const f=fixture({native}),n=f.nodes;await f.view.open();assert.equal(f.view.expanded,true);assert.equal(n['#start-battle'].parent,n['#dock-controls']);assert.equal(n['#start-battle'].disabled,true);assert.equal(n['#battle-view'].attributes['--battle-size'],'662px');assert.equal(n['#battle-fullscreen'].attributes['aria-pressed'],'true');
 n['#battle-sidebar-toggle'].handlers.click();assert.equal(n['#battle-dock'].hidden,true);assert.equal(n['#battle-sidebar-toggle'].attributes['aria-expanded'],'false');n['#battle-sidebar-toggle'].handlers.click();assert.equal(n['#battle-dock'].hidden,false);
 await f.view.close();assert.equal(f.view.expanded,false);assert.deepEqual(f.normal.children,f.originalOrder);assert.equal(f.position.top,234);assert.equal(n['#battle-dock'].hidden,true);assert.equal(n['#battle-fullscreen'].attributes['aria-pressed'],'false');
 await f.view.open();assert.equal(n['#start-battle'].parent,n['#dock-controls']);await f.view.close();assert.deepEqual(f.normal.children,f.originalOrder);
});
test('Browser Escape/fullscreen exit restores all original controls without resetting the engine',async()=>{const f=fixture({native:true});await f.view.open();f.doc.fullscreenElement=null;f.doc.handlers.fullscreenchange();assert.equal(f.view.expanded,false);assert.deepEqual(f.normal.children,f.originalOrder);await f.view.open();f.doc.handlers.keydown({key:'Escape',preventDefault(){}});await Promise.resolve();assert.equal(f.view.expanded,false);assert.deepEqual(f.normal.children,f.originalOrder);});
