/**
 * build-portable-win.mjs
 *
 * Builds a TRULY self-contained Windows portable package for the MES Simulator.
 * No installation, no Node.js dependency, no version mismatch � ever.
 *
 * Strategy:
 *   - Copies the EXACT node.exe running this script (guaranteed version match)
 *   - Bundles all JS with esbuild into a single server.cjs (source, not bytecode)
 *   - Copies the argon2 prebuilt native .node binary for Windows x64
 *   - Copies the React web UI dist folder
 *   - Creates a Start-MES.bat launcher and README
 *   - ZIPs everything into a single distributable archive
 *
 * Usage:
 *   node scripts/build-portable-win.mjs
 *
 * Output:
 *   release/MES-Simulator-Portable-Win64/      <- extract and run
 *   release/MES-Simulator-Portable-Win64.zip   <- send this to engineers
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\n================================================================================');
console.log('   ?? BUILDING MES SIMULATOR � TRULY SELF-CONTAINED PORTABLE PACKAGE');
console.log('================================================================================\n');

// --- Step 1: Verify build environment ----------------------------------------

console.log('[1/8] Verifying build environment...');
const nodeVersion = process.version;
const nodeExePath = process.execPath;
console.log(`  Node.js version : ${nodeVersion}`);
console.log(`  Node.js exe     : ${nodeExePath}`);
console.log(`  Platform        : ${process.platform}-${process.arch}`);

if (process.platform !== 'win32') {
  console.error('\n?  This script creates a Windows portable package. Run it on Windows.');
  process.exit(1);
}
if (process.arch !== 'x64') {
  console.warn(`\n??  Warning: Building on ${process.arch}. Package targets x64.`);
}
console.log('  ? Environment OK.');

// --- Step 2: Build shared package --------------------------------------------

console.log('\n[2/8] Compiling @mes/shared library...');
execSync('npm --workspace=@mes/shared run build', { cwd: rootDir, stdio: 'inherit' });
console.log('  ? @mes/shared compiled.');

// --- Step 3: Build React web UI ----------------------------------------------

console.log('\n[3/8] Compiling @mes/web production bundle...');
execSync('npm --workspace=@mes/web run build', { cwd: rootDir, stdio: 'inherit' });
console.log('  ? @mes/web compiled.');

// --- Step 4: Bundle server.cjs with esbuild -----------------------------------

console.log('\n[4/8] Bundling API server (all JS ? single server.cjs)...');
const distDir = path.join(rootDir, 'dist-portable');
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

// node:sqlite  � Node 22 built-in, no file needed (already inside node.exe)
// argon2       � native addon, must be on disk beside the bundle
// pg-native    � optional PostgreSQL C driver, not needed for SQLite mode
const esbuildCmd = [
  'npx esbuild apps/api/src/server.ts',
  '--bundle',
  '--platform=node',
  '--target=node22',
  '--format=cjs',
  `--outfile=${distDir}/server.cjs`,
  '--external:node:sqlite',
  '--external:argon2',
  '--external:pg-native',
  '--minify',
  '--drop:debugger',
  '--legal-comments=none',
  '--log-level=warning',
].join(' ');

execSync(esbuildCmd, { cwd: rootDir, stdio: 'inherit' });
console.log('  ? server.cjs generated.');

// --- Step 5: Assemble portable folder ----------------------------------------

console.log('\n[5/8] Assembling portable package...');
const releaseDir = path.join(rootDir, 'release');
const portableDir = path.join(releaseDir, 'MES-Simulator-Portable-Win64');
try { fs.rmSync(portableDir, { recursive: true, force: true }); } catch (e) { /* ignore locked folder root and overwrite contents */ }
fs.mkdirSync(portableDir, { recursive: true });

// 5a. Copy node.exe � THE KEY: exact version used to build = zero mismatch
const destNodeExe = path.join(portableDir, 'node.exe');
fs.copyFileSync(nodeExePath, destNodeExe);
const nodeSizeMb = (fs.statSync(destNodeExe).size / 1024 / 1024).toFixed(1);
console.log(`  ? node.exe embedded (${nodeVersion}, ${nodeSizeMb} MB)`);

// 5b. Copy bundled server
fs.copyFileSync(path.join(distDir, 'server.cjs'), path.join(portableDir, 'server.cjs'));
console.log('  ? server.cjs copied.');

