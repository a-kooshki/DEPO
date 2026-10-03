const { app, BrowserWindow, ipcMain, Menu, dialog, shell, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');
const http = require('http');
const os = require('os');

const isDev = !app.isPackaged;

const DATA_FILE = 'stone-inventory-data.json';
const BACKUP_FILE = 'stone-inventory-data.backup.json';
const WINDOW_STATE_FILE = 'window-state.json';
const MOBILE_PORT = 47871;

const DEFAULT_STONE_TYPES = ['Granite', 'Marble', 'Limestone'];
const EMPTY_DATA = {
  stones: [], stoneTypes: DEFAULT_STONE_TYPES, settings: {}, waybills: [], cuttingForms: [], contracts: [],
  machines: [], blades: [], operators: [],
};

const userPath = (fileName) => path.join(app.getPath('userData'), fileName);

/* ------------------------------------------------------------------ */
/* Data file                                                           */
/* ------------------------------------------------------------------ */

const isValidPayload = (value) => (
  value && typeof value === 'object'
  && (Array.isArray(value.stones) || Array.isArray(value.stoneTypes) || Array.isArray(value.waybills) || Array.isArray(value.cuttingForms) || Array.isArray(value.contracts))
);

const sanitize = (data) => ({
  stones: Array.isArray(data?.stones) ? data.stones : [],
  stoneTypes: Array.isArray(data?.stoneTypes) && data.stoneTypes.length > 0 ? data.stoneTypes : DEFAULT_STONE_TYPES,
  settings: data?.settings && typeof data.settings === 'object' ? data.settings : {},
  waybills: Array.isArray(data?.waybills) ? data.waybills : [],
  cuttingForms: Array.isArray(data?.cuttingForms) ? data.cuttingForms : [],
  contracts: Array.isArray(data?.contracts) ? data.contracts : [],
  machines: Array.isArray(data?.machines) ? data.machines : [],
  blades: Array.isArray(data?.blades) ? data.blades : [],
  operators: Array.isArray(data?.operators) ? data.operators : [],
});

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!isValidPayload(parsed)) throw new Error('Unrecognised data file shape');
  return parsed;
}

// The renderer must be able to tell "no file yet" (safe to start empty) from
// "the file exists but could not be read" (must NOT overwrite it). The status
// field carries that distinction; the renderer refuses to auto-save on 'error'.
async function loadData() {
  const filePath = userPath(DATA_FILE);
  const backupPath = userPath(BACKUP_FILE);

  try {
    return { status: 'ok', data: sanitize(await readJson(filePath)) };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { status: 'empty', data: sanitize(EMPTY_DATA) };
    }

    console.error('Primary data file unreadable:', error);

    try {
      const recovered = sanitize(await readJson(backupPath));
      // Move the damaged file aside so it can be inspected later.
      await fs.rename(filePath, `${filePath}.corrupt-${Date.now()}`).catch(() => undefined);
      return { status: 'recovered', data: recovered };
    } catch {
      return { status: 'error', data: sanitize(EMPTY_DATA), message: error.message };
    }
  }
}

// Atomic write: full contents go to a temp file, are flushed to disk, and only
// then replace the live file. The previous good copy is kept as a backup, so a
// crash mid-write can never leave the user without readable data.
async function writeData(data) {
  const filePath = userPath(DATA_FILE);
  const backupPath = userPath(BACKUP_FILE);
  const tempPath = `${filePath}.tmp`;
  const payload = JSON.stringify(sanitize(data), null, 2);

  const handle = await fs.open(tempPath, 'w');
  try {
    await handle.writeFile(payload, 'utf-8');
    await handle.sync();
  } finally {
    await handle.close();
  }

  await fs.copyFile(filePath, backupPath).catch(() => undefined);
  await fs.rename(tempPath, filePath);

  return { success: true, savedAt: new Date().toISOString() };
}

// Saves are serialised through one promise chain so two rapid saves can never
// interleave their writes. `pendingSaves` lets quit wait for the last one.
let saveQueue = Promise.resolve();
let pendingSaves = 0;

function enqueueSave(data) {
  pendingSaves += 1;
  saveQueue = saveQueue
    .catch(() => undefined)
    .then(() => writeData(data))
    .finally(() => { pendingSaves -= 1; });
  return saveQueue;
}

const flushSaves = () => saveQueue.catch(() => undefined);

