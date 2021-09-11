// import the required libraries
const electron = require('electron')
const { ipcRenderer } = electron

// let all the html elements be loaded first
window.addEventListener('DOMContentLoaded', () => {

    // ------ some constants
    const email_reg = document.getElementById("email_reg_input")
    const username_reg = document.getElementById("username_reg_input")
    const password_reg = document.getElementById("password_reg_input")
    const year_input = document.getElementById("dob_Y_reg_input")
    const month_input = document.getElementById("dob_M_reg_input")
    const date_input = document.getElementById("dob_D_reg_input")
    const continue_reg = document.getElementById("continue_btn")

    const email_login = document.getElementById("email_input")
    const password_login = document.getElementById("password_input")
    const login_btn = document.getElementById("log_in_btn")

    const email_forget = document.getElementById("email_forget_input");
    const recover_btn = document.getElementById("recover_btn"); 

    // ------ change between login , forget password and register button ------------

    const open_login_btn = document.getElementById("already_account")
    const open_reg_btn = document.getElementById("need_account")
    const open_forget_pass_btn = document.getElementById("password_forget")
    const open_login_btn2 = document.getElementById("account_exist")
    const login_card = document.getElementById("login_card")
    const reg_card = document.getElementById("registration_card")
    const forget_card = document.getElementById("forget_password_card")
    const privacy_policy_card = document.getElementById("Privacy-Policy");

    //login button in registration dialog 
    open_login_btn.addEventListener("click", () => {
        login_card.style.display = "block"
        reg_card.style.display = "none"
        // Added basic animation keyframe
        login_card.animate([
            { opacity: '0' },
            { transform: 'translateX(60px)' },
            { transform: 'translateX(0px)' },
        ], {
            duration: 500
        })

        reg_card.animate([
            { opacity: '1' },
            { transform: 'translateX(0px)' },
            { transform: 'translateX(60px)' },
        ], {
            duration: 1000
        })



    })
    //registration button in login dialog
    open_reg_btn.addEventListener("click", () => {
        login_card.style.display = "none"
        reg_card.style.display = "block"
        // Added basic animation keyframe
        login_card.animate([
            { opacity: '1' },
            { transform: 'translateX(0px)' },
            { transform: 'translateX(60px)' },
        ], {
            duration: 1000
        })

        reg_card.animate([
            { opacity: '0' },
            { transform: 'translateX(60px)' },
            { transform: 'translateX(0px)' },
        ], {
            duration: 500
        })


    })
    //forget button in login dialog
    open_forget_pass_btn.addEventListener("click", () => {


        login_card.style.display = "none"
        forget_card.style.display = "block"
        // Added basic animation keyframe
        login_card.animate([
            { opacity: '1' },
            { transform: 'translateX(0px)' },
            { transform: 'translateX(60px)' },
        ], {
            duration: 1000
        })

        forget_card.animate([
            { opacity: '0' },
            { transform: 'translateX(60px)' },
            { transform: 'translateX(0px)' },
        ], {
            duration: 500
        })

    })
    // remembered password button in forget dialog
    open_login_btn2.addEventListener("click", () => {

        login_card.style.display = "block"
        forget_card.style.display = "none"
        // Added basic animation keyframe
        login_card.animate([
            { opacity: '0' },
            { transform: 'translateX(60px)' },
            { transform: 'translateX(0px)' },
        ], {
            duration: 500
        })

        forget_card.animate([
            { opacity: '1' },
            { transform: 'translateX(0px)' },
            { transform: 'translateX(60px)' },
        ], {
            duration: 1000
        })

    })

    // ------------ Log in to the app ------------------
    login_btn.addEventListener("click", () => {
        let loginInfo
        if (validateEmail(email_login.value) && password_login.value != "") {
            loginInfo = { "email": email_login.value, "password": password_login.value }
        }else if(password_login.value != "") {
            loginInfo = { "username": email_login.value, "password": password_login.value }
        }
        ipcRenderer.send("main:logInApp", loginInfo)
    })

    //close the window after 5 secs of success login
    ipcRenderer.on("login_success", () => {
        send_msg("Logged in successfully")
        setTimeout(() => {
            ipcRenderer.send("main:close_login_win")
        }, 5000)

    })
    //login failed
    ipcRenderer.on("login_failed", ()=>{
        send_msg("login error email or password wrong", "#ff0000")
    })

    // -------- forget password ------------------
    recover_btn.addEventListener("click", ()=>{
        if(validateEmail(email_forget.value)){
        ipcRenderer.send("main:request_recover",email_forget.value)
        }else{
            send_msg("Enter valid email", "#ff0000")
        }
    })
    ipcRenderer.on("email_rec_sent",()=>{
        send_msg("email for recovery sent successfully","#00ff00")
    })
    ipcRenderer.on('recover_error', ()=>{
        send_msg("Unknown error: cannot recover password", "#ff0000")
    })

    //------------- validation of form ------------------

    function validateAndSubmitRegistration() {
        if (!validateEmail(email_reg.value)) {
            send_msg("Invalid Email", "#ff0000")
        } else if (!validateUsername(username_reg.value)) {
            send_msg("Username contains special"
                + "characters or has less than 3 characters", "#ff0000")
        } else if (!validatePassword(password_reg.value)) {
            send_msg("password must be 8 characters long and"
                + " contain uppercase , lowercase number and special character", "#ff0000")
        } else {
            submitForm()
        }
    }

    function submitForm() {
        let registrationInfo = { "email": email_reg.value,
                    "username":username_reg.value ,
                    "password": password_reg.value,
                    "DOB":  date_input.value+"-"+month_input.value+"-"+year_input.value}
        ipcRenderer.send("main:registerApp", registrationInfo)
    }
    
    //close the window after 5 secs of success registration
    ipcRenderer.on("registration_success", () => {
        send_msg("Registered successfully", "#00ff00")
        setTimeout(() => {
            ipcRenderer.send("main:close_login_win")
        }, 5000)

    })
    //registration failed
    ipcRenderer.on("registration_failed", ()=>{
        send_msg("Error Unknown : can't register","#ff0000")
    })
    //if user already exist
    ipcRenderer.on("username_registered", ()=>{
        send_msg("Username already exist","#ff0000")
    })
    //verify email
    ipcRenderer.on("email_reg_sent",()=>{
        send_msg("verification email sent successfully", "#ff0000")
    })

    continue_reg.addEventListener("click", () => {
        validateAndSubmitRegistration()
    })

    // check if email pattern is like string@string.string
    function validateEmail(email) {
        let re = /\S+@\S+\.\S+/
        return re.test(email)
    }

    //check to validate if password contains number as well as upper and lowercase
    function validatePassword(password) {
        let lowerCaseLetters = /[a-z]/g
        let upperCaseLetters = /[A-Z]/g
        let numbers = /[0-9]/g
        let invalidChar = "^[^#%&*:<>?/{|}]+$@_"
        let response = ""
        if (password.length < 8) {
            response += "0"
        } else {
            response += "1"
        }
        if (lowerCaseLetters.test(password)) {
            response += "1"
        }
        else {
            response += "0"
        }
        if (upperCaseLetters.test(password)) {
            response += "1"
        }
        else {
            response += "0"
        }
        if (numbers.test(password)) {
            response += "1"
        }
        else {
            response += "0"
        }
        if (!password.match(invalidChar)) {
            response += "1"
        } else {
            response += "0"
        }
        if (response == "11111") {
            console.log(response)
            return true
        }
        console.log(response)
        return false
    }

    // validates username
    function validateUsername(username) {
        let invalidChar = "^[^#%&*:<>?/{|}]+$"
        if ((!username.match(invalidChar)) || username.length < 4) {
            return false;
        }
        return true
    }

    //calculate no of days
    function calcNoOfDays(month, year) {
        let noOfDays
        if ((month == "2") && (year % 4 == 0)) {
            noOfDays = 29          //febraury leap-year
        }
        else if ((month == "2") && (year % 4 != 0)) {
            noOfDays = 28           //febraury non-leap
        } else if (month == "4" || month == "6" || month == "9" || month == "11") {
            noOfDays = 30
        } else {
            noOfDays = 31
        }
        return noOfDays
    }

    //function to append year from 1930 to 2011
    appendYears()
    function appendYears() {
        for (i = 2011; i > 1930; i--) {
            year_input.innerHTML += "<option value='" + i + "'>" + i + "</option>"
        }
    }

    // function to append dates according to month and year
    appendDates()
    function appendDates() {
        noOfDays = calcNoOfDays(month_input.value, year_input.value)
        date_input.innerHTML = ""
        for (i = 1; i < noOfDays + 1; i++) {
            date_input.innerHTML += "<option value='" + i + "'>" + i + "</option>"
        }
    }

    //check if there is some change in value of month or year
    year_input.addEventListener("change", () => {
        appendDates()
    })
    month_input.addEventListener("change", () => {
        appendDates()
    })

    // change the visibility of password maximum for 60000 milisecs i.e 1 mins
    function tooglePassword(btn_name, inputfield) {
        let toogleBtn = document.getElementById(btn_name)
        toogleBtn.addEventListener("click", () => {
            if (inputfield.getAttribute("type") == "text") {
                inputfield.setAttribute("type", "password")
                toogleBtn.setAttribute("src", "../icons/eye_on.svg")
                setTimeout(() => {
                    inputfield.setAttribute("type", "text");
                    toogleBtn.setAttribute("src", "../icons/eye_off.svg")
                }, 60000)
            } else {
                inputfield.setAttribute("type", "text");
                toogleBtn.setAttribute("src", "../icons/eye_off.svg")
            }
        })
    }
    tooglePassword("password_visibility_login", password_login)
    tooglePassword("password_visibility_reg", password_reg)


    // ------ code for minimizing and closing the Current Window ----------

    minimize_btn = document.getElementById('minimize_btn')
    close_btn = document.getElementById('close_btn')

    minimize_btn.addEventListener('click', function (e) {
        ipcRenderer.send("main:min_login_win")
    })

    close_btn.addEventListener('click', function (e) {
        ipcRenderer.send("main:close_login_win")
    })

    // --------------------------------------------------------------

    //create a pop up message box
    function send_msg(message, msg_color) {
        let msg_pop = document.getElementById("messagePop")
        console.log(message)
        msg_pop.style.display = "block"
        msg_pop.innerHTML = message
        msg_pop.style.color = msg_color
        setTimeout(() => {
            msg_pop.style.display = "none"
        }, 1500)
    }

    // show the privacy policy card
    document.getElementById("term_condition").addEventListener("click",()=>{
        privacy_policy_card.style.display = "block";
        reg_card.style.display = "none";
    })
    // hide the privacy policy card
    document.getElementById("close_privacy_policy").addEventListener("click", ()=>{
        privacy_policy_card.style.display = "none";
        reg_card.style.display = "block";
    })
    //check for internet connectivity
    setInterval(() => {
        if (!navigator.onLine) {
            document.getElementById("offline_status").style.display = "block"
            login_card.style.display = "none"
            reg_card.style.display = "none"
            forget_card.style.display = "none"
            privacy_policy_card.style.display = "none";
        } else {
            document.getElementById("offline_status").style.display = "none"
            if (login_card.style.display == "none" && reg_card.style.display == "none"
                && forget_card.style.display == "none" && privacy_policy_card.style.display == "none") {
                login_card.style.display = "block"
            }
        }
    }, 1000)
})