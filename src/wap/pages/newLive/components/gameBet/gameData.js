import { t } from "i18next";
import i18n from "../../../../lang/i18n";
import _ from "lodash";
export const nav1 = [
  { name: i18n.t("Betnav1Title1"), type_name: "一同号", type: "YTH", split: "" },
  { name: i18n.t("Betnav1Title2"), type_name: "二同号", type: "ETH", split: "" },
  { name: i18n.t("Betnav1Title3"), type_name: "二不同", type: "EBT", split: "," },
  // { name: i18n.t('Betnav2Title4'), type_name: '豹子', type: 'BZ', split: '' },
];

export const game1Data = [
  [
    { name: [1], value: 1.98, type_text: nav1[0].type_name, type: nav1[0].type, split: nav1[0].split, type_show: nav1[0].name },
    { name: [2], value: 1.98, type_text: nav1[0].type_name, type: nav1[0].type, split: nav1[0].split, type_show: nav1[0].name },
    { name: [3], value: 1.98, type_text: nav1[0].type_name, type: nav1[0].type, split: nav1[0].split, type_show: nav1[0].name },
    { name: [4], value: 1.98, type_text: nav1[0].type_name, type: nav1[0].type, split: nav1[0].split, type_show: nav1[0].name },
    { name: [5], value: 1.98, type_text: nav1[0].type_name, type: nav1[0].type, split: nav1[0].split, type_show: nav1[0].name },
    { name: [6], value: 1.98, type_text: nav1[0].type_name, type: nav1[0].type, split: nav1[0].split, type_show: nav1[0].name },
  ],
  [
    { name: [1, 1], value: 12.88, type_text: nav1[1].type_name, type: nav1[1].type, split: nav1[1].split, type_show: nav1[1].name },
    { name: [2, 2], value: 12.88, type_text: nav1[1].type_name, type: nav1[1].type, split: nav1[1].split, type_show: nav1[1].name },
    { name: [3, 3], value: 12.88, type_text: nav1[1].type_name, type: nav1[1].type, split: nav1[1].split, type_show: nav1[1].name },
    { name: [4, 4], value: 12.88, type_text: nav1[1].type_name, type: nav1[1].type, split: nav1[1].split, type_show: nav1[1].name },
    { name: [5, 5], value: 12.88, type_text: nav1[1].type_name, type: nav1[1].type, split: nav1[1].split, type_show: nav1[1].name },
    { name: [6, 6], value: 12.88, type_text: nav1[1].type_name, type: nav1[1].type, split: nav1[1].split, type_show: nav1[1].name },
  ],
  [
    { name: [1, 2], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [1, 3], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [1, 4], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [1, 5], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [1, 6], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [2, 3], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [2, 4], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [2, 5], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [2, 6], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [3, 4], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [3, 5], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [3, 6], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [4, 5], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [4, 6], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
    { name: [5, 6], value: 6.98, type_text: nav1[2].type_name, type: nav1[2].type, split: nav1[2].split, type_show: nav1[2].name },
  ],
  // [
  //     { name: [2, 2, 2], value: 180, type_text: nav1[3].type_name, type: nav1[3].type, split: nav1[3].split, type_show: nav1[3].name },
  //     { name: [3, 3, 3], value: 180, type_text: nav1[3].type_name, type: nav1[3].type, split: nav1[3].split, type_show: nav1[3].name },
  //     { name: [4, 4, 4], value: 180, type_text: nav1[3].type_name, type: nav1[3].type, split: nav1[3].split, type_show: nav1[3].name },
  //     { name: [1, 1, 1], value: 180, type_text: nav1[3].type_name, type: nav1[3].type, split: nav1[3].split, type_show: nav1[3].name },
  //     { name: [5, 5, 5], value: 180, type_text: nav1[3].type_name, type: nav1[3].type, split: nav1[3].split, type_show: nav1[3].name },
  //     { name: [6, 6, 6], value: 180, type_text: nav1[3].type_name, type: nav1[3].type, split: nav1[3].split, type_show: nav1[3].name },
  // ],
];

//游戏2

export const nav2 = [
  { name: i18n.t("Betnav2Title1"), type_name: "和值", type: "1", split: "" },
  { name: i18n.t("Betnav2Title2"), type_name: "二同号复选", type: "6", split: "," },
  { name: i18n.t("Betnav2Title3"), type_name: "三军", type: "7", split: "" },
  // { name: i18n.t('Betnav2Title4'), type_name: '豹子', type: '8', split: '' },
];

export const game2Data = [
  [
    {
      name: [i18n.t("BetnavDa")],
      value: 1.97,
      type_text: nav2[0].type_name,
      type: nav2[0].type,
      split: nav2[0].split,
      oname: ["大"],
      type_show: nav2[0].name,
    },
    // {
    //     name: [i18n.t('Quanwei')],
    //     value: 30,
    //     type_text: '全围',
    //     type: 9,
    //     split: '',
    //     oname: ['QW'],
    //     type_show: i18n.t('Quanwei')
    // },
    {
      name: [i18n.t("BetnavXiao")],
      value: 1.97,
      type_text: nav2[0].type_name,
      type: nav2[0].type,
      split: nav2[0].split,
      oname: ["小"],
      type_show: nav2[0].name,
    },
    {
      name: [i18n.t("BetnavDan")],
      value: 1.97,
      type_text: nav2[0].type_name,
      type: nav2[0].type,
      split: nav2[0].split,
      oname: ["单"],
      type_show: nav2[0].name,
    },
    {
      name: [i18n.t("BetnavShuang")],
      value: 1.97,
      type_text: nav2[0].type_name,
      type: nav2[0].type,
      split: nav2[0].split,
      oname: ["双"],
      type_show: nav2[0].name,
    },
  ],
  [
    { name: [1, 1], value: 12.8, type_text: nav2[1].type_name, type: nav2[1].type, split: nav2[1].split, type_show: nav2[1].name },
    { name: [2, 2], value: 12.8, type_text: nav2[1].type_name, type: nav2[1].type, split: nav2[1].split, type_show: nav2[1].name },
    { name: [3, 3], value: 12.8, type_text: nav2[1].type_name, type: nav2[1].type, split: nav2[1].split, type_show: nav2[1].name },
    { name: [4, 4], value: 12.8, type_text: nav2[1].type_name, type: nav2[1].type, split: nav2[1].split, type_show: nav2[1].name },
    { name: [5, 5], value: 12.8, type_text: nav2[1].type_name, type: nav2[1].type, split: nav2[1].split, type_show: nav2[1].name },
    { name: [6, 6], value: 12.8, type_text: nav2[1].type_name, type: nav2[1].type, split: nav2[1].split, type_show: nav2[1].name },
  ],
  [
    { name: [1], value: 1.97, type_text: nav2[2].type_name, type: nav2[2].type, split: nav2[2].split, type_show: nav2[2].name },
    { name: [2], value: 1.97, type_text: nav2[2].type_name, type: nav2[2].type, split: nav2[2].split, type_show: nav2[2].name },
    { name: [3], value: 1.97, type_text: nav2[2].type_name, type: nav2[2].type, split: nav2[2].split, type_show: nav2[2].name },
    { name: [4], value: 1.97, type_text: nav2[2].type_name, type: nav2[2].type, split: nav2[2].split, type_show: nav2[2].name },
    { name: [5], value: 1.97, type_text: nav2[2].type_name, type: nav2[2].type, split: nav2[2].split, type_show: nav2[2].name },
    { name: [6], value: 1.97, type_text: nav2[2].type_name, type: nav2[2].type, split: nav2[2].split, type_show: nav2[2].name },
  ],
  // [
  //     { name: [1, 1, 1], value: 180, type_text: nav2[3].type_name, type: nav2[3].type, split: nav2[3].split, type_show: nav2[3].name },
  //     { name: [2, 2, 2], value: 180, type_text: nav2[3].type_name, type: nav2[3].type, split: nav2[3].split, type_show: nav2[3].name },
  //     { name: [3, 3, 3], value: 180, type_text: nav2[3].type_name, type: nav2[3].type, split: nav2[3].split, type_show: nav2[3].name },
  //     { name: [4, 4, 4], value: 180, type_text: nav2[3].type_name, type: nav2[3].type, split: nav2[3].split, type_show: nav2[3].name },
  //     { name: [5, 5, 5], value: 180, type_text: nav2[3].type_name, type: nav2[3].type, split: nav2[3].split, type_show: nav2[3].name },
  //     { name: [6, 6, 6], value: 180, type_text: nav2[3].type_name, type: nav2[3].type, split: nav2[3].split, type_show: nav2[3].name },
  // ],
];

//游戏3

export const nav3 = [
  { name: i18n.t("Betnav4Title1"), type_name: "个位", type: "7.1", split: "|" },
  { name: i18n.t("Betnav4Title2"), type_name: "龙虎万千", type: "9.1", split: "," },
  { name: i18n.t("Betnav4Title3"), type_name: "十位", type: "7.1", split: "|" },
];

export const game3Data = [
  [
    {
      name: [0, i18n.t("BetnavDa")],
      value: 1.97,
      type_text: nav3[0].type_name,
      type: nav3[0].type,
      split: nav3[0].split,
      oname: [0, "大"],
      type_show: nav3[0].name,
    },
    {
      name: [0, i18n.t("BetnavXiao")],
      value: 1.97,
      type_text: nav3[0].type_name,
      type: nav3[0].type,
      split: nav3[0].split,
      oname: [0, "小"],
      type_show: nav3[0].name,
    },
    {
      name: [0, i18n.t("BetnavDan")],
      value: 1.97,
      type_text: nav3[0].type_name,
      type: nav3[0].type,
      split: nav3[0].split,
      oname: [0, "单"],
      type_show: nav3[0].name,
    },
    {
      name: [0, i18n.t("BetnavShuang")],
      value: 1.97,
      type_text: nav3[0].type_name,
      type: nav3[0].type,
      split: nav3[0].split,
      oname: [0, "双"],
      type_show: nav3[0].name,
    },
  ],
  [
    {
      name: [i18n.t("BetnavLong")],
      value: 1.99,
      type_text: nav3[1].type_name,
      type: nav3[1].type,
      split: nav3[1].split,
      oname: ["龙"],
      type_show: nav3[1].name,
    },
    {
      name: [i18n.t("BetnavHu")],
      value: 1.99,
      type_text: nav3[1].type_name,
      type: nav3[1].type,
      split: nav3[1].split,
      oname: ["虎"],
      type_show: nav3[1].name,
    },
    {
      name: [i18n.t("BetnavHe")],
      value: 10.18,
      type_text: nav3[1].type_name,
      type: nav3[1].type,
      split: nav3[1].split,
      oname: ["和"],
      type_show: nav3[1].name,
    },
  ],
  [
    {
      name: [i18n.t("BetnavDa"), 0],
      value: 1.97,
      type_text: nav3[2].type_name,
      type: nav3[2].type,
      split: nav3[2].split,
      oname: ["大", 0],
      type_show: nav3[2].name,
    },
    {
      name: [i18n.t("BetnavXiao"), 0],
      value: 1.97,
      type_text: nav3[2].type_name,
      type: nav3[2].type,
      split: nav3[2].split,
      oname: ["小", 0],
      type_show: nav3[2].name,
    },
    {
      name: [i18n.t("BetnavDan"), 0],
      value: 1.97,
      type_text: nav3[2].type_name,
      type: nav3[2].type,
      split: nav3[2].split,
      oname: ["单", 0],
      type_show: nav3[2].name,
    },
    {
      name: [i18n.t("BetnavShuang"), 0],
      value: 1.97,
      type_text: nav3[2].type_name,
      type: nav3[2].type,
      split: nav3[2].split,
      oname: ["双", 0],
      type_show: nav3[2].name,
    },
  ],
];

//游戏4

export const nav4 = [
  { name: i18n.t("BetnavTm"), type_name: "特码两面", type: "TMLM", split: "" },
  { name: i18n.t("BetnavTmsb"), type_name: "特码色波", type: "TMSB", split: "" },
];

export const game4Data = [
  [
    {
      name: [i18n.t("BetnavDan")],
      value: 1.97,
      type_text: nav4[0].type_name,
      type: nav4[0].type,
      split: nav4[0].split,
      oname: ["单"],
      type_show: nav4[0].name,
    },
    {
      name: [i18n.t("BetnavShuang")],
      value: 1.97,
      type_text: nav4[0].type_name,
      type: nav4[0].type,
      split: nav4[0].split,
      oname: ["双"],
      type_show: nav4[0].name,
    },
    {
      name: [i18n.t("BetnavDa")],
      value: 1.97,
      type_text: nav4[0].type_name,
      type: nav4[0].type,
      split: nav4[0].split,
      oname: ["大"],
      type_show: nav4[0].name,
    },
    {
      name: [i18n.t("BetnavXiao")],
      value: 1.97,
      type_text: nav4[0].type_name,
      type: nav4[0].type,
      split: nav4[0].split,
      oname: ["小"],
      type_show: nav4[0].name,
    },
  ],
  [
    {
      name: [i18n.t("BetnavHong")],
      value: 2.82,
      type_text: nav4[1].type_name,
      type: nav4[1].type,
      split: nav4[1].split,
      oname: ["红"],
      type_show: nav4[1].name,
    },
    {
      name: [i18n.t("BetnavLv")],
      value: 2.97,
      type_text: nav4[1].type_name,
      type: nav4[1].type,
      split: nav4[1].split,
      oname: ["绿"],
      type_show: nav4[1].name,
    },
    {
      name: [i18n.t("BetnavLan")],
      value: 2.97,
      type_text: nav4[1].type_name,
      type: nav4[1].type,
      split: nav4[1].split,
      oname: ["蓝"],
      type_show: nav4[1].name,
    },
  ],
];

//游戏5

export const nav5 = [
  { name: i18n.t("BetnavGj"), type_name: "猜冠军", type: "GJ", split: "" },
  { name: i18n.t("BetnavGy"), type_name: "冠亚和大小单双", type: "DXDS", split: "" },
];

export const game5Data = [
  [
    { name: [1], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [2], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [3], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [4], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [5], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [6], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [7], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [8], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [9], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
    { name: [10], value: 9.7, type_text: nav5[0].type_name, type: nav5[0].type, split: nav5[0].split, type_show: nav5[0].name },
  ],
  [
    {
      name: [i18n.t("BetnavDa")],
      value: 2.12,
      type_text: nav5[1].type_name,
      type: nav5[1].type,
      split: nav5[1].split,
      oname: ["大"],
      type_show: nav5[1].name,
    },
    {
      name: [i18n.t("BetnavXiao")],
      value: 1.78,
      type_text: nav5[1].type_name,
      type: nav5[1].type,
      split: nav5[1].split,
      oname: ["小"],
      type_show: nav5[1].name,
    },
    {
      name: [i18n.t("BetnavDan")],
      value: 1.78,
      type_text: nav5[1].type_name,
      type: nav5[1].type,
      split: nav5[1].split,
      oname: ["单"],
      type_show: nav5[1].name,
    },
    {
      name: [i18n.t("BetnavShuang")],
      value: 2.12,
      type_text: nav5[1].type_name,
      type: nav5[1].type,
      split: nav5[1].split,
      oname: ["双"],
      type_show: nav5[1].name,
    },
  ],
];

//越南30秒彩

export const nav6 = [
  { name: t("kauixuan"), type_name: "特码-快选", type: "PTH_KX", split: "" },
  { name: t("xuanshuzi"), type_name: "特码-选号", type: "PTH_XH", split: "" },
  { name: t("shurushuzi"), type_name: "特码-输入", type: "PTH_SR", split: "" },
];

export const game6Data = [
  Array(100)
    .fill("")
    .map((v, i) => {
      return { name: [i], value: i, type_text: nav6[0].type_name, type: nav6[0].type, split: nav6[0].split, type_show: nav6[0].name };
    }),
  Array(10)
    .fill("")
    .map((v, i) => {
      return { name: [i], value: i, type_text: nav6[1].type_name, type: nav6[1].type, split: nav6[1].split, type_show: nav6[1].name };
    }),
];

export const game6Type = [
  {
    name: t("quanxuan"),
    value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    name: t("BetnavDa"),
    value: [5, 6, 7, 8, 9],
  },
  {
    name: t("BetnavXiao"),
    value: [0, 1, 2, 3, 4],
  },
  {
    name: t("BetnavDan"),
    value: [1, 3, 5, 7, 9],
  },
  {
    name: t("BetnavShuang"),
    value: [0, 2, 4, 6, 8],
  },
];

export const round6Type = [
  { name: t("suijishu1"), value: 1 },
  { name: t("suijishu5"), value: 5 },
  { name: t("suijishu10"), value: 10 },
  // { name: t('delete'), value: 0 },
];

//幸运飞艇数据
export const game7Data = [
  {
    title: i18n.t("feitingType0"),
    list: [
      { name: [1, "大"], value: "2720016", type_index: 0, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [1, "小"], value: "2720016", type_index: 0, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [1, "单"], value: "2720016", type_index: 0, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [1, "双"], value: "2720016", type_index: 0, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
      { name: [1, "龙"], value: "2720019", type_index: 0, type: "LH", type_show: 4, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavLong")] },
      { name: [1, "虎"], value: "2720019", type_index: 0, type: "LH", type_show: 5, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavHu")] },
    ],
  },
  {
    title: i18n.t("feitingType1"),
    list: [
      { name: [2, "大"], value: "2720016", type_index: 1, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [2, "小"], value: "2720016", type_index: 1, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [2, "单"], value: "2720016", type_index: 1, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [2, "双"], value: "2720016", type_index: 1, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
      { name: [2, "龙"], value: "2720019", type_index: 1, type: "LH", type_show: 4, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavLong")] },
      { name: [2, "虎"], value: "2720019", type_index: 1, type: "LH", type_show: 5, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavHu")] },
    ],
  },
  {
    title: i18n.t("feitingType2"),
    list: [
      { name: [3, "大"], value: "2720016", type_index: 2, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [3, "小"], value: "2720016", type_index: 2, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [3, "单"], value: "2720016", type_index: 2, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [3, "双"], value: "2720016", type_index: 2, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
      { name: [3, "龙"], value: "2720019", type_index: 2, type: "LH", type_show: 4, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavLong")] },
      { name: [3, "虎"], value: "2720019", type_index: 2, type: "LH", type_show: 5, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavHu")] },
    ],
  },
  {
    title: i18n.t("feitingType3"),
    list: [
      { name: [4, "大"], value: "2720016", type_index: 3, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [4, "小"], value: "2720016", type_index: 3, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [4, "单"], value: "2720016", type_index: 3, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [4, "双"], value: "2720016", type_index: 3, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
      { name: [4, "龙"], value: "2720019", type_index: 3, type: "LH", type_show: 4, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavLong")] },
      { name: [4, "虎"], value: "2720019", type_index: 3, type: "LH", type_show: 5, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavHu")] },
    ],
  },
  {
    title: i18n.t("feitingType4"),
    list: [
      { name: [5, "大"], value: "2720016", type_index: 4, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [5, "小"], value: "2720016", type_index: 4, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [5, "单"], value: "2720016", type_index: 4, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [5, "双"], value: "2720016", type_index: 4, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
      { name: [5, "龙"], value: "2720019", type_index: 4, type: "LH", type_show: 4, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavLong")] },
      { name: [5, "虎"], value: "2720019", type_index: 4, type: "LH", type_show: 5, split: ",", type_text: "龙虎斗", show_name: [i18n.t("BetnavHu")] },
    ],
  },
  {
    title: i18n.t("feitingType5"),
    list: [
      { name: [6, "大"], value: "2720016", type_index: 5, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [6, "小"], value: "2720016", type_index: 5, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [6, "单"], value: "2720016", type_index: 5, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [6, "双"], value: "2720016", type_index: 5, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
    ],
  },
  {
    title: i18n.t("feitingType6"),
    list: [
      { name: [7, "大"], value: "2720016", type_index: 6, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [7, "小"], value: "2720016", type_index: 6, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [7, "单"], value: "2720016", type_index: 6, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [7, "双"], value: "2720016", type_index: 6, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
    ],
  },
  {
    title: i18n.t("feitingType7"),
    list: [
      { name: [8, "大"], value: "2720016", type_index: 7, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [8, "小"], value: "2720016", type_index: 7, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [8, "单"], value: "2720016", type_index: 7, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [8, "双"], value: "2720016", type_index: 7, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
    ],
  },
  {
    title: i18n.t("feitingType8"),
    list: [
      { name: [9, "大"], value: "2720016", type_index: 8, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [9, "小"], value: "2720016", type_index: 8, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [9, "单"], value: "2720016", type_index: 8, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [9, "双"], value: "2720016", type_index: 8, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
    ],
  },
  {
    title: i18n.t("feitingType9"),
    list: [
      { name: [10, "大"], value: "2720016", type_index: 9, type: "HE", type_show: 0, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDa")] },
      { name: [10, "小"], value: "2720016", type_index: 9, type: "HE", type_show: 1, split: ",", type_text: "和值", show_name: [i18n.t("BetnavXiao")] },
      { name: [10, "单"], value: "2720016", type_index: 9, type: "HE", type_show: 2, split: ",", type_text: "和值", show_name: [i18n.t("BetnavDan")] },
      { name: [10, "双"], value: "2720016", type_index: 9, type: "HE", type_show: 3, split: ",", type_text: "和值", show_name: [i18n.t("BetnavShuang")] },
    ],
  },
];

// 游戏 番摊

export const gameData = [
  {
    type_show: ["WHITE", "WHITE", "WHITE", "WHITE"],
    type: "FOUR_WHITE",
  },
  {
    type_show: ["WHITE", "RED", "WHITE", "WHITE"],
    type: "THREE_WHITE_ONE_RED",
  },
  {
    type_show: ["WHITE", "RED", "RED", "WHITE"],
    type: "TWO_RED_TWO_WHITE",
  },
  {
    value: 1.96,
    type: "SINGLE",
  },
  {
    value: 1.96,
    type: "DOUBLED",
  },
  {
    type_show: ["RED", "RED", "RED", "RED"],
    type: "FOUR_RED",
  },
  {
    type_show: ["RED", "RED", "RED", "WHITE"],
    type: "THREE_RED_ONE_WHITE",
  },
  {
    type_show: ["RED", "RED", "RED", "RED", "WHITE", "WHITE", "WHITE", "WHITE"],
    type: "FOUR_RED_OR_FOUR_WHITE",
  },
];

//游戏 5分快三

export const nav9 = [
  { name: i18n.t("wufenkuaisan"), type_name: "和值", type: "1", split: "" },
  { name: i18n.t("Betnav2Title2"), type_name: "二同号复选", type: "6", split: "," },
  { name: i18n.t("Betnav2Title3"), type_name: "三军", type: "7", split: "" },
  // { name: i18n.t('Betnav2Title4'), type_name: '豹子', type: '8', split: '' },
];

export const game9Data = [
  [
    {
      name: [i18n.t("BetnavDa")],
      value: 1.97,
      type_text: nav9[0].type_name,
      type: nav9[0].type,
      split: nav9[0].split,
      oname: ["大"],
      type_show: nav9[0].name,
    },
    // {
    //     name: [i18n.t('Quanwei')],
    //     value: 30,
    //     type_text: '全围',
    //     type: 9,
    //     split: '',
    //     oname: ['QW'],
    //     type_show: i18n.t('Quanwei')
    // },
    {
      name: [i18n.t("BetnavXiao")],
      value: 1.97,
      type_text: nav9[0].type_name,
      type: nav9[0].type,
      split: nav9[0].split,
      oname: ["小"],
      type_show: nav9[0].name,
    },
    {
      name: [i18n.t("BetnavDan")],
      value: 1.97,
      type_text: nav9[0].type_name,
      type: nav9[0].type,
      split: nav9[0].split,
      oname: ["单"],
      type_show: nav9[0].name,
    },
    {
      name: [i18n.t("BetnavShuang")],
      value: 1.97,
      type_text: nav9[0].type_name,
      type: nav9[0].type,
      split: nav9[0].split,
      oname: ["双"],
      type_show: nav9[0].name,
    },
  ],
  [
    { name: [1, 1], value: 12.8, type_text: nav9[1].type_name, type: nav9[1].type, split: nav9[1].split, type_show: nav9[1].name },
    { name: [2, 2], value: 12.8, type_text: nav9[1].type_name, type: nav9[1].type, split: nav9[1].split, type_show: nav9[1].name },
    { name: [3, 3], value: 12.8, type_text: nav9[1].type_name, type: nav9[1].type, split: nav9[1].split, type_show: nav9[1].name },
    { name: [4, 4], value: 12.8, type_text: nav9[1].type_name, type: nav9[1].type, split: nav9[1].split, type_show: nav9[1].name },
    { name: [5, 5], value: 12.8, type_text: nav9[1].type_name, type: nav9[1].type, split: nav9[1].split, type_show: nav9[1].name },
    { name: [6, 6], value: 12.8, type_text: nav9[1].type_name, type: nav9[1].type, split: nav9[1].split, type_show: nav9[1].name },
  ],
  [
    { name: [1], value: 1.97, type_text: nav9[2].type_name, type: nav9[2].type, split: nav9[2].split, type_show: nav9[2].name },
    { name: [2], value: 1.97, type_text: nav9[2].type_name, type: nav9[2].type, split: nav9[2].split, type_show: nav9[2].name },
    { name: [3], value: 1.97, type_text: nav9[2].type_name, type: nav9[2].type, split: nav9[2].split, type_show: nav9[2].name },
    { name: [4], value: 1.97, type_text: nav9[2].type_name, type: nav9[2].type, split: nav9[2].split, type_show: nav9[2].name },
    { name: [5], value: 1.97, type_text: nav9[2].type_name, type: nav9[2].type, split: nav9[2].split, type_show: nav9[2].name },
    { name: [6], value: 1.97, type_text: nav9[2].type_name, type: nav9[2].type, split: nav9[2].split, type_show: nav9[2].name },
  ],
  // [
  //     { name: [1, 1, 1], value: 180, type_text: nav9[3].type_name, type: nav9[3].type, split: nav9[3].split, type_show: nav9[3].name },
  //     { name: [2, 2, 2], value: 180, type_text: nav9[3].type_name, type: nav9[3].type, split: nav9[3].split, type_show: nav9[3].name },
  //     { name: [3, 3, 3], value: 180, type_text: nav9[3].type_name, type: nav9[3].type, split: nav9[3].split, type_show: nav9[3].name },
  //     { name: [4, 4, 4], value: 180, type_text: nav9[3].type_name, type: nav9[3].type, split: nav9[3].split, type_show: nav9[3].name },
  //     { name: [5, 5, 5], value: 180, type_text: nav9[3].type_name, type: nav9[3].type, split: nav9[3].split, type_show: nav9[3].name },
  //     { name: [6, 6, 6], value: 180, type_text: nav9[3].type_name, type: nav9[3].type, split: nav9[3].split, type_show: nav9[3].name },
  // ],
];

//根据名称获取type
export const getTypeByName = (name) => {
  return _.head(gameData.filter((v) => v.type === name))?.type_show || [];
};
