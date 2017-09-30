'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const express = require('express');
const mongoose = require('mongoose');
const uuid = require('uuid');
const httpError = require('http-errors');
const log = require('winston');
const baseController = require('../app/controllers/base').handlers(mongoose, uuid, log);
const todosController = require('../app/controllers/todos').handlers(baseController, mongoose.model('Todo'), httpError, log);
// const auth = require('./middlewares/authorization');

/**
 * Expose
 */

module.exports = (app, passport) => {

    const fileUpload = require('express-fileupload');
    // default options
    app.get('/', home.index);
    app.use(fileUpload());

    //   const pauth = passport.authenticate.bind(passport);

    app.get('/todos', todosController.getTodos);
    app.post('/todos', todosController.createTodo);
    app.put('/todos', todosController.editTodo);
    app.delete('/todos', todosController.deleteTodo);

    app.post('/upload', (req, res) => {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const sampleFile = req.files.sampleFile;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('./' + sampleFile.name, (err) => {
            if (err)
                return res.status(500).send(err);

            res.send('File uploaded!');
        });
    });
    app = express();
    /**
     * Error handling
     */

    app.use((err, req, res, next) => {
        // treat as 404
        if (err.message &&
            (~err.message.indexOf('not found') ||
                (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', { error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use((req, res, next) => {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });


};