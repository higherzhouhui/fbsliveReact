import { Local } from "../../common";

export async function QtTrans(text = "", lang = "vi") {
  let appKey = Local("baseInfo") ? Local("baseInfo").googleKey : "AIzaSyBebG1rZCJjTME2zHbnrb4Z1S8XOq0N_qY";
  return new Promise((resolve, reject) => {
    try {
      fetch(`https://translation.googleapis.com/language/translate/v2?key=${appKey}&q=${text}&target=${lang}&format=text`, { method: "post" })
        .then((a) => a.text())
        .then((a) => {
          try {
            resolve(JSON.parse(a).data.translations[0].translatedText);
          } catch (error) {
            reject(new Error(error));
          }
        });
    } catch (error) {
      reject(new Error(error));
    }
    setTimeout(() => {
      reject(new Error("请求超时"));
    }, 6000);
  });
}
