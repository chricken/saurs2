import dom from './dom.js';

const draw = {
    ages() {

    },
    diagram() {

    },
    init() {
        return new Promise(resolve => {
            this.cAges = dom.$('#cAges');
            this.cDiagram = dom.$('#cDiagram');
            resolve();
        })
    }
}

export default draw;