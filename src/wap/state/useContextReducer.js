import createContextReducer from "context-reducer";
import { Local } from "../../common";
import fetchContainer from "./useAction";

const getData = () => {
  const modulesFiles = require.context("./modules", false, /\.js$/);
  const modules = modulesFiles.keys().reduce(
    (modules, modulePath) => {
      const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
      const value = modulesFiles(modulePath);
      modules.state[moduleName] = value.default.state;
      modules.model[moduleName] = value.default.model;
      return modules;
    },
    { state: {}, model: {} }
  );
  return modules;
};
let init = {
  isLogin: false,
  user: Local("userInfo") || {},
  loginForm: {
    mobile: "",
    password: "",
  },
  baseInfo: Local("baseInfo") || {},
  getLiveQuickComment: Local("getLiveQuickComment") || [],
  liveList: [],
  liveTag: [],
  liveBanner: [],
  liveTagIndex: 1,
  assergoldData: Local("assergold") || {},
  Betting: Local("Betting") || {},
  previewStatus: {},
  showRechargeGift: {},
  anchorCardReq: {},
};
/** 初始state值 */
const stateDefault = {
  ...init,
  ...getData().state,
};

export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_USERINFO": {
      if (payload.imToken != undefined) {
        Local("userInfo", payload);
      }
      return {
        ...state,
        user: payload,
      };
    }
    case "UPDATE_ASSERGOLD": {
      if (payload != undefined && payload.goldCoin != null && payload.goldCoin != undefined) {
        Local("assergold", payload);
      }
      return {
        ...state,
        assergoldData: payload,
      };
    }
    case "LOGIN": {
      return {
        ...state,
        isLogin: payload,
      };
    }
    case "REGISTER": {
      return {
        ...state,
        isLogin: payload,
      };
    }
    case "SET_BASE_INFO": {
      return {
        ...state,
        baseInfo: payload,
      };
    }
    case "GET_LIVE_QUICK_COMMENT": {
      return {
        ...state,
        getLiveQuickComment: payload,
      };
    }
    case "UPDATE_LIVELIST": {
      return {
        ...state,
        liveList: payload,
      };
    }
    case "UPDATE_LIVETAG": {
      return {
        ...state,
        liveTag: payload,
      };
    }
    case "UPDATE_LIVEBANNER": {
      return {
        ...state,
        liveBanner: payload,
      };
    }
    case "UPDATE_BETTING": {
      Local("Betting", payload);
      return {
        ...state,
        Betting: payload,
      };
    }
    case "UPDATE_PREVIEWSTATUS": {
      return {
        ...state,
        previewStatus: payload,
      };
    }
    case "UPDATE_SHOWRECHARGEGIFT": {
      return {
        ...state,
        showRechargeGift: payload,
      };
    }
    case "UPDATE_ANCHORCARDREQ": {
      return {
        ...state,
        anchorCardReq: payload,
      };
    }
    default:
      try {
        const [model, event] = type.split("/");
        getData().model[model][event](payload);
        return { ...state, ...getData().state };
      } catch (error) {
        return state;
      }
  }
};

export default createContextReducer({ reducer, stateDefault, fetchContainer });
