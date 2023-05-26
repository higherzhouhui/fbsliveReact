import { Local } from "../common";
import { clearPageMap } from "./server/server";

const routes = [
  {
    path: "*",
    redirect: "/login",
  },
  {
    path: "/login",
    page: () => import("./pages/Login/login"),
  },
  {
    path: "/register",
    page: () => import("./pages/Login/register"),
  },
  {
    path: "/forget",
    page: () => import("./pages/Login/forget"),
  },
  {
    path: "/home",
    page: () => import("./pages/Home/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/promisionDetail",
    page: () => import("./pages/Home/detail"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/game",
    page: () => import("./pages/Game/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/gameAll",
    page: () => import("./pages/Game/all"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/live",
    page: () => import("./pages/newLive/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/liveSport",
    page: () => import("./pages/newLive/sport"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/liveRoom",
    page: () => import("./pages/newLive/room"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/my",
    page: () => import("./pages/Center/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/myGrade",
    page: () => import("./pages/Center/myGrade/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/recharge",
    page: () => import("./pages/Center/recharge/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/level",
    page: () => import("./pages/Center/level/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/tradeRecord",
    page: () => import("./pages/Center/tradeRecord/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/tradeRecordDetail",
    page: () => import("./pages/Center/tradeRecord/detail"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/gameRecord",
    page: () => import("./pages/Center/gameRecord/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/gameRecordDetailList",
    page: () => import("./pages/Center/gameRecord/detailList"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/gameRecordDetail",
    page: () => import("./pages/Center/gameRecord/detail"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/deposit",
    page: () => import("./pages/Center/deposit/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/firstWithdrawal",
    page: () => import("./pages/Center/deposit/firstWithdrawal"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/WithdrawalRecord",
    page: () => import("./pages/Center/deposit/WithdrawalRecord"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/addBank",
    page: () => import("./pages/Center/deposit/addBank"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/addUsdt",
    page: () => import("./pages/Center/deposit/addUsdt"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/fundPassword",
    page: () => import("./pages/Center/deposit/fundPassword"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/balance",
    page: () => import("./pages/Center/balance/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/friend",
    page: () => import("./pages/Center/friend/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/friendList1",
    page: () => import("./pages/Center/friend/firendList1"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/friendList2",
    page: () => import("./pages/Center/friend/firendList2"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/share",
    page: () => import("./pages/Center/shares/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/shareDetail",
    page: () => import("./pages/Center/shares/shareDetail"),
    meta: {
      auth: true,
    },
  },
  //   邀请明细
  {
    path: "/InvitationDetails",
    page: () => import("./pages/Center/shares/InvitationDetails"),
    meta: {
      auth: true,
    },
  },

  {
    path: "/join",
    page: () => import("./pages/Center/join/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/service",
    page: () => import("./pages/Center/services/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/follow",
    page: () => import("./pages/Center/follow/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/fans",
    page: () => import("./pages/Center/fans/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/personal",
    page: () => import("./pages/Center/personal/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/rankingList",
    page: () => import("./pages/RankingList/index"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/prize",
    page: () => import("./pages/Center/prize/index"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/prizeList",
    page: () => import("./pages/Center/prize/list"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/modifyName",
    page: () => import("./pages/Center/personal/conpmnents/modifyName"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/modifySex",
    page: () => import("./pages/Center/personal/conpmnents/modifySex"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/modifyAutograph",
    page: () => import("./pages/Center/personal/conpmnents/modifyAutograph"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/pullBlack",
    page: () => import("./pages/Center/personal/conpmnents/pullBlack"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/saveMoney",
    page: () => import("./pages/activityBox/saveMoney"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/buyProp",
    page: () => import("./pages/Center/buyProp"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/myProp",
    page: () => import("./pages/Center/myProp"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/record",
    page: () => import("./pages/Center/record"),
    meta: {
      auth: true,
    },
  },
  // 交易记录、消费记录 详细页面
  // {
  //     path: '/details',
  //     page: () => import("./pages/Center/record/details"),
  //     meta: {
  //         auth: true
  //     }
  // },
  {
    path: "/gameIframe",
    page: () => import("./pages/Game/gameIframe"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/aboutFbs",
    page: () => import("./pages/Center/aboutFbs"),
    meta: {
      auth: true,
    },
  },
  // 意见反馈
  {
    path: "/opinion",
    page: () => import("./pages/Center/opinion"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/myFeedback",
    page: () => import("./pages/Center/opinion/myFeedback"),
    meta: {
      auth: true,
    },
  },
  // 通知
  {
    path: "/notice",
    page: () => import("./pages/Center/notice"),
    meta: {
      auth: true,
    },
  },
  // 福利中心
  {
    path: "/goodCentre",
    page: () => import("./pages/Center/goodCentre"),
    meta: {
      auth: true,
    },
  },
  // 绑定手机号
  {
    path: "/bindingHandset",
    page: () => import("./pages/bindingBox/bindingHandset"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/bindingPhone",
    page: () => import("./pages/bindingBox/bindingPhone"),
    meta: {
      auth: false,
    },
  },
  // 安全
  {
    path: "/accountSafe",
    page: () => import("./pages/bindingBox/accountSafe"),
    meta: {
      auth: true,
    },
  },
  // 解绑
  {
    path: "/Unbinding",
    page: () => import("./pages/bindingBox/Unbinding"),
    meta: {
      auth: false,
    },
  },
];

//全局路由守卫
const onRouteBefore = (meta, to) => {
  // 设置切换页面默认滚动到顶部
  window.scroll(0, 0);
  clearPageMap();
  const { auth } = meta;
  // token权限验证   "/login"
  return auth && !Local("token") ? logins() : to;
};

const logins = () => {
  window.eventBus.emit("store", { type: "loginOut" });
  return "/login"
}

export default routes;

export { onRouteBefore };
