import ui from "./ui.js";
import dom from './dom.js';
import settings from "./settings.js";
import data from "./data.js";

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
            classes: ['linkBtn']
        })

        let elLink = dom.create({
            type: 'a',
            parent: el,
            attr: {
                href: link,
                target: '_blank'
            },
            content,
            classes: ['linkBtn']
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
            parent:ui.elDetails,
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

}

export default components;