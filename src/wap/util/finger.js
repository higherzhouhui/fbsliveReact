import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Local } from "../../common";

export const GetFinger = () => {
  return new Promise((resolve, reject) => {
    FingerprintJS.load().then((fp) => {
      if (!Local("finger")) {
        fp.get().then((result) => {
          const visitorId = result.visitorId;
          Local("finger", visitorId);
          resolve(visitorId);
        });
      } else {
        resolve(Local("finger"));
      }
    });
  });
};
