import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./common.module.scss";
import _ from "lodash";
import Vap from "video-animation-player";
// 以数组的格式传进来，let [data,dataSet] = useState([{{ src:'', config:'', srcTag: "", textTag: "" }}])
//  type:1 等级特效 type：2座驾特效 3:礼物文件
// callbacks 回调删除mp4
export default function VAP(props) {
  let vap;
  let { data, type, loop, callbacks } = props;
  const listRef = useRef(null);
  const { innerWidth } = window;
  const [playHave, playHaveSet] = useState(false)
  const playHaveRef = useRef(false)

  const onLoad = useCallback((val) => {
    if (!playHaveRef.current) {
      const item = _.head(val);
      // const item = _.last(val);
      if (!item) return;
      if (item.textTag && !item.srcTag) {
        item.srcTag = require("../../assets/image/default_img.png");
      }
      if (item.srcTag) {
        img2Base64(item.srcTag, (e) => {
          item.srcTag = e;
          play(item);
        });
      } else {
        play(item);
      }
    }
  }, []);

  useEffect(() => {
    console.log('data----', data);
    onLoad(data);
  }, [onLoad, data]);




  // 图片跨域转64位
  const getBase64Image = (img) => {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png"); // 可选其他值 image/jpeg
    return dataURL;
  };
  // 图片跨域转64位
  const img2Base64 = (src, cb) => {
    var image = new Image();
    image.src = src + "?v=" + Math.random(); // 处理缓存
    image.crossOrigin = "*"; // 支持跨域图片
    image.onload = function () {
      var base64 = getBase64Image(image);
      cb && cb(base64);
    };
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
          console.log('params-----', item, params, type);
          if (loop) {
            vap && vap.destroy();
          } else {
            playHaveSet(true)
            playHaveRef.current = true
          }


          vap = new Vap(params).play().on("ended", () => {
            callbacks && callbacks({ time: item.time, type })
            playHaveRef.current = false
            playHaveSet(false)
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
