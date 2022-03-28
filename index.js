'use strict';

import data from './data.js';
import win from './win.js';
import draw from './draw.js';
import ui from './ui.js'

// VARIABLEN


// FUNKTIONEN
const init = () => {

    draw.init().then(
        win.init
    ).then(
        data.init
    ).then(
        win.handleResize
    ).then(
        draw.ages
    ).then(
        data.update
    ).then(
        ui.init
    ).catch(
        console.warn
    )
}

// INIT
window.addEventListener('load', init);