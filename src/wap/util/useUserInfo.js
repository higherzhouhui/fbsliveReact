import { Local } from "../../common";
import { getUserInfo } from "../server/user";

export default async function GetUserInfo(fresh = false) {
  if (Local("token")) {
    if (fresh || !Local("userInfo")) {
      const res = await getUserInfo();
      if (res.imToken != undefined) {
        Local("userInfo", res);
      }
      return res;
    } else {
      return Local("userInfo");
    }
  }
}
