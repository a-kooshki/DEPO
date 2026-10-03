const { contextBridge, ipcRenderer } = require('electron');

// Only these calls cross the boundary. The renderer never gets access to
// `require`, the file system, or ipcRenderer itself.
contextBridge.exposeInMainWorld('electronAPI', {
  loadData: () => ipcRenderer.invoke('data:load'),
  saveData: (data) => ipcRenderer.invoke('data:save', data),
  appInfo: () => ipcRenderer.invoke('app:info'),
  getNetworkInfo: () => ipcRenderer.invoke('app:network-info'),

  // Pallets and cutting forms go through dedicated operations (not the
  // whole-document saveData above) because mobile browsers on the LAN can be
  // writing to the very same collections at the same time — see the comment
  // above the canonical store in electron/main.cjs.
  savePallet: (payload) => ipcRenderer.invoke('pallets:save', payload),
  setPalletInvoice: (payload) => ipcRenderer.invoke('pallets:set-invoice', payload),
  clearPalletInvoice: (payload) => ipcRenderer.invoke('pallets:clear-invoice', payload),
  deletePallet: (payload) => ipcRenderer.invoke('pallets:delete', payload),

  saveCuttingForm: (payload) => ipcRenderer.invoke('cutting-forms:save', payload),
  deleteCuttingForm: (payload) => ipcRenderer.invoke('cutting-forms:delete', payload),

  // Fires whenever `stones` or `cuttingForms` change for ANY reason — a
  // desktop save, or a mobile submission from someone else on the network.
  // Returns an unsubscribe function.
  onLiveUpdate: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('data:live-update', handler);
    return () => ipcRenderer.removeListener('data:live-update', handler);
  },
});
