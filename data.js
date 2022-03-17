import settings from "./settings.js";
import helpers from './helpers.js';
import win from "./win.js";
import draw from "./draw.js";

const data = {
    // Teilbaum im sichtbaren Bereich
    baumToDraw: [],
    ancestry: [],
    locations: new Set(),
    lowerEdge: 0,
    earliestAge: 358,
    filterMinAge: 0,
    filterMaxAge: 358,
    filterLocations: [],

    // Zeitalter
    ages: [{
        bez: 'karbon',
        von: 358,
        bis: 298,
        hue: 0
    }, {
        bez: 'perm',
        von: 298,
        bis: 251.9,
        hue: 30
    }, {
        bez: 'trias',
        von: 251.9,
        bis: 201.3,
        hue: 60
    }, {
        bez: 'jura',
        von: 201.3,
        bis: 145,
        hue: 90
    }, {
        bez: 'kreide',
        von: 145,
        bis: 66,
        hue: 120
    }, {
        bez: 'ceno',
        von: 66,
        bis: 0,
        hue: 150
    }],

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

    // Um die Suche zu vereinfachen, wird hier der biologische, deutsche und englische Name in Kleinbuchstaben angehängt
    addLowerCase(ast) {

        ast.forEach(el => {
            el.bezLow = el.bez.toLowerCase();
            el.deLow = el.de ? el.de.toLowerCase() : '';
            el.enLow = el.en ? el.en.toLowerCase() : '';
            if (el.children) data.addLowerCase(el.children)
        })

    },

    // Ein neues Array anlegen, das nur die Spezies enthält, die im Viewport liegen
    fillBaumToDraw() {
        data.baumToDraw = [];
        const selectEl = el => {
            let padding = Math.max(settings.heightSpecies, settings.heightGroup);
            // console.log(el.pos, (win.scrollTop - padding), (win.scrollBottom + padding));

            if (
                (!el.filtered) &&
                (el.pos > (win.scrollTop - padding)) &&
                (el.pos < (win.scrollBottom + padding))
            ) {
                data.baumToDraw.push(el);
            }
            if (el.children) {
                el.children.forEach(selectEl);
            }
        }

        data.baum.forEach(selectEl);

        // console.log(data.baumToDraw.map(el => el.bez));
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
            if (!el.filtered) {
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
            }
            data.lowerEdge = (pos > data.lowerEdge) ?
                pos :
                data.lowerEdge;
        })



        return pos;
    },
    calcLowerEdge() {
        data.lowerEdge = 0;
        const calc = el => {
            if (!el.filtered) {
                data.lowerEdge += el.children ? settings.heightGroup : settings.heightSpecies;
                if (el.children) el.children.forEach(calc);
            }
        }
        data.baum.forEach(calc);
        // data.lowerEdge += 1000;
        //console.log(data.lowerEdge);

    },
    insertParents(ast) {
        ast.forEach(el => {
            if (el.children) {
                el.children.forEach(child => {
                    child.parent = el;
                })
                data.insertParents(el.children);
            }
        })
    },

    // Nach übergebenem Paremeter sortieren
    sort(ast, sortBy, asc) {

        if (asc) ast.sort((a, b) => a[sortBy] < b[sortBy] ? -1 : 1);
        else ast.sort((a, b) => a[sortBy] > b[sortBy] ? -1 : 1);

        ast.forEach(el => {
            if (el.children) data.sort(el.children, sortBy)
        })
    },

    // Jedem Mitglied des Astes eine individuelle Farbe geben
    colorize(ast) {
        ast.forEach(el => {
            if (el.children) {
                //el.color = helpers.createColor(draw.hueGroup);
                el.color = helpers.createColor({
                    hueMin: 160,
                    hueMax: 320,
                    satMin: 50,
                    satMax: 50,
                    lightMin: 20,
                    lightMax: 30
                });
                data.colorize(el.children)
            } else {
                // el.color = helpers.createColor(draw.hueSpecies);
                el.color = helpers.createColor({
                    hueMin: 160,
                    hueMax: 320,
                    satMin: 50,
                    satMax: 50,
                    lightMin: 70,
                    lightMax: 80
                });

            }
        })
    },

    // Alle Fundorte in ein Array schreiben
    getLocations() {
        const getLoc = ast => {
            ast.forEach(el => {
                if (el.fundort) {
                    data.locations.add(...el.fundort.split(', '));
                }
                if (el.children) {
                    getLoc(el.children)
                }
            })
        }
        getLoc(data.baum);
        data.locations = [...data.locations];
        data.locations.sort();
    },

    // Fundorte der Kinder an die Eltern weitergeben
    locationsToParents(){
        const locToParents = (ast, parentLoc) => {
            ast.forEach(child => {
                let loc = [];
                // Eigene Fundorte an die der Eltern-Elemente hängen
                if ( child.fundort ) {
                    let fundort = child.fundort.split(', ');
                    parentLoc.forEach(elParentLoc => {
                        elParentLoc.push(...fundort);
                        elParentLoc = [...new Set(elParentLoc)];
                    });
                }
                parentLoc.push(loc);
                if(child.children) {
                    locToParents(child.children, [...parentLoc]);
                    child.fundort = [...new Set(loc)].join(', ');
                }

            })

        }
        locToParents(data.baum, []);
    },

    // Spezies zählen
    countSpecies(ast, numSpecies) {
        let sumSpecies = 0;
        ast.forEach(el => {
            if (el.children) {
                el.numSpecies = el.children.filter(child => !child.children).length
                el.numSpecies += data.countSpecies(el.children);
                sumSpecies += el.numSpecies;
            }
        })
        return sumSpecies;
    },

    // mögliche Fundorte sortieren
    sortLocations(){
        let locations = Object.entries(data.langLocations);
        locations.sort((a,b) => a[1][settings.lang] > b[1][settings.lang]);
        data.langLocations = {};
        locations.forEach(loc => {
            data.langLocations[loc[0]] = loc[1];
        })
       // console.log(data.langLocations);
    },

    // Nach Lebenszeitraum filtern
    filterByAge() {
        const filter = ast => {
            ast.forEach(el => {
                if (el.mioJhrBis > data.filterMaxAge && el.mioJhrVon > data.filterMaxAge) el.filtered = true;
                if (el.mioJhrBis < data.filterMinAge && el.mioJhrVon < data.filterMinAge) el.filtered = true;
                if (el.children) filter(el.children);
            })
        }
        filter(data.baum);
    },

    filterByLocations() {
        if (data.filterLocations.length) {
            const filter = ast => {
                ast.forEach(el => {
                    // Default: Element wird ausgefiltert
                    let filtered = true;

                    // Prüfen, ob ein Fundort hinterlegt ist
                    if (el.fundort) {
                        // Fundort und Filter vergleichen
                        el.fundort.split(', ').forEach(fundort => {
                            data.filterLocations.forEach(filter => {
                                // Wessen Fundort im Filter gespeichert ist, wird eingebunden
                                if (fundort == filter) filtered = false;
                            })
                        })
                        el.filtered = el.filtered || filtered;
                    } else {
                        el.filtered = true;
                    }
                    if (el.children) filter(el.children);
                })
            }
            filter(data.baum);
        }
    },

    // Einstellungen sichern
    saveSettings() {
        let settingsToSave = {
            lang: settings.lang
        }
        localStorage.setItem('settings', JSON.stringify(settingsToSave));
    },

    // Baum aktualisieren
    update() {
        // Filter zurücksetzen
        const resetFilter = ast => {
            ast.forEach(el => {
                el.filtered = false;
                if (el.children) resetFilter(el.children);
            })
        }
        resetFilter(data.baum);
        data.filterByAge();
        data.filterByLocations();
        data.sortLocations();
        data.calcPos(data.baum, 0);
        data.calcLowerEdge();
        data.fillBaumToDraw();
        draw.diagram();
    },

    init() {
        return Promise.all([
            fetch('data/daten.json'),
            fetch('data/attributes.json'),
            fetch('data/lang.json'),
            fetch('data/icons.json'),
            fetch('data/schema_dino.json'),
            fetch('data/schema_rezent.json'),
            fetch('data/lang_locations.json'),
        ]).then(
            res => Promise.all(res.map(el => el.json()))
        ).then(
            res => {
                data.baum = res[0];
                data.attr = res[1];
                data.lang = res[2];
                data.icons = res[3];
                data.schema_dino = res[4];
                data.schema_rezent = res[5];
                data.langLocations = res[6];
            }
        ).then(
            () => Promise.all([
                fetch('data/legal_de.html'),
                fetch('data/legal_en.html'),
            ])
        ).then(
            res => {
                return Promise.all(res.map(el => el.text()));
            }
        ).then(
            res => {
                data.legal_de = res[0];
                data.legal_en = res[1];
            }
        ).then(
            () => {
                let saved = localStorage.getItem('settings');
                if (saved) {
                    saved = JSON.parse(saved);
                    settings.lang = saved.lang;
                }
            }
        ).then(
            () => data.baum = data.changeObjectToArray(data.baum)
        ).then(
            () => data.sortLocations()
        ).then(
            () => data.addLowerCase(data.baum)
        ).then(
            () => data.getLocations()
        ).then(
            () => data.locationsToParents()
        ).then(
            () => data.sort(data.baum, 'mioJhrVon', false)
        ).then(
            () => data.agesToGroup(data.baum, [])
        ).then(
            () => data.countSpecies(data.baum, [])
        ).then(
            () => data.colorize(data.baum)
        ).then(
            () => data.calcPos(data.baum, 0)
        ).then(
            () => data.calcLowerEdge()
        ).then(
            () => data.insertParents(data.baum)
        ).then(
            () => {
                //console.log([...data.locations].join());
            }
        )
    }
}

export default data;