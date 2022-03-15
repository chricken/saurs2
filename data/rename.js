'use strict';

const fs = require('fs');

let data = false;
let locations = [];

const extractLocations = ast => {
    console.log(ast);
}


const init = () => {
    fs.readFile('./daten.json')

    /*
    .then(
        (res) => {
            data = JSON.parse(res.toString());
            extractLocations(data);
        }
    ).catch(
        console.log
    )
    */
}

init();