'use strict';

const { log } = require('console');
const fs = require('fs');

let data = false;
let locations = new Set();

let suchen = ['Neixiang'];
let ersetzen = 'chinamitte';

let count = 0;

const extractLocations = ast => {
    for (let key in ast) {
        count++;
        let val = ast[key];
        if (val.fundort) {

            // Suchen und ersetzen
            suchen.forEach(suche => {

                val.fundort = val.fundort.split(suche).join(ersetzen);
            })

            // Locations-Übersicht füllen
            val.fundort.split(', ').forEach(fundort => locations.add(fundort));

            // Ausgabe
            /*
            console.log(key, count);
            console.log(val.fundort);
            console.log(' ');
            */
        }
        if (val.children) extractLocations(val.children);
    }
}


const init = () => {

    fs.readFile('./daten.json', (err, res) => {
        if (err) console.log(err);
        else {
            data = JSON.parse(res);
            extractLocations(data);
            console.log('Count: ', count);
            console.log([...locations].join(', '));

            fs.writeFile(
                './daten.json',
                JSON.stringify(data),
                (err, res) => {
                    if (err) console.log(err);
                    else console.log('done');
                }
            )
        }
    })
}

init();