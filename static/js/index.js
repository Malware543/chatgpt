// configuracion de expansion input
// const input = document.querySelector(".mensaje");
// input.addEventListener("input",(e)=>{
//     e.preventDefault();
//     input.style.height =  'auto';
//     input.style.height =  input.scrollHeight + "px";
// })

import { LISTAS } from "./listas.js";
import { CONSULTAS } from "./listas.js";
// estructura de mensajes
/**
 * div#chat
 *      div.message + rol del mensaje
 *              div.nombre_tiempo
 *              div.contenido
 */

//funcion para enviar datos
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

function crear_contenedores(padre, role, textarea, time){
    //creamos contenedores
    let message = document.createElement("div"); 
    let nombre_tiempo = document.createElement("div");
    let contenido = document.createElement("div");
    let p_contenido = document.createElement("p");
    let fragmento = document.createDocumentFragment();
    // otorgando clases
    message.setAttribute("class", "message");
    nombre_tiempo.setAttribute("class", "nombre_tiempo");
    contenido.setAttribute("class", "contenido");
    p_contenido.setAttribute("class", "p_contenido");
    //dando hora
    nombre_tiempo.textContent = `${role} (${time})`;
    p_contenido.textContent = `${textarea}`;
    //agregar contenedores
    contenido.appendChild(p_contenido);
    fragmento.appendChild(nombre_tiempo);
    fragmento.appendChild(contenido);
    message.classList.add(`${role}`);
    message.appendChild(fragmento);
    padre.appendChild(message);
}

function llenado_div(div_tablas){
    let fragmento1 = document.createDocumentFragment();
    for (let i = 0; i < LISTAS.TABLAS.length; i++) {
        let ii = document.createElement("i");
        let fragmento = document.createDocumentFragment();
        let cbox = document.createElement("input");
        let label = document.createElement("label");
        cbox.setAttribute("type", "radio");
        cbox.setAttribute("name","tablas");
        cbox.setAttribute("value", `${LISTAS.TABLAS[i]}`);
        label.textContent = `${LISTAS.TABLAS[i]}`; 
        fragmento.appendChild(cbox);
        fragmento.appendChild(label);
        ii.appendChild(fragmento);
        fragmento1.appendChild(ii);
    }
    div_tablas.appendChild(fragmento1);
    //boton de busqueda
    let boton = document.createElement("button");
    boton.setAttribute("type", "button");
    boton.setAttribute("id", "btablas");
    boton.textContent = "Buscar";
    div_tablas.appendChild(boton);
}

function generar_consultas(){
    const div_filtro = document.getElementById("filtros");
    const consulta = document.querySelector("input[name='consultas']:checked");
    const tabla = document.querySelector("input[name='tablas']:checked")
    console.log(consulta.value)
    if(consulta.value != "Informacion_municipio"){
        //construir input
        let year = document.createElement("input");
        let id = document.createElement("input");
        let label1 = document.createElement("label");
        let label2 = document.createElement("label");
        let label3 = document.createElement("label");
        let boton = document.createElement("button");
        let borrar = document.createElement("button");
        let temperatura = document.createElement("input");
        //dar propiedades input
        year.setAttribute("type","text");
        year.setAttribute("placeholder", "Ingrese el año");
        id.setAttribute("type","text");
        id.setAttribute("placeholder", "Ingrese el id");
        temperatura.setAttribute("type", "text");
        temperatura.setAttribute("placeholder", "Ingrese Precisión");
        //dar propiedades label
        label1.textContent = "Año";
        label2.textContent = "Id";
        label3.textContent = "Precisión"
        //botones
        boton.setAttribute("type","button");
        boton.setAttribute("id","bfiltros");
        borrar.setAttribute("type", "button");
        borrar.setAttribute("id","borrar");
        boton.textContent = "Guardar";
        borrar.textContent = "Borrar";
        //agregar elementos
        div_filtro.appendChild(label1);
        div_filtro.appendChild(year);
        div_filtro.appendChild(label2);
        div_filtro.appendChild(id);
        div_filtro.appendChild(label3);
        div_filtro.appendChild(temperatura);
        div_filtro.appendChild(boton);
        div_filtro.appendChild(borrar);
        boton.addEventListener("click",(e)=>{
            e.preventDefault();
            let tipo = "";
            let valor = consulta.value;
            if(tabla.value.includes("Tpobreza")){
                tipo = tabla.value;
            } else{
                //encontramos la tabla para la consulta
                for (let i = 0; i < LISTAS.TABLAS.length; i++) {
                    if(valor.includes(LISTAS.TABLAS[i].toLowerCase())){
                        tipo = LISTAS.TABLAS[i];
                    }
                    
                }
            }
            console.log(tipo)


            let data = {
                tipo:tipo,
                consulta:consulta.value,
                year:year.value,
                id:id.value
            }
            consulta_fetch(LISTAS.RUTAS[4],data)
            .then(data=>{
                sessionStorage.setItem("consulta",data.data+"\ntemperature:"+temperatura.value);
            });
        });
        borrar.addEventListener("click",(e)=>{
            e.preventDefault();
            sessionStorage.removeItem("consulta");
        })
    } else{
        let boton = document.createElement("button");
        //botones
        boton.textContent = "Guardar"
        boton.setAttribute("type","button");
        boton.setAttribute("id","bfiltros");
        div_filtro.appendChild(boton);

        boton.addEventListener("click",(e)=>{
            e.preventDefault();
            let data = {
                tipo:"Municipio",
                consulta:input.value,
                year:0,
                id:""
            }
            consulta_fetch(LISTAS.RUTAS[4],data)
            .then(data=>{
                sessionStorage.setItem("consulta",data.data);
            });
        });
    }
}

