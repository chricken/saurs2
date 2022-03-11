import data from './data.js';
import components from './components.js';

const ui = {
    isHolding: false,
    clickMousePos: [0, 0],
    pos: [0, 0],
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
    updateDetails(){
        components.details(data.selected);
    },
    init() {
        return new Promise(resolve => {
            ui.el = document.querySelector('#ui');
            ui.elTitle = document.querySelector('#uiTitle');
            ui.elDetails = document.querySelector('#uiDetails .content');

            ui.pos = [ui.el.offsetLeft, ui.el.offsetTop];

            // Eventlisteners
            ui.elTitle.addEventListener('mousedown', ui.hold);
            document.body.addEventListener('mouseup', ui.leave);
            document.body.addEventListener('mousemove', ui.move)
        })
    }
}
export default ui;