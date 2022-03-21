import data from './data.js';
import components from './components.js';
import helpers from './helpers.js';
import settings from './settings.js';

const ui = {
    isHolding: false,
    clickMousePos: [0, 0],
    //pos: [0, 0],
    offset: [0, 0],

    hold(evt) {
        ui.isHolding = true;
        ui.offset = [
            ui.el.offsetLeft - evt.pageX,
            ui.el.offsetTop - evt.pageY
        ];
    },

    leave() {
        ui.isHolding = false;
    },

    move(evt) {
        // console.log(ui.hold);
        if (ui.isHolding) {
            let left = evt.pageX + ui.offset[0];
            let top = evt.pageY + ui.offset[1];
            left = helpers.crop(left, 0, window.innerWidth - ui.el.offsetWidth);
            top = helpers.crop(top, 0, window.innerHeight - ui.el.offsetHeight);
            // console.log(left, top);
            ui.el.style.left = left + 'px';
            ui.el.style.top = top + 'px';
        }
    },

    // Auf die Überschrften, um die Elemente auf- und zuklappen zu können
    makeTitlesActive() {
        //console.log(ui.elTitles);
        ui.elements.forEach(uiElement => {
            let elTitle = uiElement.querySelector('.title');
            elTitle.addEventListener('click', () => {
                uiElement.classList.toggle('active');
            })
        })
    },

    // Abstammungskette aktualisieren
    updateAncestry() {
        data.ancestry = [];
        const getNextAncestry = el => {
            data.ancestry.push(el);
            if (el.parent) getNextAncestry(el.parent)
        }
        getNextAncestry(data.selected);
        components.ancestry();
    },

    updateDetails() {
        components.details(data.selected);
        ui.updateAncestry();
    },
    translateTitles() {
        const titles = [...document.querySelectorAll('#ui .title')];
        //console.log(titles);
        titles.forEach(el => {
            let translateFrom = el.querySelector('.translateFrom');
            let translateTo = el.querySelector('.translateTo');

            translateTo.innerHTML = data.lang[translateFrom.innerHTML][settings.lang];
        })

    },
    updateUI() {
        ui.translateTitles();
        components.details(data.selected);
        components.filter();
        components.search();
        components.settings();
        components.legal();
        components.about();

    },

    init() {
        return new Promise(resolve => {
            ui.el = document.querySelector('#ui');
            ui.elTitle = document.querySelector('#uiTitle');
            ui.elDetails = document.querySelector('#uiDetails .content');
            ui.elLegal = document.querySelector('#uiLegal .content');
            ui.elAbout = document.querySelector('#uiAbout .content');
            ui.elements = [...document.querySelectorAll('#ui .uiElement')];

            //ui.pos = [ui.el.offsetLeft, ui.el.offsetTop];

            // Eventlisteners
            ui.elTitle.addEventListener('mousedown', ui.hold);
            document.body.addEventListener('mouseup', ui.leave);
            document.body.addEventListener('mousemove', ui.move);

            ui.makeTitlesActive();
            ui.updateUI();
        })
    }
}
export default ui;