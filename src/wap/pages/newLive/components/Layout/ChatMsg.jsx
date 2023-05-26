import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SpinLoading } from "antd-mobile";
import { QtTrans } from "../../../../util/translate";
import style from "./index.module.scss";
import { franc } from "franc";

const ChatMsg = (props) => {
  const { msg } = props;
  const [needTrans, needTransSet] = useState(false); //是否需要翻译
  const [isTrans, isTransSet] = useState(false); //是否已经翻译
  const [transText, transTextSet] = useState(""); //翻译文本
  const [transLoading, transLoadingSet] = useState(false);
  const [hasTrans, hasTransSet] = useState(false);
  const showMsg = useMemo(() => {
    return isTrans ? transText : msg;
  });
  const langList = [
    { glang: "vi", blang: ["vi"], flang: "vie" },
    { glang: "zh-CN", blang: ["zh-CN"], flang: "und" },
    { glang: "en", blang: ["en", "en-US", "en-EG", "en-AU", "en-GB", "en-CA", "en-NZ", "en-IE", "en-ZA", "en-JM", "en-BZ", "en-TT"], flang: "eng" },
  ];
  let [data] = langList.filter((a) => a.blang.includes(navigator.language));
  let lang = data ? data.glang : "vi";

  const onLoad = useCallback(() => {
    let flang = franc(msg, { minLength: 1, only: ["vie", "cha", "eng"] });
    let index = langList.findIndex((a) => {
      return a.flang === flang && a.blang.includes(navigator.language);
    });
    if (index < 0) {
      needTransSet(true);
    }
  }, []);
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const Trans = () => {
    if (!hasTrans) {
      transLoadingSet(true);
      QtTrans(msg, lang)
        .then((res) => {
          transTextSet(res);
          hasTransSet(true);
          isTransSet(true);
          transLoadingSet(false);
        })
        .catch((err) => {
          transLoadingSet(false);
        });
    } else {
      isTransSet((e) => !e);
    }
  };
  return (
    <>
      {showMsg}
      {transLoading ? <SpinLoading className={style.transLoading} style={{ "--size": "20px" }} /> : needTrans && <img src={require("../../../../assets/image/new/text-trans.png")} alt="" className={style.textTrans} onClick={() => Trans()} />}
    </>
  );
};

export default ChatMsg;
