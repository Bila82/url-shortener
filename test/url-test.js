//Para la prueba ponemos el entorno en test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
const shortid = require('shortid');
let Url = require('../models/url-schema');
require('dotenv').config({ path: '../config/.env' });

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let urlController = require('../app');
let should = chai.should();


chai.use(chaiHttp);

/*
* Prueba GET /api/short/top
*/
describe('/GET TOp 10 urls mas visitadas', () => {
    it('DEberia recuperar las 10 urls mas visitadas', (done) => {
        chai.request(urlController)
            .get('/api/short/top')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.most(10);
                done();
            });
    });
});

/*
* Prueba POST /api/short/top
*/
describe('/POST generar error al no enviar url larga', () => {
    it('El metodo post debe fallar, si no esta el campo longUrl', (done) => {
        let longUrl = {
            "longUrl": null
        }
        chai.request(urlController)
            .post('/api/short')
            .send(longUrl)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.eql('Url invalida');
                done();
            });
    });
});

/*
* Prueba POST /api/short/top
*/
describe('/POST generar url corta al enviar una url larga', () => {
    it('El metodo post devolver una url corta, si se envia una url larga longUrl', (done) => {
        let longUrl = {
            "longUrl": "wwww.google.com"
        }
        chai.request(urlController)
            .post('/api/short')
            .send(longUrl)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('string');
                done();
            });
    });
});

/*
* Prueba del metodo  DELETE /api/short/:urlId
*/
describe('/DELETE/ metodo que elimina una url', () => {
    it('Metodo que elimina una url, recibiendo una urlId', (done) => {
        const base = process.env.BASEURL;
        const urlIdGenerated = shortid.generate();
        const shortUrlCreated = `${base}/${urlIdGenerated}`;

        let newTinyUrl = new Url({
            longUrl: "https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai",
            tinyUrl: shortUrlCreated,
            urlId: urlIdGenerated,
            creationDate: new Date(),
        });

        newTinyUrl.save((err, newTinyUrl) => {

            chai.request(urlController)
                .delete('/api/short/' + newTinyUrl.urlId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.eql('Url corta eliminada');
                    done();
                });
        });
    });
});