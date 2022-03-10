import dom from './dom.js';
import data from './data.js';
import helpers from './helpers.js';
import win from './win.js';
import settings from './settings.js';

const draw = {
    linkPadding: 20,
    linkLeftStop: 0,
    mouseY: 0,
    parentColor: '#f00',
    childColor: '#0f0',
    selectedColor: '#000',
    selectedUnderlayColor: 'hsla(0,0%,0%,.3)',
    hoverColor: 'hsla(0,0%,50%,.2)',
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
            ctx.fillStyle = 'hsla(0,0%,0%,.2)';

            ctx.textAlign = 'right';
            ctx.font = '80px oswald';
            ctx.translate(right - 20, 20);
            ctx.rotate(1.5 * Math.PI);
            ctx.fillText(data.lang[age.bez][settings.lang], 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        })

        // Gruppen und Spezies zeichnen
        data.baumToDraw.forEach(el => {
            draw.underlay(el, ctx, width);
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

        // Ggf Untergrund zeichnen
        if (data.selected && data.selected == el) {
            ctx.fillStyle = draw.selectedUnderlayColor;
            ctx.fillRect(
                0,
                top,
                width,
                settings.heightGroup
            )
        }

        // Farben festlegen
        if (data.selected && data.selected == el) {
            ctx.lineWidth = 2;
            ctx.fillStyle = draw.selectedColor;
        } else if (data.selected && data.selected.children && data.selected.children.includes(el)) {
            ctx.lineWidth = 2;
            ctx.fillStyle = draw.childColor;
        } else if (data.selected && el.children.includes(data.selected)) {
            ctx.lineWidth = 2;
            ctx.fillStyle = draw.parentColor;
        } else {
            ctx.lineWidth = 1;
            ctx.fillStyle = el.color;
        }


        // Element zeichnen
        ctx.fillRect(
            left,
            top,
            right - left,
            settings.heightGroup - (padding * 2)
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.strokeRect(
                left,
                top,
                right - left,
                settings.heightGroup - (padding * 2)
            )
            //draw.link(el, ctx, width, height, left, top + padding);
        draw.bezeichnung(el, ctx, width, height, left, right, top, 14)
    },

    species(el, ctx, width, height) {
        let padding = 1;

        let anfang = data.ages[0].von;

        let left = width - (width / anfang * el.mioJhrVon);
        let right = width - (width / anfang * el.mioJhrBis);
        let top = el.pos + padding - win.scrollTop;

        // Farben festlegen
        if (data.selected && data.selected == el) {
            ctx.lineWidth = 2;
            ctx.fillStyle = draw.selectedColor;
        } else if (data.selected && data.selected.children && data.selected.children.includes(el)) {
            ctx.lineWidth = 2;
            ctx.fillStyle = draw.childColor;
        } else {
            ctx.lineWidth = 1;
            ctx.fillStyle = el.color;
        }
        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';

        ctx.fillRect(
            left,
            top,
            right - left,
            settings.heightSpecies - (padding * 2)
        )
        ctx.strokeRect(
                left,
                top,
                right - left,
                settings.heightSpecies - (padding * 2)
            )
            // draw.link(el, ctx, width, height, left, top + padding);
        draw.bezeichnung(el, ctx, width, height, left, right, top, 14)
    },
    allLinks(ast, ctx, width) {
        let kurvenradius = 10;
        let paddingParent = 20;
        let paddingChild = 10;

        ast.forEach(el => {
            // console.log(el);
            if (el.parent) {
                let anfang = data.ages[0].von;
                let padding = 1;

                let left = width - (width / anfang * el.mioJhrVon);
                let top = el.pos + padding - win.scrollTop;

                let parentLeft = width - (width / anfang * el.parent.mioJhrVon);
                let parentTop = el.parent.pos - win.scrollTop;

                // Settings
                ctx.lineJoin = 'round';
                if (data.selected == el) {
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#a00';
                    ctx.fillStyle = '#a00';
                } else if (data.selected == el.parent) {
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#0a0';
                    ctx.fillStyle = '#0a0';
                } else {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#000';
                    ctx.fillStyle = '#000';
                }

                // Linien zeichnen
                // Jede Linie wird einzaln gezeichnet, da sich mglw noch etwas an den Farben ändert
                ctx.beginPath();

                ctx.moveTo(
                    parentLeft,
                    parentTop + paddingParent
                );
                ctx.lineTo(
                    parentLeft - draw.linkPadding,
                    parentTop + paddingParent
                );
                ctx.arc(
                    parentLeft - draw.linkPadding,
                    parentTop + paddingParent + kurvenradius,
                    kurvenradius,
                    1.5 * Math.PI,
                    1 * Math.PI,
                    true
                )
                ctx.lineTo(
                    parentLeft - (kurvenradius / 2),
                    top + paddingChild
                );
                ctx.lineTo(
                    left,
                    top + paddingChild
                );
                ctx.stroke();

                // Pfeil anhängen
                ctx.beginPath();
                ctx.moveTo(left, top + paddingChild);
                ctx.lineTo(left - 5, top + paddingChild - 5);
                ctx.lineTo(left - 5, top + paddingChild + 5);
                ctx.lineTo(left, top + paddingChild);
                ctx.fill();

            }
            // Kinder iterieren
            if (el.children) draw.allLinks(el.children, ctx, width);
        })
    },

    underlay(el, ctx, width) {
        let pos = el.pos - win.scrollTop;
        let h = el.children ? settings.heightGroup : settings.heightSpecies;
        // console.log(draw.mouseY, pos, h);
        if (draw.mouseY > pos && draw.mouseY < pos + h) {
            ctx.fillStyle = draw.hoverColor;
            ctx.fillRect(
                0,
                pos,
                width,
                h
            )
        }
    },

    // Einen Link zeichnen. Wird z.Zt. nicht verwendet. 
    // Mglw später wieder, falls die Starts und Ziele nur für sichtbare Elemente gezeichnet werden sollen
    link(el, ctx, width, height, left, top) {
        if (el.parent) {

            let anfang = data.ages[0].von;
            let parentLeft = width - (width / anfang * el.parent.mioJhrVon);
            let parentTop = el.parent.pos - win.scrollTop;

            // Settings
            ctx.lineWidth = 1;
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#000';

            // Linien zeichnen
            ctx.beginPath();

            ctx.moveTo(parentLeft, parentTop + 20);
            ctx.lineTo(parentLeft - draw.linkPadding + 10, parentTop + 20);
            ctx.lineTo(parentLeft - draw.linkPadding, parentTop + 30);
            ctx.lineTo(parentLeft - (draw.linkPadding / 2), top + 10);
            ctx.lineTo(left, top + 10);
            ctx.stroke();

            // Pfeil anhängen
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(left, top + 10);
            ctx.lineTo(left - 5, top + 5);
            ctx.lineTo(left - 5, top + 15);
            ctx.lineTo(left, top + 10);
            ctx.fill();

            //console.log(left, parentLeft);
        }
    },
    diagram() {
        let width = draw.cDiagram.width;
        let height = draw.cDiagram.height;
        let ctx = draw.cDiagram.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        draw.scrollbar(ctx, width, height);


        // Gruppen und Spezies zeichnen
        data.baumToDraw.forEach(el => {
            // draw.underlay(el, ctx, width);
            if (el.children) draw.group(el, ctx, width, height)
            else draw.species(el, ctx, width, height)
        })

        // Linien auch außerhalb des Viewports zeichnen
        draw.allLinks(data.baum, ctx, width);


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