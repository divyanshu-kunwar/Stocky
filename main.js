// for getting started with electron see 
// https://www.electronjs.org/docs/latest/tutorial/quick-start#run-the-main-process

// import required libraries here
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
let login_win
// create a login windows
function createWindow() {
  login_win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    frame: false,
    transparent: true,
    // load javascript for login page
    webPreferences: {
      preload: path.join(__dirname, 'scripts/login.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    },

  })
  login_win.loadFile('html-win/login.html')
  login_win.maximize();
}

let graphWin;
//create window for graph
function createGraphWindows() {
  graphWin = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    // load javascript for login page
    webPreferences: {
      preload: path.join(__dirname, 'scripts/graphwin.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    },

  })
  graphWin.loadFile('html-win/graphwin.html')
  graphWin.maximize();
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

ipcMain.on('main:min_login_win', () => {
  login_win.minimize()
})
ipcMain.on('main:close_login_win', () => {
  login_win.close()
})


// ------------------firebase functions ------------------------------
//existing user asking for login
ipcMain.on('main:logInApp', function (e, loginInfo) {
  console.log(loginInfo);
  loginUserFirebase(loginInfo['email'], loginInfo['password'])
})

//new user asking for registration
ipcMain.on('main:registerApp', function (e, registrationInfo) {
  console.log(registrationInfo);
  if (!checkUserName(registrationInfo['username'])) {
    login_win.webContents.send("username_registered");
  } else {
    registerUserFirebase(registrationInfo['email'], registrationInfo['password'])
    addUserData(registrationInfo['username'], registrationInfo['email'], registrationInfo['DOB'])
  }
})

//asking for recovery
ipcMain.on('main:request_recover', function (e, emailId) {
  console.log("recover",emailId);
  recoverPasswordFirebase(emailId);
})

//checks if username exist in database
function checkUserName(username) {
  return true
}

const firebase = require('firebase/app')
const authentication = require('firebase/auth')
const database = require('firebase/database')

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTmLGFaxxgDaBmcoOnbQXAX3jO00xxuco",
  authDomain: "stocky-0.firebaseapp.com",
  projectId: "stocky-0",
  databaseURL:"https://stocky-0-default-rtdb.firebaseio.com/",
  storageBucket: "stocky-0.appspot.com",
  messagingSenderId: "448393168193",
  appId: "1:448393168193:web:4aad08a13be2e808318dc0",
  
}

// Initialize Firebase
const app_ = firebase.initializeApp(firebaseConfig)
const auth = authentication.getAuth()
const db = database.getDatabase()



// send all data to firebase for authentication, registration and login
function registerUserFirebase(email, password) {
  authentication.createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      login_win.webContents.send("registration_failed");
    });
}

// send all data to firebase for authentication and login
function loginUserFirebase(email, password) {
  authentication.signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      login_win.webContents.send("login_failed");
    });
}

// recover password link send
function recoverPasswordFirebase(email){
  console.log("recover",email);
  authentication.sendPasswordResetEmail(email)
  .then(() => {
    login_win.webContents.send("email_reg_sent");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    login_win.webContents.send("recover_error");
  });
}

//some more code for storing user info will be written here
function addUserData(username, email, DOB) {
  console.log("adding these info to database ", username, " email ", email, " DOB ", DOB)
  console.log("locally adding these info ", username, " email ", email, " DOB ", DOB)
}


// triggers when user sign in state is changed that is logged in or logged out
authentication.onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    const uid = user.uid;
    console.log("user signed in")
    if (user.emailVerified == false) {
      authentication.sendEmailVerification(user)
        .then(() => {
          login_win.webContents.send("email_reg_sent")
          console.log("email verification sent");
          auth.signOut()
        });
    } else {
      login_win.webContents.send("login_success")
    }
  } else {
    console.log("user signed out")
  }
});

function firebaseLoadData(){
  const companyRef = database.ref(db, 'userdata/d/1'); 
  database.get(companyRef).then((snapshot) =>{
      const companyData = snapshot.val();
      sendDataToGraph(companyData);
  }).catch((error) => {
    console.error(error);
  })
}

ipcMain.on("load_graph_data",()=>{
  firebaseLoadData();
})
function sendDataToGraph(companyData){
    graphWin.webContents.send("company_data_aaya" , companyData);
}