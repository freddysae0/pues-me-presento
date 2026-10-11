// Desktop shell. The game stays a plain web build: no Node in the renderer (sandbox + context isolation).
// Production serves dist/ through app:// because ES modules and fetch() of GLB/MP3 do not work from file://.
const { app, BrowserWindow, protocol, net, session, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const devUrl = process.env.PMP_DEV_URL; // set by tools/desktop-dev.mjs
const root = path.join(__dirname, '..', 'dist');
const rootUrl = pathToFileURL(root + path.sep).toString(); // app:// is served from these files

app.setName('Pues me presento');
// No autoplay switch: the start-up notice button is the user gesture that unlocks audio (same as the web build).
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);

// Everything is local (CLAUDE.md rule 4): refuse any request that leaves the app or the dev server.
function allowed(url) {
  if (url.startsWith('app://') || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('devtools://') || url.startsWith(rootUrl)) return true;
  return !!devUrl && (url.startsWith(devUrl) || url.startsWith(devUrl.replace(/^http/, 'ws')));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600, height: 900, minWidth: 1024, minHeight: 600, backgroundColor: '#2b2140', show: false, autoHideMenuBar: true, title: 'Pues me presento',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.removeMenu();
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url) && !allowed(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!allowed(url)) e.preventDefault(); });
  // No menu bar, so wire the useful shortcuts by hand.
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11' || (input.alt && input.key === 'Enter')) { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (devUrl && (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i'))) { win.webContents.toggleDevTools(); e.preventDefault(); }
    if (devUrl && input.control && input.key.toLowerCase() === 'r') { win.webContents.reload(); e.preventDefault(); }
  });
  win.loadURL(devUrl || 'app://game/index.html');
}

app.whenReady().then(() => {
  protocol.handle('app', request => {
    const file = path.normalize(path.join(root, decodeURIComponent(new URL(request.url).pathname)));
    if (!file.startsWith(root + path.sep)) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  session.defaultSession.webRequest.onBeforeRequest((details, done) => done({ cancel: !allowed(details.url) }));
  createWindow();
});
app.on('window-all-closed', () => app.quit());
