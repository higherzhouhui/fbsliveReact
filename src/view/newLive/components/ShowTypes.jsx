import React, { useEffect, useRef } from 'react';
import { Local } from '../../../common';
import { useTranslation } from "react-i18next";
const ShowTypes = (props) => {
    const { t } = useTranslation()
    const { userLevels, gameResults, unmixed } = props
    const gidsRef = useRef()
    useEffect(() => {
        if (gameResults.userLevel != undefined && userLevels != undefined, gidsRef.current == undefined) {
            let LevelProp = Local('LevelProp_pc') || []
            let [data] = LevelProp?.filter((val) => val.level == userLevels);
            gidsRef.current = data?.resourceUrl //有svga播放中不被替代
            GetGiftListzjF2(
                data?.resourceUrl, gameResults
            )
        }
    }, [
        userLevels,
        gameResults
    ])
    // 进房飘屏播放
    const GetGiftListzjF2 = (url, data) => {
        console.log("进房飘屏播放----", url);
        if (url != undefined) {
            var player = new SVGA.Player("#CarSvga3");
            var parser = new SVGA.Parser("#CarSvga3"); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
            // console.log(parser);
            player.loops = 1; //播放1次
            player.clearsAfterStop = true; //清空画布
            parser.load(url, function (videoItem) {
                player.setVideoItem(videoItem);
                player.startAnimation();
                player.onFrame(function () { });
                player.setImage(data?.avatar || require('../../../wap/assets/image/login/logoz.png'), 'avatar');
                player.setText({
                    text: `${data?.nickname} ${t('enterRoom')}`,
                    family: 'Arial',
                    size: "24px",
                    color: "#ffe0a4",
                }, 'content');
                player.onFinished(() => {
                    console.log('停止');
                    unmixed()

                    gidsRef.current = undefined
                });
            });
        }
    };
    return (
        <>
            {/* display: `${gidsRef.current != undefined ? "block" : "none"}`,
         zIndex: `${gidsRef.current != undefined ? 3 : -2}`, */}
            <div id='CarSvga3' style={{ width: '335px', height: '90px', position: 'absolute', right: '0px', bottom: '30%' }} >
            </div>

        </>

    );
}

export default ShowTypes;
