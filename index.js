'use strict';

import data from './data.js';
import dom from './dom.js';
import win from './win.js';
import draw from './draw.js';

// VARIABLEN


// FUNKTIONEN
const init = () => {
    draw.init().then(
        win.init
    ).then(
        data.init
    ).then(
        () => draw.ages()
    ).then(
        () => data.update()
    ).then(
        () => console.log(draw)
    ).catch(
        console.warn
    )
}

// INIT
window.addEventListener('load', init);