/* ------------------------------------------------------------------ */
/* Canonical in-memory store                                           */
/* ------------------------------------------------------------------ */
//
// Both the desktop renderer (over IPC) and mobile browsers on the LAN (over
// HTTP) read and write through this single object, which lives only in this
// process. Nobody else is allowed to own a copy of `stones`/`cuttingForms`
// that it mutates and writes back wholesale — that "last write wins" pattern
// is exactly what would let a mobile entry get silently erased by a desktop
// save (or vice versa) if two people used the app at the same time. Instead,
// every write goes through a small operation (add this pallet, save this
// cutting form, ...) that mutates `store` here and *only* here, so Node's
// single-threaded event loop is enough to make each operation atomic — there
// is no in-between state a second request could observe.

let store = null;
let storeReady = null;

async function initStore() {
  if (!storeReady) {
    storeReady = loadData().then((result) => {
      store = result.data;
      return result;
    });
  }
  return storeReady;
}

function computeNextCuttingRowNumber() {
  return store.cuttingForms.length === 0 ? 1 : Math.max(...store.cuttingForms.map((f) => f.rowNumber)) + 1;
}

// Mirrors src/shared/domain.js's flattenCoups — duplicated in plain CJS here
// because this file and the renderer bundle use different module systems.
// Both this and src/shared/domain.js are covered by tests asserting the same
// input produces the same shape.
function flattenCoupsForApi() {
  return store.waybills.flatMap((w) => w.coups.map((c) => ({
    ...c, waybillNumber: w.waybillNumber, waybillId: w.id, contractNumber: w.contractNumber,
  })));
}

const sseClients = new Set();

function broadcastChange() {
  const livePayload = { stones: store.stones, cuttingForms: store.cuttingForms };
  BrowserWindow.getAllWindows().forEach((win) => {
    if (!win.isDestroyed()) win.webContents.send('data:live-update', livePayload);
  });
  const message = `data: ${JSON.stringify({ type: 'update' })}\n\n`;
  sseClients.forEach((res) => { try { res.write(message); } catch { /* client gone */ } });
}

function persistAndBroadcast() {
  enqueueSave(store).catch((error) => console.error('Background save failed:', error));
  broadcastChange();
}

function savePalletStones({ palletNumber, editingPalletNumber, stones }) {
  if (!palletNumber || !Array.isArray(stones) || stones.length === 0) {
    return { error: 'اطلاعات پالت ناقص است.' };
  }
  // Mobile clients never see invoice/sold status (their reference data is
  // deliberately minimal), so this guard has to live here to protect them
  // too, not just in the desktop UI.
  if (!editingPalletNumber) {
    const alreadySold = store.stones.some((s) => s.palletNumber === palletNumber && String(s.invoiceNumber || '').trim() !== '');
    if (alreadySold) return { error: `پالت ${palletNumber} قبلاً فروخته شده است.` };
  }
  const rest = editingPalletNumber
    ? store.stones.filter((s) => s.palletNumber !== editingPalletNumber)
    : store.stones;
  store.stones = [...stones, ...rest];
  persistAndBroadcast();
  return { stones: store.stones };
}

function setInvoiceForPallets({ palletNumbers, invoice }) {
  if (!Array.isArray(palletNumbers) || palletNumbers.length === 0) return { error: 'پالتی انتخاب نشده است.' };
  store.stones = store.stones.map((s) => (palletNumbers.includes(s.palletNumber) ? { ...s, invoiceNumber: invoice || '' } : s));
  persistAndBroadcast();
  return { stones: store.stones };
}

function deletePalletByNumber({ palletNumber }) {
  if (!palletNumber) return { error: 'شماره پالت مشخص نیست.' };
  store.stones = store.stones.filter((s) => s.palletNumber !== palletNumber);
  persistAndBroadcast();
  return { stones: store.stones };
}

