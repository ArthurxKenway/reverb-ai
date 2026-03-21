const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  quitApp: () => ipcRenderer.send('quit-app'),
  onStartupVideoFinished: () => ipcRenderer.send('startup-video-finished')
});


