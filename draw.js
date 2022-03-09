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
        let barHeight = height - padding - padding;
        // Kasten zeichnen
        ctx.fillStyle = `hsla(0,0%,0%,.8)`;

        ctx.fillRect(
            top,
            padding,
            width * .01,
            barHeight
        )
        ctx.strokeStyle = `hsla(0,0%,100%,1)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            top,
            padding,
            width * .01,
            barHeight
        )

        // Handle zeichnen
        const relCHeight = barHeight * (draw.cDiagram.height / data.lowerEdge);
        const posScrollHandle = (win.scrollTop) * (barHeight / data.lowerEdge);
        // console.log(posScrollHandle);

        ctx.fillStyle = `hsla(0,0%,100%,.8)`;

        ctx.fillRect(
            padding,
            padding + posScrollHandle,
            width * .01,
            relCHeight
        )
        ctx.strokeStyle = `hsla(0,0%,100%,1)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            padding,
            padding + posScrollHandle,
            width * .01,
            relCHeight
        )
    },

    bezeichnung(el, ctx, width, height, left, right, top, fontSize = 14) {
        let padding = 5;
        let content = el.bez;

        ctx.textAlign = 'left';
        ctx.font = `${fontSize}px oswald`;
        let textWidth = ctx.measureText(content).width + padding * 2;

        ctx.fillStyle = 'hsla(0,0%,100%,.8)';
        ctx.strokeStyle = 'hsla(0,0%,0%,.5)';

        ctx.lineWidth = 1;
        if (left > width - textWidth) left -= textWidth + padding;
        else left += padding;

        // Füllung
        ctx.fillRect(left, top + padding, textWidth, fontSize * 1.6);

        // Rand
        ctx.strokeRect(left, top + padding, textWidth, fontSize * 1.6)

        // Text
        ctx.fillStyle = 'hsla(0,0%,0%,1)';

        ctx.fillText(content, left + padding, top + (padding) + fontSize);
    },
    
    group(el, ctx, width, height) {

        let padding = 2;
        let anfang = data.ages[0].von;

        let left = width - (width / anfang * el.mioJhrVon);
        let right = width - (width / anfang * el.mioJhrBis);
        let top = el.pos + padding - win.scrollTop;

        ctx.fillStyle = el.color;
        ctx.fillRect(
            left,
            top,
            right - left,
            settings.heightGroup - (padding * 2)
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            left,
            top,
            right - left,
            settings.heightGroup - (padding * 2)
        )
        draw.bezeichnung(el, ctx, width, height, left, right, top, 14)
    },

    species(el, ctx, width, height) {
        let padding = 1;

        let anfang = data.ages[0].von;

        let left = width - (width / anfang * el.mioJhrVon);
        let right = width - (width / anfang * el.mioJhrBis);
        let top = el.pos + padding - win.scrollTop;

        ctx.fillStyle = el.color;
        ctx.fillRect(
            left,
            top,
            right - left,
            settings.heightSpecies - (padding * 2)
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            left,
            top,
            right - left,
            settings.heightSpecies - (padding * 2)
        )
        draw.bezeichnung(el, ctx, width, height, left, right, top, 14)
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