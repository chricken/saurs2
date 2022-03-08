import dom from './dom.js';
import draw from './draw.js';

const win = {
    resize() {
        draw.cAges.width = window.innerWidth;
        draw.cAges.height = window.innerHeight;
        draw.cDiagram.width = window.innerWidth;
        draw.cDiagram.height = window.innerHeight;
        draw.ages();
        draw.diagram();
    },
    init() {
        return new Promise(resolve => {
            window.addEventListener('resize', win.resize);
            win.resize();
            resolve();
        })
    }
}

export default win;