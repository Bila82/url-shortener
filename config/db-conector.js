const mongoose = require('mongoose');
require('dotenv').config({ path: './enviroment/.env' });

/**
* Funcion que establece la conexion de mongoose con la BD.
*/
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexion exitosa con BD');
  } catch (err) {
    console.error('Error en conexion a la BD: ' + err.message);
    process.exit(1);
  }
};

module.exports = connectToDB;