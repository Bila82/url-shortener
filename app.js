
require('dotenv').config({ path: './config/.env' });
const connectToDB = require('./config/db-conector');
const Express = require('Express');
const compression = require('compression');
const app = Express();

process.env.NODE_ENV = 'production';

app.use(compression()); //En teoria mejora los tiempos, pero aun no detecte una mejora significativa

connectToDB();

// Body Parser - Se utiliza para poder leer el contenido de los request
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

//Agregamos los endpoints definidos en url-controller
app.use(require('./controller/url-controller'));

// Configuramos el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto: ${PORT}`);
});

module.exports = app; // for testing