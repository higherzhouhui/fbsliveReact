import { Button, Popup, Toast } from "antd-mobile";
import React, { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { ProUser, incomeDetail } from '../../../server/center'
import { Local } from "../../../../common";

const Shares = (props) => {
  const { show, onClose } = props;
  const { t } = useTranslation();
  const history = useNavigate();
  const codeUrl = `${Local("baseInfo")?.shareUrl}?puid=${Local("userInfo")?.uid}`;

  const [detail, setDetail] = useState({
    allProfit: 0,
    shareCount: 0,
    balance: 0,
    bindRebate: 0,
    shareFee: 0,
    promotionTopupMin: 0,
    promotionWithdrawFee: 0,
    promotionWithdrawMin: 0,
    promotionLotteryFee: 0,
    promotionGiftFee: 0
  })
  const [createPictures, createPicturesSet] = useState(false)

  const init = useCallback(async () => {
    const res = await ProUser()
    if (!(res instanceof Error)) {
      console.log('ProUser', res);
      setDetail(res)
    }
    // const res2 = await incomeDetail({ page: 0 })
    // if (!(res2 instanceof Error)) {

    //   console.log('数据', res2,);
    // }
  }, [])
  useEffect(() => {
    if (show) {
      init()
    }
  }, [show])


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
        position: "top",
      });
    }
    document.body.removeChild(textarea);
  };

  // 保存二维码
  const createPicture = (ids) => {
    html2canvas(document.querySelector(`#${ids}`)).then((res) => {
      let imgUrl = res.toDataURL("image/png");
      // console.log('图片临时地址',imgUrl)
      let aLink = document.createElement("a");
      aLink.href = imgUrl;
      aLink.download = new Date().toLocaleString() + ".png"; //导出文件名，这里以时间命名
      document.body.appendChild(aLink);
      // 模拟a标签点击事件
      aLink.click();
      // 事件已经执行，删除本次操作创建的a标签对象
      document.body.removeChild(aLink);
    });
  };

  return (
    <div>
      <Popup visible={show} onMaskClick={() => { createPictures ? createPicturesSet(false) : onClose() }} bodyClassName={style.bbg}>
        {/* 顶部 */}
        <div className={style.topBg} >
          <div className={style.title}><div className={style.title_left}></div> {t('yaoqinghaoyouyiqiwanyouxi')} <div className={style.title_right}></div></div>
          <div className={style.des}>Mời bạn bè tham gia nhận ngay {detail?.promotionLotteryFee}%, cược và {detail?.promotionGiftFee}% quà</div>
          <img src={require("../../../assets/image/center/share-top-icon.png")} className={style.topIcon} alt="shareIcon" />
        </div>
        <div className={style.wrap}>
          {/* 邀请链接 */}
          <div className={style.shareSection}>
            <div className={style.shareWrap}>
              <QRCode value={codeUrl} style={{ width: "94px", height: "94px" }} className={style.QRCode} />
              <div className={style.shareWrapRight}>
                <div className={style.shareWrapTop}>
                  <dt style={{ marginBottom: '8px' }}>{t('fenxianglianjie')}</dt>
                  <dd style={{ whiteSpace: 'nowrap', overflow: 'hidden', width: '80%', textOverflow: 'ellipsis' }}>{codeUrl}</dd>
                </div>
                <div className={style.shareWrapBottom}>
                  <Button className={style.eventBtn} onClick={() => copy(codeUrl)}>
                    {t("ui_copy_link")}
                  </Button>
                  <Button className={`${style.eventBtn} ${style.fillBtn}`} onClick={() => createPicturesSet(true)}>
                    {t('baocun')}
                  </Button>
                </div>
              </div>
            </div>
            <div className={style.shareWrapEnter} onClick={() => {
              history('/InvitationDetails', { state: codeUrl })
            }}>
              {t('yaoqingmingxi')}
              <img src={require("../../../assets/image/center/left.png")} className={style.leftIcon} />
            </div>
          </div>
          {/* 您的推荐 */}
          <div className={style.shareData}>
            <div className={style.shareDataTitle}>
              {t('nindetuijiain')}
              <span onClick={() => history("/shareDetail")}>
                {t('shouyimingxi')}
                <img src={require("../../../assets/image/center/left.png")} className={style.leftIcon} />
              </span>
            </div>
            <div className={style.shareDataContent}>
              <div className={style.disFlexs}>
                <dt>{detail?.allProfit}</dt>
                <dd>{t("rebate6")}</dd>
              </div>
              <div className={style.disFlexs}>
                <dt>{detail?.shareCount}</dt>
                <dd>{t("rebate8")}</dd>
              </div>
            </div>
          </div>
        </div>


        {/* createPicture("QRCodes") */}
        {/* 保存图片内容 */}
        {
          createPictures && <div id="QRCodes" style={{ position: 'fixed', top: '-50%', left: '50%', zIndex: '9', transform: 'translate(-50%,0)', width: '302px', height: '511px', background: `url(${require('../../../assets/image/center/fx/fxtanc.png')})`, backgroundSize: '100% 100%', }}>
            <QRCode value={codeUrl} style={{ width: "130px", height: "130px", position: 'absolute', bottom: '134px', left: '86px' }} />

            <img src={require('../../../assets/image/center/fx/fz.png')} alt="" className={style.fz_img} onClick={() => { copy(codeUrl) }} />
            <img src={require('../../../assets/image/center/fx/xiaz.png')} alt="" className={style.fz_xiaz} onClick={() => { createPicture('QRCodes') }} />

            {/* <img src={require('../../../assets/image/center/fx/gb.png')} alt="" className={style.imgs} onClick={() => { createPicturesSet(false) }} /> */}
          </div>
        }
        {createPictures && <div onClick={() => createPicturesSet(false)} className={style.mc_back}>

        </div>}
      </Popup >
    </div>
  );
};

export default Shares;
