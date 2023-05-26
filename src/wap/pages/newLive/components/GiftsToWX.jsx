import React, { useEffect, useState } from "react";
import style from "./common.module.scss";
import { Button, Mask, Toast, Avatar, ProgressBar } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { getAnchorCard } from "../../../server/live";
import useContextReducer from "../../../state/useContextReducer";

const GiftsToWX = (props) => {
  const {
    state: {
      live: {
        giftData,
        liveDetail,
        verticalScreen
      },
    },
  } = useContextReducer.useContextReducer();
  const { t } = useTranslation();

  const [visible, visibleSet] = useState(false);
  const [getAnchorCardD, getAnchorCardDSet] = useState({});
  const [contactFlag, contactFlagSet] = useState(); // -1关闭 0 未开启 1开起
  const [totalAmounts, totalAmountsSet] = useState(0);

  useEffect(() => {
    window.eventBus.addListener("contactFlagS", contactFlagS);
    return () => {
      window.eventBus.removeListener("contactFlagS", contactFlagS);
    }
  }, []);
  useEffect(() => {
    contactFlagSet(liveDetail?.liveListAnchorInfoVO?.contactFlag);
  }, [liveDetail, liveDetail.liveListAnchorInfoVO.contactFlag]);

  const contactFlagS = (e) => {
    contactFlagSet(e);
  };

  // 点击打开弹窗
  const onLuckBag = async () => {
    const res = await getAnchorCard({ anchorUid: liveDetail?.liveListAnchorInfoVO?.anchorId, liveId: liveDetail?.liveId, language: props.lang });
    if (!(res instanceof Error)) {
      // console.log('image.png', '礼物', giftData, '----', res);
      contactFlagSet(res.contactFlag);
      let totalAmounts = ((res?.totalAmount == null ? 0 : Number(res?.totalAmount)) / Number(res?.contactAmount)) * 100;
      totalAmountsSet(totalAmounts);
      getAnchorCardDSet(res);
      visibleSet(true);
    }
  };

  // 复制
  const copy = (e) => {
    const textarea = document.createElement("textarea");
    textarea.setAttribute("readonly", "readonly");
    textarea.value = e;
    document.body.appendChild(textarea);
    textarea.select();
    if (document.execCommand("copy")) {
      document.execCommand("copy");
      Toast.show({
        content: t("ui_successful_copy"),
        position: "center",
        duration: 1000,
      });
    }
    document.body.removeChild(textarea);
  };

  const giftTrueF = (id) => {

    visibleSet(false)
    let datas
    if (id) {
      giftData.forEach((value, index) => {
        value.propBaseResponses.forEach((value_2, index_2) => {
          if (value_2.gid == id) {
            console.log(index, index_2);
            datas = { index, index_2 }
          }
        })
      })
    }
    window.eventBus.emit("giftTrue", datas);
  }

  return (
    <div>
      {/* 入口 */}
      {
        contactFlag == 1 &&
        (
          <div className={`${style.GiftsToWX} ${!verticalScreen.verticalScreens ? style.GiftsToWX_h : ''}`} onClick={() => onLuckBag()}>
            <img src={require("../../../assets/image/live/gwx/rklog.png")} alt="" className={style.title_img} />
          </div>
        )}
      {/* 内容 */}

      <Mask
        visible={visible}
        destroyOnClose
        onMaskClick={() => {
          visibleSet(false);
        }}>
        <div className={style.GiftsToWX_center}>
          <Avatar style={{ "--size": "70px", "--border-radius": "100%" }} src={getAnchorCardD?.anchorAvatar} className={style.GiftsToWX_Avatar} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />
          <div className={style.GiftsToWX_name}>{getAnchorCardD?.nickname}</div>
          <div className={style.GiftsToWX_qm}>{getAnchorCardD?.signature == null || getAnchorCardD?.signature == undefined || getAnchorCardD?.signature.toString().length == 0 ? t("zhegerenhenlan") : getAnchorCardD?.signature}</div>

          {/* 获取信息 */}
          <div className={style.GiftsToWX_information}>
            <Avatar src={require("../../../assets/image/live/gwx/zalo.png")} style={{ "--size": "30px", "--border-radius": "100%" }} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />
            {getAnchorCardD?.isComplete == false && <div>************</div>}
            {getAnchorCardD?.isComplete == true && <div className={style.contactInfo}>{getAnchorCardD?.contactInfo}</div>}
            {getAnchorCardD?.isComplete == false && (
              <Button
                className={style.GiftsToWX_information_but}
                onClick={() => {
                  giftTrueF(getAnchorCardD?.contactGiftId)
                }}>
                {t("huoqu")}
              </Button>
            )}
            {getAnchorCardD?.isComplete == true && (
              <Button
                className={style.GiftsToWX_information_but}
                onClick={() => {
                  copy(getAnchorCardD?.contactInfo);
                }}>
                {t("btn_copy")}
              </Button>
            )}
          </div>

          {/* 底部信息  */}
          {/* 累计送礼获取 */}
          {getAnchorCardD?.contactGainType == 1 && (
            <div>
              <div className={style.GiftsToWX_mpjd}>{t("huoqumingpianjindu")}</div>
              {getAnchorCardD?.isComplete == false && <div className={style.GiftsToWX_zs}>{t("zengsongliwudadaoyaoqiujikehuoqu")}</div>}
              {getAnchorCardD?.isComplete == true && <div className={style.GiftsToWX_zs}>{t("yidadaohuoquyaoqiu")}</div>}
              <div className={style.GiftsToWX_ProgressBar}>
                <ProgressBar
                  // percent={(getAnchorCardD?.totalAmount == null ? 0 : Number(getAnchorCardD?.totalAmount)) / Number(getAnchorCardD?.contactAmount)}
                  percent={totalAmounts}
                  style={{
                    "--fill-color": "#fff",
                    "--track-color": "#95B6D7",
                    "--track-width": "14px",
                    width: "180px",
                  }}
                  rounded
                />
                <div className={style.GiftsToWX_ProgressBar_div}>
                  {getAnchorCardD?.totalAmount == null ? 0 : getAnchorCardD?.totalAmount}/{getAnchorCardD?.contactAmount}
                </div>
              </div>
            </div>
          )}
          {/* 指定礼物获取 */}
          {getAnchorCardD?.contactGainType == 2 && (
            <div className={style.GiftsToWX_appoint}>
              <Avatar style={{ "--size": "50px" }} src={getAnchorCardD?.cover} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />
              {getAnchorCardD?.isComplete == false && <div className={style.divs}>{t("zengsonghuoqu", { a: getAnchorCardD?.gname })}</div>}
              {getAnchorCardD?.isComplete == true && (
                <div className={`${style.GiftsToWX_appoint_right} ${style.divs}`}>
                  <div className={style.getAnchorCardD_gname}>{t("yizengsongliwu", { a: getAnchorCardD?.gname })}</div>
                  <div className={style.lx}>{t("lijifuzhilianxifangshi")}</div>
                </div>
              )}
            </div>
          )}
          <div className={style.GiftsToWX_bottom_size}>
            1、{t("tianjiashiqingbeizhuniceng")}
            <br />
            2、{t("lianxifangshiruyouxujiaketongguo")}
          </div>

          {/* 关闭按钮 */}
          {/* gb.png */}
          <img
            src={require("../../../assets/image/live/gwx/gb.png")}
            className={style.gb_imgs}
            alt=""
            onClick={() => {
              visibleSet(false);
            }}
          />
        </div>
      </Mask>
    </div>
  );
};

export default GiftsToWX;
