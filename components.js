import ui from "./ui.js";
import dom from './dom.js';
import settings from "./settings.js";
import data from "./data.js";
import helpers from "./helpers.js";
import win from "./win.js";
import draw from "./draw.js";

const components = {

    comparisons: [
        {
            length: .05,
            img: './img/schema/schmetterling.png'
        },
        {
            length: .55,
            img: './img/schema/kaninchen.png'
        },
        {
            length: 1.8,
            img: './img/schema/mensch.png'
        },
        {
            length: 6,
            img: './img/schema/elefant.png'
        },
        {
            length: 16,
            img: './img/schema/pottwal.png'
        }
    ],

    info({
        content = false,
        legende = '',
        parent = false
    } = {}) {
        const el = dom.create({
            parent,
            classes: ['info']
        })

        dom.create({
            parent: el,
            classes: ['legende'],
            content: legende,
            type: 'span'
        })

        dom.create({
            parent: el,
            classes: ['text'],
            content,
            type: 'span'
        })

        return el;
    },

    linkBtn({
        content = false,
        link = false,
        parent = false
    } = {}) {

        let el = dom.create({
            parent,
            classes: ['linkBtn', 'transit']
        })

        let elLink = dom.create({
            type: 'a',
            parent: el,
            attr: {
                href: link,
                target: '_blank'
            },
            content,
            classes: ['transit']
        })

        return el;
    },

    // Icons, um bspw Lebensraum oder Nahrung zu zeigen
    infoIconset(attrName) {
        if (data.selected[attrName]) {
            const parent = dom.create({
                classes: [`${attrName} info`],
                parent: ui.elDetails
            })

            dom.create({
                parent,
                classes: ['legende'],
                content: data.lang[attrName][settings.lang],
                type: 'span'
            })

            // Mögliche Lebensräume filtern und iterieren
            Object.entries(data.selected[attrName])
                .filter(el => el[1])
                .map(el => el[0])
                .forEach(el => {
                    dom.create({
                        parent,
                        type: 'img',
                        attr: {
                            src: `./img/${data.icons[el]}.png`
                        },
                        classes: ['infoIcon']
                    })
                })
        }
    },

    details(ast) {
        ui.elDetails.innerHTML = '';

        let parentTitle = dom.create({
            parent: ui.elDetails,
            classes: ['elTitle']
        })

        dom.create({
            type: 'h3',
            content: ast.bez,
            parent: parentTitle
        })

        if (ast[settings.lang])
            dom.create({
                type: 'h4',
                parent: parentTitle,
                content: ast[settings.lang]
            })

        if (ast.mioJhrVon)
            components.info({
                parent: ui.elDetails,
                content: `${ast.mioJhrVon} ${data.lang.mioJhr[settings.lang]}`,
                legende: `${data.lang.mioJhrVon[settings.lang]}`
            })

        if (ast.mioJhrBis)
            components.info({
                parent: ui.elDetails,
                content: `${ast.mioJhrBis} ${data.lang.mioJhr[settings.lang]}`,
                legende: `${data.lang.mioJhrBis[settings.lang]}`
            })

        if (ast.fundort)
            components.info({
                parent: ui.elDetails,
                content: ast.fundort,
                legende: data.lang.fundort[settings.lang]
            })

        if (ast.laenge) {
            let parent = components.info({
                parent: ui.elDetails,
                content: false,
                legende: data.lang.laenge[settings.lang]
            })

            let comparison = false;
            components.comparisons.forEach(el => {
                if (el.length < ast.laenge) comparison = el.img;
            })

            // Lebende Art zum Vergleich
            parent.style.height = '100px';
            dom.create({
                type: 'img',
                parent: parent.querySelector('.text'),
                attr: {
                    src: comparison
                },
                classes: ['lengthIcon recent']
            })
            //console.log(ast);
            // Ausgestorbene Art
            let typ = Object.entries(ast.typ).find(el => el[1])[0];
            console.log(typ);
            dom.create({
                type: 'img',
                parent: parent.querySelector('.text'),
                attr: {
                    src: `./img/schema/${typ}.png`
                },
                classes: ['lengthIcon dino']
            })
        }
        // Lebensraum
        components.infoIconset('lebensraum');

        // Nahrung
        components.infoIconset('nahrung')

        // Schmuck
        components.infoIconset('schmuck');



        console.log(data.selected);

        // Link-Buttons
        const elLinks = dom.create({
            parent: ui.elDetails,
            classes: ['linkBtns']
        })

        components.linkBtn({
            content: 'Wikipedia (en)',
            link: `https://en.wikipedia.org/wiki/${ast.bez}`,
            parent: elLinks
        })

        components.linkBtn({
            content: 'Wikipedia (de)',
            link: `https://de.wikipedia.org/wiki/${ast.bez}`,
            parent: elLinks
        })

        components.linkBtn({
            content: 'Dinosaurpictures',
            link: `https://dinosaurpictures.org/${ast.bez}-pictures`,
            parent: elLinks
        })

        components.linkBtn({
            content: 'Dinopedia',
            link: `https://dinopedia.fandom.com/wiki/${ast.bez}`,
            parent: elLinks
        })

    },

    ancestryChild(parent, child) {
        const el = dom.create({
            content: child.bez,
            classes: ['ancestryChild transit'],
            parent,
            listeners: {
                click() {
                    data.selected = child;
                    win.scrollToEl(child);
                    ui.updateDetails();
                }
            }
        })
    },

    ancestry() {
        const parent = document.querySelector('#uiTree .content');
        parent.innerHTML = '';
        data.ancestry.reverse().forEach(el => {
            // console.log(el.bez);
            components.ancestryChild(parent, el);
        })
    },

    searchResult(el, parent) {
        let container = dom.create({
            parent,
            content: el.bez + (el[settings.lang] ? ` (${el[settings.lang]})` : ''),
            classes: ['result transit'],
            listeners: {
                click() {
                    win.scrollToEl(el);
                    ui.updateDetails();
                }
            }
        })
    },

    search() {
        // Callback-Funktion
        const handleInput = evt => {
            const found = [];
            const input = evt.target.value;
            const checkNames = ast => {
                ast.forEach(el => {
                    if (
                        el.bezLow.includes(input)
                        || el[`${settings.lang}Low`].includes(input)
                    ) found.push(el);
                    if (el.children) checkNames(el.children);
                })
            }

            checkNames(data.baum);

            elResults.innerHTML = '';
            found.forEach(el => {
                components.searchResult(
                    el,
                    elResults
                )
            })
        }


        // Eltern-Element suchen und leeren
        const parent = document.querySelector('#uiSuche .content');
        parent.innerHTML = parent.innerHTML = '';

        // DOM-Aufbau
        const inputSearch = dom.create({
            classes: ['input'],
            parent
        })

        dom.create({
            type: 'h5',
            content: data.lang.byname[settings.lang],
            parent: inputSearch
        })

        dom.create({
            type: 'input',
            parent: inputSearch,
            listeners: {
                input: handleInput
            }
        })

        const elResults = dom.create({
            classes: ['results'],
            parent: inputSearch
        })

    },

    settings() {
        // Eltern-Element suchen und leeren
        const parent = document.querySelector('#uiSettings .content');

        parent.innerHTML = parent.innerHTML = '';

        // Callback-Funktion
        const handleChange = evt => {
            settings.lang = sel.value;
            ui.updateUI();
            data.update();
        }

        // DOM-Aufbau
        const elSprache = dom.create({
            parent,
            classes: ['inputs']
        })

        dom.create({
            type: 'h5',
            content: data.lang.sprache[settings.lang],
            parent: elSprache
        })

        const sel = dom.create({
            type: 'select',
            parent: elSprache,
            listeners: {
                change: handleChange
            }
        })

        dom.create({
            type: 'option',
            content: 'Deutsch',
            attr: {
                value: 'de'
            },
            parent: sel
        })

        dom.create({
            type: 'option',
            content: 'English',
            attr: {
                value: 'en'
            },
            parent: sel
        })
        sel.value = settings.lang;


    },

    filter() {
        // Eltern-Element suchen und leeren
        const parent = document.querySelector('#uiFilter .content');
        parent.innerHTML = parent.innerHTML = '';

        // Callback-Funktion
        // Filter nach Mio Jahren
        const handleInput = (evt, changeThis) => {
            let target = evt.target;
            let value = helpers.crop(Number(target.value), 0, data.earliestAge);
            data[changeThis] = value;
            target.value = value;
            // console.log(data.filterMinAge, data.filterMaxAge);
            data.update();
        }

        // DOM-Aufbau
        const inputsMioJhrs = dom.create({
            classes: ['inputs spalten2'],
            parent
        })


        dom.create({
            type: 'h5',
            content: data.lang.byage[settings.lang],
            parent: inputsMioJhrs
        })

        dom.create({
            type: 'input',
            parent: inputsMioJhrs,
            attr: { value: data.earliestAge },
            listeners: {
                input(evt) { handleInput(evt, 'filterMaxAge') }
            }
        })

        dom.create({
            type: 'input',
            parent: inputsMioJhrs,
            attr: { value: 0 },
            listeners: {
                input(evt) { handleInput(evt, 'filterMinAge') }
            }
        })
    }
}

export default components;