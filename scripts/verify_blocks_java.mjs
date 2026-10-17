// SPDX-License-Identifier: MIT
import {writeFileSync,mkdirSync,readdirSync} from 'node:fs';import {resolve} from 'node:path';import {execFileSync} from 'node:child_process';
import {EVENTS,blocksJava,emptyBlocks} from '../src/core.js';import {EXTRA_MISSIONS} from '../src/curriculum.js';
const output=resolve('build/events-java');mkdirSync(output,{recursive:true});
const programs=[blocksJava({...emptyBlocks(),...Object.fromEntries(Object.keys(EVENTS).map(k=>[k,[{type:k==='run'?'scan':'back',value:k==='run'?0:20}]]))},'AllEvents'),...EXTRA_MISSIONS.filter(m=>m.solutionCode).map((m,i)=>m.solutionCode.replace('class Entrenamiento','class JavaLesson'+i))];
const files=programs.map((source,i)=>{const name=i===0?'AllEvents':'JavaLesson'+(i-1);const file=resolve(output,name+'.java');writeFileSync(file,source);return file;});
const classpath=readdirSync('runtime').filter(f=>f.endsWith('.jar')&&f!=='jdk17-symbols.jar').map(f=>resolve('runtime',f)).join(':');
execFileSync('java',['-cp',resolve('runtime/ecj-3.46.0.jar'),'org.eclipse.jdt.internal.compiler.batch.Main','-17','-proc:none','-classpath',classpath,'-d',output,...files],{stdio:'inherit',timeout:60000});
console.log('PASS: seven generated Java event handlers, scan(), and three genuine Java lesson solutions compile with ECJ.');

// Compile a copied class through the same named bridge used in the browser,
// then deploy both identical simple names to a real original-engine battle.
const {inspectJava,changeJavaPackage}=await import('../src/java-identity.js');
const original=`/* public class Decoy {} */
package classroom.identity;
public final class Duel extends robocode.Robot {
 public Duel() {}
 public Duel copy(){return new classroom.identity.Duel();}
 public void run(){while(true){turnGunRight(360);}}
 public void onScannedRobot(robocode.ScannedRobotEvent e){fire(2);}
}`;
const copied=changeJavaPackage(original,'classroom.identity.copia2');
const args=[];for(const [i,source] of [original,copied].entries()){const file=resolve(output,'identity-'+i+'.java');writeFileSync(file,source);args.push(file,inspectJava(source).fullName);}
execFileSync('java',['-cp',resolve('runtime/ecj-3.46.0.jar'),'org.eclipse.jdt.internal.compiler.batch.Main','-17','-proc:none','-classpath',classpath,'-d',output,resolve('scripts/JavaIdentityProbe.java')],{stdio:'inherit',timeout:60000});
const proof=execFileSync('java',['-Dotea.symbols='+resolve('runtime/jdk17-symbols.jar'),'-cp',output+':'+classpath,'JavaIdentityProbe',resolve('runtime/robocode-home.zip'),resolve('build/identity-native'),...args],{encoding:'utf8',timeout:120000,maxBuffer:5000000});
const frames=proof.split('\n').filter(l=>l.startsWith('{"type":"frame"')).map(l=>JSON.parse(l));
if(!proof.includes('IDENTITY_PROBE_OK')||!frames.some(f=>new Set(f.robots.map(r=>r.fullName)).size===2&&f.robots.some(r=>r.fullName===args[1])&&f.robots.some(r=>r.fullName===args[3])))throw Error('Distinct Java identities did not participate together');
writeFileSync(resolve(output,'identity-native.log'),proof);
console.log('PASS: constructors and qualified self references compile in both packages; same-name classes participate together in the original engine ('+frames.length+' frames).');