function get_time(){
    let fecha = new Date();
    let hora = fecha.getHours();
    let mintos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
    let dia = fecha.getDay();
    let mes = fecha.getMonth();
    let year = fecha.getFullYear();
    return dia+"-"+mes+"-"+year+" "+hora+":"+mintos+":"+segundos;
}

// contenedor del chat
const chat = document.querySelector("#chat");
const input = document.querySelector(".mensaje");
const div_tablas = document.querySelector("#tablas");
// boton de envio
const boton_envio = document.querySelector(".bEnviar");
// agregar evento a boton_envio
boton_envio.addEventListener("click",(e)=>{
    e.preventDefault();
    // valor de texarea
    let textarea = document.querySelector(".mensaje").value;
    crear_contenedores(chat, "User", textarea, get_time());
    let botones_radio = document.querySelector("input[name='tablas']:checked");
    let extra_data = "";
    if(sessionStorage.getItem("consulta") != ""){
        extra_data = sessionStorage.getItem("consulta");
        textarea += ":"+`${extra_data}`;
    } else{
        extra_data = "";
    }
    console.log(botones_radio.value);
    //solicitamos respuesta
    let data = {
        role:"user",
        msg:textarea
    }
    consulta_fetch(LISTAS.RUTAS[2], data)
    .then(data =>{
        console.log("ok:"+data.msg);
        console.log("ok:"+data.date);
        crear_contenedores(chat, "Assistant", data.msg, data.date);
    });

    document.querySelector(".mensaje").value = "";
});

input.addEventListener("keydown", (e)=>{
    if(event.keyCode == 13){
        e.preventDefault();
        // valor de texarea
        let textarea = document.querySelector(".mensaje").value;
        crear_contenedores(chat, "User", textarea, get_time());
        let extra_data = "";
        if(sessionStorage.getItem("consulta") != ""){
            extra_data = sessionStorage.getItem("consulta");
            textarea += ":"+`${extra_data}`;
        } else{
            extra_data = "";
        }
        //solicitamos respuesta
        let data = {
            role:"user",
            msg:textarea
        }
        consulta_fetch(LISTAS.RUTAS[2], data)
        .then(data =>{
            crear_contenedores(chat, "Assistant", data.msg, data.date);
            
        });
    
        document.querySelector(".mensaje").value = "";
        console.log("presionado");
    }
});


window.addEventListener("load",(e)=>{
    llenado_div(div_tablas);
});

setTimeout(()=>{
    const boton_tablas = document.querySelector("#btablas");
    boton_tablas.addEventListener("click",(e)=>{
        e.preventDefault();
        let botones_radio = document.querySelector("input[name='tablas']:checked");
        let data = {
            "tabla":botones_radio.value
        }
        consulta_fetch(LISTAS.RUTAS[3],data)
        .then(data=>{
            console.log(data.columnas[0][0]);
            let respuesta = data.columnas[0][0];
            let columnas = respuesta.split(",");
            let div_columnas = document.querySelector("#consultas");
            let fragmento = document.createDocumentFragment();
            let arreglo = [];
            //seleccion de arreglos
            if(botones_radio.value == LISTAS.TABLAS[0]){
                arreglo = CONSULTAS.APOYOS;
            } else if(botones_radio.value == LISTAS.TABLAS[1]){
                arreglo = CONSULTAS.DELINCUENCIA;
            } else if(botones_radio.value == LISTAS.TABLAS[2]){
                arreglo = CONSULTAS.MUNICIPIO;
            } else if( botones_radio.value == LISTAS.TABLAS[3]){
                arreglo = CONSULTAS.PADRON;
            } else if( botones_radio.value == LISTAS.TABLAS[4]){
                arreglo = CONSULTAS.POBREZA;
            } else if( botones_radio.value == LISTAS.TABLAS[5]){
                arreglo = CONSULTAS.VOTOS;
            }

            for (let i = 0; i < arreglo.length; i++) {
                let ii = document.createElement("i");
                let radio = document.createElement("input");
                let label = document.createElement("label");
                radio.setAttribute("type","radio");
                radio.setAttribute("name","consultas");
                radio.setAttribute("value", arreglo[i]);
                label.textContent =  `${arreglo[i]}`;
                ii.appendChild(radio);
                ii.appendChild(label);
                fragmento.appendChild(ii);
            }
            let boton = document.createElement("button");
            boton.setAttribute("type", "button");
            boton.setAttribute("id", "bconsultas");
            boton.textContent = "Enviar"
            fragmento.appendChild(boton);
            div_columnas.appendChild(fragmento);
            console.log(columnas);
            let benvio = document.getElementById("bconsultas");
            benvio.addEventListener("click", (e)=>{
                e.preventDefault();
                generar_consultas();
                console.log("presionado");
            });
        });
    });
},1000);

// AUTO SCROLL AQUI SJSJSJSJSJJSJSJSJS
const chatContainer = document.getElementById('chat');
const mensajeTxt = document.getElementById('mensajeTxt');

chatContainer.addEventListener('click',(e)=>{
    e.preventDefault();
    const nuevoMensaje = mensajeTxt.value;

    chatContainer.textContent += nuevoMensaje + '\n';

    chatContainer.scrollTop = chatContainer.scrollHeight;

    mensajeTxt.value = '';
});