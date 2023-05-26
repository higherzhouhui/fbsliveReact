import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, message, Empty } from "antd";
import { feedbackSave, feedbackTypes, feedbackAll, feedbackRead } from "../../../api/userInfo";
import { queryUserAssetList } from "../../../api/userInfo";
import { getOssToken } from "../../../api/base";
import { useTranslation } from "react-i18next";
const { Option } = Select;
import OpinionList from "./common/opinionList";
import OpinionListDetail from "./common/opinionListDetail";
import OSS from "ali-oss";
import "./opinion.scss";
export default () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  // 上传图片
  const [imgData, setImgData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [associate, setAssociate] = useState(0);
  const [feedbackTypesList, feedbackTypesListSet] = useState([]);
  const [userAssetList, setUserAssetList] = useState([]);
  const [list, setList] = useState([]); //我的反馈
  const [loading1, setLoading1] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [info, setInfo] = useState([]);
  const [listDetailShow, setListDetailShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  // 获取问题类型
  const getFeedbackTypes = async () => {
    const rt = await feedbackTypes();
    if (!(rt instanceof Error)) {
      feedbackTypesListSet(rt || []);
    }
  };
  /**
   * 选择问题类型，如果类型associate==0，则没有相关订单，否则查询查询订单
   * @param {*} value
   */
  const onTypeIdChange = (value) => {
    const temp = feedbackTypesList.find((item) => {
      return item.id == value;
    });
    setAssociate(temp?.associate || 0);
    if (temp?.associate !== 0) {
      getQueryUserAssetList(temp?.associate);
    }
  };
  /**
   * 根据问题类型查询相关订单
   * @param {*} assertCode
   */
  const getQueryUserAssetList = async (assertCode) => {
    const rt = await queryUserAssetList({
      methodType: 10000, //当前记录类型
      assertCode, //全部弹窗 选中内容
      timeAssertCode: 40004, //时间弹窗 选中内容  7天
      pageNum: 0,
      pageSize: 999,
      trn: "",
    });
    if (!(rt instanceof Error)) {
      setUserAssetList(rt.centerUserAssetsPlusVOS || []);
    }
  };
  const onFinish = async ({ businessOrderNum, content, typeId }) => {
    let params = {
      typeId,
      businessOrderNum,
      content,
      photoAlbum: imgData.length > 0 ? imgData.join(",") : "",
    };
    setLoading(true);
    const rt = await feedbackSave(params);
    if (!(rt instanceof Error)) {
      setLoading(false);
      form.resetFields();
      getFeedbackAll();
      setImgData([]);
      message.success({ content: `${t("user_opinion_submit")}`, duration: 0.5 });
    }
  };
  /**
   * 上传图片方法
   */
  const editAvatar = () => {
    let inputChoose = document.createElement("input");
    inputChoose.type = "file";
    inputChoose.style = "display:none";
    document.body.appendChild(inputChoose);
    inputChoose.click();
    inputChoose.onchange = async function () {
      const oss = await getOssToken();
      if (!(oss instanceof Error)) {
        let file = inputChoose.files[0];
        const client = new OSS({
          region: oss.endpoint.split(".")[0],
          accessKeyId: oss.key,
          accessKeySecret: oss.secret,
          bucket: oss.bucketName,
          stsToken: oss.token,
        });
        async function put() {
          try {
            const result = await client.put(`webh5/avatar-${new Date().getTime()}-${file.name}`, file);
            setImgData([...imgData, result.url]);
            document.body.removeChild(inputChoose);
          } catch (e) {
            console.log(e);
          }
        }
        put();
      }
    };
  };
  /**
   * 删除上传的图片
   * @param {*} i
   */
  const delImgData = (i) => {
    let data = [...imgData];
    data.forEach((value, index) => {
      if (index == i) {
        data.splice(index, 1);
      }
    });
    setImgData(data);
  };
  const getFeedbackAll = async () => {
    try {
      setLoading1(true);
      const rt = await feedbackAll();
      if (!(rt instanceof Error)) {
        setList(rt || []);
        setLoading1(false);
        setRefresh(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const hideOpinion = () => {
    setDetailShow(false);
  };
  const onItem = (data) => {
    setInfo(data);
    setListDetailShow(true);
  };
  const hideOpinionListDetail = () => {
    setListDetailShow(false);
  };
  // 上一页/下一页切换
  const changeItem = (data) => {
    let length = list.length;
    let index = list.findIndex((v) => {
      return v.id == info.id;
    });
    let obj = {};
    if (data == "prev") {
      // 如果上一条是第0条，那么切换就是从数组的最后一条开始 else 正常切换index-1
      index == 0 ? (obj = list[length - 1]) : (obj = list[index - 1]);
    } else {
      // 如果下一条是最后一条，那么切换就是从0开始  else 正常切换index+1
      index + 1 == length ? (obj = list[0]) : (obj = list[index + 1]);
    }
    setInfo(obj);
  };
  useEffect(() => {
    getFeedbackTypes();
    getFeedbackAll();
  }, []);
  return (
    <div className="container-opinion">
      <div className="content-left">
        <div className="title">{t("user_yjfk")}</div>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={true} className="opinion-form" autoComplete="off">
          <Form.Item name="typeId" rules={[{ required: true, message: t("user_opinion_pwtlx") }]} required label={t("user_opinion_wtlx")}>
            <Select size="middle" placeholder={t("user_opinion_pwtlx")} onChange={onTypeIdChange} allowClear style={{ textAlign: "left", width: "400px" }}>
              {feedbackTypesList.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {associate !== 0 && (
            <Form.Item name="businessOrderNum" label={t("user_opinion_xgdd")}>
              <Select size="middle" placeholder={t("user_opinion_pxgdd")} allowClear style={{ textAlign: "left", width: "400px" }}>
                {userAssetList.map((item, index) => {
                  return (
                    <Option key={index} value={item.trn}>
                      {item.trn} - {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
          <Form.Item name="content" label={t("user_opinion_wtms")} rules={[{ required: true, message: t("user_opinion_pwtms") }]}>
            <Input.TextArea style={{ height: "160px", width: "580px" }} placeholder={t("user_opinion_tips1")} />
          </Form.Item>
          <Form.Item label={t("user_opinion_tips2")}>
            {/* 图片 */}
            <div className="upload-content">
              {imgData.map((item, index) => {
                return (
                  <div key={index} className="item">
                    <img key={index} src={item} alt="" className="icon-upload-img" />
                    <img onClick={() => delImgData(index)} className="close" src={require("../../../assets/images/userInfo/close.png")} alt="" />
                  </div>
                );
              })}
              {imgData.length < 3 && (
                <div
                  onClick={() => {
                    editAvatar();
                  }}
                  className="border">
                  <span className="icon icon-upload"></span>
                </div>
              )}
            </div>
          </Form.Item>
          <Form.Item>
            <Button loading={loading} className="btn-sumit" type="primary" htmlType="submit">
              {t("f_btn_submit")}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="content-right">
        <div className="right-tips">
          <span className="title">{t("user_opinion_wdfk")}</span>
          <span className="more" onClick={() => setDetailShow(true)}>
            {t("ui_more")} <i className="icon icon-right"></i>{" "}
          </span>
        </div>
        <div className={`feedback ${loading1 && "loading"}`}>
          {list.map((item, index) => {
            return (
              <div key={index} className="feedback-item" onClick={() => onItem(item)}>
                <div className="feedback-item-name">{item.name}</div>
                <div title={item.content} className="feedback-item-content">
                  {item.content}
                </div>
              </div>
            );
          })}
          {list.length == 0 && <Empty description={null} />}
        </div>
      </div>

      <div className={`drawer-body ${detailShow ? "show" : "hide"}`}>
        <OpinionList hideOpinion={() => hideOpinion()} list={list} />
      </div>

      <div className={`drawer-body ${listDetailShow ? "show" : "hide"}`}>
        <OpinionListDetail hideOpinionListDetail={() => hideOpinionListDetail()} changeItem={(data) => changeItem(data)} info={info} />
      </div>
    </div>
  );
};
