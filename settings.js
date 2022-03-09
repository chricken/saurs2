const settings = {
    lang: 'de',
    heightGroup: 40,
    heightSpecies: 40,



    loadLanguage() {
        // Sprache laden
        settings.language = localStorage.getItem('language') || settings.language;
    },
    init() {
        return new Promise(resolve => {
            settings.loadLanguage();
            resolve();
        })
    }
}

export default settings;