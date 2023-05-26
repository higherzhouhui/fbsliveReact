import React, { useEffect, useState } from "react";
import style from "./index.module.scss";
import useContextReducer from "../../../../state/useContextReducer";

const Index = () => {
  const {
    state: { anchorCardReq },
  } = useContextReducer.useContextReducer();

  const anchorCardsStyle = (e) => {
    switch (e) {
      case 1:
        return style.style1;
      case 2:
        return style.style2;
      case 3:
        return style.style3;
      case 4:
        return style.style4;
    }
  };

  return (
    <>
      {anchorCardReq?.content && anchorCardReq?.content.length > 0 && (
        <div className={`${style.styles} ${anchorCardsStyle(anchorCardReq?.style)}`} style={{ left: `${anchorCardReq?.x * 100}%`, top: `${anchorCardReq?.y * 100}%`, color: `${anchorCardReq?.textColor}`, fontSize: `${anchorCardReq?.fontSize}px`, fontWeight: `${anchorCardReq?.fontBold ? "bold" : "none"}` }}>
          {anchorCardReq?.content}
        </div>
      )}
    </>
  );
};

export default Index;