// 5c. Copy web UI assets
const webDistDir = path.join(rootDir, 'apps', 'web', 'dist');
fs.cpSync(webDistDir, path.join(portableDir, 'public'), { recursive: true });
console.log('  ? Web UI assets copied ? public/');

// 5d. Copy argon2 native module (prebuilt .node binary for win32-x64)
const argon2Src = path.join(rootDir, 'node_modules', 'argon2');
const argon2Dest = path.join(portableDir, 'node_modules', 'argon2');
if (!fs.existsSync(argon2Src)) {
  console.error('\n?  argon2 not found in node_modules. Run: npm install');
  process.exit(1);
}
fs.cpSync(argon2Src, argon2Dest, { recursive: true });

  // Copy argon2 dependencies (@phc and node-gyp-build) so portable runs on any machine
  const phcSrc = path.join(rootDir, 'node_modules', '@phc');
  if (fs.existsSync(phcSrc)) {
    fs.cpSync(phcSrc, path.join(portableDir, 'node_modules', '@phc'), { recursive: true });
  }
  const gypBuildSrc = path.join(rootDir, 'node_modules', 'node-gyp-build');
  if (fs.existsSync(gypBuildSrc)) {
    fs.cpSync(gypBuildSrc, path.join(portableDir, 'node_modules', 'node-gyp-build'), { recursive: true });
  }
console.log('  ? argon2 native addon copied (win32-x64 prebuilt).');

  // 5e. Copy SQL migrations for runtime schema init
  const migrationsSrc = path.join(rootDir, 'apps', 'api', 'src', 'db', 'migrations');
  const migrationsDest = path.join(portableDir, 'migrations');
  fs.cpSync(migrationsSrc, migrationsDest, { recursive: true });
  console.log('  ? SQL schema migrations copied ? migrations/');

// --- Step 6: Write launcher scripts ------------------------------------------

console.log('\n[6/8] Writing launcher scripts...');

// Main launcher � double-click to start
fs.writeFileSync(path.join(portableDir, 'Start-MES.bat'), `\
@echo off
title i-MES 2.0 Simulator
cd /d "%~dp0"

echo.
echo  ============================================================================
echo     i-MES 2.0 - SMT MANUFACTURING EXECUTION SYSTEM  --  PORTABLE SIMULATOR
echo  ============================================================================
echo.
echo  Starting MES engine... (first run may take 5-10 seconds to seed database)
echo.

start "" /B node.exe server.cjs

timeout /t 5 /nobreak > nul

echo  Opening Cleanroom Cockpit in browser...
start "" http://localhost:4000/

echo.
echo  ============================================================================
echo   Cockpit UI  :  http://localhost:4000/
echo   API Docs    :  http://localhost:4000/api-docs
echo   Metrics     :  http://localhost:4000/metrics
echo   Fuji TCP    :  tcp://localhost:30040
echo  ============================================================================
echo.
echo  Press any key to STOP the MES server.
pause > nul

taskkill /F /IM node.exe /T 2>nul
echo  MES server stopped.
`, 'utf-8');

// Background mode (no console window blocks)
fs.writeFileSync(path.join(portableDir, 'Start-MES-Background.bat'), `\
@echo off
cd /d "%~dp0"
start "" /B node.exe server.cjs
timeout /t 4 /nobreak > nul
start "" http://localhost:4000/
`, 'utf-8');

// Stop script
fs.writeFileSync(path.join(portableDir, 'Stop-MES.bat'), `\
@echo off
taskkill /F /IM node.exe /T 2>nul
echo MES server stopped.
pause
`, 'utf-8');

console.log('  ? Start-MES.bat, Start-MES-Background.bat, Stop-MES.bat created.');

// --- Step 7: Write README -----------------------------------------------------

