// One command for desktop development: start Vite, open Electron on it, stop both when the window closes.
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import electron from 'electron';

const server = await createServer({ server: { host: '127.0.0.1', port: 5173 } });
await server.listen();
const url = server.resolvedUrls.local[0].replace(/\/$/, '');
console.log(`Vite en ${url} · abriendo Electron (F12 DevTools, Ctrl+R recargar, F11 pantalla completa)`);
const child = spawn(electron, ['.'], { stdio: 'inherit', env: { ...process.env, PMP_DEV_URL: url } });
child.on('exit', async code => { await server.close(); process.exit(code ?? 0); });
