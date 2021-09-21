const { ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send("load_graph_data");
    ipcRenderer.on("company_data_aaya",(e,companyData) =>{
        console.log(companyData);
    })
});