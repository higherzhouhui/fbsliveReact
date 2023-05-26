import React, { useState, useEffect, useRef } from "react";
import style from "./index.module.scss";
import { info, getOssToken } from "../../../server/Personal";
import { Avatar, Button, DatePicker, Mask, Toast, NavBar } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useContextReducer from "../../../state/useContextReducer";
import OSS from "ali-oss";
import CropperJs from "cropperjs";
import "cropperjs/dist/cropper.css";
import { Local } from "../../../../common";

let updateInfo = {};
const Personal = () => {
  const now = new Date();
  const now2 = new Date("1800-01-01");
  const { t } = useTranslation();
  const history = useNavigate();
  const [visible, setVisible] = useState(false);
  const [clipImg, clipImgSet] = useState(false);
  const imgRef = useRef(null);

  const cropperRef = useRef();
  const cropperImgRef = useRef(""); //剪切图片临时地址
  const {
    state: { user },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { freshUser } = fetchUtils;
  useEffect(() => {
    freshUser();
  }, []);

  // 修改用户头像
  const editAvatar = () => {
    let inputChoose = document.createElement("input");
    inputChoose.type = "file";
    inputChoose.style = "display:none";
    document.body.appendChild(inputChoose);
    inputChoose.click();
    inputChoose.onchange = async function () {
      let img = document.createElement("img");
      img.onload = () => {
        // alert(img.height)
        // alert(img.width)
        if (img.height >= 500 && img.width >= 500) {
          cropperImgRef.current = URL.createObjectURL(inputChoose.files[0]);
          updateInfo = inputChoose.files[0];
          clipImgSet(true);
          setTimeout(() => {
            const myCropper = new CropperJs(imgRef.current, {
              viewMode: 1,
              dragMode: "move",
              aspectRatio: 1,
              autoCropArea: 0.9,
              highlight: false,
              cropBoxResizable: false,
              toggleDragModeOnDblclick: false,
            });
            cropperRef.current = myCropper;
          }, 50);
        } else {
          Toast.show({
            content: t("qingxuanzebudiyu"),
          });
        }
      };
      img.src = URL.createObjectURL(inputChoose.files[0]);
    };
  };

  const handleSubmitImg = async () => {
    clipImgSet(false);
    // history("/personal");
    cropperRef.current
      .getCroppedCanvas({
        width: 300,
        maxWidth: 300, // maxWidth、maxHeight必须设置，原因见：遇到的bug和解决方案
        height: 300,
        maxHeight: 300, // maxWidth、maxHeight必须设置，原因见：遇到的bug和解决方案
      })
      .toBlob(async (blob) => {
        if (blob) {
          const oss = await getOssToken();
          if (!(oss instanceof Error)) {
            const client = new OSS({
              region: oss.endpoint.split(".")[0],
              accessKeyId: oss.key,
              accessKeySecret: oss.secret,
              bucket: oss.bucketName,
              stsToken: oss.token,
            });
            async function put() {
              try {
                const result = await client.put(`webh5/avatar-${new Date().getTime()}-${updateInfo.name}`, blob);
                infoD({ avatar: result.url });
              } catch (e) {
                console.log(e);
              }
            }
            put();
          }
        }
      }, "image/png");
  };

  // 修改
  const infoD = (data = {}) => {
    info({ ...data }).then((item) => {
      freshUser();
    });
  };
  // 日期
  const dateToSrting = (date) => {
    let str = "";
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    y = y < 10 ? "0" + y : y;
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    str = `${y}-${m}-${d}`;
    return str;
  };
  return (
    <div>
      {/* <CNavBar title={t("xiugaigerenxinxxi")} left={true} /> */}
      <NavBar className={style.wbg} back={null} left={<img src={require("../../../assets/image/kf/left.png")} className={style.leftImg} onClick={() => history(-1)} />} onBack={() => history("/my")}>
        <div className={style.title}>{t("xiugaigerenxinxxi")}</div>
      </NavBar>
      <div className={style.bodys}>
        {/* 头像 */}
        <div className={style.title}>
          <div>{t("touxiang")}</div>
          <div style={{ display: "flex", alignItems: "center" }} onClick={() => editAvatar()}>
            <Avatar src={user?.avatar} alt="" className={style.avatar} style={{ "--size": "44px", "--border-radius": "100%" }} />
            <img src={require("../../../assets/image/center/rights.png")} alt="" style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
          </div>
        </div>
        {/* 内容 */}
        <div className={style.centes}>
          <div className={style.title_font}>{t("jinbengziliao")}</div>
          <div className={`${style.rows} ${style.marginBottom}`}>
            <div>{t("ui_nickname")}</div>
            <div className={style.rows_right} onClick={() => history("/modifyName", { state: { ...user } })}>
              <div className={user?.nickname !== null && user?.nickname !== undefined && user?.nickname.length == 0 ? style.rows_right_color : ""}>{user?.nickname}</div>
              <img src={require("../../../assets/image/center/rights.png")} alt="" style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
            </div>
          </div>
          <div className={`${style.rows} `} onClick={() => history("/modifySex", { state: { ...user } })}>
            <div>{t("sex")}</div>
            <div className={style.rows_right}>
              <div>{user?.sex == 1 ? t("sex1") : user?.sex == 2 ? t("sex2") : t("weizhi")}</div>
              <img src={require("../../../assets/image/center/rights.png")} alt="" style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
            </div>
          </div>
        </div>
        {/* 个人信息 */}
        <div className={style.bottoms}>
          <div className={style.title_font}>{t("gerenxinxi")}</div>
          <div className={style.rows}>
            <div>{t("qianmin")}</div>
            <div className={style.rows_right} onClick={() => history("/modifyAutograph", { state: { ...user } })}>
              <div className={user.signature !== null && user.signature !== undefined && user.signature.length == 0 ? style.rows_right_color : t("jiesaoyixiaziji")}>{user.signature !== null && user.signature !== undefined && user.signature.length == 0 ? t("jiesaoyixiaziji") : user?.signature}</div>
              <img src={require("../../../assets/image/center/rights.png")} alt="" style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
            </div>
          </div>
        </div>
        {/* 账号与安全 */}
        {Local("baseInfo")?.closeFacebook == 0 && (
          <div className={`${style.bottoms} ${style.displays}`}>
            <div
              className={style.rows}
              onClick={() => {
                history("/accountSafe", { state: { x: true, phone: user.phone } });
              }}>
              <div className={style.title_font2}>{t("zhagnhaoyuanquan")}</div>
              <img src={require("../../../assets/image/center/rights.png")} alt="" style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
            </div>
          </div>
        )}
        {/* 修改密码 */}
        <div className={`${style.bottoms} ${style.displays}`}>
          <div
            className={style.rows}
            onClick={() => {
              history("/forget", { state: { x: true, phone: user.phone } });
            }}>
            <div className={style.title_font2}>{t("ui_wap_text_097")}</div>
            <img src={require("../../../assets/image/center/rights.png")} alt="" style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
          </div>
        </div>

        {/* 黑名单 */}
        <div className={`${style.bottoms} ${style.displays}`}>
          <div
            className={style.rows}
            onClick={() => {
              history("/pullBlack");
            }}>
            <div className={style.title_font2}>{t("pullBlack5")}</div>
            <img src={require("../../../assets/image/center/rights.png")} alt="" style={{ width: "14px", height: "14px", marginLeft: "4px" }} />
          </div>
        </div>
      </div>

      <DatePicker
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        min={now2}
        max={now}
        onConfirm={(val) => {
          infoD({ birthday: dateToSrting(val) });
        }}
        cancelText={t("btn_cancel")}
        confirmText={t("baocun")}
        title={t("shengri")}
      />

      <Mask visible={clipImg} destroyOnClose onMaskClick={() => clipImgSet(false)} className="clipImgMask">
        {/* style={{ background: `url(${cropperImgRef.current})`, backgroundSize: '100% 100%' }} */}
        <div className={style.clipBody}>
          <img src={cropperImgRef.current} alt="" ref={imgRef} className={style.clipImg} />
          <div className={style.buts}>
            <Button
              className={style.clipSubmit}
              onClick={() => {
                clipImgSet(false);
                // history("/personal");
              }}>
              {t("chongxingxuanze")}
            </Button>
            <Button className={`${style.clipSubmit} ${style.colors}`} onClick={() => handleSubmitImg()}>
              {t("btn_submit")}
            </Button>
          </div>
        </div>
      </Mask>
    </div>
  );
};

export default Personal;
