import { Verify } from "../../components";
import { CheckSms, register } from "../../server/login";
import { Button, Toast, Input, PasscodeInput, NumberKeyboard, Avatar, Popup, SpinLoading, Mask } from "antd-mobile";
import { Input as Inputs } from "../../components";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { json, useNavigate } from "react-router-dom";
import Style from "./register.module.scss";

import useContextReducer from "../../state/useContextReducer";
import { getOssToken } from "../../server/Personal";
import { suggestedlist } from "../../server/live";
import { rankDetail } from "../../server/RankingList";
import { Local } from "../../../common";
import { accountLogin } from "../../server/login";
import { batchFollow } from "../../server/Fans";
import OSS from "ali-oss";
import CropperJs from "cropperjs";
import "cropperjs/dist/cropper.css";
import ToastModel from "../../components/ToastModel";
let loading2Fn;

let timeChange;
let updateInfo = {};
const Register = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  let [step, setStep] = useState(1);
  let [mobile, setMobile] = useState("");
  let [code, setCode] = useState("");
  let [nickname, setNickname] = useState("");
  let [password, setPassword] = useState("");
  let [pass, setPass] = useState("");
  let [sex, setSex] = useState(1);
  let [cid, setCid] = useState("");
  let [agentIds, agentIdsSet] = useState("");
  const {
    fetchUtils: { freshUser, userGetUserAsserGold },
    dispatch,
  } = useContextReducer.useContextReducer();

  const [avatar, avatarSet] = useState("");

  const [liveResponses, liveResponsesSet] = useState([]);
  const [pages, pagesSet] = useState(0);
  const [visible1, setVisible1] = useState(false);

  const [remember, setRemember] = useState(!!Local("remember"));
  const [rankDetailss, rankDetailssSet] = useState([]);

  const [loadings, loadingsSet] = useState(false);

  const [liveResponseLoading, liveResponseLoadingSet] = useState(false);
  const [rankDetailsLoading, rankDetailsLoadingSet] = useState(false);

  const [disableds, disabledsSet] = useState(false);

  const [demo1, demo1Set] = useState([]); //直播
  const [demo2, demo2Set] = useState([]); //热门
  const [imgShT, imgShTSet] = useState(false); //刷新

  const [loadingAvatar, setLoadingAvatar] = useState(false);

  // 头像裁剪
  const imgRef = useRef(null);
  const [clipImg, clipImgSet] = useState(false);
  const cropperRef = useRef();
  const cropperImgRef = useRef(""); //剪切图片临时地址

  useEffect(() => {
    let agentId = sessionStorage.getItem("agentId") != null && sessionStorage.getItem("agentId") != undefined && sessionStorage.getItem("agentId") != "null" && sessionStorage.getItem("agentId") != "undefined" ? sessionStorage.getItem("agentId") : undefined;
    agentIdsSet(agentId);
  }, []);

  // 获取推荐
  const suggestedlists = (page = 0) => {
    suggestedlist({ page: page, num: 6 }).then((item) => {
      item.forEach((value, index) => {
        value.Check = true;
      });
      console.log("推荐1232", item);
      liveResponseLoadingSet(false);
      liveResponsesSet(item);
    });
  };

  // 热门主播 直播月榜前6个
  const rankDetails = () => {
    rankDetail({
      type: 1,
      rankType: 3,
    }).then((item) => {
      // console.log('榜单详情', item);
      let data = item.splice(0, 6);

      data.forEach((value, index, array) => {
        // demo2.forEach((value_2) => {
        //     if (value_2 == value.anchorId) {
        //         value.Check = true
        //     }
        // })
        value.Check = true;
      });
      console.log("热门主播", data);
      rankDetailsLoadingSet(false);
      rankDetailssSet(data);
    });
  };
  //登录事件
  const handleLogin = async () => {
    Local("token", null);
    Local("userInfo", null);

    const res = await accountLogin({ mobile: mobile, password });
    // const res = await accountLogin({ mobile: '0777777777', password: 'a123456' })
    if (!(res instanceof Error)) {
      if (remember) {
        Local("remember", true);
        Local("mobile", mobile);
        Local("password", password);
        // Local('mobile', '0777777777')
        // Local('password', 'a123456')
      } else {
        Local("remember", null);
        Local("mobile", null);
        Local("password", null);
      }
      Local("token", res.token);
      // history('/live')

      // 获取正在直播
      suggestedlists(pages);
      // 获取热门直播
      rankDetails(demo2);
      // 打开弹窗
      setVisible1(true);
    }
  };

  // 刷新
  const Refresh = () => {
    liveResponsesSet([]);
    rankDetailssSet([]);
    liveResponseLoadingSet(true);
    rankDetailsLoadingSet(true);
    // 刷新旋转
    imgShTSet(true);
    setTimeout(() => {
      imgShTSet(false);
    }, 1000);

    rankDetails();
    if (liveResponses.length < 6) {
      pagesSet(0);
      suggestedlists(0);
    } else {
      pagesSet(pages + 1);
      suggestedlists(pages + 1);
    }
    console.log(demo1, demo2);
  };
  // 选中判断
  const adds = (item, i) => {
    let data1 = [...liveResponses];
    let data2 = [...rankDetailss];
    let data3 = [...demo1];
    let data4 = [...demo2];
    if (i == 1) {
      data1.forEach((value, index, array) => {
        if (value.anchorId == item.anchorId) {
          // 判断是否是选中状态
          if (value.Check == undefined || value.Check == false) {
            data3 = [...data3, value.anchorId];
            value.Check = true;
          } else if (value.Check == true) {
            value.Check = false;
            data3.forEach((value_2, index_2) => {
              if (value_2 == value.anchorId) {
                data3.splice(index_2, 1);
              }
            });
          }
        }
      });
      // console.log('123', data3);
      demo1Set(data3);
      liveResponsesSet(data1);
    }
    if (i == 2) {
      data2.forEach((value, index, array) => {
        if (value.anchorId == item.anchorId) {
          // 判断是否是选中状态
          if (value.Check == undefined || value.Check == false) {
            value.Check = true;
            data4 = [...data4, value.anchorId];
          } else if (value.Check == true) {
            value.Check = false;

            data4.forEach((value_2, index_2) => {
              if (value_2 == value.anchorId) {
                data4.splice(index_2, 1);
              }
            });
          }
        }
      });
      // console.log('321', data4);
      demo2Set(data4);
      rankDetailssSet(data2);
    }
    // 判断是否有选中数据
    let aaa = [...data1, ...data2];
    let c = true;
    aaa.forEach((items) => {
      if (items.Check == true && items.Check !== undefined) {
        c = false;
      }
    });
    disabledsSet(c);
  };
  // 关注
  const follow = (d) => {
    // console.log('这是绑定', d);
    batchFollow({ targetIds: d }).then((item) => {
      loadingsSet(false);
      // console.log('关注', item);

      freshUser();
      userGetUserAsserGold();
      window.eventBus.emit("store", { type: "handleLogin" });
      history("/live");
    });
  };
  // 关注提交
  const Submit = async () => {
    // loadingsSet(true)
    // 所有选中数据
    let data = "";
    // 正在直播
    liveResponses.forEach((item) => {
      if (item.Check) {
        data += `${item.anchorId},`;
      }
    });
    // 热门
    rankDetailss.forEach((item) => {
      if (item.Check) {
        data += `${item.anchorId},`;
      }
    });

    let data2 = data.slice(0, data.length - 1);
    // console.log('选中的数据', data2);

    follow(data2);
  };

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
        console.log(img.height, img.width);
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
    // clipImgSet(false);
    clipImgSet(false);
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
                console.log("blob-------", blob);
                // const result = await client.put(`webh5/avatar-${user.uid}-${new Date().getTime()}`, blob);
                const result = await client.put(
                  `webh5/${new Date().getTime()}-${updateInfo.name}`,
                  blob
                  // 自定义headers
                  //,{headers}
                );

                // infoD({ avatar: result.url });
                avatarSet(result.url);
              } catch (e) {
                console.log(e);
              }
            }
            put();
          }
        }
      }, "image/png");
  };

  // 修改用户头像
  // const editAvatar = () => {
  //   let inputChoose = document.createElement("input");
  //   inputChoose.type = "file";
  //   inputChoose.style = "display:none";
  //   document.body.appendChild(inputChoose);
  //   inputChoose.click();
  //   inputChoose.onchange = async function () {
  //     loading2Fn = ToastModel.loading(t("jia_zai_zhong"));
  //     const oss = await getOssToken();
  //     if (!(oss instanceof Error)) {
  //       let file = inputChoose.files[0];
  //       const client = new OSS({
  //         // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  //         region: oss.endpoint.split(".")[0],
  //         // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  //         accessKeyId: oss.key,
  //         accessKeySecret: oss.secret,
  //         // 填写Bucket名称。
  //         bucket: oss.bucketName,
  //         stsToken: oss.token,
  //       });

  //       async function put() {
  //         try {
  //           // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
  //           // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
  //           const result = await client.put(
  //             `webh5/${file.name}`,
  //             file
  //             // 自定义headers
  //             //,{headers}
  //           );
  //           // console.log('这是多少', result.url);
  //           avatarSet(result.url);
  //           ToastModel.fresh();
  //           document.body.removeChild(inputChoose);
  //         } catch (e) {
  //           // avaLoadingSet(false)
  //           console.log(e);
  //           ToastModel.fresh();
  //         }
  //       }
  //       put();
  //     }
  //   };
  // };

  const [times, timesSet] = useState(180);
  const [timeD, timeDSet] = useState(false);

  const timeF = () => {
    timeChange = setInterval(() => {
      timesSet((t) => --t);
    }, 1000);
  };
  useEffect(() => {
    if (times > 0 && times < 180) {
    } else {
      clearInterval(timeChange);
      timeDSet(false);
      timesSet(180);
    }
  }, [times]);
  // 步骤1
  const step1 = () => {
    const handleCheckPhone = async () => {
      timeDSet(true);
      timeF();
      setStep(step + 1);
    };
    return (
      <>
        <div className={Style.formBody}>
          <img
            onClick={() => {
              history(-1);
            }}
            src={require("../../assets/image/login/left.png")}
            alt=""
            style={{ width: "18px", height: "18px", position: "fixed", top: "20px", left: "16px" }}
          />
          <div className={Style.title_font}>{t("establishAccount")}</div>
          <div className={Style.title_font2}> {t("beUsedEorEstablishAccount")}</div>
          <div>
            <span className={Style.label}>{t("TelephoneNumber")}</span>
            <Input
              placeholder={t("enterPhone")}
              value={mobile}
              onChange={(val) => {
                setMobile(val);
              }}
              maxLength={10}
              type="account"
              style={{ "--color": "#000" }}
              className={Style.stepInput}
            />
          </div>
          <Verify phone={mobile} type={1} onGetId={setCid} className={mobile.length > 0 ? Style.Verify : Style.Verify2} Click={handleCheckPhone} sendType="1"></Verify>
        </div>
      </>
    );
  };
  // 步骤2
  const step2 = () => {
    const handleCheckPhone = async () => {
      const res = await CheckSms({ mobile, vcode: code });
      if (!(res instanceof Error)) {
        if (res === "1") setStep(step + 1);
        else return Toast.show({ content: t("cao_zuo_sb") });
      }
    };
    const handleCheckPhone2 = () => {
      timeDSet(true);
      timeF();
    };
    return (
      <>
        <div className={Style.formBody}>
          <img
            onClick={() => {
              setStep(1);
            }}
            src={require("../../assets/image/login/left.png")}
            alt=""
            style={{ width: "18px", height: "18px", position: "fixed", top: "20px", left: "16px" }}
          />
          <div className={Style.title_font}>{t("inputCode")}</div>
          <div className={Style.title_font2}> {t("inputCode2")}</div>
          <div className={Style.sendOut_Tips}>{t("phoneSendMailbox")}</div>
          <div className={Style.sendOut_Tips2}>{mobile}</div>
          <div>
            <span className={Style.label}>{t("CreateVerificationCode")}</span>
            {/* <Inputs
                        placeholder={t('enterPhone')}
                        value={mobile}
                        onChange={val => {
                            setMobile(val)
                        }}
                        maxLength={10}
                        type="account"
                        className={Style.stepInput} 
                    /> */}
            <PasscodeInput
              style={{ "--cell-size": "42px", "--cell-gap": "51px" }}
              plain={true}
              onChange={(val) => {
                setCode(val);
              }}
              length={4}
              seperated={true}
              keyboard={<NumberKeyboard />}
            />
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>{timeD ? <div className={Style.Verify3_time}>{times}</div> : <Verify phone={mobile} type={1} onGetId={setCid} className={Style.Verify3} sendType="1" Click={handleCheckPhone2} sendTxts="123"></Verify>}</div>
          </div>
          {/* <div>
                    <span className={Style.label}>{t('ui_code')}</span>
                    <div className={Style.inputGroup}>
                        <Inputs
                            placeholder={t('enterVerify')}
                            value={code}
                            onChange={val => {
                                setCode(val)
                            }}
                            type="account"
                            maxLength={6}
                            className={Style.stepInput}
                        />
                        <Verify phone={mobile} type={1} onGetId={setCid} className={Style.Verify} sendType="1"></Verify>
                    </div>
                </div> */}
          <Button className={Style.nextBtn1} block color="primary" size="large" style={{ "--border-radius": "5px" }} loading="auto" onClick={handleCheckPhone} disabled={!code}>
            {t("RegisteredAccount")}
          </Button>
          {/* <div className={Style.tipsText}>
                    {t('ui_wap_text_053')} <span style={{ '--border-radius': '12px' }} onClick={() => history(-1)}>{t('immediately_login')}</span>
                </div> */}
        </div>
      </>
    );
  };

  // 步骤3
  const step3 = () => {
    //校验密码
    //校验两次输入密码
    const checkSubmit = async (_) => {
      if (!pass || !password) return Toast.show({ content: t("enterPass") });
      if (password !== pass) return Toast.show({ content: t("repassError") });
      let form = {};
      form.avatar = avatar.length > 0 ? avatar : "";
      form.puid = "";
      form.captchaValidate = cid;
      form.mobile = mobile;
      form.phone = mobile;
      form.nickname = nickname;
      form.password = password;
      form.sex = form.sex || "1";
      form.agentId = agentIds;
      delete form.repass;
      if (sessionStorage.getItem("puid")) form.puid = sessionStorage.getItem("puid");
      // handleLogin()

      const res = await register(form);
      if (!(res instanceof Error)) {
        dispatch({
          type: "REGISTER",
          payload: {
            mobile,
            password,
          },
        });
        dispatch({
          type: "LOGIN",
          payload: false,
        });
        // history(-1)
        // 立即登录
        handleLogin();
      }
    };

    return (
      <div className={Style.formBody2}>
        <div style={{ position: "fixed", top: "20px", left: "16px", display: "flex", alignItems: "center" }}>
          <img
            onClick={() => {
              setStep(2);
            }}
            src={require("../../assets/image/login/left.png")}
            alt=""
            style={{ width: "18px", height: "18px" }}
          />
          <div className={Style.top_font}>{t("ImproveInformation")}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px" }}>
          <div style={{ position: "relative" }} onClick={() => editAvatar()}>
            <Avatar src={avatar} style={{ width: "80px", height: "80px", borderRadius: "100%" }} />
            <img src={require("../../assets/image/login/xj.png")} alt="" className={Style.imgs} />
          </div>
        </div>
        <div>
          <span className={Style.label}>{t("nickName")}</span>
          <Inputs value={nickname} placeholder={t("enterNickName")} className={Style.stepInput} onChange={setNickname} colors="000" maxLength={10} />
        </div>
        {/* <div className={Style.formSex}>
                <img src={sex == 1 ? manActiveImg : manImg} alt="" onClick={() => setSex(1)} />
                <img src={sex == 2 ? womanActiveImg : womanImg} alt="" onClick={() => setSex(2)} />
            </div> */}
        <div>
          <span className={Style.label}>{t("sex")}</span>
          <div className={Style.sex_dsp}>
            <div onClick={() => setSex(1)} className={`${sex == 1 ? Style.Check : ""}  ${Style.divs}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 9px 0 6px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={require("../../assets/image/login/sex1.png")} alt="" style={{ width: "30px", height: "30px", marginRight: "9px" }} />
                {t("sex1")}
              </div>

              <img src={sex == 1 ? require("../../assets/image/login/true.png") : require("../../assets/image/login/false.png")} alt="" style={{ width: "14px", height: "14px" }} />
            </div>
            <div onClick={() => setSex(2)} className={`${sex == 2 ? Style.Check : ""}  ${Style.divs}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 9px 0 6px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={require("../../assets/image/login/sex2.png")} alt="" style={{ width: "30px", height: "30px", marginRight: "9px" }} />
                {t("sex2")}
              </div>

              <img src={sex == 2 ? require("../../assets/image/login/true.png") : require("../../assets/image/login/false.png")} alt="" style={{ width: "14px", height: "14px" }} />
            </div>
          </div>
        </div>
        <div>
          <span className={Style.label}>{t("password")}</span>
          <Inputs value={password} placeholder={t("enterPass")} className={Style.stepInput} onChange={setPassword} type="password" colors="000" />
        </div>
        <div>
          <span className={Style.label}>{t("repass")}</span>
          <Inputs value={pass} placeholder={t("enterPass")} className={Style.stepInput} onChange={setPass} type="password" colors="000" />
        </div>

        {(sessionStorage.getItem("agentId") == undefined || sessionStorage.getItem("agentId") == "null") && (
          <div>
            <span className={Style.label}>{t("agentIdS1")}</span>
            <Inputs value={agentIds} placeholder={t("agentIdS")} className={Style.stepInput} onChange={agentIdsSet} colors="000" />
          </div>
        )}
        <Button className={Style.nextBtn1} block color="primary" size="large" style={{ "--border-radius": "5px" }} loading="auto" disabled={!nickname || !password || !pass} onClick={checkSubmit}>
          {t("btn_submit")}
        </Button>

        <Popup
          visible={visible1}
          onMaskClick={() => {
            // setVisible1(false);
            freshUser();
            userGetUserAsserGold();
            window.eventBus.emit("store", { type: "handleLogin" });
            history("/live");
          }}
          bodyStyle={{ height: "519px" }}>
          <div className={Style.popups}>
            <div className={Style.titles}>
              <div className={Style.demo1}>
                <img src={require("../../assets/image/login/sx.png")} alt="" onClick={() => Refresh()} className={imgShT ? Style.imgSh : ""} />
              </div>
              <div className={Style.demo2}>{t("tuijianguanzhu")}</div>
              <div
                className={Style.demo1}
                onClick={() => {
                  freshUser();
                  userGetUserAsserGold();
                  window.eventBus.emit("store", { type: "handleLogin" });
                  history("/live");
                }}>
                {t("tiaoguo")}
              </div>
            </div>
            <div className={Style.centers}>
              {/* 正在直播 */}
              <div className={Style.titleS2}>{t("zhengzaizhibo")}</div>
              <div className={Style.zzzz}>
                {!liveResponseLoading ? (
                  liveResponses?.map((item, index) => {
                    return (
                      <div
                        className={Style.zzzz_demo}
                        key={index}
                        onClick={() => {
                          adds(item, 1);
                        }}>
                        {/* Check */}
                        <div className={Style.Avatars}>
                          <Avatar src={item?.avatar} style={{ "--size": "80px", "--border-radius": "100%" }} />
                          {item.Check == undefined || item.Check == false ? <img src={require("../../assets/image/login/wgx.png")} alt="" className={Style.AvatarsCheck} /> : <img src={require("../../assets/image/login/gx.png")} alt="" className={Style.AvatarsCheck} />}
                        </div>
                        <div className={Style.size}>
                          <div className={Style.size2}>{item.nickname}</div> <img src={require("../../assets/image/login/zbz2.png")} alt="" />
                        </div>
                        {/* <div className={Style.bottom}>{item.rq}</div> */}
                      </div>
                    );
                  })
                ) : (
                  <SpinLoading style={{ "--size": "24px" }} />
                )}
              </div>
              {/* 热门直播 */}
              <div className={Style.titleS2}>{t("remenzhubo")}</div>
              <div className={Style.zzzz}>
                {!rankDetailsLoading ? (
                  rankDetailss?.map((item, index) => {
                    return (
                      <div
                        className={Style.zzzz_demo}
                        key={`${item.anchorId}-${index}`}
                        onClick={() => {
                          adds(item, 2);
                        }}>
                        <div className={Style.Avatars}>
                          <Avatar src={item?.avatar} style={{ "--size": "80px", "--border-radius": "100%" }} />
                          {item.Check == undefined || item.Check == false ? <img src={require("../../assets/image/login/wgx.png")} alt="" className={Style.AvatarsCheck} /> : <img src={require("../../assets/image/login/gx.png")} alt="" className={Style.AvatarsCheck} />}
                        </div>
                        <div className={Style.size}>
                          <div className={Style.size2}>{item.nickname}</div> {item.liveId != null && item.liveId != 0 && <img src={require("../../assets/image/login/zbz3.png")} alt="" />}
                        </div>
                        {/* <div className={Style.bottom}>{item.rq}</div> */}
                      </div>
                    );
                  })
                ) : (
                  <SpinLoading style={{ "--size": "24px" }} />
                )}
              </div>
            </div>
            {/* disabled={disableds}  */}
            <Button className={Style.buts} disabled={disableds} loading="auto" onClick={() => Submit()}>
              {t("btn_submit")}
            </Button>
          </div>
        </Popup>

        <Mask visible={clipImg} destroyOnClose onMaskClick={() => clipImgSet(false)} className="clipImgMask">
          {/* style={{ background: `url(${cropperImgRef.current})`, backgroundSize: '100% 100%' }} */}
          <div className={Style.clipBody}>
            <img src={cropperImgRef.current} alt="" ref={imgRef} className={Style.clipImg} />
            <div className={Style.buts}>
              <Button
                className={Style.clipSubmit}
                onClick={() => {
                  // clipImgSet(false)
                  clipImgSet(false);
                }}>
                {t("chongxingxuanze")}
              </Button>
              <Button className={`${Style.clipSubmit} ${Style.colors}`} onClick={() => handleSubmitImg()}>
                {t("btn_submit")}
              </Button>
            </div>
          </div>
        </Mask>
      </div>
    );
  };
  return <>{step === 1 ? step1() : step === 2 ? step2() : step3()}</>;
};

export default Register;
