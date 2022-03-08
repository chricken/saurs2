import dom from './dom.js';
import draw from './draw.js';

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
        win.scrollTop = Math.max(
            document.body.scrollTop,
            document.documentElement.scrollTop
        );
        win.scrollBottom = win.scrollTop + window.innerHeight;
    },
    init() {
        return new Promise(resolve => {
            window.addEventListener('resize', win.handleResize);
            window.addEventListener('scroll', win.handleScroll);
            win.handleResize();
            win.handleScroll();
            resolve();
        })
    }
}

export default win;