// SPDX-License-Identifier: MIT
import {writeFileSync,mkdirSync,readdirSync} from 'node:fs';import {resolve} from 'node:path';import {execFileSync} from 'node:child_process';
import {EVENTS,blocksJava,emptyBlocks} from '../src/core.js';import {EXTRA_MISSIONS} from '../src/curriculum.js';
const output=resolve('build/events-java');mkdirSync(output,{recursive:true});
const programs=[blocksJava({...emptyBlocks(),...Object.fromEntries(Object.keys(EVENTS).map(k=>[k,[{type:k==='run'?'scan':'back',value:k==='run'?0:20}]]))},'AllEvents'),...EXTRA_MISSIONS.filter(m=>m.solutionCode).map((m,i)=>m.solutionCode.replace('class Entrenamiento','class JavaLesson'+i))];
const files=programs.map((source,i)=>{const name=i===0?'AllEvents':'JavaLesson'+(i-1);const file=resolve(output,name+'.java');writeFileSync(file,source);return file;});
const classpath=readdirSync('runtime').filter(f=>f.endsWith('.jar')&&f!=='jdk17-symbols.jar').map(f=>resolve('runtime',f)).join(':');
execFileSync('java',['-cp',resolve('runtime/ecj-3.46.0.jar'),'org.eclipse.jdt.internal.compiler.batch.Main','-17','-proc:none','-classpath',classpath,'-d',output,...files],{stdio:'inherit',timeout:60000});
console.log('PASS: seven generated Java event handlers, scan(), and three genuine Java lesson solutions compile with ECJ.');
