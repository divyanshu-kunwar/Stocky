// import the required libraries
const electron = require('electron')
const { ipcRenderer } = electron

// let all the html elements be loaded first
window.addEventListener('DOMContentLoaded', () => {

    // ------ change between login and register button ---------------

    const open_login_btn = document.getElementById("already_account")
    const open_reg_btn = document.getElementById("need_account")
    const login_card = document.getElementById("login_card")
    const reg_card = document.getElementById("registration_card")

    open_login_btn.addEventListener("click", ()=>{
        login_card.style.display = "block"
        reg_card.style.display = "none"
        // Added basic animation keyframe
        login_card.animate([
            {opacity: '0'},
            {transform: 'translateX(60px)'},
            {transform: 'translateX(0px)'},
        ],{
            duration: 500
        });

        reg_card.animate([
            {opacity: '1'},
            {transform: 'translateX(0px)'},
            {transform: 'translateX(60px)'},
        ],{
            duration: 1000
        });



    })
    open_reg_btn.addEventListener("click", ()=>{
        login_card.style.display = "none"
        reg_card.style.display = "block"
        // Added basic animation keyframe
        login_card.animate([
            {opacity: '1'},
            {transform: 'translateX(0px)'},
            {transform: 'translateX(60px)'},
        ],{
            duration: 1000
        });

        reg_card.animate([
            {opacity: '0'},
            {transform: 'translateX(60px)'},
            {transform: 'translateX(0px)'},
        ],{
            duration: 500
        });


    })


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

})