# Desafío N°15
## Consigna 1
Incorporar al proyecto de servidor de trabajo la compresión gzip.

Verificar sobre la ruta /info con y sin compresión, la diferencia de cantidad de bytes devueltos en un caso y otro.

Luego implementar loggueo (con alguna librería vista en clase) que registre lo siguiente:

- Ruta y método de todas las peticiones recibidas por el servidor (info)
- Ruta y método de las peticiones a rutas inexistentes en el servidor (warning)
- Errores lanzados por las apis de mensajes y productos, únicamente (error)


### Considerar el siguiente criterio:
Loggear todos los niveles a consola (info, warning y error)

Registrar sólo los logs de warning a un archivo llamada warn.log

Enviar sólo los logs de error a un archivo llamada error.log


## Consigna 2

Luego, realizar el análisis completo de performance del servidor con el que venimos trabajando.

Vamos a trabajar sobre la ruta '/info', en modo fork, agregando ó extrayendo un console.log de la información colectada antes de devolverla al cliente. Además desactivaremos el child_process de la ruta '/randoms'

Para ambas condiciones (con o sin console.log) en la ruta '/info' OBTENER:

1) El perfilamiento del servidor, realizando el test con --prof de node.js. Analizar los resultados obtenidos luego de procesarlos con --prof-process. 
2) Utilizaremos como test de carga Artillery en línea de comandos, emulando 50 conexiones concurrentes con 20 request por cada una. 
3) Extraer un reporte con los resultados en archivo de texto.

## Resolución de las consignas

Se implementó una ruta 
```bash
http://localhost:8080/info
```

y otra en donde los recursos que entrega la misma tienen compresion 

```bash
http://localhost:8080/infozip
```
el objetivo de ambas rutas es evidenciar la compresion de los recursos de las mismas. 