fs.writeFileSync(path.join(portableDir, 'README.txt'), `\
================================================================================
   i-MES 2.0 - SMT MANUFACTURING EXECUTION SYSTEM -- PORTABLE SIMULATOR
   Self-Contained | No Installation | No Node.js Needed
   Runtime: ${nodeVersion} (${process.arch}, embedded)
================================================================================

HOW TO USE
----------
1. Extract this folder anywhere (Desktop, USB drive, D:\\, etc.)
2. Double-click  Start-MES.bat
3. Browser opens automatically to http://localhost:4000/
4. Press any key in the console to STOP the server.

RESET FACTORY STATE
--------------------
Delete  mes_local.db  in this folder and re-run Start-MES.bat.
All demo data will be re-seeded automatically on the next start.

LOGIN CREDENTIALS
------------------
  Badge ID       PIN    Role
  OP-SMT-01      1234   Operator (Feeder Specialist)
  OP-SMT-02      2345   Operator (Splicing Tech)
  QC-LEAD-01     4321   Quality Lead
  LL-01          5678   Line Lead / Supervisor
  SYS-ADMIN-01   9999   System Admin

CLEANROOM COCKPIT TABS
-----------------------
  Tab 1:  Operator Station        Line execution & barcode dispatch
  Tab 2:  Supervisor Dashboard    eBR records & Part 11 sign-off
  Tab 3:  Traceability Genealogy  Component & PCB panel genealogy trees
  Tab 4:  Component Splicing      Feeder reel setup, MSL clocks & interlocks
  Tab 5:  Solder Paste & 3D SPI   Stencil life, inspection & squeegee tuning
  Tab 6:  3D AOI & Defect         Optical inspection & repeat-defect halts
  Tab 7:  Reflow Profiling        Thermal PWI engine & oven drift
  Tab 8:  Autonomous AGV Fleet    Floor navigation & replenishment
  Tab 9:  Predictive Intelligence Weibull reliability, SPC Cpk
  Tab 10: SRE & Topology Health   System metrics, ingress pipeline, SLO

ENDPOINTS
----------
  http://localhost:4000/          Cleanroom Cockpit UI
  http://localhost:4000/api-docs  Swagger interactive API docs
  http://localhost:4000/metrics   Prometheus metrics
  http://localhost:4000/health    Health probe
  tcp://localhost:30040           Fuji Nexim machine gateway

TECHNICAL
----------
  node.exe  : ${nodeVersion} (embedded, no system Node.js used)
  Database  : SQLite (mes_local.db, created on first run)
  Port      : 4000 (HTTP + WebSocket)
  Fuji TCP  : 30040

================================================================================
`, 'utf-8');

console.log('  ? README.txt written.');

// --- Step 8: Package size report + ZIP ---------------------------------------

console.log('\n[7/8] Package contents:');

function getDirSize(p) {
  if (!fs.existsSync(p)) return 0;
  let total = 0;
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    const ep = path.join(p, e.name);
    total += e.isDirectory() ? getDirSize(ep) : fs.statSync(ep).size;
  }
  return total;
}

let totalBytes = 0;
for (const item of fs.readdirSync(portableDir, { withFileTypes: true })) {
  const ip = path.join(portableDir, item.name);
  const bytes = item.isDirectory() ? getDirSize(ip) : fs.statSync(ip).size;
  totalBytes += bytes;
  console.log(`    ${item.isDirectory() ? '[dir ]' : '[file]'} ${item.name.padEnd(40)} ${(bytes / 1024 / 1024).toFixed(1)} MB`);
}
console.log(`\n  Total: ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);

console.log('\n[8/8] Creating ZIP archive (PowerShell Compress-Archive)...');
const zipPath = path.join(releaseDir, 'MES-Simulator-Portable-Win64.zip');

try {
  // PowerShell Compress-Archive is available on all Windows 10/11 � no 7zip needed
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${portableDir}' -DestinationPath '${zipPath}' -Force"`,
    { stdio: 'inherit' }
  );
  console.log(`  ? ZIP created: ${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(1)} MB`);
} catch (err) {
  console.warn(`  ??  ZIP creation failed (${err.message}) � folder is ready, zip manually.`);
}

// --- Done ----------------------------------------------------------------------

console.log('\n================================================================================');
console.log('   ?  BUILD COMPLETE � SEND TO YOUR ENGINEERS');
console.log('================================================================================');
console.log(`\n  ?? Folder : release\\MES-Simulator-Portable-Win64\\`);
console.log(`  ?? ZIP    : release\\MES-Simulator-Portable-Win64.zip`);
console.log('\n  ?  Extract anywhere. Double-click Start-MES.bat. Done.');
console.log('     No Node.js. No installation. No version mismatch. Ever.\n');
