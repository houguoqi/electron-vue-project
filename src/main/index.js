import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 自定义菜单
const menuTemplate = [
  {
    label: '主页',
    click() {
      // 页面跳转方式一（推荐）
      mainWindow.webContents.send('href', '/upload-file');
      // 页面跳转方式二
      // mainWindow.loadURL(winURL+'#/index')
    }
  },
  {
    label: '我的工具',
    submenu: [
      {
        label: '压缩图片',
        click() {
          mainWindow.webContents.send('href', '/upload-file');
        }
      },
      {
        label: 'markdown便签',
        click() {
          mainWindow.webContents.send('href', '/mark-down-note');
        }
      }
    ]
  },
  {
    label: '操作',
    submenu: [
      {
        label: '最小化',
        click() {
          mainWindow.minimize()
        }
      },
      {
        label: '最大化',
        click() {
          mainWindow.maximize()
        }
      },
      {
        label: '关闭',
        click() {
          mainWindow.close()
        }
      }
    ]
  }
];
 
var Menu = require('electron').Menu;
Menu.setApplicationMenu( Menu.buildFromTemplate(menuTemplate));

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
