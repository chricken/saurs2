import settings from "./settings.js";

const data = {
    // Teilbaum im sichtbaren Bereich
    baumToDraw: [],

    // Den gesamten Baum zu einem Array umwandeln, damit er sich besser verarbeiten lässt
    changeObjectToArray(aeste) {
        return Object.entries(aeste).map(el => {
            let a = {};
            a.bez = el[0];
            Object.entries(el[1]).forEach(info => a[info[0]] = info[1]);
            if (a.children) a.children = data.changeObjectToArray(a.children);
            return a;
        })
    },

    // Allen Gruppen das Alter der Kinder zuweisen, damit auch die Gruppen im Diagram ein Alter haben
    agesToGroup(ast, alter) {
        ast.forEach(el => {

            if (el.children) {
                let lokalAlter = { von: 0, bis: 1000 };
                data.agesToGroup(
                    el.children, [...alter, lokalAlter]
                );

                el.mioJhrVon = lokalAlter.von;
                el.mioJhrBis = lokalAlter.bis;

            } else {
                alter = alter.map(alterEl => {
                    if (el.mioJhrVon) alterEl.von = Math.max(el.mioJhrVon, alterEl.von);
                    if (el.mioJhrBis) alterEl.bis = Math.min(el.mioJhrBis, alterEl.bis);
                    return alterEl;
                })
            }
        })
    },

    // Für alle Spezies und Gruppen die absolute Position (in px) ablegen
    calcPos(ast, pos) {
        ast.forEach(el => {
            if (!el.children) {
                // Wenn es eine Spezies ist
                el.pos = pos;
                pos += settings.heightSpecies;
            } else {
                // Wenn es eine Gruppe ist
                el.pos = pos;
                pos += settings.heightGroup;
                if (!el.collapsed) {
                    pos = data.calcPos(el.children, pos);
                }
            }
        })
        return pos;
    },

    /*
    TODO: Gruppen sollen einen Pfeil tragen. Wird der angeklickt, dann wird die Gruppe zusammengeklappt
    */
    init() {
        return Promise.all([
            fetch('data/daten.json'),
            fetch('data/attributes.json'),
            fetch('data/lang.json'),
            fetch('data/icons.json'),
            fetch('data/schema_dino.json'),
            fetch('data/schema_rezent.json')
        ]).then(
            res => {
                return Promise.all(res.map(el => el.json()));
            }
        ).then(
            res => {
                data.baum = res[0];
                data.attr = res[1];
                data.lang = res[2];
                data.icons = res[3];
                data.schema_dino = res[4];
                data.schema_rezent = res[5];
            }
        ).then(
            () => data.baum = data.changeObjectToArray(data.baum)
        ).then(
            () => data.agesToGroup(data.baum, [])
        ).then(
            () => data.calcPos(data.baum, 0)
        ).then(
            console.log
        )
    }
}

export default data;