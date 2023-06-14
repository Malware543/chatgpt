from flask import Flask, render_template, request, session, jsonify, redirect, url_for, make_response
import openai, uuid, configparser
from datetime import datetime, timedelta
from librerias.conexion import CONEXION
#clave_tesjo = "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"
#clave_privada = "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"
clave_tesjo = "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"
#clave_premiun =  "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"

#arcivo de configuracion
configuracion = configparser.ConfigParser()
configuracion.read("configuracion.ini")
configuracion.sections()

#objeto de conexion
conexion = {
    "host":configuracion["database1"]["host"],
    "port":configuracion["database1"]["port"],
    "user":configuracion["database1"]["user"],
    "passwd":configuracion["database1"]["passwd"],
    "db":configuracion["database1"]["db"]
}

#arreglos
TABLAS=["Apoyos", "Delincuencia", "Municipio", "PadronElectoral","Tpobreza", "Votos"]

#api chatgpt
openai.api_key = clave_tesjo

app = Flask(__name__)
app.secret_key = "clave3"
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60) #las sessiones expiran en 1h

def crear_conversacion():
    session = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = [{"role": "assistant", "content": "You are a helpful assistant."},
                    {"role": "user", "content": "cual fue el mensaje anterior que te mande?"}]
    )
    return session

def get_time():
    return datetime.now().strftime("%d-%m-%Y %H:%M:%S")

@app.route("/enviar_conversacion", methods=["GET","POST"])
def enviar_conversacion():
    data = request.get_json()
    mensajes_api = [{"role": data["role"], "content":data["msg"]}]
    #mensajes_api = [{"role": msg["role"], "content": msg["content"]} for msg in mensajes]

    respuesta = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = mensajes_api
        #conversation_id = chat_id
    )

    return jsonify({"date":get_time(),"msg":respuesta.choices[0].message.content})

def crear_mensaje(role, mensaje):
    tiempo = datetime.now().strftime("%d-%m-%Y %H:%M:%S")        
    mensajes={"role":role,"content":mensaje,"time":tiempo,"name":"asistente"}
    return mensajes

@app.route("/",methods=["GET", "POST"])
def index():
    mensajes = []

    # user =  request.get_json()["user"]
    # assistant =  request.get_json()["assistant"]
    # mensajes.append(user)
    # mensajes.append(assistant)
    # print(mensajes)

    return render_template("index.html")

@app.route("/i", methods=["GET", "POST"])
def ind():
    mensajes = []
    if("mensajes" in session):
        mensajes = session["mensajes"]
        print(session["mensajes"])
        #session.clear()

    if(request.method ==  "POST"):
        mensaje = request.form["mensaje"]
        tiempo = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        mensajes.append({"role":"user","content":mensaje,"time":tiempo,"name":"usuario"})
        respuesta = enviar_conversacion(mensajes)
        #respuesta=""

        tiempo = datetime.now().strftime("%d-%m-%Y %H:%M:%S")        
        mensajes.append({"role":"assistant","content":respuesta,"time":tiempo,"name":"asistente"})

    session["mensajes"] = mensajes


    return render_template("index.html", mensajes=mensajes)

@app.route("/login", methods=["GET", "POST"])
def login():
    return render_template("login.html")

@app.route("/crear_sesion", methods=["POST"])
def crear_sesion():
    #verificamos que el json no este vacio
    if(request.get_json()["duser"] != ""):
        #creamos variable data
        data = request.get_json()
        #creamos id unico de usuario
        user_session_id = str(uuid.uuid4())
        #creamos un nuevo chat
        id_chat = crear_conversacion()
        #crear chat
        
        # mensajes = []
        # chats = {
        #     "chat1": mensajes
        # }
        # info_user = {
        #     "usuario":data["duser"],
        #     "id":user_session_id,
        #     "chats":chats
        # }
        # session[data["duser"]] = info_user
        print(id_chat.id)
        
    else:
        print("vacio")
        
    #respuesta =  make_response(redirect("/"))
    #respuesta.set_cookie("mensaje", id_chat.choices[0].message.content)
    mensajes = []
    mensajes.append(crear_mensaje("user","Hola!"))
    mensajes.append(crear_mensaje("assistant",id_chat.choices[0].message.content))
    #print(mensajes)
    data =  {
        "user":mensajes[0],
        "assistant": mensajes[1]
    }
    # mensajes = id_chat.choices[0].message.content
    # respuesta_json = jsonify(data)
    # respuesta = make_response(url_for("index",mensajes=mensajes))
    # respuesta.data = respuesta_json.get_data()
    # respuesta.headers['Content-type'] = "aplication/json"
    
    return jsonify(data)

@app.route("/tablas",methods=["GET","POST"])
def tablas():
    data = request.get_json()
    conn =  CONEXION(**conexion)
    respuesta = conn.consultar_db(configuracion.get("consultas", "nombres_columnas").format(tabla=str(data["tabla"]).lower()))
    return jsonify({"columnas":respuesta})

@app.route("/consultas",methods=["GET","POST"])
def consultas():
    data = request.get_json()
    conn = CONEXION(**conexion)
    respuesta = ""
    print(data)
    match(data["tipo"]):
        case "Apoyos":
            print(0)
        case "Delincuencia":
            print(1)
        case "Municipio":
            print(2)
        case "PadronElectoral":
            print(3)
        case "Tpobreza":
            print(4)
        case "Votos":
            tablas = conn.consultar_db(configuracion.get("consultas", "nombres_columnas").format(tabla=data["tipo"]))
            respuesta = conn.consultar_db(configuracion.get("consultas_votos", "votos_por_seccion").format(id=data["id"], year=data["year"]))
            numero_de_filas = len(respuesta)
            nueva_respuesta = tablas[0][0]
            nueva_respuesta = nueva_respuesta.replace(",V_VALIDOS,V_CAN_NREG,V_NULOS,TOTAL_V,LISTA_N","")+"\n"
            for i in range(0,numero_de_filas):
                nueva_respuesta += respuesta[i][0] + "\n"
            print(nueva_respuesta)
        case _:
            print("opcion no encontrada")
    
    return jsonify({"data":nueva_respuesta})

if(__name__ == "__main__"):
    
    app.run(debug=True, port=5000, host="192.168.31.194");
    