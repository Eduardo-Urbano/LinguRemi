import { isUserLogged, logout, updateAuthLinks } from "./auth.js";

window.addEventListener("DOMContentLoaded", () =>{
    isUserLogged();
    updateAuthLinks();
})