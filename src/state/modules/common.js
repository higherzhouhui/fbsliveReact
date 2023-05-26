import { Local } from "../../common";

const state = {
  activity: Local("preActivity-pc") || [],
  ad: Local("preAd-pc") || [],
  game: Local("preGame-pc") || [],
  quickComent: Local("prequickComment-pc") || [],
  Im: {},
};
const model = {
  SetGame(payload) {
    state.game = payload;
  },
  SetAd(payload) {
    state.ad = payload;
  },
  SetActivity(payload) {
    state.activity = payload;
  },
  SetquickComment(payload) {
    state.quickComent = payload;
  },
  SetIm(payload) {
    state.Im = payload;
  },
};
export default {
  state,
  model,
};
