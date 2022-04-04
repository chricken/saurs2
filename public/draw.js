import dom from './dom.js';
import data from './data.js';
import helpers from './helpers.js';
import win from './win.js';
import settings from './settings.js';

const draw = {
    linkPadding: 25,
    linkLeftStop: 0,
    scrollbarPadding: 10,
    mouseY: 0,

    parentColor: 'hsla(0,100%,40%,1)',
    childColor: 'hsla(120,100%,40%,1)',
    linkColor: 'hsla(0,0%,0%,.5)',
    parentLinkColor: 'hsla(0,100%,20%,.8)',
    childLinkColor: 'hsla(120,100%,20%,.8)',
    selectedColor: 'hsla(0,0%,0%,1)',

    selectedUnderlayColor: 'hsla(0,0%,0%,.3)',
    hoverColor: 'hsla(0,0%,50%,.2)',

    imgGrungeRed: false,
    imgGrungeGreen: false,
    imgGrungeBlack: false,

    elClosers: [],

    hueGroup: {
        hueMin: 170,
        hueMax: 190,
        satMin: 60,
        satMax: 80,
        lightMin: 30,
        lightMax: 40,
    },
    hueSpecies: {
        hueMin: -10,
        hueMax: 10,
        satMin: 30,
        satMax: 40,
        lightMin: 50,
        lightMax: 50,
    },

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
        let padding = draw.scrollbarPadding;
        let top = padding;
        let bottom = height - padding;
        let barHeight = height - padding - padding;
        let barWidth = width * .01;

        // Kasten zeichnen
        ctx.fillStyle = `hsla(0,0%,0%,.8)`;

        ctx.fillRect(
            top,
            padding,
            barWidth,
            barHeight
        )
        ctx.strokeStyle = `hsla(0,0%,100%,1)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            top,
            padding,
            barWidth,
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
            barWidth,
            relCHeight
        )

        ctx.strokeStyle = `hsla(0,0%,100%,1)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            padding,
            padding + posScrollHandle,
            barWidth,
            relCHeight
        )
    },

    bezeichnung(el, ctx, width, height, left, right, top, fontSize = 14) {
        let padding = 5;
        let content = el.bez;
        if (el.children) content += ` (${el.numSpecies} ${data.lang['spezies'][settings.lang]})`

        if (el[settings.lang]) content += ` - ${el[settings.lang]}`;

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
        let grunge = false;
        ctx.fillStyle = el.color;
        ctx.lineWidth = 1;

        // Farben festlegen
        if (data.selected && data.selected == el) {
            ctx.lineWidth = 2;
            grunge = draw.imgGrungeBlack;
        } else if (data.selected && data.selected.children && data.selected.children.includes(el)) {
            ctx.lineWidth = 2;
            grunge = draw.imgGrungeGreen;
        } else if (data.selected && el.children.includes(data.selected)) {
            ctx.lineWidth = 2;
            grunge = draw.imgGrungeRed;
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

        // Grunge
        if (grunge) {
            ctx.drawImage(grunge,
                0, el.pos % grunge.naturalHeight, right - left, settings.heightGroup - (padding * 2),
                left, top, right - left, settings.heightGroup - (padding * 2)
            )
        }

        draw.bezeichnung(el, ctx, width, height, left, right, top)

    },

    // Checken, ob die Maus einen Closer berührt
    closerUnderMouse() {
        return draw.elClosers.find(closer => {
            return (draw.mouseX > closer.left
                && draw.mouseX < closer.left + closer.width
                && draw.mouseY > closer.top
                && draw.mouseY < closer.top + closer.height
            )
        })
    },

    closers() {
        draw.elClosers = [];
        let ctx = draw.cClosers.getContext('2d');
        ctx.clearRect(0, 0, draw.cClosers.width, draw.cClosers.height);

        let width = draw.cDiagram.width;
        let h = settings.heightGroup;
        let anfang = data.ages[0].von;

        data.baumToDraw.forEach(el => {
            // Linke Kante der Gruppe
            let left = width - (width / anfang * el.mioJhrVon);
            let top = el.pos - win.scrollTop;

            // Closer-Triangle speichern, um den späteren Rollover und Click zu realisieren
            let closer = {
                left: left - (h / 6),
                top: top + (h / 5),
                width: h / 5 * 2,
                height: h / 5 * 3,
                el
            }
            draw.elClosers.push(closer);

            if (el.children) {
                ctx.fillStyle = el.hover ? '#000' : '#fff';
                ctx.strokeStyle = '#000';
                ctx.beginPath();

                if (!el.collapsed) {
                    ctx.moveTo(closer.left-3, closer.top+3);
                    ctx.lineTo(closer.left + closer.width + 3, closer.top+3);
                    ctx.lineTo(closer.left + (closer.width / 2), closer.top + (closer.height));
                } else {
                    ctx.moveTo(closer.left, closer.top);
                    ctx.lineTo(closer.left + closer.width, closer.top + (closer.height / 2));
                    ctx.lineTo(closer.left, closer.top + closer.height);
                }

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        })

    },
    species(el, ctx, width, height) {
        let padding = 1;

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
        let grunge = false;
        ctx.fillStyle = el.color;
        ctx.lineWidth = 1;

        // Farben festlegen
        if (data.selected && data.selected == el) {
            ctx.lineWidth = 2;
            grunge = draw.imgGrungeBlack;
        } else if (data.selected && data.selected.children && data.selected.children.includes(el)) {
            ctx.lineWidth = 2;
            grunge = draw.imgGrungeGreen;
        }
        ctx.fillRect(
            left,
            top,
            right - left,
            settings.heightSpecies - (padding * 2)
        )

        ctx.strokeStyle = 'hsla(0,0%,0%,.6)';
        ctx.strokeRect(
            left,
            top,
            right - left,
            settings.heightSpecies - (padding * 2)
        )

        // Grunge
        if (grunge) {
            ctx.drawImage(grunge,
                0, el.pos % grunge.naturalHeight, right - left, settings.heightGroup - (padding * 2),
                left, top, right - left, settings.heightGroup - (padding * 2)
            )
        }
        draw.bezeichnung(el, ctx, width, height, left, right, top)
    },

    allLinks(ast, ctx, width) {
        let kurvenradius = 10;
        let paddingParent = 20;
        let paddingChild = 10;

        ast.forEach(el => {
            // console.log(el);
            if ((!el.filtered) && el.parent) {
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
                    ctx.strokeStyle = draw.parentLinkColor;
                    ctx.fillStyle = draw.parentLinkColor;
                } else if (data.selected == el.parent) {
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = draw.childLinkColor;
                    ctx.fillStyle = draw.childLinkColor;
                } else {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = draw.linkColor;
                    ctx.fillStyle = draw.linkColor;
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
                    parentLeft - draw.linkPadding - (kurvenradius),
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
            if (el.children && !el.collapsed) draw.allLinks(el.children, ctx, width);
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

    diagram() {
        //Schließer-Dreiecke resetten
        //draw.elClosers = [];

        let width = draw.cDiagram.width;
        let height = draw.cDiagram.height;
        let ctx = draw.cDiagram.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        draw.scrollbar(ctx, width, height);

        draw.allLinks(data.baum, ctx, width);

        // Gruppen und Spezies zeichnen
        data.baumToDraw.forEach(el => {
            // draw.underlay(el, ctx, width);
            if (el.children) draw.group(el, ctx, width, height)
            else draw.species(el, ctx, width, height)
        })

        // Linien auch außerhalb des Viewports zeichnen

        // console.timeEnd();
    },

    loadImgs() {

        let imgs = [
            { key: 'imgGrungeRed', url: 'img/grunge_brown.png' },
            { key: 'imgGrungeBlack', url: 'img/grunge_black.png' },
            { key: 'imgGrungeGreen', url: 'img/grunge_green.png' }
        ]
        return Promise.all(
            imgs.map(img => new Promise(resolve => {
                draw[img.key] = document.createElement('img');
                draw[img.key].addEventListener('load', resolve);
                draw[img.key].src = img.url
            }))
        )
    },
    init() {
        return new Promise(resolve => {
            draw.cAges = dom.$('#cAges');
            draw.cDiagram = dom.$('#cDiagram');
            draw.cClosers = dom.$('#cClosers');
            draw.loadImgs().then(
                resolve
            )
        })
    }
}

export default draw;