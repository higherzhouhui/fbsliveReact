import { Button, Input, Popup, Toast, Popover, Switch } from "antd-mobile";
import React, { useState, useEffect, useRef, useCallback } from "react";
import style from "./index.module.scss";
import { autoUpBalanceSwitch, upOrDownBalance } from "../../../server/balance";
import useContextReducer from "../../../state/useContextReducer.js";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
const PointOut = React.lazy(() => import("../../../components/pointOut/index"));

const TransferAccounts = (props) => {
  const [money, setMoney] = useState("");
  const history = useNavigate();
  const {
    state: { user, assergoldData },
    fetchUtils,
  } = useContextReducer.useContextReducer();
  const { freshUser, userGetUserAsserGold } = fetchUtils;
  const [datasI, datasISet] = useState();

  const [balanceI, balanceISet] = useState(0);
  const [balanceT, balanceTSet] = useState(false);
  const [visible2, setVisible2] = useState(false);
  // balance 判断是否是转账页面
  const { visible, onMaskClick, transformations, transformation, info, fresh, balance } = props;
  const datas = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000];
  // 开关自动转入
  const SwitchF = async (e) => {
    let autoUpBalance = e ? 1 : 0;
    const res = await autoUpBalanceSwitch({ autoUpBalance: autoUpBalance });
    if (!(res instanceof Error)) {
      // console.log("asdsadsad", res, autoUpBalance, e);
      // SwitchsSet(e)
      freshUser();
      userGetUserAsserGold();
    }
  };
  const popoverRef = useRef();
  const init = useCallback(() => {
    freshUser();
    userGetUserAsserGold();
  }, [])
  useEffect(() => {
    init()
  }, [init]);
  //1转入 2转出
  const transMoney = async (type) => {
    console.log(type, money, assergoldData?.goldCoin, Number(money), Number(assergoldData?.goldCoin), Number(info?.banlance));
    if (type === 1 && Number(money) > Number(assergoldData?.goldCoin)) {
      setVisible2(true);
      // Toast.show({
      //     maskClassName: 'maskClassNames',
      //     content: t("sysmsg_amount_not_enough")
      // });
      return;
    }
    if (type === 2 && Number(money) > Number(info?.banlance))
      return Toast.show({
        maskClassName: "maskClassNames",
        content: t("sysmsg_amount_not_enough"),
      });
    let data = {
      amount: money,
      gameType: balance == undefined ? info?.type : balance[balanceI]?.type,
      tradeType: type,
    };
    const res = await upOrDownBalance(data);
    if (!(res instanceof Error)) {
      // console.log('asdasdsadsfdsf法第三方第三方的', res.balance);

      // freshUser();
      userGetUserAsserGold();

      balance == undefined ? fresh(res.balance || 0) : fresh({ balance: res.balance || 0, type: balance[balanceI]?.type });

      datasISet();
      balance == undefined && onMaskClick();
      setMoney("");
      Toast.show(t("sys_check_pass"));
    }
  };

  // 转账页 点击弹窗
  const balanceF = () => {
    console.log("balance----------", balance);
    balanceTSet(true);
  };

  return (
    <>
      {balance == undefined ? (
        <Popup
          style={{ "--z-index": "2000" }}
          onMaskClick={() => {
            datasISet();
            onMaskClick();
            setMoney("");

            popoverRef.current?.hide();
          }}
          visible={visible}>
          <div className={style.inputBody}>
            <div className={style.title}>
              <div style={{ width: "100%", paddingLeft: "18px", textAlign: "center" }}>{t("trans")}</div>
              <img
                src={require("../../../assets/image/center/sc.png")}
                alt=""
                onClick={() => {
                  datasISet();
                  onMaskClick();
                  setMoney("");

                  popoverRef.current?.hide();
                }}
              />
            </div>
            {/* 自动转账 */}
            <div className={style.Transmatic}>
              <div className={`${style.border_bottom2}`}>
                <div className={style.div}>
                  {t("zidongzhuanzhang")}{" "}
                  <Popover
                    ref={(ref) => (popoverRef.current = ref)}
                    style={{ "--z-index": "2003" }}
                    content={
                      <div
                        style={{
                          width: "100px",
                          fontSize: "10px",
                          fontFamily: "PingFangSC-Regular, PingFang SC",
                          fontWeight: "400",
                          color: "#FFFFFF",
                          lineHeight: "16px",
                        }}>
                        {t("kaiqihousuoyousanfangyouxijinru")}
                      </div>
                    }
                    trigger="click"
                    placement="bottom"
                    mode="dark">
                    <img src={require("../../../assets/image/game/zx/wh.png")} alt="" />
                  </Popover>
                </div>
                <Switch style={{ "--width": "40px", "--height": "22px" }} checked={user?.autoUpBalance == 1 ? true : false} onChange={(e) => SwitchF(e)} />
              </div>
            </div>
            {/* 开起自动转入 隐藏 */}
            {user?.autoUpBalance != 1 && (
              <div>
                <div style={{ padding: "12px" }}>
                  <div className={style.balanceInfo}>
                    <div className={style.left}>
                      <span>{t("balance")}</span>
                      <span>{assergoldData?.goldCoin || 0}</span>
                    </div>
                    <div
                      onClick={() => {
                        history("/recharge");
                      }}
                      className={style.right}>
                      {t("ui_dep")}
                    </div>
                  </div>
                </div>
                <div className={style.center}>
                  <div className={style.center_left}>
                    {/* <div className={style.dmoe}>
                         {
                             transformations ? <img src={require('../../../assets/image/center/money.png')} alt="" className={style.imgs} /> : <img src={info.gameLogo} alt="" className={style.imgs} />
                         }
                     </div>
                     <div style={{ height: '22px', display: 'flex', justifyContent: 'center', position: 'relative', margin: '4px 0' }}>
                         <img src={require('../../../assets/image/center/moneydemo1.png')} alt="" style={{ height: '22px', width: '2px' }} />
                         <img src={require('../../../assets/image/center/fordemo1.png')} alt="" style={{ width: '48px', height: '6px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                     </div>
                     <div className={style.dmoe}>
                         {
                             transformations ? <img src={info.gameLogo} alt="" className={style.imgs} /> : <img src={require('../../../assets/image/center/money.png')} alt="" className={style.imgs} />
                         }
                     </div> */}
                    <div>{t("cong")}</div>
                    <img src={require("../../../assets/image/center/bottomicon.png")} alt="" />
                    <div>{t("dao")}</div>
                  </div>
                  <div className={style.inputs}>
                    <div className={style.input_div}>
                      <div className={`${style.inputs2} ${style.bottoms}`}>
                        <div className={style.input_c}>{t("game_wallet_transfer_record_type.0")}</div>
                        <div>{transformations ? t("zhongxinqianbao") : info?.gameName}</div>
                      </div>
                      <div className={style.inputs2}>
                        <div className={style.input_r}>{t("game_wallet_transfer_record_type.1")}</div>
                        <div>{transformations ? info?.gameName : t("zhongxinqianbao")}</div>
                      </div>
                    </div>
                    <div>
                      <img
                        src={require("../../../assets/image/center/qeihuan.png")}
                        alt=""
                        style={{ width: "28px", height: "28px" }}
                        onClick={() => {
                          transformation();
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.tisi}>
                  <span>{t("zhuangzhangjine")}</span>
                  {t("banlance_duihuan")}
                </div>
                {/* 弹窗金额 */}
                <div className={style.money_div}>
                  {datas.map((value, index) => {
                    return (
                      <div
                        className={`${style.datas_div} ${datasI == index ? style.datas_div_z : ""}`}
                        key={index}
                        onClick={() => {
                          datasISet(index), setMoney(value);
                        }}>
                        {value}

                        {datasI == index && <img src={require("../../../assets/image/newImg/qbxz.png")} alt="" />}
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "0 12px" }}>
                  <div className={style.je_input}>
                    <Input
                      type="number"
                      value={money}
                      onChange={(e) => {
                        datasISet();
                        // /^\d*(\.?\d{0,2})/g)
                        // /^(\-)*(\d+)\.(\d\d).*$/
                        e = e.match(/^\d*(\.?\d{0,2})/g)[0] || "";
                        console.log("eeeeee", e);
                        // if (/^\d*(\.?\d{0,2})/g.test(e) == false) {
                        //     console.log(11111, /^\d*(\.?\d{0,2})/g.test(e));
                        //     setMoney(e);
                        // }
                        setMoney(e);
                      }}
                      placeholder={t("qingshuruzhuanhuanjine")}
                      className={style.input}
                      style={{ borderBottom: "1px solid #fff" }}
                    />
                    <div className={style.rights}>
                      <span>₫</span>
                      <div
                        className={style.divs}
                        onClick={() => {
                          console.log("infos", info, info?.banlance);
                          datasISet(), setMoney(transformations ? assergoldData?.goldCoin || 0 : balance[balanceI]?.balance || 0);
                        }}>
                        {t("ui_all")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={style.btnGroup}>
                  {transformations ? (
                    // 转入
                    <Button className={style.btn} onClick={() => transMoney(1)} loading="auto" disabled={!(Number(money) > 0)}>
                      {t("lijizhuanghzhang")}
                    </Button>
                  ) : (
                    // 转出
                    <Button className={style.btn} onClick={() => transMoney(2)} loading="auto" disabled={!(Number(money) > 0)}>
                      {t("lijizhuanghzhang")}
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className={style.font_bottom}>
              {t("ruxibangzhu")}{" "}
              <span
                onClick={() => {
                  history("/service");
                }}>
                {t("lianxikefu")}
              </span>
            </div>
          </div>

          <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history("/recharge")} type={2} />
        </Popup>
      ) : (
        <div className={style.inputBody}>
          {/* 自动转账 */}
          <div className={`${style.Transmatic} ${style.margin30} `}>
            <div className={`${style.border_bottom}`}>
              <div className={`${style.div} `}>
                {t("zidongzhuanzhang")}{" "}
                <Popover
                  ref={(ref) => (popoverRef.current = ref)}
                  style={{ "--z-index": "2003" }}
                  content={
                    <div
                      style={{
                        width: "100px",
                        fontSize: "10px",
                        fontFamily: "PingFangSC-Regular, PingFang SC",
                        fontWeight: "400",
                        color: "#FFFFFF",
                        lineHeight: "16px",
                      }}>
                      {t("kaiqihousuoyousanfangyouxijinru")}
                    </div>
                  }
                  trigger="click"
                  placement="bottom"
                  mode="dark">
                  <img src={require("../../../assets/image/game/zx/wh.png")} alt="" />
                </Popover>
              </div>
              <Switch style={{ "--width": "40px", "--height": "22px" }} checked={user?.autoUpBalance == 1 ? true : false} onChange={(e) => SwitchF(e)} />
            </div>
          </div>
          {/* 开起自动转入 隐藏 */}
          {user?.autoUpBalance != 1 && (
            <div>
              <div className={style.center}>
                <div className={style.center_left}>
                  <div>{t("cong")}</div>
                  <img src={require("../../../assets/image/center/bottomicon.png")} alt="" />
                  <div>{t("dao")}</div>
                </div>
                <div className={style.inputs}>
                  <div className={style.input_div}>
                    <div className={`${style.inputs2} ${style.bottoms}`}>
                      <div className={style.input_c}>{t("game_wallet_transfer_record_type.0")}</div>
                      <div
                        onClick={() => {
                          !transformations && balanceF();
                        }}
                        className={style.inputs2_div}>
                        {transformations ? t("zhongxinqianbao") : balance[balanceI]?.gameName} {!transformations && <img src={require("../../../assets/image/newImg/right.png")} alt="" />}
                      </div>
                    </div>
                    <div className={style.inputs2}>
                      <div className={style.input_r}>{t("game_wallet_transfer_record_type.1")}</div>
                      <div
                        onClick={() => {
                          transformations && balanceF();
                        }}
                        className={style.inputs2_div}>
                        {transformations ? balance[balanceI]?.gameName : t("zhongxinqianbao")} {transformations && <img src={require("../../../assets/image/newImg/right.png")} alt="" />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      src={require("../../../assets/image/center/qeihuan.png")}
                      alt=""
                      style={{ width: "28px", height: "28px" }}
                      onClick={() => {
                        transformation();
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={style.tisi}>
                <span>{t("zhuangzhangjine")}</span>
                {t("banlance_duihuan")}
              </div>
              {/* 弹窗金额 */}
              <div className={style.money_div}>
                {datas.map((value, index) => {
                  return (
                    <div
                      className={`${style.datas_div} ${datasI == index ? style.datas_div_z : ""}`}
                      key={index}
                      onClick={() => {
                        datasISet(index), setMoney(value);
                      }}>
                      {value}

                      {datasI == index && <img src={require("../../../assets/image/newImg/qbxz.png")} alt="" />}
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: "0 12px" }}>
                <div className={style.je_input}>
                  <Input
                    type="number"
                    value={money}
                    onChange={(e) => {
                      datasISet();
                      // /^\d*(\.?\d{0,2})/g)
                      // /^(\-)*(\d+)\.(\d\d).*$/
                      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || "";
                      console.log("eeeeee", e);
                      // if (/^\d*(\.?\d{0,2})/g.test(e) == false) {
                      //     console.log(11111, /^\d*(\.?\d{0,2})/g.test(e));
                      //     setMoney(e);
                      // }
                      setMoney(e);
                    }}
                    placeholder={t("qingshuruzhuanhuanjine")}
                    className={style.input}
                    style={{ borderBottom: "1px solid #fff" }}
                  />
                  <div className={style.rights}>
                    <span>₫</span>
                    <div
                      className={style.divs}
                      onClick={() => {
                        console.log("infos", info, info?.banlance);
                        datasISet(), setMoney(transformations ? assergoldData?.goldCoin || 0 : balance[balanceI]?.balance || 0);
                      }}>
                      {t("ui_all")}
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.btnGroup}>
                {transformations ? (
                  // 转入
                  <Button className={style.btn} onClick={() => transMoney(1)} loading="auto" disabled={!(Number(money) > 0)}>
                    {t("lijizhuanghzhang")}
                  </Button>
                ) : (
                  // 转出
                  <Button className={style.btn} onClick={() => transMoney(2)} loading="auto" disabled={!(Number(money) > 0)}>
                    {t("lijizhuanghzhang")}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className={style.font_bottom}>
            {t("ruxibangzhu")}{" "}
            <span
              onClick={() => {
                history("/service");
              }}>
              {t("lianxikefu")}
            </span>
          </div>

          <Popup
            visible={balanceT}
            onMaskClick={() => {
              balanceTSet(false);
            }}
            bodyStyle={{ height: "330px" }}>
            <div className={style.balanceT}>
              <div className={style.titles}>{t("xuanzheyouxiqianbao")}</div>
              <div className={style.gameName}>
                {balance.map((value, index) => {
                  return (
                    <div
                      key={value?.type}
                      className={style.gameName_div}
                      onClick={() => {
                        balanceISet(index), balanceTSet(false);
                      }}>
                      {value?.gameName}

                      {balanceI == index && <img src={require("../../../assets/image/newImg/gou.png")} alt="" />}
                    </div>
                  );
                })}
              </div>
              <div
                className={style.close}
                onClick={() => {
                  balanceTSet(false);
                }}>
                {t("quxiao")}
              </div>
            </div>
          </Popup>
          <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history("/recharge")} type={2} />
        </div>
      )}
    </>
  );
};

export default TransferAccounts;