// The client (desktop or mobile) resolves coup/machine/blade references and
// sends a fully-formed record; the one thing this process never trusts the
// client for is `rowNumber`, since two submissions racing for the same
// number is the one real way concurrent entry could corrupt data. It is
// always (re)computed here, from this process's own canonical array.
function saveCuttingFormRecord(input) {
  if (!input || !input.coupNumber || !input.machineId) return { error: 'اطلاعات فرم برش ناقص است.' };
  const existingIndex = input.id ? store.cuttingForms.findIndex((f) => f.id === input.id) : -1;
  const existing = existingIndex >= 0 ? store.cuttingForms[existingIndex] : null;
  const record = {
    ...input,
    id: existing ? existing.id : `cf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    rowNumber: existing ? existing.rowNumber : computeNextCuttingRowNumber(),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  if (existing) store.cuttingForms[existingIndex] = record;
  else store.cuttingForms = [record, ...store.cuttingForms];
  persistAndBroadcast();
  return { record };
}

function deleteCuttingFormById({ id }) {
  if (!id) return { error: 'شناسه فرم مشخص نیست.' };
  store.cuttingForms = store.cuttingForms.filter((f) => f.id !== id);
  persistAndBroadcast();
  return { cuttingForms: store.cuttingForms };
}

/* ------------------------------------------------------------------ */
/* Window state                                                        */
/* ------------------------------------------------------------------ */

function readWindowState() {
  try {
    const state = JSON.parse(fsSync.readFileSync(userPath(WINDOW_STATE_FILE), 'utf-8'));
    if (typeof state?.width === 'number' && typeof state?.height === 'number') return state;
  } catch {
    // no saved state yet
  }
  return { width: 1360, height: 860 };
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) return;
  try {
    const bounds = win.isMaximized() ? win.getNormalBounds() : win.getBounds();
    fsSync.writeFileSync(
      userPath(WINDOW_STATE_FILE),
      JSON.stringify({ ...bounds, maximized: win.isMaximized() }),
      'utf-8'
    );
  } catch (error) {
    console.error('Could not persist window state:', error);
  }
}

/* ------------------------------------------------------------------ */
/* Window                                                              */
/* ------------------------------------------------------------------ */

function resolveWindowIcon() {
  const pngIcon = path.join(__dirname, '../build/icon.png');
  return fsSync.existsSync(pngIcon) ? pngIcon : undefined;
}

let mainWindow = null;

function createWindow() {
  const state = readWindowState();

  mainWindow = new BrowserWindow({
    ...state,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    backgroundColor: '#F4F5F7',
    icon: resolveWindowIcon(),
    title: 'DEPO',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
    },
  });

  if (state.maximized) mainWindow.maximize();

  // Nothing is shown until the first paint, so the user never sees a white flash.
  mainWindow.once('ready-to-show', () => mainWindow.show());

  ['resize', 'move', 'close'].forEach((event) => {
    mainWindow.on(event, () => saveWindowState(mainWindow));
  });

  mainWindow.on('closed', () => { mainWindow = null; });

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('Renderer gone:', details);
    dialog.showErrorBox('خطای برنامه', 'صفحه‌ی برنامه به‌طور غیرمنتظره بسته شد. برنامه دوباره بارگذاری می‌شود.');
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.reload();
  });

  // Security: the app only ever renders its own bundle. Anything trying to
  // navigate elsewhere or open a popup is sent to the real browser instead.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isLocal = url.startsWith('http://127.0.0.1:5173') || url.startsWith('file://');
    if (!isLocal) {
      event.preventDefault();
      if (/^https?:/.test(url)) shell.openExternal(url);
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

/* ------------------------------------------------------------------ */
/* Mobile / LAN HTTP server                                            */
/* ------------------------------------------------------------------ */
//
// Serves the small standalone "ثبت پالت" / "ثبت برش" pages (mobile/) to any
// browser on the same network, plus the JSON API they call. Bound to
// 0.0.0.0 so other devices on the LAN can reach it, not just this machine.
// This is intentionally its own plain http.Server rather than a framework —
// the route surface is small and fixed, and one fewer dependency is one
// fewer thing that can fail to install offline.

const MOBILE_ROOT = path.join(__dirname, '../mobile');
const SHARED_ROOT = path.join(__dirname, '../src/shared');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

let httpServer = null;
let boundPort = null;

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 2 * 1024 * 1024) { reject(new Error('Request body too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (chunks.length === 0) { resolve(null); return; }
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8'))); } catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) });
  res.end(payload);
}

// Serves a file from one of the two allowed static roots, refusing to
// resolve outside them (no `..` escaping the mobile/ or src/shared/ folders).
async function serveStaticFile(res, rootDir, relativePath) {
  const safeRelative = relativePath.replace(/^\/+/, '') || 'index.html';
  const resolved = path.normalize(path.join(rootDir, safeRelative));
  if (!resolved.startsWith(path.normalize(rootDir))) { sendJson(res, 403, { error: 'Forbidden' }); return; }
  try {
    const data = await fs.readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}

async function handleApiRequest(req, res, pathname) {
  await initStore();

  if (req.method === 'GET' && pathname === '/api/state') {
    sendJson(res, 200, {
      stoneTypes: store.stoneTypes,
      coups: flattenCoupsForApi(),
      machines: store.machines,
      blades: store.blades,
      operators: store.operators,
    });
    return;
  }

  if (req.method === 'GET' && pathname.startsWith('/api/pallets/')) {
    const palletNumber = decodeURIComponent(pathname.slice('/api/pallets/'.length));
    const stones = store.stones.filter((stone) => stone.palletNumber === palletNumber);
    if (stones.length === 0) { sendJson(res, 404, { error: 'پالت پیدا نشد.' }); return; }
    sendJson(res, 200, { palletNumber, stones });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/pallets') {
    try {
      const body = await readRequestBody(req);
      const result = savePalletStones(body || {});
      sendJson(res, result.error ? 400 : 200, result);
    } catch {
      sendJson(res, 400, { error: 'درخواست نامعتبر است.' });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/cutting-forms') {
    try {
      const body = await readRequestBody(req);
      const result = saveCuttingFormRecord(body || {});
      sendJson(res, result.error ? 400 : 200, result);
    } catch {
      sendJson(res, 400, { error: 'درخواست نامعتبر است.' });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

function startMobileServer(startPort) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://localhost');
      const pathname = url.pathname;

      if (pathname.startsWith('/api/')) {
        handleApiRequest(req, res, pathname).catch((error) => {
          console.error('API request failed:', error);
          if (!res.headersSent) sendJson(res, 500, { error: 'خطای داخلی سرور' });
        });
        return;
      }

      if (pathname.startsWith('/shared/')) {
        serveStaticFile(res, SHARED_ROOT, pathname.replace('/shared/', '/'));
        return;
      }

      serveStaticFile(res, MOBILE_ROOT, pathname === '/' ? '/index.html' : pathname);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && startPort < MOBILE_PORT + 10) {
        server.close();
        resolve(startMobileServer(startPort + 1));
        return;
      }
      console.error('Mobile server failed to start:', error);
      resolve(null);
    });

    server.listen(startPort, '0.0.0.0', () => {
      boundPort = startPort;
      resolve(server);
    });
  });
}

function getLanAddress() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) return entry.address;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* System tray — keeps the LAN service alive without the window open   */
/* ------------------------------------------------------------------ */

let tray = null;

function showNetworkInfoDialog() {
  const address = getLanAddress();
  const message = address && boundPort
    ? `http://${address}:${boundPort}`
    : 'دستگاه به شبکه‌ی محلی متصل نیست.';
  dialog.showMessageBox({
    type: 'info',
    title: 'اتصال موبایل',
    message: 'آدرس فرم‌های موبایل',
    detail: `${message}\n\nاین آدرس را در مرورگر یک گوشی متصل به همین شبکه باز کنید.`,
    buttons: ['باشه'],
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../build/icon.png');
  const image = fsSync.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty();
  tray = new Tray(image.isEmpty() ? nativeImage.createEmpty() : image.resize({ width: 16, height: 16 }));
  tray.setToolTip('DEPO — در حال اجرا در پس‌زمینه');

  const rebuildMenu = () => {
    tray.setContextMenu(Menu.buildFromTemplate([
      {
        label: 'باز کردن DEPO',
        click: () => {
          if (mainWindow && !mainWindow.isDestroyed()) { mainWindow.show(); mainWindow.focus(); } else { createWindow(); }
        },
      },
      { label: 'اطلاعات اتصال موبایل', click: showNetworkInfoDialog },
      { type: 'separator' },
      {
        label: 'خروج کامل (توقف سرویس)',
        click: () => { app.quit(); },
      },
    ]));
  };

  rebuildMenu();
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) { mainWindow.show(); mainWindow.focus(); } else { createWindow(); }
  });
}

