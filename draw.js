import dom from './dom.js';
import data from './data.js';
import helpers from './helpers.js';
import win from './win.js';

const draw = {

    ages() {
        let anfang = data.ages[0].von;
        let width = draw.cAges.width;
        let height = draw.cAges.height;
        let ctx = draw.cAges.getContext('2d');
        data.ages.forEach(age => {
            // Füllung
            ctx.globalAlpha = .2;
            ctx.fillStyle = helpers.createColor(0, 360, 50, 50);
            let left = width / anfang * age.von;
            let right = width / anfang * age.bis;
            ctx.fillRect(
                left,
                0,
                right - left,
                height
            )

            console.log(age.bez);
            ctx.fillColor = '#000';
            ctx.beginPath();

            ctx.fillText(age.bez, left, 10);
            ctx.fill();


        })
    },
    diagram() {

    },
    init() {
        return new Promise(resolve => {
            draw.cAges = dom.$('#cAges');
            draw.cDiagram = dom.$('#cDiagram');
            resolve();
        })
    }
}

export default draw;