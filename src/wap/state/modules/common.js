import { Local } from "../../../common";

const state = {
  activity: Local("preActivity") || [],
  ad: Local("preAd") || [],
  game: Local("preGame") || [],
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
  SetIm(payload) {
    state.Im = payload;
  },
};
export default {
  state,
  model,
};
