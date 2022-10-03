const crypto = require('crypto');
var base62 = require("base62/lib/ascii");

/**
* Funcion que valida mediante una expresion regular, posibles URLs
* @param {string} value - Url que se desea validar
* @returns {boolean} - Devuelve si es valida o no la url
*/
function validateUrl(value) {
  var regexpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  return regexpression.test(
    value
  );
}

/**
* Funcion que codifica la URL recibida y genera una version reducida. Utilizando MD5 para obtener una cadena fija de 32 hexadecimales y luedo se aplica codificacion en BASE62 (similar a BASE 64, pero sin + y /)
* @param {string} value - Url que se desea reducir
* @returns {string} - Devuelve una version reducida de la URL
*/
function encodeUrl(value) {
  //Se genera un HASH hexadeciman con MD5
  var hashMD5 = crypto.createHash('md5').update(value).digest("hex");
  //luego ese hash exa lo convertimos a decimal
  var convertHexaToDecimal = parseInt(hashMD5, 16);
  //luego ese decimal lo convertimos a Base62
  var convertToBAse62 = base62.encode(convertHexaToDecimal);
  console.log(hashMD5);
  console.log(convertHexaToDecimal);
  console.log(convertHexaToDecimal);
  return convertToBAse62;
}

module.exports = { validateUrl, encodeUrl };