import React, { useEffect } from "react";
import { ConfigProvider, Toast } from "antd-mobile";
import RouterGuard from "./react-router-guard";
import routes, { onRouteBefore } from "./routes";
import "./assets/style/index.css";
import "./assets/style/index.scss";
import "./lang/i18n";
import ContextReducer from "./state/useContextReducer";
import enUS from "antd-mobile/es/locales/en-US";
import { useLocation } from "react-router-dom";
import { getAgentInfo } from "./server/user";
const EventStore = React.lazy(() => import("./state/event"));

let promoteDomain = window.location.href;
const App = () => {
  const query = useLocation();
  const getQuery = () => {
    return query.search
      .replace("?", "")
      .replace("@", "&")
      .split("&")
      .reduce((arr, item) => {
        arr[item.split("=")[0]] = item.split("=")[1];
        return arr;
      }, {});
  };
  const { puid, device } = getQuery();
  if (puid) sessionStorage.setItem("puid", puid);
  if (device) sessionStorage.setItem("device", device);
  Toast.config({ position: "center", maskClickable: true });

  // agentInfo 用于注册代理功能
  // * 进入APP，活动浏览器域名，调用getAgentInfo接口，若接口返回agentId则存在，注册时传入后端，
  const agentInfo = async () => {
    if (promoteDomain.split("?agentId=")[1] != undefined) {
      sessionStorage.setItem("agentId", promoteDomain.split("?agentId=")[1]);
    } else {
      let res = await getAgentInfo({ promoteDomain: promoteDomain });
      if (res && res.agentId) {
        sessionStorage.setItem("agentId", res.agentId);
        console.log("这是请求地址", promoteDomain);
        // sessionStorage.setItem('promoteDomain', promoteDomain2)
      } else {
        sessionStorage.setItem("agentId", null);
        // sessionStorage.setItem('promoteDomain', null)
      }
    }
  };
  useEffect(() => {
    agentInfo();
    document.oncontextmenu = new Function("event.returnValue=false;");
    document.onselectstart = new Function("event.returnValue=false;");
  }, []);
  return (
    <ConfigProvider locale={enUS}>
      <ContextReducer.Provider>
        <RouterGuard
          routers={routes}
          onRouterBefore={onRouteBefore}
          loading={
            <div>
              {/* <img src={require('./assets/image/loading.png')} alt="" className='loadingPng' /> */}
              <img src={require("./assets/image/common/loading.gif")} alt="" className="loadingPng" />
            </div>
          }
        />
        <EventStore />
      </ContextReducer.Provider>
    </ConfigProvider>
  );
};

export default App;
