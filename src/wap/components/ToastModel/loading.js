import { Button } from "antd-mobile";
import React, { Component } from "react";
import style from "./toast.module.scss";
import i18n from "../../lang/i18n";

class ToastLoading extends Component {
  constructor() {
    super();
    this.transitionTime = 300;
    this.state = { notices: [] };
    this.removeNotice = this.removeNotice.bind(this);
  }

  getNoticeKey() {
    const { notices } = this.state;
    return `notice-${new Date().getTime()}-${notices.length}`;
  }

  addNotices(notice) {
    const { notices } = this.state;
    notice.key = this.getNoticeKey();
    // notices.push(notice);//展示所有的提示
    notices[0] = notice; //仅展示最后一个提示
    this.setState({ notices });
    if (notice.duration > 0) {
      setTimeout(() => {
        this.removeNotice(notice.key);
      }, notice.duration);
    }
    return () => {
      this.removeNotice(notice.key);
    };
  }

  removeNotice(key) {
    const { notices } = this.state;
    this.setState({
      notices: notices.filter((notice) => {
        if (notice.key === key) {
          if (notice.onClose) setTimeout(notice.onClose, this.transitionTime);
          return false;
        }
        return true;
      }),
    });
  }

  render() {
    const { notices } = this.state;
    return notices.map((notice) => (
      <div className={style.toastModel} style={{ background: notice.opt.backColor || "rgba(0, 0, 0, 0.5)" }} key={notice.key}>
        {notice.type === "loading" && (
          <div className={style.toast}>
            <div className={style.toast_box}>
              <img src={require("../../assets/image/common/loading.gif")} className={style.loadingGif} />
              <div className="toast_text">{notice.content}</div>
            </div>
          </div>
        )}
        {notice.type === "link" && (
          <div className={style.toast}>
            <div className={style.toast_box}>
              <img src={require("../../assets/image/common/loading.gif")} className={style.loadingGif} />
              <dt>{i18n.t("wu_fa_lj")}</dt>
              <dd>{i18n.t("jian_cha_wl")}</dd>
              <Button className={style.btn} onClick={() => location.reload()}>
                {i18n.t("chong_xin_jz")}
              </Button>
            </div>
          </div>
        )}
        {notice.type === "msg" && (
          <div className={style.toast}>
            <div className={style.toast_msg}>{notice.content}</div>
          </div>
        )}
        {notice.type === "fresh" && (
          <div className={style.loadingTrans}>
            <div className={style.transBox}>
              <div className={style["dbl-spinner"]}></div>
              <div className={`${style["dbl-spinner"]} ${style["dbl-spinner--2"]}`}></div>
            </div>
            {i18n.t("chong_lian")}
          </div>
        )}
      </div>
    ));
  }
}

export default ToastLoading;
