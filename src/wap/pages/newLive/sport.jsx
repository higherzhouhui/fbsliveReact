import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import style from './room.module.scss'
import DPlayer from "dplayer";
import { userAgent } from '../../../utils/tools'
import { useState } from "react";
let dp = null

export default function liveSport() {
    const { state } = useLocation()
    const [playIcon, setplayIcon] = useState(true)
    let url = state?.liveListRoomBaseVO?.adJumpUrl || state?.liveListRoomBaseVO?.webRtcUrl
    const initPlay = useCallback(() => {
        dp = new DPlayer({
            container: document.getElementById("dplayer"),
            live: true,
            autoplay: true,
            preload: 'auto',
            volume: 0,
            hotkey: false,
            video: {
                url: url,
                type: "mp4",
                customType: {
                    customHls: function (video, player) {
                        const hls = new MP4();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                    },
                },
            },
        });
        dp.on('play', () => {
            setTimeout(() => {
                dp.volume(1)
            }, 1000);
        })
    }, [])

    useEffect(() => {
        initPlay()
    }, [initPlay])

    const handleClick = () => {
        setplayIcon(false)
        dp && dp.paused && dp.play()
    }


    return <div className={style.sportLiveRoom} >
        {/* 解决IOS进入没有自动播放视频 */}
        {userAgent() == 'ios' && playIcon && <img onClick={() => { handleClick() }} id={style.playIcon} src={require('../../assets/image/live/play.png')} alt="" />}
        <div id="dplayer" className={style.liveVideo}>
        </div>
    </div>
}