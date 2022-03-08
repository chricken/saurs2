import dom from './dom.js';
import data from './data.js';
import helpers from './helpers.js';
import win from './win.js';
import settings from './settings.js';

const draw = {

    ages() {
        let anfang = data.ages[0].von;
        let width = draw.cAges.width;
        let height = draw.cAges.height;

        let ctx = draw.cAges.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        data.ages.forEach(age => {
            // Füllung
            ctx.fillStyle = `hsl(${age.hue}, 40%, 80%)`;
            let left = width - (width / anfang * age.von);
            let right = width - (width / anfang * age.bis);
            console.log(left, right, age.bez);
            ctx.fillRect(
                left,
                0,
                right - left,
                height
            )

            // Trennstriche
            ctx.fillStyle = 'hsla(0,0%,0%,.1)';
            ctx.fillRect(
                right - 5,
                0,
                5,
                height
            )

            // Beschriftung
            ctx.fillStyle = 'hsla(0,0%,0%,.5)';

            ctx.textAlign = 'right';
            ctx.font = '80px oswald';
            ctx.translate(left + 80, 20);
            ctx.rotate(1.5 * Math.PI);
            ctx.fillText(data.lang[age.bez][settings.lang], 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        })
    },
    diagram() {
        let width = draw.cAges.width;
        let height = draw.cAges.height;
        let ctx = draw.cDiagram.getContext('2d');
        ctx.clearRect(0, 0, width, height);

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