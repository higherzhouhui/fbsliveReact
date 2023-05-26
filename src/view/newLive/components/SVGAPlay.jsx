import React, { useCallback, useEffect, useRef } from 'react';
import useContextReducer from '../../../state/useContextReducer'
import _ from "lodash";
import style from './style/SVGAPlay.module.scss'

const SVGAPlay = (props) => {
    const { gid, unmixed, resourceUrlRef } = props
    const { fetchUtils, dispatch, state: { live: {
        giftData,
        giftList
    } } } = useContextReducer.useContextReducer()


    const playHaveRef = useRef(false)

    const onLoad = useCallback((val) => {
        if (!playHaveRef.current) {
            const item = _.head(val);
            if (!item) return
            showScreenGift(item)
        }
    }, [])

    useEffect(() => {
        // showScreenGift(resourceUrlRef)
        console.log('resourceUrlRef-------', resourceUrlRef);
        onLoad(resourceUrlRef)
    }, [onLoad, resourceUrlRef])

    const showScreenGift = (val) => {

        let { url, time } = val
        if (url != undefined) {
            playHaveRef.current = true

            url = url?.replace("http:", "")?.replace("https:", "");
            console.log('url--------------------', url);
            var player = new SVGA.Player("#svga-wrap");
            var parser = new SVGA.Parser("#svga-wrap");
            parser.load(url, (videoItem) => {
                player.loops = 1; // 循环次数
                player.setVideoItem(videoItem);
                player.startAnimation();
                player.onFinished(() => {
                    //动画结束
                    //删除当前播放列表
                    window.eventBus.emit("visibleGift5SetD"); //关闭互动礼物
                    unmixed(time)
                    playHaveRef.current = false
                });
            });
        }

    };

    return (
        <div id="svga-wrap" className={style["svga-wrap"]} >

        </div>
    );
}

export default SVGAPlay;
