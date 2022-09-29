<a name="readme-top"></a>

<h1 align="center"> URL-Shortener </h1> 

 <!-- PROJECT SHIELDS -->
[![Status][status-shield]][status-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de contenidos</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del proyecto</a>
      <ul>
        <li><a href="#construido-con">Construido con</a></li>
      </ul>
    </li>
    <li>
      <a href="#comenzando">Comenzando</a>
      <ul>
        <li><a href="#prerequisitos">Prerequisitos</a></li>
        <li><a href="#instalacion">Instalacion</a></li>
      </ul>
    </li>
    <li><a href="#modo-de-uso">Modo de Uso</a></li>
    <li><a href="#contacto">Contacto</a></li>
    <li><a href="#logica-de-funcionamiento">Logica de Funcionamiento</a></li>
    <li><a href="#implementacion-a-gran-escala">Implementacion a gran escala</a></li>
  </ol>
</details>

<!-- ABOdUT THE PROJECT -->
## Acerca del Proyecto

Programa diseñado para acortar urls, almacenando en MongoDB, las urls pequeñas generadas. Y luego al introducir las urs pequeñas, redireccionar a la url original, contando las visitas.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Construido con

* NodeJS
* Express
* short-unique-id
* MongoDB
* Moongose
* Dotenv

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Comenzando

### Prerequisitos

Es necesario que tener los siguientes programas instalados:
* NodeJs [https://nodejs.org/es/download/](https://nodejs.org/es/download/)
* MongoDB [https://www.mongodb.com/try/download/community2](https://www.mongodb.com/try/download/community2)
* MongoDB Compass [https://www.mongodb.com/try/download/compass2] (https://www.mongodb.com/try/download/compass2)
* Postman [https://www.postman.com/downloads/] (https://www.postman.com/downloads/)

### Instalacion

Una vez instalados los programas requeridos, procedemos a instalar los paquetes/modulos necesarios para nuestro programa funcione.

1. Clonar el repositorio
   ```sh
   git clone https://github.com/Bila82/url-shortener.git
   ```
2. Instalar los paquetes NPM necesarios
   ```sh
   npm install
   ```
3. Configurar las variables necesarias en `enviroment\.env`
   ```js
    DATABASE=mongodb://localhost:27017
    HOME=http://localhost
    PORT=3333
    #Cuando tengamos un F5, deberiamos apuntar ahi
    BASEURL=http://localhost:3333
   ```
4. Ejecucion
   ```sh
   node app
   ``` 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Modo de Uso

Utilizando Postman se pueden ejecutar los siguientes llamados:

* Obtener una url corta
  Metodo POST  [http://localhost:3333/api/short] (http://localhost:3333/api/short)
  
  Body: 
  ```JSON
  {
   "longUrl": "https://open.spotify.com/"
  }
  ```
  Esto nos devolvera una url similar a:  http://localhost:3333/AUSRtIcjK 
  
* Redireccion a la Url original
  Al introducir la url generada en un navegador, seremos redireccionados a la Url original.
  
  _Nota: cada ves que utilicemos una url corta, se incrementara el contador de visitas._
  
* Borrar una url corta generada
  Metodo DELETE [http://localhost:3333/api/short/AUSRtIcjK] (http://localhost:3333/api/short/AUSRtIcjK)
  
  Esto eliminara la url corta generada.
  
* Ver el top 10 de url, con mas visitas
  Metodo GET [http://localhost:3333/api/short/top] (http://localhost:3333/api/short/top)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LOGIC -->
## Logica de Funcionamiento

A continuacion vamos a describir brevemente la logica de la aplicacion:

* Luego de recibir una url, el primer paso que se realiza, es la validacion de la misma. Utilizando una funcion que controla que la url cumpla con una expresion regular.

_NOTA: Esto se puede reemplazar por una funcion que valide que la url exista, pero dicha funcion agregaria tiempo de consulta y verificacion. Se podria utilizar el paquete: url-exist [https://www.npmjs.com/package/url-exist](https://www.npmjs.com/package/url-exist)_

* Una vez que se valido la url original, el siguiente paso es verificar que dicha url, no exista en nuestra base de datos. Si existe se devuelve el registro existente, y sino se procede al siguiente paso.

* Si la url no existe, procedemos a crear un nuevo codigo UUID, utilizando la libreria short-unique-id [https://shortunique.id/](https://shortunique.id/).

_NOTA: Esto se puede reemplazar por las siguientes librerias que se encargan de encriptar y desencriptar en BASE64 la url recibida. Se encripta con la libreria "btoa" [https://www.npmjs.com/package/btoa](https://www.npmjs.com/package/btoa). Y luego para la consulta se desencripta con la libreria "atob" [https://www.npmjs.com/package/atob](https://www.npmjs.com/package/atob).
Existe la posibilidad, que tanto el codigo generado con short unique id, como el encriptado con BASE64, se repita en algun momento, con lo cual seria bueno, validarlo con los registros en la Base de Datos_

* Lo que sigue luego de generar el codigo UUID o la encriptacion, es proceder a guardar en la base de Datos MongoDB, nuestro objeto JSON, cuyos campos mas importantes son la url original, y la url pequeña.

_NOTA: El guardado del objeto JSON se realiza utilizando el paquete Moongose, que permite el modelado de objetos (esquemas) con conexion a MongoDB._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- IMPLEMENTATION -->
## Implementacion a gran escala

Si bien el fuerte de NodeJS es su capacidad para manejar muchos eventos, (gestion simultanea de eventos). Si se piensa a gran escala, en una gran cantidad de usuarios conectados, que realicen multiples consultas de manera simultanea, es probable que una sola instancia de la aplicacion no de abasto.

Por lo cual algunas sugerencias, a tener en cuenta son las siguientes:

* Utilizar Cache: Esto permite almacenar consultas reiterativas a base de datos y evitar llamadas recurrentes, como por ejemplo Varnish [(https://varnish-cache.org/docs/index.html)](https://varnish-cache.org/docs/index.html), con lo cual mejoraria la velocidad de respuesta.

* Utilizar un Balanceador de Carga: Si se configura un balanceador de carga, que apunte a multiples instancias de la aplicacion, esto permitiria incrementar la cantidad de consultas, sin impactar negativamente en la performance. Nginx [https://www.nginx.com/](https://www.nginx.com/) o HAProxy [http://www.haproxy.org/](http://www.haproxy.org/).

* Utilizar una base de datos en memoria: Si bien MongoDB, es una gran opcion, comparando su performance contra bases relacionales (para este caso en particular de objetos). Es posible mejorar aun mas el tiempo de respuesta utilizando una base en memoria como REDIS [https://redis.io/docs/getting-started/](https://redis.io/docs/getting-started/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contacto

Arnaldo Bilancieri -  arnaldobilancieri@gmail.com

Link del Proyecto: [https://github.com/Bila82/url-shortener](https://github.com/Bila82/url-shortener)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS-->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[status-shield]: https://img.shields.io/badge/Status-Finalizado-green
[status-url]: Finalizado
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/arnaldo-gabriel-bilancieri-99b24011/
