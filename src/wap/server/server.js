import { Toast, Modal } from "antd-mobile";
import md5 from "md5";
import axios from "axios";
import { Local } from "../../common";
import { userAgent } from "../../utils/tools";
import React from "react";
import "../assets/style/server.scss";
import _ from "lodash";
import ToastModel from "../components/ToastModel";
import i18n from "../lang/i18n";
import { GetFinger } from "../util/finger";

const baseUrl = "/api";
let datas = false; //判断只弹窗一次
let loading2Url = [];
let loading2Time = null;
let loading2Fn;
let version = "1.3.0";

const delay = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, time * 1000);
  });
};

const isNoBodyMethod = (method) => ["get", "delete"].includes(method.toLowerCase());
const getLang = (language) => {
  switch (language) {
    case "th":
      return "THAI";
    case "zh":
      return "CN";
    case "en":
      return "EN";
    case "vie":
      return "YN";
    default:
      return "YN";
  }
};
const getGameLang = (language) => {
  switch (language) {
    case "JP":
      return "ja-JP";
    case "vie":
      return "vi-VN";
    case "zh":
      return "zh-CN";
    default:
      return "vi-YN";
  }
};

// 暫存：紀錄執行中的請求
const pending = new Map();

const addPending = (config) => {
  // 利用method和url來當作這次請求的key，一樣的請求就會有相同的key
  const key = [config.method, config.url].join("&");
  // 為config添加cancelToken屬性
  config.cancelToken = new axios.CancelToken((cancel) => {
    // 確認暫存中沒有相同的key後，把這次請求的cancel函式存起來
    if (!pending.has(key)) pending.set(key, cancel);
  });
};

const removePending = (config) => {
  if (config && config.method && config.url) {
    // 利用method和url來當作這次請求的key，一樣的請求就會有相同的key
    const key = [config.method, config.url].join("&");
    // 如果暫存中有相同的key，把先前存起來的cancel函式拿出來執行，並且從暫存中移除
    if (pending.has(key)) {
      const cancel = pending.get(key);
      cancel(key);
      pending.delete(key);
    }
  }
};

//loading加载白名单
const passTime = ["/api/center-client/sys/user/gameBalanceList", "/api/live-client/live/list"];

//设置两秒加载队列
const setTime2 = (config) => {
  if (passTime.includes(config.url)) return;
  loading2Url.push(`${config.headers["X-Timestamp"]}${config.url}`);
  if (loading2Url.length > 0) {
    loading2Time = setTimeout(() => {
      if (loading2Url.length > 0) {
        loading2Fn = ToastModel.loading(i18n.t("jia_zai_zhong"), 12000);
      } else {
        clearTimeout(loading2Time);
        loading2Time = null;
      }
    }, 5000);
  }
};

