import ui from "./ui.js";
import dom from './dom.js';
import settings from "./settings.js";
import data from "./data.js";
import helpers from "./helpers.js";
import win from "./win.js";

const components = {

    legal() {
        ui.elLegal.innerHTML = data[`legal_${settings.lang}`];
    },

    about() {
        ui.elAbout.innerHTML = data[`about_${settings.lang}`];
    },

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
        if (ast) {
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

            // Lebenszeitraum
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

            // Fundort
            if (ast.fundort) {
                let fundorte = ast.fundort.split(', ')
                    .map(el => data.langLocations[el][settings.lang])
                    .join(', ');

                const parent = components.info({
                    parent: ui.elDetails,
                    //content: fundorte,
                    legende: data.lang.fundort[settings.lang]
                })
                const parentImgs = dom.create({
                    parent,
                    classes: ['parentImgs']
                })
                dom.create({
                    parent: parentImgs,
                    type: 'img',
                    attr: {
                        src: './img/loc/bg.png'
                    },
                    classes: ['imgLocation', 'sizeReference']
                })

                ast.fundort.split(', ').forEach(el => {
                    dom.create({
                        parent: parentImgs,
                        type: 'img',
                        attr: {
                            src: `./img/loc/${el}.png`
                        },
                        classes: ['imgLocation'],
                        listeners: {
                            error(evt) {
                                console.log(el);
                            }
                        }
                    })
                })

            }

            // Gewicht
            if (ast.gewicht)
                components.info({
                    parent: ui.elDetails,
                    content: `${ast.gewicht}kg`,
                    legende: data.lang.gewicht[settings.lang]
                })

            // Längenübersicht
            if (ast.laenge) {
                let parent = components.info({
                    parent: ui.elDetails,
                    legende: data.lang.laenge[settings.lang]
                })
                dom.create({
                    parent,
                    content: `${ast.laenge} ${data.lang.meter[settings.lang]}`,
                    classes: ['value'],
                    type: 'span'
                })

                let comparison = false;
                data.schema_rezent.forEach(el => {
                    if (el.laenge < ast.laenge) comparison = el;
                })

                // Lebende Art zum Vergleich
                let scale = comparison.laenge / ast.laenge;
                //console.log(scale);
                parent.style.height = '100px';
                dom.create({
                    type: 'img',
                    parent: parent.querySelector('.text'),
                    attr: {
                        src: `./img/schema/${comparison.url}`
                    },
                    styles: {
                        transform: `scale(${scale})`
                    },
                    classes: ['lengthIcon recent']
                })

                // Ausgestorbene Art
                let typ = Object.entries(ast.typ).find(el => el[1])[0];

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


            // Link-Buttons
            const elLinks = dom.create({
                parent: ui.elDetails,
                classes: ['linkBtns']
            })

            components.linkBtn({
                content: 'Wikipedia (en)',
                link: `https: //en.wikipedia.org/wiki/${ast.bez}`,
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
        }
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
                        el.bezLow.includes(input) ||
                        el[`${settings.lang}Low`].includes(input)
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
            data.saveSettings();
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
        // Filter nach Mio Jahre
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

        // Filter nach Fundort
        dom.create({
            parent,
            type: 'h5',
            content: data.lang.byLocation[settings.lang]
        })

        data.locations.forEach(loc => {
            // console.log(loc);
            const elFilterBtn = dom.create({
                parent,
                content: data.langLocations[loc][settings.lang],
                classes: ['filterBtn', 'transit'],
                listeners: {
                    click() {
                        if (!data.filterLocations.includes(loc)) data.filterLocations.push(loc);
                        else data.filterLocations = data.filterLocations.filter(el => el != loc);
                        components.filter();
                        data.update();
                    }
                }
            })
            if (data.filterLocations.includes(loc))
                elFilterBtn.classList.add('active');
        })
    }
}

export default components;