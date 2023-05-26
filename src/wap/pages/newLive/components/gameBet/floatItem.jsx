import React, { useEffect, useMemo } from "react";
import style from "./common.module.scss";
import game1Icon1 from "../../../../assets/image/live/fllu.png";
import game1Icon2 from "../../../../assets/image/live/flxie.png";
import game1Icon3 from "../../../../assets/image/live/frji.png";
import game1Icon4 from "../../../../assets/image/live/frfish.png";
import game1Icon5 from "../../../../assets/image/live/flpangxie.png";
import game1Icon6 from "../../../../assets/image/live/flxia.png";
import game2Icon1 from "../../../../assets/image/live/dot01.png";
import game2Icon2 from "../../../../assets/image/live/dot02.png";
import game2Icon3 from "../../../../assets/image/live/dot03.png";
import game2Icon4 from "../../../../assets/image/live/dot04.png";
import game2Icon5 from "../../../../assets/image/live/dot05.png";
import game2Icon6 from "../../../../assets/image/live/dot06.png";

const Ball = React.lazy(() => import("./ball"));
export default function FloatItem(props) {
  const { info, index, finish } = props;
  const game1IconList = [{ icon: game1Icon1 }, { icon: game1Icon2 }, { icon: game1Icon3 }, { icon: game1Icon4 }, { icon: game1Icon5 }, { icon: game1Icon6 }];

  // jsks图标库
  const game2IconList = [{ icon: game2Icon1 }, { icon: game2Icon2 }, { icon: game2Icon3 }, { icon: game2Icon4 }, { icon: game2Icon5 }, { icon: game2Icon6 }];

  const getGame1Icon = (index) => {
    return game1IconList[index - 1] ? game1IconList[index - 1].icon : "";
  };

  const getGame2Icon = (index) => {
    return game2IconList[index - 1] ? game2IconList[index - 1].icon : "";
  };

  const getNow = () => {
    return Date.parse(new Date()) / 1000;
  };
  const hideBody = useMemo(() => {
    return getNow() - info.time > 8;
  });
  const hideAni = useMemo(() => {
    return getNow() - info.time > 5;
  });
  const showAni = useMemo(() => {
    let time = getNow() - info.time;
    return time < 1;
  });
  useEffect(() => {
    if (hideBody) {
      finish(index);
    }
  }, [hideBody]);

  return (
    <>
      {!hideBody && (
        <div className={`${showAni ? style.ani : ""} ${hideAni ? style.hideAni : ""} ${style.floorWindow1}`}>
          {/* <img src={require('../../../../assets/image/live/xlog.png')} className={style.close} onClick={() => close()} /> */}
          <div className={style.title}>
            {/* ---{t('issues')} */}
            <div className={style.title_nickName}>{info.nickName}</div>
            <div className={style.title_expect}>{info.expect}</div>
          </div>
          {info.name === "yuxx" && (
            <div className={style.content}>
              {info.resultList.map((item, index) => (
                <img src={getGame1Icon(item)} key={index} className={style.icon} />
              ))}
            </div>
          )}
          {(info.name === "jsks" || info.name === "jsks5" || info.name === "tz") && (
            <div className={style.content}>
              {info.resultList.map((item, index) => (
                <img src={getGame2Icon(item)} key={`topHis${index}`} />
              ))}
            </div>
          )}
          {info.name === "txssc" && (
            <div className={style.content}>
              {info.resultList.map((item, index) => (
                <i key={`fast${index}`} className={style.redCard}>
                  {item}
                </i>
              ))}
            </div>
          )}
          {info.name === "yflhc" && (
            <div className={style.content}>
              {info.resultList
                .filter((v, i) => i < 6)
                .map((item, index) => (
                  <i key={`tm${index}`} className={style.redCard}>
                    {item}
                  </i>
                ))}
              +{info.resultList[7] == 2 ? <i className={style.greenCard}>{info.resultList[6]}</i> : info.resultList[7] == 3 ? <i className={style.blueCard}>{info.resultList[6]}</i> : <i className={style.redCard2}>{info.resultList[6]}</i>}
            </div>
          )}
          {(info.name === "pk10" || info.name === "xyft") && (
            <div className={style.content}>
              {info.resultList.map((item, index) => (
                <i key={`guanjun${index}`} className={style.redCard}>
                  {item}
                </i>
              ))}
            </div>
          )}
          {info.name === "ft" && (
            <div className={style.content}>
              <Ball list={info.resultList} />
            </div>
          )}
          {info.name === "race1m" && (
            <div className={style.content}>
              {info.resultList.map((item, index) => (
                <img src={require(`../../../../assets/image/newRankingList/day${item}.png`)} key={`other${index}`}></img>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
``;
