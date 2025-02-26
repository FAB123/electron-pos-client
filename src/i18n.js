import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/common.json";
import translationAR from "./locales/ar/common.json";

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
