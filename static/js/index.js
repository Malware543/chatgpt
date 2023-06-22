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
        .then(response => {
            return response.json()
        });
}

function crear_contenedores(padre, role, textarea, time) {
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

function llenado_div(div_tablas) {
    let fragmento1 = document.createDocumentFragment();
    for (let i = 0; i < LISTAS.TABLAS.length; i++) {
        let ii = document.createElement("i");
        let fragmento = document.createDocumentFragment();
        let cbox = document.createElement("input");
        let label = document.createElement("label");
        cbox.setAttribute("type", "radio");
        cbox.setAttribute("name", "tablas");
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

function generar_consultas() {
    const div_filtro = document.getElementById("filtros");
    const consulta = document.querySelector("input[name='consultas']:checked");
    const tabla = document.querySelector("input[name='tablas']:checked")
    console.log(consulta.value)
    if (consulta.value != "Informacion_municipio") {
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
        year.setAttribute("type", "text");
        year.setAttribute("placeholder", "Ingrese el año");
        id.setAttribute("type", "text");
        id.setAttribute("placeholder", "Ingrese el id");
        temperatura.setAttribute("type", "text");
        temperatura.setAttribute("placeholder", "Ingrese Precisión");
        //dar propiedades label
        label1.textContent = "Año";
        label2.textContent = "Id";
        label3.textContent = "Precisión"
            //botones
        boton.setAttribute("type", "button");
        boton.setAttribute("id", "bfiltros");
        borrar.setAttribute("type", "button");
        borrar.setAttribute("id", "borrar");
        boton.textContent = "Guardar";
        borrar.textContent = "Borrar";
        //agregar elementos
        div_filtro.appendChild(label1);
        div_filtro.appendChild(year);
        div_filtro.appendChild(label2);
        div_filtro.appendChild(id);
        //div_filtro.appendChild(label3);
        //div_filtro.appendChild(temperatura);
        div_filtro.appendChild(boton);
        div_filtro.appendChild(borrar);
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            let tipo = "";
            let valor = consulta.value;
            if (tabla.value.includes("Tpobreza")) {
                tipo = tabla.value;
            } else {
                //encontramos la tabla para la consulta
                for (let i = 0; i < LISTAS.TABLAS.length; i++) {
                    if (valor.includes(LISTAS.TABLAS[i].toLowerCase())) {
                        tipo = LISTAS.TABLAS[i];
                    }

                }
            }
            console.log(tipo)


            let data = {
                tipo: tipo,
                consulta: consulta.value,
                year: year.value,
                id: id.value
            }
            consulta_fetch(LISTAS.RUTAS[4], data)
                .then(data => {
                    sessionStorage.setItem("consulta", data.data);
                });
        });
        //agregado de evento para el boton de borrar
        //borra la informacion de la consulta, ademas de eliminar los
        //elementos de los demas divs
        borrar.addEventListener("click", (e) => {
            e.preventDefault();
            //eliminamos elementos del contenedor de consulta
            let ii = document.querySelectorAll(".i");
            for (let i = 0; i < ii.length; i++) ii[i].remove();
            document.querySelector("#bconsultas").remove();
            //eliminamos elementos del contenedor de filtro
            label1.remove();
            year.remove();
            label2.remove();
            id.remove();
            boton.remove();
            borrar.remove();
            //eliminamos la consulta de la sesion
            sessionStorage.removeItem("consulta");
        });
    } else {
        let boton = document.createElement("button");
        let borrar = document.createElement("button");
        //botones
        boton.textContent = "Guardar";
        borrar.textContent = "Borrar";
        boton.setAttribute("type", "button");
        boton.setAttribute("id", "bfiltros");
        borrar.setAttribute("type", "button");
        borrar.setAttribute("id", "borrar");
        div_filtro.appendChild(boton);
        div_filtro.appendChild(borrar);

        boton.addEventListener("click", (e) => {
            e.preventDefault();
            let data = {
                tipo: "Municipio",
                consulta: input.value,
                year: 0,
                id: ""
            }
            consulta_fetch(LISTAS.RUTAS[4], data)
                .then(data => {
                    sessionStorage.setItem("consulta", data.data);
                });
        });

        //agregado de evento para el boton de borrar
        //borra la informacion de la consulta, ademas de eliminar los
        //elementos de los demas divs
        borrar.addEventListener("click", (e) => {
            e.preventDefault();
            //eliminamos elementos del contenedor de consulta
            let ii = document.querySelectorAll(".i");
            for (let i = 0; i < ii.length; i++) ii[i].remove();
            document.querySelector("#bconsultas").remove();
            //eliminamos elementos del contenedor de filtro
            boton.remove();
            borrar.remove();
            //eliminamos la consulta de la sesion
            sessionStorage.removeItem("consulta");
        });
    }
}

function get_time() {
    let fecha = new Date();
    let hora = fecha.getHours();
    let mintos = fecha.getMinutes();
    let segundos = fecha.getSeconds();
    let dia = fecha.getDay();
    let mes = fecha.getMonth();
    let year = fecha.getFullYear();
    return dia + "-" + mes + "-" + year + " " + hora + ":" + mintos + ":" + segundos;
}

// contenedor del chat
const chat = document.querySelector("#chat");
const input = document.querySelector(".mensaje");
const div_tablas = document.querySelector("#tablas");
// boton de envio
const boton_envio = document.querySelector(".bEnviar");
// agregar evento a boton_envio
boton_envio.addEventListener("click", (e) => {
    e.preventDefault();
    // valor de texarea
    let textarea = document.querySelector(".mensaje").value;
    crear_contenedores(chat, "User", textarea, get_time());
    let botones_radio = document.querySelector("input[name='tablas']:checked");
    let extra_data = "";
    let configuracion = "";
    if (sessionStorage.getItem("consulta") != "") {
        extra_data = sessionStorage.getItem("consulta");
        configuracion = sessionStorage.getItem("configuracion");
        textarea += ":\n" + `${extra_data}\n ademas usa esta configuracion:${configuracion}`;
    } else {
        extra_data = "";
    }
    console.log(botones_radio.value);
    //solicitamos respuesta
    let data = {
        role: "user",
        msg: textarea
    }
    consulta_fetch(LISTAS.RUTAS[2], data)
        .then(data => {
            console.log("ok:" + data.msg);
            console.log("ok:" + data.date);
            crear_contenedores(chat, "Assistant", data.msg, data.date);
        });

    document.querySelector(".mensaje").value = "";
});
//programacion de evento del input para el envio de mensajes;
input.addEventListener("keydown", (e) => {
    //tecla enter
    if (event.keyCode == 13) {
        e.preventDefault();
        // valor de texarea
        let textarea = document.querySelector(".mensaje").value;
        //creamos el contenedor de nuestro mensaje enviado
        crear_contenedores(chat, "User", textarea, get_time());
        //variables auxiliares
        let extra_data = "";
        let configuracion = "";
        //si el item de la consulta esta vacio entoces no envia la informacion adicional
        if (sessionStorage.getItem("consulta") != "") {
            extra_data = sessionStorage.getItem("consulta");
            configuracion = sessionStorage.getItem("configuracion");
            textarea += ":\n" + `${extra_data}\n ademas usa esta configuracion:${configuracion}`;
        } else {
            extra_data = "";
        }
        //creamos diccionario de la informacion a enviar
        let data = {
            role: "user",
            msg: textarea
        }
        //solicitamos respuesta
        consulta_fetch(LISTAS.RUTAS[2], data)
            .then(data => {
                //creamos el contenedor de la respuesta de chatgpt
                crear_contenedores(chat, "Assistant", data.msg, data.date);
            });
        //limpiamos el textarea para enviar otro mensaje
        document.querySelector(".mensaje").value = "";
    }
});


window.addEventListener("load", (e) => {
    llenado_div(div_tablas);
});

setTimeout(() => {
    const boton_tablas = document.querySelector("#btablas");
    boton_tablas.addEventListener("click", (e) => {
        e.preventDefault();
        let botones_radio = document.querySelector("input[name='tablas']:checked");
        let data = {
            "tabla": botones_radio.value
        }
        consulta_fetch(LISTAS.RUTAS[3], data)
            .then(data => {
                console.log(data.columnas[0][0]);
                let respuesta = data.columnas[0][0];
                let columnas = respuesta.split(",");
                let div_columnas = document.querySelector("#consultas");
                let fragmento = document.createDocumentFragment();
                let arreglo = [];
                //seleccion de arreglos
                if (botones_radio.value == LISTAS.TABLAS[0]) {
                    arreglo = CONSULTAS.APOYOS;
                } else if (botones_radio.value == LISTAS.TABLAS[1]) {
                    arreglo = CONSULTAS.DELINCUENCIA;
                } else if (botones_radio.value == LISTAS.TABLAS[2]) {
                    arreglo = CONSULTAS.MUNICIPIO;
                } else if (botones_radio.value == LISTAS.TABLAS[3]) {
                    arreglo = CONSULTAS.PADRON;
                } else if (botones_radio.value == LISTAS.TABLAS[4]) {
                    arreglo = CONSULTAS.POBREZA;
                } else if (botones_radio.value == LISTAS.TABLAS[5]) {
                    arreglo = CONSULTAS.VOTOS;
                }
                // creacion de contenedor de consultas
                for (let i = 0; i < arreglo.length; i++) {
                    let ii = document.createElement("i");
                    let radio = document.createElement("input");
                    let label = document.createElement("label");
                    ii.setAttribute("class", "i");
                    radio.setAttribute("type", "radio");
                    radio.setAttribute("name", "consultas");
                    radio.setAttribute("value", arreglo[i]);
                    //_ reemplazarlos por un espacio
                    label.textContent = `${arreglo[i].replaceAll("_", " ")}`;
                    ii.appendChild(radio);
                    ii.appendChild(label);
                    fragmento.appendChild(ii);
                }
                //
                let boton = document.createElement("button");
                boton.setAttribute("type", "button");
                boton.setAttribute("id", "bconsultas");
                boton.textContent = "Enviar"
                fragmento.appendChild(boton);
                div_columnas.appendChild(fragmento);
                console.log(columnas);
                let benvio = document.getElementById("bconsultas");
                benvio.addEventListener("click", (e) => {
                    e.preventDefault();
                    generar_consultas();
                    console.log("presionado");
                });
            });
    });
}, 1000);

// AUTO SCROLL AQUI SJSJSJSJSJJSJSJSJS
const chatContainer = document.getElementById('chat');
const mensajeTxt = document.getElementById('mensajeTxt');

chatContainer.addEventListener('click', (e) => {
    e.preventDefault();
    const nuevoMensaje = mensajeTxt.value;

    chatContainer.textContent += nuevoMensaje + '\n';

    chatContainer.scrollTop = chatContainer.scrollHeight;

    mensajeTxt.value = '';
});

// creacion de ventana flotante
const boton_configuracion = document.querySelector(".boton_configuracion");
boton_configuracion.addEventListener("click", (e) => {
    e.preventDefault();
    //oscurecer pantalla
    let oscurecer = document.querySelector(".opaco");
    oscurecer.classList.add("activo");
    //crear titulo para la ventana
    let titulo = document.createElement("h3");
    //caracteristicas para titulo
    titulo.setAttribute("class", "titulo_f");
    titulo.textContent = "Configuraciones avanzadas";
    //crear contenedor de ventana
    let contenedor_ventana = document.createElement("div");// contenedor principal
    let contenedor_ventana_i = document.createElement("div");// contenedor de inputs
    let contenedor_ventana_c = document.createElement("div");// contenedor de cabecera 
    let contenedor_ventana_p = document.createElement("div"); //contenedor de pie de pag
    //agregar caracteristicas al div
    contenedor_ventana.setAttribute("class", "flotante");
    contenedor_ventana_i.setAttribute("class", "flotante_i");
    contenedor_ventana_c.setAttribute("class", "flotante_c");
    contenedor_ventana_p.setAttribute("class", "flotante_p");
    //creacion de botones de ventana
    let boton_cerrar = document.createElement("button");
    let boton_configurar = document.createElement("button");
    let boton_cancelar = document.createElement("button");
    let boton_eliminar = document.createElement("button");
    //agregar caracteristicas
    boton_cerrar.setAttribute("class", "boton_cerrar");
    boton_configurar.setAttribute("class", "boton_configurar");
    boton_cancelar.setAttribute("class", "boton_cancelar");
    boton_eliminar.setAttribute("class", "boton_eliminar");
    //textos
    boton_cerrar.textContent = "X";
    boton_cancelar.textContent = "Cancelar";
    boton_configurar.textContent = "Configurar";
    boton_eliminar.textContent = "Eliminar Config";
    //crear inputs para parametros
    let temperatura, diversity_penalty, max_tokens, top_k, top_p, repetition_penalty,
        length_penalty, seed, prompt_importance;
    // crear elementos tipo input para la ventana
    temperatura = document.createElement("input");
    diversity_penalty = document.createElement("input");
    max_tokens = document.createElement("input");
    top_k = document.createElement("input");
    top_p = document.createElement("input");
    repetition_penalty = document.createElement("input");
    length_penalty = document.createElement("input");
    seed = document.createElement("input");
    prompt_importance = document.createElement("input");
    //agregar caracteristicas, clases
    temperatura.setAttribute("class", "input_configuracion");
    temperatura.setAttribute("id", "temperatura");
    diversity_penalty.setAttribute("class", "input_configuracion");
    diversity_penalty.setAttribute("id", "diversity_penalty");
    max_tokens.setAttribute("class", "input_configuracion");
    max_tokens.setAttribute("id", "max_tokens");
    top_k.setAttribute("class", "input_configuracion");
    top_k.setAttribute("id", "top_k");
    top_p.setAttribute("class", "input_configuracion");
    top_p.setAttribute("id", "top_p");
    repetition_penalty.setAttribute("class", "input_configuracion");
    repetition_penalty.setAttribute("id", "repetition_penalty");
    length_penalty.setAttribute("class", "input_configuracion");
    length_penalty.setAttribute("id", "length_penalty");
    seed.setAttribute("class", "input_configuracion");
    seed.setAttribute("id", "seed");
    prompt_importance.setAttribute("class", "input_configuracion");
    prompt_importance.setAttribute("id", "prompt_importance");
    //agregar placeholder
    temperatura.setAttribute("placeholder", "Ingrese la precisión");
    diversity_penalty.setAttribute("placeholder", "Ingrese la penalización de diversidad");
    max_tokens.setAttribute("placeholder", "Ingrese el máximo de tokens");
    top_k.setAttribute("placeholder", "Ingrese la diversidad de k");
    top_p.setAttribute("placeholder", "Ingrese el muestreo de nucleos");
    repetition_penalty.setAttribute("placeholder", "Ingrese la penalización de repetición");
    length_penalty.setAttribute("placeholder", "Ingrese la penalización de longitud");
    seed.setAttribute("placeholder", "Ingrese la semilla");
    prompt_importance.setAttribute("placeholder", "Ingrese la importancia del prompt");
    // agregar elementos al div de los inputs
    contenedor_ventana_i.appendChild(temperatura);
    contenedor_ventana_i.appendChild(diversity_penalty);
    contenedor_ventana_i.appendChild(max_tokens);
    contenedor_ventana_i.appendChild(top_k);
    contenedor_ventana_i.appendChild(top_p);
    contenedor_ventana_i.appendChild(repetition_penalty);
    contenedor_ventana_i.appendChild(length_penalty);
    contenedor_ventana_i.appendChild(seed);
    contenedor_ventana_i.appendChild(prompt_importance);
    //agregamos botones a cabecera
    contenedor_ventana_c.appendChild(titulo);
    contenedor_ventana_c.appendChild(boton_cerrar);
    //agregamos botones a pie de pag
    contenedor_ventana_p.appendChild(boton_cancelar);
    contenedor_ventana_p.appendChild(boton_eliminar);
    contenedor_ventana_p.appendChild(boton_configurar);
    //agregamos al contenedor principal
    contenedor_ventana.appendChild(contenedor_ventana_c);
    contenedor_ventana.appendChild(contenedor_ventana_i);
    contenedor_ventana.appendChild(contenedor_ventana_p);
    
    document.querySelector("body").appendChild(contenedor_ventana);

    // programacion de eventos para botones de cnacelar y cerrar
    boton_cerrar.addEventListener("click", (e)=>{
        e.preventDefault();
        contenedor_ventana.remove();
        oscurecer.classList.remove("activo");
    });
    boton_cancelar.addEventListener("click", (e)=>{
        e.preventDefault();
        contenedor_ventana.remove();
        oscurecer.classList.remove("activo");
    });
    //programacion de evento de boton eliminar configuracion
    boton_eliminar.addEventListener("click", (e)=>{
        e.preventDefault();
        sessionStorage.removeItem("configuracion");
    });
    //agregar evento a boton de configurar
    boton_configurar.addEventListener("click", (e)=>{
        e.preventDefault();
        //seleccionamos todos los inputs de la ventana
        let inputs = document.querySelectorAll(".input_configuracion");
        //filtramos los inputs que tengan valores diferentes de nulo
        let valores = Array.from(inputs).filter(item=>{
            if(item.value != null) return item.value
        });
        //variable para guardar la configuracion
        let configuracion = "";
        //creamos la cadena de configuracion
        for (let i = 0; i < valores.length; i++) configuracion += ` ${valores[i].id}:${valores[0].value}`;
        //guardamos el item de configuracion de la sesion
        sessionStorage.setItem("configuracion", configuracion);
        console.log(sessionStorage.getItem("configuracion"));
    });
});
//creacion de variables de sesion
function inicializar_sesion(){
    sessionStorage.setItem("configuracion", "");
    sessionStorage.setItem("");
}