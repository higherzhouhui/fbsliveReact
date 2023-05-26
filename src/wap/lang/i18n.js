import i18n from "i18next";
import zh from "./zh.json";
import vie from "./vie.json";
import { initReactI18next } from "react-i18next";
import { Local } from "../../common";
import { userAgent } from "../../utils/tools";

// Local("lang", "zh");
if (userAgent() !== "PC") {
  i18n.use(initReactI18next).init({
    resources: {
      zh: {
        translation: zh,
      },
      vie: {
        translation: vie,
      },
    },
    //默认语言
    lng: Local("lang") || "vie",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
