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

module.exports = { validateUrl };