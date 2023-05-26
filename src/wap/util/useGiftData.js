import { Local } from "../../common";
import { getUserInfo } from "../server/user";
import { GetGiftType } from "../server/live";

// 直播间礼物
export default async function GetGiftData(fresh = false) {
    if (Local("token")) {
        if (fresh || !Local("giftData")) {
            const res = await GetGiftType();
            if (res) {
                Local("giftData", res);
            }
            return res || [];
        } else {
            return Local("giftData");
        }
    }
}
