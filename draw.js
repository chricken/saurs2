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
            ctx.translate(right - 20, 20);
            ctx.rotate(1.5 * Math.PI);
            ctx.fillText(data.lang[age.bez][settings.lang], 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        })
    },
    scollbar(ctx, width, height) {
        ctx.fillStyle = `hsla(0,0%,0%,.8)`;
        ctx.fillRect(
            5,
            5,
            width * .01,
            height - 10
        )
        ctx.strokeStyle = `hsla(0,0%,100%,1)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(
            5,
            5,
            width * .01,
            height - 10
        )
    },
    group(el, ctx, width, height) {

        let anfang = data.ages[0].von;

        let left = width - (width / anfang * el.mioJhrVon);
        let right = width - (width / anfang * el.mioJhrBis);

        ctx.fillStyle = el.color;
        ctx.fillRect(
            left,
            el.pos + 2,
            right - left,
            settings.heightGroup - 2
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            left,
            el.pos + 2,
            right - left,
            settings.heightGroup - 2
        )
    },
    species(el, ctx, width, height) {

        let anfang = data.ages[0].von;

        let left = width - (width / anfang * el.mioJhrVon);
        let right = width - (width / anfang * el.mioJhrBis);

        ctx.fillStyle = el.color;
        ctx.fillRect(
            left,
            el.pos + 2,
            right - left,
            settings.heightSpecies - 2
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            left,
            el.pos + 2,
            right - left,
            settings.heightSpecies - 2
        )
    },
    diagram() {
        let width = draw.cDiagram.width;
        let height = draw.cDiagram.height;
        let ctx = draw.cDiagram.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        draw.scollbar(ctx, width, height);

        // Gruppen und Spezies zeichnen
        data.baumToDraw.forEach(el => {
            if (el.children) draw.group(el, ctx, width, height)
            else draw.species(el, ctx, width, height)
        })
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