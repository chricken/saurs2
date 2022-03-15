import data from './data.js';
import components from './components.js';

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
            ui.el.style.left = evt.pageX + ui.offset[0] + 'px';
            ui.el.style.top = evt.pageY + ui.offset[1] + 'px';
        }
    },

    // Auf die Überschrften, um die Elemente auf- und zuklappen zu können
    makeTitlesActive() {
        //console.log(ui.elTitles);
        ui.elements.forEach(uiElement => {
            let elTitle = uiElement.querySelector('.title');
            elTitle.addEventListener('click', () => {
                if (uiElement.classList.contains('active')) {
                    uiElement.classList.remove('active');
                } else {
                    //console.log(elTitle);
                    ui.elements.forEach(el => el.classList.remove('active'));
                    uiElement.classList.add('active');
                }
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

    init() {
        return new Promise(resolve => {
            ui.el = document.querySelector('#ui');
            ui.elTitle = document.querySelector('#uiTitle');
            ui.elDetails = document.querySelector('#uiDetails .content');
            ui.elements = [...document.querySelectorAll('#ui .uiElement')];

            //ui.pos = [ui.el.offsetLeft, ui.el.offsetTop];

            // Eventlisteners
            ui.elTitle.addEventListener('mousedown', ui.hold);
            document.body.addEventListener('mouseup', ui.leave);
            document.body.addEventListener('mousemove', ui.move);

            ui.makeTitlesActive();
            components.filter();
            components.search();
        })
    }
}
export default ui;