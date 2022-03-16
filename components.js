import ui from "./ui.js";
import dom from './dom.js';
import settings from "./settings.js";
import data from "./data.js";
import helpers from "./helpers.js";
import win from "./win.js";

const components = {

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

        if (ast.laenge)
            components.info({
                parent: ui.elDetails,
                content: `${ast.laenge} ${data.lang.meter[settings.lang]}`,
                legende: data.lang.laenge[settings.lang]
            })

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
        data.ancestry.forEach(el => {
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

        const handleInput = evt => {
            const found = [];
            const input = evt.target.value;
            const checkNames = ast => {
                ast.forEach(el => {
                    if (el.bezLow.includes(input)) found.push(el);
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

            /*
            console.clear();
            console.log( found.map(el => el.bez).join(' ') )
            */
        }

        const parent = document.querySelector('#uiSuche .content');

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

    filter() {
        const parent = document.querySelector('#uiFilter .content');

        // Filter nach Mio Jahren
        const handleInput = (evt, changeThis) => {
            let target = evt.target;
            let value = helpers.crop(Number(target.value), 0, data.earliestAge);
            data[changeThis] = value;
            target.value = value;
            // console.log(data.filterMinAge, data.filterMaxAge);
            data.update();
        }

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