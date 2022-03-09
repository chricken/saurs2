import dom from './dom.js';
import draw from './draw.js';
import data from './data.js';


const win = {
    scrollTop: 0,
    scrollBottom: 0,
    handleResize() {
        draw.cAges.width = window.innerWidth;
        draw.cAges.height = window.innerHeight;
        draw.cDiagram.width = window.innerWidth;
        draw.cDiagram.height = window.innerHeight;
        draw.ages();
        draw.diagram();
    },
    handleScroll() {
        /*
        win.scrollTop = Math.max(
            document.body.scrollTop,
            document.documentElement.scrollTop
        );
        */
        win.scrollBottom = win.scrollTop + window.innerHeight;
        data.fillBaumToDraw();
        //draw.ages();
        draw.diagram();
    },
    handleWheel(evt) {
        //console.log(evt);
        win.scrollTop = Math.min(
            data.lowerEdge - draw.cDiagram.height,
            Math.max(
                0,
                evt.deltaY + win.scrollTop
            )
        );
        // console.log(win.scrollTop);
        win.handleScroll();
    },
    init() {
        return new Promise(resolve => {
            window.addEventListener('resize', win.handleResize);
            window.addEventListener('scroll', win.handleScroll);
            window.addEventListener('wheel', win.handleWheel);

            // Größen auslesen ohne Redraw
            draw.cAges.width = window.innerWidth;
            draw.cAges.height = window.innerHeight;
            draw.cDiagram.width = window.innerWidth;
            draw.cDiagram.height = window.innerHeight;


            win.scrollBottom = win.scrollTop + window.innerHeight;
            //win.handleResize();
            // win.handleScroll();
            resolve();
        })
    }
}

export default win;