// 去除2秒加载
const clearTime2 = (config, type) => {
  if (type === "normal" && config) {
    let name = `${config.headers["X-Timestamp"]}${config.url}`;
    _.pull(loading2Url, name);
  } else if (type === "fail") {
    // let block = ['api/center-client/sys/user/get/info']
    // console.log(type, "type11111111")
    let index = loading2Url.findIndex((v) => v.includes(config.message.replace("post&/api/", "").replace("get&/api/", "")));
    if (index >= 0) {
      _.pullAt(loading2Url, index);
    }
  }
  setTimeout(() => {
    if (loading2Time && loading2Url.length === 0) {
      clearTimeout(loading2Time);
      loading2Time = null;
      loading2Fn && loading2Fn();
    }
  }, 500);
};

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    if (userAgent() !== "PC") {
      config.data = config.data || {};
      let params = { ...config.data };
      let userInfo = Local("userInfo") || {};
      let udid = config.data.udid;
      config.data.language = getLang(Local("lang") || "vie");
      config.data.timestamp = new Date().getTime();
      config.data.sign = md5(udid + "jgyh,kasd" + config.data.timestamp);
      config.data.paySign = md5(udid.substring(0, 6) + "8qiezi" + config.data.timestamp);
      config.data.currentUserAppVersion = "2.0.5";
      config.data.channel = "";
      config.data.version = version;
      config.data.softVersion = version;
      config.data.os = "5"; //5是h5
      config.data.platForm = "h5";
      config.data.deviceType = "1";
      config.url = !config.url.includes(config.PROXY) ? config.PROXY + config.url : config.url;
      if (!config.data.uid) config.data.uid = userInfo.uid;
      config.headers = Object.assign(config.headers, {
        "X-UDID": udid,
        "X-Timestamp": config.data.timestamp,
        "X-Language": config.data.language,
        "X-Sign": config.data.sign,
        "Accept-Language": getGameLang(Local("lang") || "vie"),
        os: 5,
        tenantSys: "fbs-yn",
      });
      let token = Local("token");
      if (token) {
        config.headers.Authorization = `HSBox ${token}`;
        config.data.token = token;
      }
      if (isNoBodyMethod(config.method)) {
        config.params = params;
      }
      if (config.hasRemovePending) {
        // // 先判斷是否有重複的請求要取消
        removePending(config);
      }
      addPending(config);

      // 暂时隐藏灰色loading
      // if (location.pathname !== "/liveRoom") setTime2(config);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截
axios.interceptors.response.use(
  (res) => {
    if (userAgent() !== "PC") {
      clearTime2(res.config, "normal");
      removePending(res);
      try {
        const json = res.data;
        // console.log('res.data', json, json.data);

        // 判断一键回收接口
        if (res.config.url == "/api/center-client/sys/user/backAllGameCoin") {
          Toast.show({
            maskClassName: "maskClassNames",
            content: json.msg || json.message,
            position: "center",
          });
        }
        if (res.config.url == "/api/live-client/live/send/gift") {
          return res;
        }
        // agentApi单独处理
        if (json.code == 200 && res.config.PROXY == "/agentApi") {
          console.log("code == 200json.msg");
          //  || Toast.show(json.msg || json.message);
          return json.data;
        }
        //返回数据  待测试
        if (json.code === 0 || json.code === 200) {
          // console.log('json.code--------------------------', json.code);
          // || Toast.show(json.msg || json.message)
          return json.data;
        } else if (json.code === 3001) {
          return json;
        } else if (json.code == 11004) {
          return json.data;
        } else if (json.code === 1008) {
          return new Error(json.message || json.msg);
        }
        // 判断code返回json
        else if (json.code == 14121) {
          return json;
        } else if (res.config.PROXY != "/agentApi") {
          //全局错误码提示
          Toast.show({
            maskClassName: "maskClassNames",
            content: json.msg || json.message,
            position: "center",
          });
          // 未登录时
          if (json.code == 992) {
            localStorage.clear();
            location.reload();
          }
          return new Error(json || "未知错误！");
        }
      } catch (error) {
        return new Error(error || "未知错误！");
      }
    } else return res;
  },
  async (error) => {
    loading2Fn && loading2Fn();
    if (userAgent() !== "PC") {
      if (error.config) {
        clearTime2(error.config, "normal");
      } else clearTime2(error, "fail");
      // ![404].includes(Number(error.response.status)) && Toast.show(error.response)
      if (error.response?.status === 426 || error.response?.data?.code == 995) {
        if (!datas) {
          let res = error.response || { data: {} };
          datas = true;
          Modal.show({
            content: (
              <div className="maintain" style={{ background: `url(${require("../assets/image/center/whz.png")})`, backgroundSize: "100% 100%", padding: "0 21px", height: "449px" }}>
                <div className="text">{res.data.msg}</div>
              </div>
            ),
            closeOnMaskClick: true,
            bodyClassName: "maintenances",

            onClose: async () => {
              Local("token", "");
              location.href = "/login";
            },
          });
        }
      }
      // console.log('errerror', error,  2, error.response.data.msg);
      // if(error.response?.status==433){

      // }
      if (error.response?.data?.msg != null && error.response?.data?.msg != undefined && error.response?.data?.msg.length > 0) {
        Toast.show({
          maskClassName: "maskClassNames",
          content: error.response?.data?.msg || error.response?.data?.message,
          position: "center",
        });
      }
      // console.log(error.config);
      if (error.config) {
        try {
          if (error.config.reTry > 0) {
            await delay(3);
            return request(error.config.url, error.config.method, JSON.parse(error.config.data), error.config.hasRemovePending, error.config.PROXY, error.config.reTry - 1);
          } else {
            return Promise.reject(error);
          }
        } catch (err) {
          // Toast.show(err || i18n.t("wang_luo_yc"));
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(err);
      }
    }
  }
);

const doRequest = (options) => {
  if (userAgent() !== "PC") {
    if (options.hasRemovePending) {
      options.timeout = 15000;
    }
    return axios.request(options);
  }
};

const request = (url, method, data = {}, hasRemovePending = true, PROXY = "/api", reTry = 3) => {
  return new Promise((resolve) => {
    GetFinger().then((udid) => {
      data.udid = udid;
      resolve(doRequest({ url, method, data, hasRemovePending, PROXY, reTry }));
    });
  });
};

export default request;

export const clearPageMap = () => {
  loading2Url = [];
  clearTimeout(loading2Time);
  loading2Time = null;
};
