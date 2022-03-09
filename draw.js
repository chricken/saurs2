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
    scrollbar(ctx, width, height) {
        let padding = 5;
        let top = padding;
        let bottom = height - padding;
        // Kasten zeichnen
        ctx.fillStyle = `hsla(0,0%,0%,.8)`;

        ctx.fillRect(
            top,
            padding,
            width * .01,
            height - padding - padding
        )
        ctx.strokeStyle = `hsla(0,0%,100%,1)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            top,
            padding,
            width * .01,
            height - padding - padding
        )

        // Handle zeichnen
        console.log(win.scrollTop);
    },

    bezeichnung(el, ctx, width, height, left, right, fontSize = 14) {
        let padding = 5;
        ctx.fillStyle = 'hsla(0,0%,100%,.8)';
        ctx.strokeStyle = 'hsla(0,0%,0%,.5)';

        ctx.lineWidth = 1;

        // Füllung
        ctx.fillRect(
            left + padding,
            el.pos + padding,
            100,
            fontSize * 1.6
        )

        // Rand
        ctx.strokeRect(
            left + padding,
            el.pos + padding,
            100,
            fontSize * 1.6
        )

        // Text
        ctx.fillStyle = 'hsla(0,0%,0%,1)';
        ctx.textAlign = 'left';
        ctx.font = `${fontSize}px oswald`;
        ctx.fillText(
            el.bez,
            left + padding + padding,
            el.pos + (padding / 2) + padding + fontSize,
        );

    },
    group(el, ctx, width, height) {

        let padding = 2;
        let anfang = data.ages[0].von;

        let left = width - (width / anfang * el.mioJhrVon);
        let right = width - (width / anfang * el.mioJhrBis);

        ctx.fillStyle = el.color;
        ctx.fillRect(
            left,
            el.pos + padding,
            right - left,
            settings.heightGroup - (padding * 2)
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            left,
            el.pos + padding,
            right - left,
            settings.heightGroup - (padding * 2)
        )
        draw.bezeichnung(el, ctx, width, height, left, right, 10)
    },

    species(el, ctx, width, height) {

        let padding = 1;

        let anfang = data.ages[0].von;

        let left = width - (width / anfang * el.mioJhrVon);
        let right = width - (width / anfang * el.mioJhrBis);

        ctx.fillStyle = el.color;
        ctx.fillRect(
            left,
            el.pos + padding,
            right - left,
            settings.heightSpecies - (padding * 2)
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            left,
            el.pos + padding,
            right - left,
            settings.heightSpecies - (padding * 2)
        )
        draw.bezeichnung(el, ctx, width, height, left, right, 14)
    },
    diagram() {
        let width = draw.cDiagram.width;
        let height = draw.cDiagram.height;
        let ctx = draw.cDiagram.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        draw.scrollbar(ctx, width, height);

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