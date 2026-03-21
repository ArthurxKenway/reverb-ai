const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');


// Fix for Windows cache/permission errors
const userDataPath = path.join(app.getPath('userData'), '..', 'reverb-ai-data');
app.setPath('userData', userDataPath);
app.commandLine.appendSwitch('disable-gpu-cache');
app.disableHardwareAcceleration();

const isDev = !app.isPackaged;

let mainWindow;
let splash;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    show: false, 
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#000000',
    icon: path.join(__dirname, isDev ? 'public/favicon.ico' : 'dist/favicon.ico'), 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(() => console.error('Vite not running!'));
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  splash = new BrowserWindow({
    width: 1200,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  const splashPath = isDev 
    ? path.join(__dirname, 'public/splash.html') 
    : path.join(__dirname, 'dist/splash.html');
  
  splash.loadFile(splashPath);

  // FAIL-SAFE: If video doesn't trigger the close, force it after 5 seconds
  setTimeout(() => {
    if (splash && !splash.isDestroyed()) {
      showMain();
    }
  }, 5000);
}

function showMain() {
  if (splash) splash.close();
  mainWindow.show();
  mainWindow.focus();
}

ipcMain.on('startup-video-finished', showMain);
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('quit-app', () => {
  app.quit();
});


ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});



app.whenReady().then(() => {
  createWindow();
  if(process.platform === 'win32') app.setAppUserModelId('com.reverb.ai');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
