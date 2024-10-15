// import { EN_US, ES_AR } from '../enums/languages';
const ES_AR = 'es-AR';
const EN_US = 'en-US';

const PROJECT_ID = 'cm29kyxe30001s5ds5flu7oa7';
let translations = null;
let language = ES_AR;

export async function getTranslations(lang, callback) {
    localStorage.clear();
    translations = null;
    language = lang;
    
    if (language === ES_AR) {
        return callback ? callback() : false;
    }

    return await fetch(`https://traducila.vercel.app/api/translations/cm29kyxe30001s5ds5flu7oa7/en-US`)
    //${language}${PROJECT_ID}
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('translations', JSON.stringify(data));
        translations = data;
        if(callback) callback()
    });
}





export function getPhrase(key) {
    if (!translations) {
        const locals = localStorage.getItem('translations');
        translations = locals ? JSON.parse(locals) : null;
    }

    let phrase = key;
    if (translations && translations[key]) {
        phrase = translations[key];
    }

    return phrase;
}






function isAllowedLanguge(language) {
    const allowedLanguages = ['es-AR', 'en-US', 'pt-BR', 'de-DE','fr-FR'];
    return allowedLanguages.includes(language);
}

export function getLanguageConfig() {
    let languageConfig;

    // Obtener desde la URL el idioma
    console.log(window.location.href)

    /* 
      depende como lo manejemos: 
      1) puede venir como www.dominio.com/es-AR
      2) puede venir como www.dominio.com?lang=es-AR

      En el primer caso se obtiene con: window.location.pathname
      En el segundo caso se obtiene leyendo el query param lang 
      
      vamos a implementar una logica que cubra ambos casos
    */

    const path = window.location.pathname !== '/' ? window.location.pathname : null;
    const params = new URL(window.location.href).searchParams;
    const queryLang = params.get('lang');

    languageConfig = path ?? queryLang;

    if (languageConfig) {
        if (isAllowedLanguge(languageConfig)) {
            return languageConfig;
        }
    }

    const browserLanguage = window.navigator.language;
    if (isAllowedLanguge(browserLanguage)) {
        return browserLanguage;
    }

    return ES_AR;
}