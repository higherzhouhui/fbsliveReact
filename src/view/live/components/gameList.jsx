// 游戏列表
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from "react-i18next";
import { Empty } from 'antd';
import { GetGameList, GetLiverDetail, GetCurFlagOpenGame } from '../../../api/live'
import { Getissue } from "../../../api/game";
import { CSSTransition } from "react-transition-group";
import RightGame from './rightGame';
import GameDetail from "../../../components/live/detail/game/detail";

import './style/gameList.scss'
let timer = null;
let timer2 = null;
let gameComp = null;

export default (props) => {
    const { t } = useTranslation()
    const {
        FreshUser,
        baseInfo: { liveId, anchorId },
        getGiftList,
        userInfo,
    } = props;
    const [loading, setLoading] = useState(false)
    const [gameList, setGameList] = useState([]);
    const [baseGameList, baseGameListSet] = useState([]);
    const [gameName, gameNameSet] = useState("yuxx");
    const [gamePic, gamePicSet] = useState("");
    const [gameShow, gameShowSet] = useState(false);
    const [issuData, issuDataSet] = useState({});
    const [down_time, down_timeSet] = useState(60);
    const [configBase, configBaseSet] = useState({});
    const [fbShow, setFbShow] = useState(false)
    const detailRef = useRef(null);
    // 游戏列表
    const getGameList = async () => {
        try {
            setLoading(true)
            let rt = await Promise.all([GetGameList(), GetCurFlagOpenGame({ "type": 5 })])
            if (!(rt instanceof Error)) {
                let gameList = rt[0]
                let fbGame = rt[1]
                setLoading(false)
                let tempGameList = gameList.filter((item) => {
                    //过滤番摊游戏（未开发完）
                    return !["allgame", "ft","272", "xyft", "tz",  "jsks5", 'race1m','yncp30s','223'].includes(item.name);
                });
                if (fbGame) {
                    tempGameList.push({
                        id: 0,
                        icon: require('../../../assets/images/liveDetail/fbGame-icon.png'),
                        name: "fb",
                        chinese: "FB",
                    })
                }
                setGameList(tempGameList);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getLiverDetail = () => {
        GetLiverDetail({ liveId, anchorId }).then((rt) => {
            rt.liveStartLottery.forEach((item) => {
                item.icon = item.lorretyIcon;
                item.name = item.lotteryName;
            });
            let liveStartLottery = rt.liveStartLottery.filter((item) => {
                //过滤番摊游戏（未开发完）
                return !['race1m',].includes(item.name);
            });
            baseGameListSet(liveStartLottery.length ? liveStartLottery : []);
        });
    };

    const gameChoice = (data) => {
        gameNameSet(data.name);
        gamePicSet(data.icon);
        if (data.name === 'fb') {
            return setFbShow(true)
        }
        console.log(data, "data")
        getissue(data.name);
        gameShowSet(true);
    };
    //游戏倒计时
    const getissue = (name = "yuxx") => {
        Getissue({ name }, ["223", "272"].includes(name) ? "lottery" : "").then((rt) => {
            detailRef.current && detailRef.current.getIssueHandle(rt);
            let newCount = rt.down_time;
            if (newCount < 10) newCount = "0" + newCount;
            if (gameShow && rt.down_time > 50 && rt.down_time <= 55) {
                gameComp && gameComp.getGameHistory && gameComp.getGameHistory();
            }
            issuDataSet(Object.assign({}, { ...issuData }, rt));
            down_timeSet(newCount);
            djsFun(rt.down_time, name);
        });
        clearInterval(timer);
        timer = setInterval(() => getissue(name), 5000);
    };
    // 处理游戏倒计时
    const djsFun = (downTime, typeName) => {
        clearTimeout(timer2);
        timer2 = setTimeout(() => {
            let newCount = downTime - 1;
            if (newCount <= 0) {
                newCount = 0;
                getissue(typeName);
            }
            if (newCount < 10) newCount = "0" + newCount;
            down_timeSet(newCount);
            djsFun(Number(newCount), typeName);
        }, 1000);
    };
    const getGameComp = (value) => {
        gameComp = value;
    };
    const storeEvent = (e) => {
        if (e.type === "setBaseInfo") {
            configBaseSet(e.payload);
        }
    };
    const init = useCallback(() => {
        getGameList();
        // getGiftType();
        // getLiveGift();
        getLiverDetail();
        getissue();
        window.eventBus.addListener("store", storeEvent);
    }, []);

    useEffect(() => {
        init();
        return () => {
            clearInterval(timer);
            clearInterval(timer2);
            window.eventBus.removeListener("store", storeEvent);
        };
    }, [init]);
    useEffect(() => {
        getGameList();
    }, [])
    return <div className={`container-game-list ${loading && 'loading'}`}>
        <div className='title'>{t('live_gamelist')}</div>
        <div className='content'>
            {/* 鱼虾蟹 猜大小 */}
            {/* isCpButton 是否开启彩票 */}
            {/* <div className='game-list'>
                {Number(configBase.isCpButton) === 0 && baseGameList
                    .filter((val) => {
                        //过滤番摊游戏（未开发完）
                        return !["ft"].includes(val.lotteryName);
                    })
                    .map((item, index) => (
                        <div className="game-list-item" key={index} style={{ marginRight: 18 }} onClick={() => gameChoice(item)}>
                            <div className="timer-icon">
                                {down_time} <span className="dian-icon">’</span>
                            </div>
                            <img className={"game-icon game-icon-" + index} src={item.icon} />
                            <div className={"game-name game-text-" + index}>{item.cpName}</div>
                        </div>
                    ))}
            </div> */}
            {/* <div >
                <RightGame userInfo={userInfo} />
            </div> */}
            {/* {JSON.stringify(gameList)} */}
            {/* 其他全部游戏 */}
            {/* isCpButton 是否开启彩票 */}
            {Number(configBase.isCpButton) === 0 &&
                gameList.length ? (
                <div className='game-list'>
                    {gameList.map((item, index) => {
                        return <div key={index} onClick={() => gameChoice(item)} className="game-list-item">
                            <img className="game-icon" src={item.icon} key={index} alt="" />
                            <div className="game-name">{item.chinese}</div>
                        </div>
                    })}
                </div>
            ) : ''}

        </div>
        {/* fb组件 */}
        {fbShow && <RightGame userInfo={userInfo} name={gameName} gamePic={gamePic} FreshUser={FreshUser} onClose={() => setFbShow(false)} />}
        <div className='game-detail-box'>
            <CSSTransition in={gameShow} timeout={500} classNames="fade" unmountOnExit appear={true}>
                <GameDetail ref={detailRef} getGameComp={getGameComp} issuData={issuData} down_time={down_time} FreshUser={FreshUser} userInfo={userInfo} onClose={() => gameShowSet(false)} liveId={liveId} name={gameName} gamePic={gamePic} />
            </CSSTransition>
        </div>
    </div>
}