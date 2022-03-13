import ui from "./ui.js";
import dom from './dom.js';;

const components = {
    details(data) {
        ui.elDetails.innerHTML = '';

        let elBez = dom.create({
            type: 'h3',
            content: data.bez,
            parent: ui.elDetails
        })
    },

}

export default components;