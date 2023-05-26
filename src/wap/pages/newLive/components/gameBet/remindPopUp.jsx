import React from "react";
import style from "./common.module.scss";
import { Mask } from "antd-mobile";
import useContextReducer from "../../../../state/useContextReducer";

const RemindPopUp = (props) => {
  const {
    state: {
      live: { RoomGameList, liveIssue },
    },
  } = useContextReducer.useContextReducer();
  const { tipsPopUp2, tipsPopUpSet2 } = props;
  let [item] = RoomGameList?.filter((a) => a.name === liveIssue.name);
  return (
    <>
      <Mask
        visible={tipsPopUp2}
        onMaskClick={() => {
          tipsPopUpSet2();
        }}
        getContainer={document.body}
        style={{
          zIndex: "99999",
        }}>
        <div className={style.RemindPopUps}>
          {/* title */}
          <div className={style.RemindPopUps_title}>{item?.chinese}</div>
          {/* 内容 */}
          <div className={style.RemindPopUps_center}>
            {/* 换行处理 */}
            <div className={style.RemindPopUps_magrin} dangerouslySetInnerHTML={{ __html: item?.playMethod?.replace(/\n/g, "<br>") }}>
              {/* {item.playMethod} */}
            </div>
          </div>
        </div>
      </Mask>
    </>
  );
};

export default RemindPopUp;
