import { authorization, getLang, userAgent } from "./tools";
import { Local } from "../common";
import md5 from "./md5";
import { merge } from "lodash";
import { message } from "antd";
import React from "react";
import { Modal } from "antd-mobile";
import { GetFinger } from "../wap/util/finger";
const axios = require("axios").default;
const MSGWHITE = ["只能跟主播私聊"];

// 判断只弹窗一次
let datas = false;
const genReqBaseInfo = (timestamp) => {
  // let udid = Local("finger") || "empty";
  let udids = Local("finger") || "empty";
  // 每次请求判断udid
  GetFinger().then((udid) => {
    console.log("udids", udid);
    udids = udid;
  });

  return {
    channel: "",
    currentUserAppVersion: "2.0.5",
    language: getLang(Local("lang") || "vie"),
    os: "6", //6是pc
    sign: md5(udids + "jgyh,kasd" + timestamp),
    paySign: md5(udids.substring(0, 6) + "8qiezi" + timestamp),
    udid: udids,
    version: "0.3.8",
    timestamp,
    token: authorization(),
    uid: (Local("userInfo2") && Local("userInfo2").uid) || "",
    platForm: "pc",
    deviceType: "1",
  };
};

const checkResMsg = (body) => {
  if (body.code >= 999 && body.msg) {
    if (body.code == 999 && body.msg == "投注失败") {
      if (Local("lang") == "vie") {
        message.error("แพ้พนัน");
      } else if (Local("lang") == "en") {
        message.error("bet lost");
      } else {
        // message.error(body.msg)
      }
    } else {
      // 单存活动 流水不够打开失败弹窗
      if (body.code == 14121) {
        window.eventBus.emit("msg14121", body);
      } else if (body.code == 1001) {
      } else if (body.code == 1008) {
        new Error(body.msg);
      } else {
        message.error(body.msg);
      }
    }
    throw new Error(body.msg);
  } else if (body.code == 992) {
    Local("token2", "");
    Local("userInfo2", "");
  }
  return body;
};

// 拦截请求
axios.interceptors.request.use(
  (config) => {
    if (userAgent() === "PC") {
      let reqBaseInfo = {};
      const method = config.method.toUpperCase();
      if (config.url.indexOf("/agentApi/") > -1) {
        reqBaseInfo = {};
      } else {
        reqBaseInfo = genReqBaseInfo(new Date().getTime());
      }
      if (config.headers) {
        merge(config.headers, {
          "X-UDID": reqBaseInfo.udid,
          "X-Timestamp": reqBaseInfo.timestamp,
          "X-Language": reqBaseInfo.language,
          "X-Sign": reqBaseInfo.sign,
          os: 6,
          Authorization: "HSBox " + reqBaseInfo.token,
          tenantSys: "fbs-yn",
        });
      }
      if (method === "POST") {
        config.data = { ...reqBaseInfo, ...(config.data || {}) };
      }
    }
    return config;
  },
  (error) => {
    if (userAgent() === "PC") {
      Promise.reject(error);
    }
  }
);
const WhiteCode = [992];

// 拦截响应 @ TODO 验证身份有效（由标准 code 决定？）
axios.interceptors.response.use(
  (response) => {
    if (userAgent() === "PC") {
      const body = response.data;
      checkResMsg(body);
      return body;
    } else return response;
  },

  (error) => {
    if (userAgent() === "PC") {
      const response = error.response;
      if (WhiteCode.includes(response.data.code * 1)) {
        return Local("token2", "");
      }
      const showErrorDefault = () => {
        message.error(error.message || "服务异常");
      };
      // debugger

      // 有响应回来
      if (response && response.data && response.status) {
        const body = response.data;
        if (body.msg) {
          if (MSGWHITE.includes(body.msg)) return;
          message.error(body.msg || "服务异常");
        } else {
          // showErrorDefault()
        }
      } else {
        showErrorDefault();
      }
      // ![404].includes(Number(error.response.status)) && Toast.show(error.response)
      if (error.response?.status === 426 || error.response?.data?.code == 995) {
        if (!datas) {
          let res = error.response || { data: {} };
          datas = true;
          Modal.show({
            content: (
              <div className="maintain" style={{ background: `url(${require("../wap/assets/image/center/whz.png")})`, backgroundSize: "100% 100%", padding: "0 21px", height: "449px" }}>
                <div className="text">{res.data.msg}</div>
              </div>
            ),
            closeOnMaskClick: true,
            bodyClassName: "maintenances",

            onClose: async () => {
              Local("token2", "");
              location.href = "/login";
            },
          });
        }
      }

      // @ TODO 是否有 401 等
      return Promise.reject(error);
    } else {
      return error;
    }
  }
);

const PROXY = "/api";

// 发起一次请求
async function makeRequest(option) {
  try {
    if (userAgent() === "PC") {
      if (!option.method) {
        option.method = "POST";
      }
      if (option.PROXY) {
        // console.log(option,"option")
        option.url = option.PROXY + option.url;
      } else {
        option.url = PROXY + option.url;
      }
      const resBody = await axios(option);
      return resBody.data; // body.data
    }
  } catch (error) {}
}

export { makeRequest };
