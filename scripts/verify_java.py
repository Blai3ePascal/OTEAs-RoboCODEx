# SPDX-License-Identifier: MIT
import json,sys
lines=open(sys.argv[1]).read().splitlines()
if 'OK:classroom.TestTank' not in lines:raise SystemExit('ECJ did not compile the sample Java robot')
frames=[json.loads(l) for l in lines if l.startswith('{"type":"frame"')]
results=[json.loads(l) for l in lines if l.startswith('{"type":"result"')]
assert len(frames)>20,'Too few original engine frames'
assert any(r.get('scores') for r in results),'Original engine did not finish with scores'
assert len([r for r in results if r.get('capped')])>=2,'Consecutive capped battles did not finish'
assert any(f['bullets'] for f in frames),'Original engine did not fire'
assert any(r['damage']>0 for result in results for r in result.get('scores',[])),'No original bullet damage recorded'
assert any(len({(round(r['x']),round(r['y'])) for r in f['robots']})==2 for f in frames),'Robots overlap'
print('PASS: real Java compilation, original engine movement/projectiles/damage/scores,',len(frames),'frames')
