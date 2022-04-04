'use strict';

const opn = require('better-opn');
const express = require('express');
let server = express();

server.use(express.static('public'));

const init = () => {

    server.listen(80, err => {
        if (err) console.log(err);
        else {
            console.log('Server läuft, Client wird geöffnet');
            opn('http://localhost');
        }
    });
}

init()