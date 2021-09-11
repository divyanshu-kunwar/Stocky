// for getting started with electron see 
// https://www.electronjs.org/docs/latest/tutorial/quick-start#run-the-main-process

// import required libraries here
const { app, BrowserWindow ,ipcMain} = require('electron');
const path = require('path')
let login_win
// create a login windows
function createWindow () {
    login_win = new BrowserWindow({
      width: 800,
      height: 600,
      resizable:true,
      frame : false,
      transparent:true,
      // load javascript for login page
      webPreferences: {
        preload: path.join(__dirname, 'scripts/login.js'),
        nodeIntegration : true,
        enableRemoteModule:true
      },

    })
    login_win.loadFile('html-win/login.html')
    login_win.maximize();
  }

// when app is ready call the function to create login window
app.whenReady().then(() => {
    createWindow()

    //  activating the app when no windows are available should open a new one one mac.
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })

  })

// when all windows are closed , make sure to quit the app on windows , linux
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on('main:min_login_win', event => {
    login_win.minimize()
})
ipcMain.on('main:close_login_win', event => {
    login_win.close()
})

// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use


// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBTmLGFaxxgDaBmcoOnbQXAX3jO00xxuco",
//   authDomain: "stocky-0.firebaseapp.com",
//   projectId: "stocky-0",
//   storageBucket: "stocky-0.appspot.com",
//   messagingSenderId: "448393168193",
//   appId: "1:448393168193:web:4aad08a13be2e808318dc0"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);