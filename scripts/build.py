#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
import pathlib, zipfile, subprocess, os, shutil, json, hashlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
setup=ROOT/'vendor/robocode-1.11.1-setup.jar'
if not setup.exists(): setup=ROOT.parent/'upload/robocode-1.11.1-setup.jar'
if not setup.exists(): raise SystemExit('Falta vendor/robocode-1.11.1-setup.jar')
runtime=ROOT/'runtime'; runtime.mkdir(exist_ok=True)
z=zipfile.ZipFile(setup); jars=[]
for name in z.namelist():
 if name.startswith('libs/') and name.endswith('.jar') or name=='compilers/ecj-3.46.0.jar':
  f=runtime/pathlib.Path(name).name; f.write_bytes(z.read(name));jars.append(f.name)
with zipfile.ZipFile(runtime/'robocode-home.zip','w',zipfile.ZIP_DEFLATED) as out:
 for name in z.namelist():
  if not name.endswith('/') and not name.startswith(('javadoc/','compilers/')): out.writestr(name,z.read(name))
(runtime/'jars.json').write_text(json.dumps(jars))
notices=[]
for name in jars:
 jar=runtime/name
 with zipfile.ZipFile(jar) as contents:
  saved=[]
  for entry in contents.namelist():
   if entry.endswith('/') or not any(v in entry.lower() for v in ['license','notice','copying','about.html']):continue
   try:text=contents.read(entry).decode('utf-8')
   except UnicodeDecodeError:continue
   output=ROOT/'licenses/vendor'/name/entry.replace('/','_');output.parent.mkdir(parents=True,exist_ok=True);output.write_text(text);saved.append(str(output.relative_to(ROOT)))
  notices.append({'file':name,'sha256':hashlib.sha256(jar.read_bytes()).hexdigest(),'notices':saved})
(ROOT/'licenses/inventory.json').write_text(json.dumps(notices,indent=2))

classes=ROOT/'build/classes'; classes.mkdir(parents=True,exist_ok=True)
cp=os.pathsep.join(str(p) for p in runtime.glob('*.jar'))
subprocess.run(['java','-cp',str(runtime/'ecj-3.46.0.jar'),'org.eclipse.jdt.internal.compiler.batch.Main','-17','-proc:none','-classpath',cp,'-d',str(classes),str(ROOT/'java/ArenaBridge.java'),str(ROOT/'java/JdkSymbols.java')],check=True)
subprocess.run(['java','-cp',str(classes),'otea.JdkSymbols',str(runtime/'jdk17-symbols.jar')],check=True)
java_home=pathlib.Path(shutil.which('java')).resolve().parent.parent
legal=java_home/'legal'
if legal.exists():
 for f in legal.rglob('*'):
  if f.is_file():
   target=ROOT/'licenses/openjdk17-runtime'/f.relative_to(legal);target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(f,target)
version=subprocess.run(['java','-version'],capture_output=True,text=True).stderr
(runtime/'jdk17-origin.json').write_text(json.dumps({'purpose':'Compile-time symbol lookup; never added to the execution classpath','java_version':version,'license':'GPL-2.0-only WITH Classpath-exception-2.0','source':'https://github.com/openjdk/jdk17u','sha256':hashlib.sha256((runtime/'jdk17-symbols.jar').read_bytes()).hexdigest()},indent=2))

with zipfile.ZipFile(runtime/'arena-bridge.jar','w',zipfile.ZIP_DEFLATED) as out:
 for f in classes.rglob('*.class'):out.write(f,str(f.relative_to(classes)))
dist=ROOT/'dist'
if dist.exists():shutil.rmtree(dist)
dist.mkdir()
for name in ['index.html','jvm.html','styles.css','LICENSE','THIRD_PARTY_NOTICES.md']:
 shutil.copy2(ROOT/name,dist/name)
for name in ['src','assets','runtime','licenses','docs']:shutil.copytree(ROOT/name,dist/name)
manifest={str(f.relative_to(dist)):hashlib.sha256(f.read_bytes()).hexdigest() for f in dist.rglob('*') if f.is_file()}
(dist/'manifest.json').write_text(json.dumps(manifest,indent=2))
print('Build completo:',len(manifest),'archivos. Instalador SHA256:',hashlib.sha256(setup.read_bytes()).hexdigest())
