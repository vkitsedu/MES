const { spawn } = require('child_process');
const path = require('path');

const desktopDir = 'C:\\Users\\Vipin\\Desktop\\MES-Simulator-Portable-Win64';
const proc = spawn(path.join(desktopDir, 'node.exe'), [path.join(desktopDir, 'server.cjs')], {
  cwd: desktopDir
});

proc.stdout.on('data', (d) => process.stdout.write('[DESKTOP STDOUT]: ' + d.toString()));
proc.stderr.on('data', (d) => process.stderr.write('[DESKTOP STDERR]: ' + d.toString()));

setTimeout(() => {
  console.log('Tested cleanly! Terminating test process...');
  proc.kill();
  process.exit(0);
}, 4500);
