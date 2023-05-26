import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./common.module.scss";
import useContextReducer from "../../../../state/useContextReducer";
import { Popup } from "antd-mobile";
import { CNavBar } from "../../../../components";

export default function BetHead(props) {
  const {
    state: {
      live: { liveIssue, RoomDownTimeInfo, RoomDownTime, RoomGameList },
    },
  } = useContextReducer.useContextReducer();
  const [visible, visibleSet] = useState(false)
  const { selfRight, nameEmpty } = props;
  const { t } = useTranslation();
  const mTime = (time) => {
    //  秒
    let second = parseInt(time);
    //  分
    let minute = 0;
    //  小时
    let hour = 0;
    if (second > 60) {
      minute = parseInt(second / 60);
      second = parseInt(second % 60);
      if (minute > 60) {
        hour = parseInt(minute / 60);
        minute = parseInt(minute % 60);
      }
    }
    function zoreTime(n) {
      return n > 9 ? n : "0" + n;
    }
    return `${Math.floor(time / 3600) <= 0 ? "" : `${zoreTime(hour)}:`}${zoreTime(minute)}:${zoreTime(second)}`;
  };

  const nav = [
    { name: t("rule"), icon: "gz", url: "" },
    { name: t("kaijiang"), icon: "kj", url: "" },
    { name: 'Biểu đồ', icon: 'ld', url: '' },
  ];

  const getIcon = useMemo(() => {
    if (RoomGameList.length > 0) {
      return RoomGameList.filter((item) => {
        return item.name === liveIssue.name;
      })[0];
    } else return {};
  }, [liveIssue, RoomGameList]);

  return (
    <>
      {/* titlebj.png */}
      <div className={`${style.betHead} ${style.disFlexs}`}>
        <div className={style.top}>
          <div className={style.disFlexb}>
            <div className={`${style.disFlex} ${style.colors2}`}>
              <img src={getIcon?.icon} />
              <div className={style.nickName}>
                {!nameEmpty ? liveIssue.nickName : ""}
              </div>
            </div>
            {!!selfRight ? (
              selfRight
            ) : (
              <div className={style.right_div}>
                {nav.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className={style.demo}
                      onClick={() => {
                        value.icon == "gz" && window.eventBus.emit("ruleEmit");
                        value.icon == "kj" && window.eventBus.emit("showH5BetResult", liveIssue);
                        // value.icon == 'ld' && visibleSet(true)
                        // value.icon == 'ld' &&
                        if (value.icon == 'ld') {
                          console.log(getIcon);
                          window.location = getIcon?.ludanUrl
                        }

                      }}>
                      <img src={require(`../../../../assets/image/live/lottery/${value.icon}icon.png`)} alt="" />
                      <div>{value.name}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className={style.bottom}>
          <div className={style.disFlexb}>
            <div className={`${style.disFlex} ${style.colors}`}>
              {t("fengpan")}：{<div className={style.yellow}>{RoomDownTimeInfo == "封盘" ? t("fengpan") : mTime(RoomDownTime)}</div>}
            </div>
            {props.children}
          </div>
        </div>
      </div>
      <Popup position='right' destroyOnClose onMaskClick={() => visibleSet(false)} visible={visible}>
        <div className={style.popup_ld}>
          <CNavBar title={'Biểu đồ'} left={true} leftClick={() => visibleSet(false)} />
          <iframe src={getIcon?.ludanUrl} className={style.iframes}>

          </iframe>

          {/* getIcon?.ludanUrl */}
        </div>
      </Popup>
    </>
  );
}
