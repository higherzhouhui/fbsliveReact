import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./common.module.scss";
import _ from "lodash";
import Vap from "video-animation-player";
// 以数组的格式传进来，let [data,dataSet] = useState([{{ src:'', config:'', srcTag: "", textTag: "" }}])
//  type:1 等级特效 type：2座驾特效 3:礼物文件
export default function VAP(props) {
  let vap;
  let { data, type, loop } = props;
  const listRef = useRef(null);
  const { innerWidth } = window;

  const onLoad = useCallback((val) => {
    const item = _.last(val);
    if (!item) return;
    if (item.textTag && !item.srcTag) {
      item.srcTag = require("../../wap/assets/image/default_img.png");
    }
    if (item.srcTag) {
      getBase64ByUrl(item.srcTag, (e) => {
        item.srcTag = e;
        play(item);
      });
    } else {
      play(item);
    }
  }, []);

  useEffect(() => {
    onLoad(data);
  }, [onLoad, data]);

  // 图片存在跨域，下载到本地64位
  const getBase64ByUrl = (src, callback, outputFormat) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", src, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function (e) {
      if (xhr.status == 200) {
        let uInt8Array = new Uint8Array(xhr.response);
        let i = uInt8Array.length;
        let binaryString = new Array(i);
        while (i--) {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        let data = binaryString.join("");
        let base64 = window.btoa(data);
        let dataUrl = "data:" + (outputFormat || "image/png") + ";base64," + base64;
        callback.call(this, dataUrl);
      }
    };
    xhr.send();
  };

  // 根据屏幕分辨率计算视频
  const countSize = (w, h) => {
    let rh = parseInt((h / w) * innerWidth);
    return {
      width: innerWidth,
      height: rh,
    };
  };

  const play = (item) => {
    // console.log('tag1: item.srcTag, tag2: item.textTag', item.srcTag, item.textTag);
    //从json文件中获取合适的高宽
    fetch(item.config)
      .then((e) => e.text())
      .then((e) => {
        let {
          info: { w, h },
        } = JSON.parse(e);
        let { width, height } = countSize(w, h);
        let params = Object.assign(
          {
            container: listRef.current,
            // 素材视频链接
            src: item.src,
            // 素材配置json对象
            config: item.config,
            width,
            height,
            // 同素材生成工具中配置的保持一致
            fps: 20,
            // 是否循环
            loop,
            // 起始播放时间点
            beginPoint: 0,
            // 精准模式
            accurate: true,
            // 播放起始时间点(秒)
            mute: true,
          },
          type == 2 ? { type: 2, tag1: item.srcTag, tag2: item.textTag } : { type: 1 }
        );
        try {
          console.log('params----------', params, type);

          vap && vap.destroy();
          vap = new Vap(params).play().on("ended", () => {
            vap.destroy();
            vap = null;
          });
        } catch (error) {
          console.log(error);
        }
      });
  };
  return <div ref={listRef} className={style.FloatingScreen2}></div>;
}
