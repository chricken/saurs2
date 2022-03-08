'use strict';

import data from './data.js';
import dom from './dom.js';
import win from './win.js';
import draw from './draw.js';

// VARIABLEN


// FUNKTIONEN
const init = () => {
    draw.init().then(
        data.init
    ).then(
        win.init
    ).then(
        () => console.log(data.baum)
    ).catch(
        console.warn
    )
}

// INIT
window.addEventListener('load', init);