/* ------------------------------------------------------------------ */
/* Menu                                                                */
/* ------------------------------------------------------------------ */

function buildMenu() {
  const template = [
    {
      label: 'پرونده',
      submenu: [
        {
          label: 'محل ذخیره اطلاعات',
          click: () => shell.showItemInFolder(userPath(DATA_FILE)),
        },
        {
          label: 'تهیه نسخه پشتیبان…',
          click: async () => {
            const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
              title: 'ذخیره نسخه پشتیبان',
              defaultPath: `stone-inventory-${new Date().toISOString().slice(0, 10)}.json`,
              filters: [{ name: 'JSON', extensions: ['json'] }],
            });
            if (canceled || !filePath) return;
            try {
              await flushSaves();
              await fs.copyFile(userPath(DATA_FILE), filePath);
              dialog.showMessageBox(mainWindow, { type: 'info', message: 'نسخه پشتیبان ذخیره شد.', buttons: ['باشه'] });
            } catch (error) {
              dialog.showErrorBox('خطا در تهیه پشتیبان', error.message);
            }
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'خروج' },
      ],
    },
    {
      label: 'ویرایش',
      submenu: [
        { role: 'undo', label: 'واگرد' },
        { role: 'redo', label: 'ازنو' },
        { type: 'separator' },
        { role: 'cut', label: 'برش' },
        { role: 'copy', label: 'کپی' },
        { role: 'paste', label: 'چسباندن' },
        { role: 'selectAll', label: 'انتخاب همه' },
      ],
    },
    {
      label: 'نمایش',
      submenu: [
        { role: 'reload', label: 'بارگذاری دوباره' },
        { role: 'resetZoom', label: 'اندازه عادی' },
        { role: 'zoomIn', label: 'بزرگ‌نمایی' },
        { role: 'zoomOut', label: 'کوچک‌نمایی' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'تمام‌صفحه' },
        ...(isDev ? [{ role: 'toggleDevTools', label: 'ابزار توسعه' }] : []),
      ],
    },
    {
      label: 'راهنما',
      submenu: [
        {
          label: 'درباره برنامه',
          click: () => dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'درباره برنامه',
            message: 'DEPO',
            detail: `نسخه ${app.getVersion()}\nالکترون ${process.versions.electron}`,
            buttons: ['باشه'],
          }),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/* ------------------------------------------------------------------ */
/* IPC                                                                 */
/* ------------------------------------------------------------------ */

ipcMain.handle('data:load', async () => {
  const result = await initStore();
  return { status: result.status, data: store, message: result.message };
});

// Only for the collections nobody else writes concurrently (stoneTypes,
// settings, waybills, contracts, machines, blades, operators). `stones` and
// `cuttingForms` are deliberately dropped from whatever the renderer sends —
// those two are owned exclusively by the pallets:*/cuttingForms:* channels
// below, so a desktop save can never clobber something a mobile client just
// added while the renderer's own copy was a moment stale.
ipcMain.handle('data:save', async (_event, data) => {
  try {
    await initStore();
    store = {
      ...store,
      stoneTypes: Array.isArray(data?.stoneTypes) ? data.stoneTypes : store.stoneTypes,
      settings: data?.settings && typeof data.settings === 'object' ? data.settings : store.settings,
      waybills: Array.isArray(data?.waybills) ? data.waybills : store.waybills,
      contracts: Array.isArray(data?.contracts) ? data.contracts : store.contracts,
      machines: Array.isArray(data?.machines) ? data.machines : store.machines,
      blades: Array.isArray(data?.blades) ? data.blades : store.blades,
      operators: Array.isArray(data?.operators) ? data.operators : store.operators,
    };
    return await enqueueSave(store);
  } catch (error) {
    console.error('Save failed:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('pallets:save', async (_event, payload) => { await initStore(); return savePalletStones(payload); });
ipcMain.handle('pallets:set-invoice', async (_event, payload) => { await initStore(); return setInvoiceForPallets(payload); });
ipcMain.handle('pallets:clear-invoice', async (_event, payload) => { await initStore(); return setInvoiceForPallets({ ...payload, invoice: '' }); });
ipcMain.handle('pallets:delete', async (_event, payload) => { await initStore(); return deletePalletByNumber(payload); });

ipcMain.handle('cutting-forms:save', async (_event, payload) => { await initStore(); return saveCuttingFormRecord(payload); });
ipcMain.handle('cutting-forms:delete', async (_event, payload) => { await initStore(); return deleteCuttingFormById(payload); });

ipcMain.handle('app:info', () => ({
  version: app.getVersion(),
  dataPath: userPath(DATA_FILE),
}));

ipcMain.handle('app:network-info', () => {
  const address = getLanAddress();
  return address && boundPort ? { url: `http://${address}:${boundPort}`, address, port: boundPort } : { url: null };
});

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

// Two copies of the app writing to the same JSON file would silently lose
// records, so a second launch just focuses the window that already exists.
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });

  app.whenReady().then(async () => {
    await initStore();
    httpServer = await startMobileServer(MOBILE_PORT);
    buildMenu();
    createTray();
    createWindow();
  });

  // Quit is held until the write queue drains, so the last edit is never lost.
  app.on('before-quit', (event) => {
    if (pendingSaves === 0 && !httpServer) return;
    event.preventDefault();
    flushSaves().finally(() => {
      if (httpServer) httpServer.close();
      httpServer = null;
      app.exit(0);
    });
  });

  // Closing the window does NOT stop the app: the LAN server that mobile
  // devices depend on keeps running in the background (visible as the tray
  // icon) until "خروج کامل" is chosen from the tray menu, or the OS shuts
  // down. This is what makes the mobile pages independent of the desktop
  // window being open.
  app.on('window-all-closed', () => {
    // Intentionally does nothing — see comment above.
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  dialog.showErrorBox('خطای غیرمنتظره', String(error?.message || error));
});
