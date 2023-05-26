import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import style from "./common.module.scss";
import Vap from "video-animation-player";
let vap = null;
const Ani = (props) => {
  const { params, dataSet } = props;

  const onLoad = useCallback(() => {
    play();
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad]);
  const play = () => {
    vap = new Vap()
      .play({
        container: document.getElementById(params.id),
        ...params,
      })
      .on("ended", () => {
        dataSet((e) => {
          e.splice(0, 1);
          return e;
        });
        vap.destroy();
        vap = null;
      });
  };

  return <div id={params.id} className={style.FloatingScreen2}></div>;
};

export default Ani;
