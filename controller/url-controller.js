const Express = require('express');
const router = Express.Router();
const ShortUniqueId = require('short-unique-id');
const utils = require('../utils/util');
const Url = require('../models/url-schema');
require('dotenv').config({ path: '../config/.env' });

/**
 * POST /api/short
 * Metodo POST que recibe una url larga y devuelve una url recortada.
 * @param {string} request.body.required - longUrl Json con la url original
 * @return {string} 200 response - url reducida 
 */
router.post('/api/short', async (req, res) => {
    const originalUrl = req.body.longUrl;
    const base = process.env.BASEURL;

    if (utils.validateUrl(originalUrl)) {
        //console.log('url valida');
        try {
            //Primero buscamos si existe la url completa en nuestra BD
            let returnUrl = await Url.findOne({ longUrl: originalUrl });

            //Si existe, la devolvemos en el request
            if (returnUrl) {
                res.json(returnUrl.tinyUrl);

            //Si no existe, damos el alta
            } else {

                 var existeUIdGenerado = true;

                 const uid = new ShortUniqueId(); //En teoria no se duplican nunca los ids (Can generate any number of ids without duplicates, even millions per day.)
                 //console.log(uid());
                 var urlIdGenerated = uid();

                 while(existeUIdGenerado){
                    //Controlamos que el UID generado no este en uso en la base (hay muy bajas probabilidades, pero hay que controlar).
                    let controlUrl = await Url.findOne({ urlId: urlIdGenerated });
                    
                    //si ya esta usado el ui generado, generamos uno nuevo y volvemos a controlar.
                    if(controlUrl){
                        var urlIdGenerated = uid();
                    } else {
                        existeUIdGenerado = false; 
                    }
                 }

                 const shortUrlCreated = `${base}/${urlIdGenerated}`;

                returnUrl = new Url({
                    longUrl: originalUrl,
                    tinyUrl: shortUrlCreated,
                    urlId: urlIdGenerated,
                    creationDate: new Date(),
                });

                await returnUrl.save();
                res.json(shortUrlCreated);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json('Error interno del servidor. Al generar url corta: ' + err);
        }
    } else {
        res.status(400).json('Url invalida');
    }
});

/**
 * GET /:urlId
 * Metodo GET que recibe una url corta y redirecciona hacia la url larga
 * @param {string} urlId - Url reducida
 */
router.get('/:urlId', async (req, res) => {
    try {
        const url = await Url.findOne({ urlId: req.params.urlId });
        if (url) {
            url.visits++;
            url.save();
            return res.redirect(url.longUrl);
        } else {
            res.status(404).json('Url no encontrada');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Error interno del servidor. Al buscar url completa: ' + err);
    }
});

/**
 * DELETE /api/short/:urlId
 * Metodo DELETE que elimina una url corta que coincida con la urlId que recibe
 * @param {string} urlId - Url reducida
 * @return {string} 200 response - Mensaje confirmando el borrado (si existe la url reducida)
 */
router.delete('/api/short/:urlId', async (req, res) => {
    try {
        const url = await Url.findOneAndDelete({ urlId: req.params.urlId });
        if (url) {
            res.json('Url corta eliminada');
        } else {
            res.json('No se encontro la Url corta');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Error interno del servidor. Al querer eliminar una url corta: ' + err);
    }
});


/* borrar LISTA de urlsCOrtas

Estadisticas de uso!
las 10 url con mas visitas */


/**
 * GET /api/short/top
 * Metodo GET recupera el top 10  de url mas visitadas
 * @param {string} number - tamano de la lista
 * @return {string} 200 response - Json con una lista de las 10 url con mayor cantidad de visitas
 */
router.get('/api/short/top/:number', async (req, res) => {
    try {
        const urlList = await Url.find().sort({ visits: -1 }).limit(req.params.number);
        if (urlList) {
            //console.log(JSON.stringify(urlList));
            return res.json(urlList.map(u => u.tinyUrl + ' visits: ' + u.visits));
        } else {
            res.status(404).json('Urls no encontradas.');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Error interno del servidor. Al buscar top de url cortas visitadas: ' + err);
    }
});

module.exports = router;