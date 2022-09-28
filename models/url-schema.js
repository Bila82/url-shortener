const mongoose = require('mongoose');

/**
* Esquema, para el guardado del objeto URL dentro de la BD (similar a un tabla relacional)
*/
const UrlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
    index: true
  },
  longUrl: {
    type: String,
    required: true,
    index: true
  },
  tinyUrl: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  visits: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('Url', UrlSchema);