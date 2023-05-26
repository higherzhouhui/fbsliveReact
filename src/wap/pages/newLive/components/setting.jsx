import React, { useState } from "react";
import style from "./common.module.scss";
import useContextReducer from "../../../state/useContextReducer";

const Share = React.lazy(() => import("../../Center/shares/index"));

export default function Setting() {
  const {
    state: {
      live: { verticalScreen },
    },
  } = useContextReducer.useContextReducer();

  // 分享的app
  const [showShare, setShowShare] = useState(false);
  return (
    <>
      <div className={`${style.right_img} ${!verticalScreen.verticalScreens ? style.right_img_h : ''}`} style={{ marginBottom: `${verticalScreen.verticalScreens ? '8px' : '0'}` }}>
        <img src={require("../../../assets/image/live/xzb/fx.png")} alt="" onClick={() => setShowShare(true)} />
      </div>
      <Share show={showShare} onClose={() => setShowShare()} />
    </>
  );
}
