import dom from './dom.js';
import draw from './draw.js';
import data from './data.js';
import settings from './settings.js';
import helpers from './helpers.js';


const win = {
    scrollTop: 0,
    scrollBottom: 0,

    // Auf eine Änderung des Fensters reagieren
    handleResize() {
        draw.cAges.width = window.innerWidth;
        draw.cAges.height = window.innerHeight;
        draw.cDiagram.width = window.innerWidth;
        draw.cDiagram.height = window.innerHeight;
        draw.ages();
        draw.diagram();
    },

    // Auf ein System-Scroll reagieren. 
    // hat außer im Init keine Bedeutung, lasse es trotzdem stehen.
    handleScroll() {
        win.scrollBottom = win.scrollTop + window.innerHeight;
        data.fillBaumToDraw();
        //draw.ages();
        draw.diagram();
    },

    // Auf ein Scrollen mit dem Mausrad reagieren
    handleWheel(evt) {
        win.scrollTop = Math.min(
            data.lowerEdge - draw.cDiagram.height,
            Math.max(
                0,
                evt.deltaY + win.scrollTop
            )
        );
        win.handleScroll();
    },

    // Auswahl markieren
    // Auswahl wird in einen dedizierten Speicher geschrieben, statt die Eigenschaft eines Elementes zu ändern
    // So spare ich das Zurücksetzen
    markSelected(evt) {
        let width = draw.cDiagram.width;
        let height = draw.cDiagram.height;
        let padding = draw.scrollbarPadding;
        let top = padding;
        let bottom = height - padding;
        let barHeight = height - padding - padding;
        let barWidth = width * .01;

        if (
            evt.layerX > padding
            && evt.layerX < padding + barWidth
            && evt.layerY > padding
            && evt.layerY < bottom
        ) {
            win.scrollTo(evt);
            win.scrollbarSelected = true;
        } else {
            data.selected = data.baumToDraw.find(el => {
                let h = el.children ? settings.heightGroup : settings.heightSpecies;
                let pos = el.pos - win.scrollTop;
                return (evt.layerY > pos) && (evt.layerY < pos + h);
            })
            // console.log(data.selected);
        }
        draw.diagram();
    },
    scrollTo(evt) {
        let width = draw.cDiagram.width;
        let height = draw.cDiagram.height;
        let padding = draw.scrollbarPadding;
        let top = padding;
        let bottom = height - padding;
        let barHeight = height - padding - padding;
        let barWidth = width * .01;

        let pos = (evt.layerY - padding) / barHeight;
        // console.log(pos * data.lowerEdge);
        win.scrollTop = helpers.crop((pos * data.lowerEdge), 0, data.lowerEdge - draw.cDiagram.height);
        
        win.handleScroll();
    },
    leaveMouse(evt) {
        win.scrollbarSelected = false;
    },

    // Position eintragen, an der die Maus ist, um später im Zeichenprozess die drunterliegende Spezies/Gruppe zu markieren
    handleMove(evt) {
        draw.mouseY = evt.layerY;
        draw.ages();

        if (win.scrollbarSelected) {
            win.scrollTo(evt);
        }
    },

    init() {
        return new Promise(resolve => {
            window.addEventListener('resize', win.handleResize);
            window.addEventListener('scroll', win.handleScroll);
            window.addEventListener('wheel', win.handleWheel);
            draw.cDiagram.addEventListener('mousedown', win.markSelected);
            draw.cDiagram.addEventListener('mouseup', win.leaveMouse);
            draw.cDiagram.addEventListener('mousemove', win.handleMove);

            // Größen auslesen ohne Redraw
            draw.cAges.width = window.innerWidth;
            draw.cAges.height = window.innerHeight;
            draw.cDiagram.width = window.innerWidth;
            draw.cDiagram.height = window.innerHeight;

            win.scrollBottom = win.scrollTop + window.innerHeight;
            // win.handleResize();
            // win.handleScroll();
            resolve();
        })
    }
}

export default win;