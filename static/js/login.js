//importamos listas

import { RUTAS } from "./listas.js";
//obtencion de variables de usuario
const user = document.querySelector("#username")
const pass = document.querySelector("#password")
const benviar =  document.querySelector(".bEnviarL") 
//funcion para enviar json a servidor
function consulta_fetch(ruta, data) {
    return fetch(ruta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(response =>{
            return response.json()
        });
}

benviar.addEventListener("click", (e)=>{
    e.preventDefault();
    let data = {
        duser:user.value,
        dpass:pass.value
    }
    consulta_fetch(RUTAS.crear, data)
    .then(data=>{
        console.log(data)
        window.location.href = "/";
    })
});

