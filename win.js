import dom from './dom.js';
import draw from './draw.js';
import data from './data.js';
import settings from './settings.js';
import helpers from './helpers.js';
import ui from './ui.js';


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
        draw.closers();
        dom.$('#ui .inner').style.maxHeight = `${draw.cDiagram.height * .8}px`;
    },

    // Auf ein System-Scroll reagieren. 
    // hat außer im Init keine Bedeutung, lasse es trotzdem stehen.
    handleScroll() {
        win.scrollBottom = win.scrollTop + window.innerHeight;
        data.fillBaumToDraw();
        //draw.ages();
        draw.diagram();
        draw.closers();
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
    handleClick(evt) {

        let closer = draw.closerUnderMouse();
        // console.log(closer);
        if (closer) {
            // Wenn ein Closer geklickt wurde, dann soll das Element als zusammengeklappt markiert werden
            closer.el.collapsed = !closer.el.collapsed;
            //console.log(closer.el);
            //draw.closers();
            data.update()
        } else {
            // Wenn woanders geklickt wurde, dann sollen die Details gezeigt werden

            let width = draw.cDiagram.width;
            let height = draw.cDiagram.height;
            let padding = draw.scrollbarPadding;
            let top = padding;
            let bottom = height - padding;
            let barHeight = height - padding - padding;
            let barWidth = width * .01;

            if (
                evt.layerX > padding &&
                evt.layerX < padding + barWidth &&
                evt.layerY > padding &&
                evt.layerY < bottom
            ) {
                win.scrollTo(evt);
                win.scrollbarSelected = true;
            } else {
                data.selected = data.baumToDraw.find(el => {
                    let h = el.children ? settings.heightGroup : settings.heightSpecies;
                    let pos = el.pos - win.scrollTop;
                    return (evt.layerY > pos) && (evt.layerY < pos + h);
                })
                if (data.selected) ui.updateDetails();
                // console.log(data.selected);
            }
        }
        draw.diagram();

    },
    scrollToEl(el) {
        data.selected = el;
        win.scrollTop = el.pos;
        win.handleScroll();
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
        draw.mouseX = evt.layerX;

        draw.elClosers.forEach(closer => closer.el.hover = false);
        let active = draw.closerUnderMouse();
        if (active) active.el.hover = true;
        //console.log(draw.closerUnderMouse());

        if (win.scrollbarSelected) {
            win.scrollTo(evt);
        }

        draw.ages();
        // draw.diagram();
        draw.closers();
    },

    init() {
        return new Promise(resolve => {
            window.addEventListener('resize', win.handleResize);
            window.addEventListener('scroll', win.handleScroll);
            draw.cClosers.addEventListener('wheel', win.handleWheel);

            draw.cClosers.addEventListener('mousedown', win.handleClick);
            draw.cClosers.addEventListener('mouseup', win.leaveMouse);
            draw.cClosers.addEventListener('mousemove', win.handleMove);

            // Größen auslesen ohne Redraw
            draw.cAges.width = window.innerWidth;
            draw.cAges.height = window.innerHeight;
            draw.cDiagram.width = window.innerWidth;
            draw.cDiagram.height = window.innerHeight;
            draw.cClosers.width = window.innerWidth;
            draw.cClosers.height = window.innerHeight;

            win.scrollBottom = win.scrollTop + window.innerHeight;
            // win.handleResize();
            // win.handleScroll();
            resolve();
        })
    }
}

export default win;