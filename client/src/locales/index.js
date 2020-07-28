import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';
// translation files import
import translationEn from './en/translations.json';
import translationHe from './he/translations.json';
import {initReactI18next} from 'react-i18next';
// initialization
i18n
    .use(XHR)
    .use(LanguageDetector)
    .use(initReactI18next) // bind react-i18next to the instance
    .init({
        debug: true,
        lng: 'en',
        fallbackLng: 'en', // use heb if detected lng is not available
        // keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        // translation files are added here
        resources: {
            'en': {
                translations: translationEn
            },
            'he': {
                translations: translationHe
            }
        },
        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations'
    });

// plural fix for hebrew https://github.com/i18next/i18next/issues/1122#issuecomment-525271129
const origGetSuffix = i18n.services.pluralResolver.getSuffix;
i18n.services.pluralResolver.getSuffix = (code, count, ...other) => {
    if (code === 'he') {
        // special case for 0
        if (count === 0) {
            return '_0';
        }
        // case for plural
        if (count > 1) {
            return '_plural';
        }
        return '';
    }
    return origGetSuffix.call(i18n.services.pluralResolver, code, count, ...other);
};

export default i18n;
