import pymysql
class CONEXION():
    def __init__(self, host, port, user, passwd, db):
        self.__host = host
        self.__port = port
        self.__user = user
        self.__passwd = passwd
        self.__db = db

    def __crear_conexion(self):
        try:
            conn = pymysql.connect(
                host=self.__host,
                port=int(self.__port),
                user = self.__user,
                passwd=self.__passwd,
                db=self.__db
            )
        except Exception as e:
            return print(f"Error:{e}")
        return conn if(conn) else "Error"
    
    def consultar_db(self, consulta):
        #creamos conexion
        conn = self.__crear_conexion()
        cursor1 = conn.cursor()
        #ejecutar consulta
        cursor1.execute(consulta)
        #obtenemos resultados
        resultado = cursor1.fetchall()
        #cerramos la conexion
        conn.close()
        cursor1.close()
        return resultado
