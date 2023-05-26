import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Local } from '../common';
//配置中文的配置文件
import translation_zh from './zh.json';
//配置英文的配置文件
import translation_vie from './vie.json'
const resources = {
  zh: {
    translation: translation_zh
  },
  vie: {
    translation: translation_vie
  }
};
// 默认设置越南语
let lng = 'vie'
if (Local('lang')) lng = Local('lang')
Local('lang', lng)
i18n.use(initReactI18next).init({
  resources,
  lng,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
