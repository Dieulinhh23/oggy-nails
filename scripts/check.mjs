import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('dist/index.html','utf8');
for(const asset of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1])) {
 if(!asset.includes('://')&&!existsSync(`dist/${asset}`))throw new Error(`Missing asset ${asset}`);
}
new vm.Script(readFileSync('dist/app.js','utf8'));
for(const id of ['menu','filters','booking','booking-form','service','date','time','notes','result'])if(!html.includes(`id="${id}"`))throw new Error(`Missing ${id}`);
console.log('Static assets, planner elements, and JavaScript syntax verified.');
