import createContextReducer from "context-reducer";
import { Local } from "../common";
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
  user: Local("userInfo2"),
  loginForm: {
    mobile: "",
    password: "",
  },
  baseInfo: Local("baseInfo") || {},
  liveList: [],
  liveTag: [],
  liveBanner: [],
  liveTagIndex: 1,
  assergoldData: Local("assergold2") || {},
  game: [],
  anchorCardReq: {},
  serviceUrl: ""
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
      Local("userInfo2", payload);
      Local("assergold2", { goldCoin: payload ? payload.goldCoin : 0 })
      return {
        ...state,
        user: payload,
        assergoldData: { goldCoin: payload ? payload.goldCoin : 0 }
      };
    }
    case "UPDATE_ASSERGOLD": {
      Local("assergold2", payload);
      const goldCoin = payload?.goldCoin
      const user = {
        ...init.user,
        goldCoin,
      }
      return {
        ...state,
        user,
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
    case "UPDATE_GAME": {
      return {
        ...state,
        game: payload,
      };
    }
    case "UPDATE_ANCHORCARDREQ": {
      return {
        ...state,
        anchorCardReq: payload,
       }
    }
    case "UPDATE_SERVICEURL": {
      return {
        ...state,
        serviceUrl: payload,
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
