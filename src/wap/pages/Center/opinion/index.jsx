import { Button, NavBar, Popup, Skeleton, Empty, DatePickerView, InfiniteScroll, Toast, TextArea, Input, Swiper } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOssToken } from "../../../server/Personal";
import OSS from "ali-oss";
import { feedbackSave, feedbackTypes, feedbackAll } from "../../../server/opinion";
import { queryUserAssetList } from "../../../server/record";

import style from "./index.module.scss";
const Index = () => {
  const history = useNavigate();

  // 文本
  const [TextAreaD, TextAreaDSet] = useState("");
  // 选择类型

  // 上传图片
  const [imgDatas, imgDatasSet] = useState([]);

  // 选择问题类型
  const [visible1, visible1Set] = useState(false);

  // 相关订单
  const [visible2, visible2Set] = useState(false);

  // 查看img
  const [visible3, visible3Set] = useState(false);

  // 问题类型索引
  const [problemTypeI, problemTypeISet] = useState();

  // 相关订单号索引
  const [problemTypeI2, problemTypeI2Set] = useState();

  const [imgDatasI, imgDatasISet] = useState(0);

  const [feedbackTypesD, feedbackTypesDSet] = useState([]);

  const [queryUserAssetListD, queryUserAssetListDSet] = useState([]);
  const [queryUserAssetListD2, queryUserAssetListDSet2] = useState([]);

  const [loading, loadingSet] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [orderChange, orderChangeSet] = useState("");

  const pageNumsRef = useRef(0);

  const orderChangeRef = useRef("");

  // 上传图片
  const editAvatar = () => {
    let inputChoose = document.createElement("input");
    inputChoose.type = "file";
    inputChoose.style = "display:none";
    document.body.appendChild(inputChoose);
    inputChoose.click();
    inputChoose.onchange = async function () {
      // avaLoadingSet(true)
      const oss = await getOssToken();
      if (!(oss instanceof Error)) {
        console.log(oss);
        let file = inputChoose.files[0];
        const client = new OSS({
          // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
          region: oss.endpoint.split(".")[0],
          // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
          accessKeyId: oss.key,
          accessKeySecret: oss.secret,
          // 填写Bucket名称。
          bucket: oss.bucketName,
          stsToken: oss.token,
        });
        console.log(client);
        async function put() {
          try {
            // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
            // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
            const result = await client.put(
              `webh5/avatar-${new Date().getTime()}-${file.name}`,
              file
              // 自定义headers
              //,{headers}
            );
            imgDatasSet([...imgDatas, result.url]);
            document.body.removeChild(inputChoose);
          } catch (e) {
            // avaLoadingSet(false)
            console.log(e);
          }
        }
        put();
      }
    };
  };

  const deleteImg = (i) => {
    let data = [...imgDatas];
    data.forEach((value, index) => {
      if (index == i) {
        data.splice(index, 1);
      }
    });
    imgDatasSet(data);
  };

  useEffect(() => {
    feedbackTypesF();
  }, []);

  // 反馈类型
  const feedbackTypesF = async () => {
    const res = await feedbackTypes();
    if (!(res instanceof Error)) {
      console.log("类型", res);
      feedbackTypesDSet(res);
    }
  };

  // input
  const changeInput = (e) => {
    console.log(e);
    let data = [...queryUserAssetListD2];
    let a = data.filter((value, index) => {
      return value.trn.indexOf(e) != -1;
    });
    queryUserAssetListDSet(a);
  };

  // 提交
  const Submit = async () => {
    if (problemTypeI == null || problemTypeI == undefined) {
      Toast.show({
        icon: "fail",
        content: t("qingxuanzewentiliexing"),
        position: "center",
      });
      return;
    }
    if (TextAreaD.length == 0) {
      Toast.show({
        icon: "fail",
        content: t("qingtianxeiwentimiaoshu"),
        position: "center",
      });
      return;
    }

    loadingSet(true);
    let imgs = [...imgDatas];
    let img = "";
    imgs.forEach((value, index) => {
      img += `${value},`;
    });
    if (img.length > 0) {
      img = img.slice(0, img.length - 1);
    }
    let data = {
      businessOrderNum: queryUserAssetListD[problemTypeI2]?.trn,
      content: TextAreaD,
      photoAlbum: img,
      typeId: feedbackTypesD[problemTypeI]?.id,
    };
    const res = await feedbackSave(data);
    if (!(res instanceof Error)) {
      TextAreaDSet("");
      imgDatasSet([]);
      problemTypeISet();
      problemTypeI2Set();

      loadingSet(false);

      Toast.show({
        icon: "success",
        content: t("fankuichenggong"),
        position: "center",
      });
    } else {
      loadingSet(false);
    }
  };
  const loadMore = async () => {
    let data = {
      methodType: 10000, //当前记录类型
      assertCode: feedbackTypesD[problemTypeI]?.associate, //全部弹窗 选中内容
      timeAssertCode: 40004, //时间弹窗 选中内容  7天
      pageNum: pageNumsRef.current,
      pageSize: 10,
      trn: orderChangeRef.current,
    };
    const res = await queryUserAssetList(data);
    if (!(res instanceof Error)) {
      queryUserAssetListDSet((val) => [...val, ...res.centerUserAssetsPlusVOS]);
      queryUserAssetListDSet2((val) => [...val, ...res.centerUserAssetsPlusVOS]);
    }
    setHasMore(res.centerUserAssetsPlusVOS.length > 0);

    if (res.centerUserAssetsPlusVOS.length > 0) {
      pageNumsRef.current = Number(pageNumsRef.current) + 1;
    } else {
      pageNumsRef.current = 0;
    }
  };
  // 搜索
  const doSearch = () => {
    pageNumsRef.current = 0;
    queryUserAssetListDSet([]);
    queryUserAssetListDSet2([]);
    loadMore();
  };

  return (
    <div className={style.yj_body}>
      <NavBar
        back={null}
        left={<img src={require("../../../assets/image/kf/left.png")} style={{ width: "22px", height: "26px" }} onClick={() => history(-1)} />}
        className={style.wbg}
        right={
          <div className={style.NavBar} onClick={() => history("/myFeedback")}>
            {t("wodefankui")}
          </div>
        }>
        <div style={{ fontSize: "18px", fontWeight: "500", color: "rgb(30, 27, 39)" }}>{t("yijianfankui")}</div>
      </NavBar>
      {/* 选择框 */}
      <div className={style.bodys}>
        <div className={style.content}>
          {/* 类型 */}
          <div className={style.content_title}>
            {t("wentileixing")}
            <span>*</span>
          </div>
          <div
            className={style.content_lx}
            onClick={() => {
              visible1Set(true);
            }}>
            <div>{problemTypeI != null && problemTypeI != undefined ? <span style={{ color: "#1E1B27" }}>{feedbackTypesD[problemTypeI]?.name}</span> : t("xuanzewentiliexing")}</div>
            <img src={require("../../../assets/image/center/fx/fxright.png")} alt="" />
          </div>
          {/* 订单 associate!=0*/}
          {problemTypeI != null && problemTypeI != undefined && feedbackTypesD[problemTypeI]?.associate != 0 && <div className={style.content_title}>{t("xiangguandingdan")}</div>}
          {problemTypeI != null && problemTypeI != undefined && feedbackTypesD[problemTypeI]?.associate != 0 && (
            <div
              className={style.content_lx}
              onClick={() => {
                visible2Set(true);
                doSearch();
              }}>
              <div>{problemTypeI2 != null && problemTypeI2 != undefined ? <span style={{ color: "#1E1B27" }}>{queryUserAssetListD[problemTypeI2]?.trn}</span> : t("xuanzexiangguandingdanhao")}</div>
              <img src={require("../../../assets/image/center/fx/fxright.png")} alt="" />
            </div>
          )}
          {/* 描述 */}
          <div className={style.content_title2}>
            {t("wentimiaoshu")}
            <span>*</span>
            <span className={style.nr}>({t("neirongjieyu", { a: "20", b: "200" })})</span>
          </div>
          <div className={style.content_ms}>
            <div className={style.TextAreas}>
              <TextArea maxLength={200} rows={9} value={TextAreaD} onChange={TextAreaDSet} placeholder={t("qingxiangximiaoshunindewentihuojianuyi")} />
              <div className={style.showCount}>{TextAreaD.length}/200</div>
            </div>
            <div className={style.img_bottom}>
              <div className={style.img_bottom_num}>{imgDatas.length}/3</div>
              {/* 图片 */}
              <div className={style.img_div}>
                {imgDatas.map((value, index) => {
                  return (
                    <div key={index} className={style.border}>
                      <div
                        className={style.position}
                        onClick={() => {
                          visible3Set(true), imgDatasISet(index);
                        }}>
                        <div
                          className={style.right}
                          onClick={(e) => {
                            e.stopPropagation(), deleteImg(index);
                          }}>
                          <img src={require("../../../assets/image/center/fk/sc.png")} alt="" />
                        </div>
                        <img src={value} alt="" className={style.border_img} />
                      </div>
                    </div>
                  );
                })}
                {imgDatas.length < 3 && (
                  <div
                    onClick={() => {
                      editAvatar();
                    }}
                    className={style.border}>
                    <img src={require("../../../assets/image/center/sclog.png")} alt="" className={style.border_img} />
                  </div>
                )}
              </div>
              <div className={style.img_bottom_font}>* {t("wenjiangeshiwei")}</div>
            </div>
          </div>
        </div>
        <div className={style.buts}>
          <Button className={style.buts2} loading={loading} onClick={() => Submit()}>
            {t("btn_submit")}
          </Button>
        </div>
      </div>
      {/* 问题类型 */}
      <Popup
        visible={visible1}
        onMaskClick={() => {
          visible1Set(false);
        }}
        bodyStyle={{ height: "90vh" }}>
        <div className={style.Popup_body}>
          <div className={style.top}>
            <div
              className={style.top_cancel}
              onClick={() => {
                visible1Set(false);
              }}>
              {t("cancel")}
            </div>
            <div>{t("xuanzewentiliexing")}</div>
          </div>
          <div className={style.content}>
            {feedbackTypesD.length == 0 ? (
              <Empty className={style.Empty} image={<img className="emptyImg" src={require("../../../assets/image/center/xgjlnull.png")} />} description={t("noData")}></Empty>
            ) : (
              feedbackTypesD.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={style.content_div}
                    onClick={() => {
                      problemTypeISet(index), problemTypeI2Set(), visible1Set(false);
                    }}>
                    <div className={style.content_div_left}>
                      <img src={item?.icon} alt="" />
                      {item?.name}
                    </div>
                    {problemTypeI == index && <img style={{ width: "16.5px", height: "11.5px" }} src={require("../../../assets/image/center/gxlog.png")} alt="" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Popup>
      {/* 订单号 */}
      <Popup
        visible={visible2}
        onMaskClick={() => {
          visible2Set(false);
          orderChangeSet("");
          orderChangeRef.current = "";
        }}
        bodyStyle={{ height: "90vh", background: "#fff" }}
        destroyOnClose={true}>
        <div className={style.Popup_body2}>
          <div className={style.top}>
            <div
              className={style.top_cancel}
              onClick={() => {
                visible2Set(false);
                orderChangeSet("");
                orderChangeRef.current = "";
              }}>
              {t("cancel")}
            </div>
            <div>{t("xiangguandingdan")}</div>
          </div>
          <div className={style.search}>
            <div className={style.inpu}>
              <img
                src={require("../../../assets/image/center/fk/whlog.png")}
                alt=""
                onClick={() => {
                  doSearch();
                }}
              />
              {/* onClear={() => { doSearch() }} */}
              {/* changeInput(e), */}
              <Input
                className={style.inpu2}
                onClear={() => {
                  (orderChangeRef.current = ""), doSearch();
                }}
                onEnterPress={() => {
                  doSearch();
                }}
                value={orderChangeRef.current}
                onChange={(e) => {
                  (orderChangeRef.current = e), orderChangeSet(e);
                }}
                placeholder={t("qingshuruxiangguandingdanhao")}
                style={{ "--placeholder-color": "#CCCCCC" }}
                clearable
              />
            </div>
          </div>
          <div className={style.content}>
            {queryUserAssetListD.length != 0 && <div className={style.content_titles}>{t("ningxiangzixundedingdan")}：</div>}
            <div className={style.ovfl}>
              {queryUserAssetListD.length == 0 ? (
                <Empty className={style.Empty} image={<img className="emptyImg" src={require("../../../assets/image/center/xgjlnull.png")} />} description={t("noData")}></Empty>
              ) : (
                queryUserAssetListD.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={style.content_div}
                      onClick={() => {
                        problemTypeI2Set(index), (orderChangeRef.current = ""), orderChangeSet(""), visible2Set(false);
                      }}>
                      <div className={style.content_div_fonts}>
                        <div className={style.content_div_fonts_l}>{item?.trn}</div>
                        <div>{item?.name}</div>
                      </div>
                      <div className={style.content_div_fonts} style={{ textAlign: "right" }}>
                        <div className={style.content_div_fonts_r}>{item?.goldCoin}</div>
                        <div>{item?.gmtAllCreate}</div>
                      </div>
                    </div>
                  );
                })
              )}
              {queryUserAssetListD.length != 0 && <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />}
            </div>
          </div>
        </div>
      </Popup>

      {/* 展开图片 */}
      <Popup
        visible={visible3}
        onMaskClick={() => {
          visible3Set(false);
          imgDatasISet();
        }}
        position="right"
        bodyStyle={{ width: "100vw" }}
        destroyOnClose={true}>
        <div style={{ width: "100%", height: "100vh", boxSizing: "border-box" }}>
          <NavBar
            back={null}
            left={
              <img
                src={require("../../../assets/image/kf/left.png")}
                style={{ width: "22px", height: "26px" }}
                onClick={() => {
                  visible3Set(false), imgDatasISet();
                }}
              />
            }
            className={style.wbg}
            // right={<div className={style.NavBar} onClick={() => history('/myFeedback')} >我的反馈</div>}
          >
            {/* <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                            {'查看图片'}
                        </div> */}
          </NavBar>
          {/* <div className={style.Popup_body4}>
                        <img src={imgDatas[imgDatasI]} alt="" />
                    </div> */}
          <Swiper defaultIndex={imgDatasI}>
            {imgDatas.map((value, index) => {
              return (
                <Swiper.Item className={style.Popup_body4} key={index}>
                  <img src={value} alt="" />
                </Swiper.Item>
              );
            })}
          </Swiper>
          <div className={style.Popup_body3_bottom}>
            <div></div>
            <div>{t("yixuanzezhaopian", { a: imgDatas.length })}</div>
            <div
              onClick={() => {
                visible3Set(false);
              }}>
              {t("btn_confirm")}
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Index;
