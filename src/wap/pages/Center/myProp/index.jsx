import { Toast, Skeleton } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { GetGiftList, propCar, setShowCar } from "../../../server/live";
import { CNavBar, CEmpty } from '../../../components'
import moment from 'moment'
import useContextReducer from "../../../state/useContextReducer";
import VAP from "../../../components/vap";

const Index = () => {
    const {
        state: {
            user
        },
        fetchUtils,
    } = useContextReducer.useContextReducer();
    const { freshUser } = fetchUtils;
    const history = useNavigate()
    const [GetGiftListD, GetGiftListDSet] = useState([])
    const [propCarGid, propCarGidSet] = useState()
    const [propCarD, propCarDSet] = useState([])

    const [svg, svgSet] = useState(false)

    const [Loading, LoadingSet] = useState(false)
    const [videoInfo2, videoInfo2Set] = useState([])
    const [playMP4, playMP4Set] = useState(false)
    useEffect(() => {
        // propCarF()
        LoadingSet(true)

        GetGiftListF()
    }, [])

    const GetGiftListF = async () => {
        let res = await GetGiftList()
        if (!(res instanceof Error)) {
            let list = res || []
            let data = []
            list.forEach((value, index) => {
                if (value.type == 1 && value.isShow == 1) {
                    data = [...data, value]
                }
            })
            // console.log('多少座驾', data);
            data.sort((a, b) => {
                return a.goldCoin - b.goldCoin
            })

            let res_2 = await propCar()

            if (!(res_2 instanceof Error)) {
                LoadingSet(false)
                propCarDSet(res_2.carList)
                propCarGidSet(res_2.showGid)

                let datas = []
                if (res_2 != null && res_2 != undefined && res_2.carList[0] != undefined) {
                    data.forEach((value, index, array) => {
                        res_2.carList.forEach((value_2, index_2) => {
                            if (value.gid == value_2.gid) {
                                datas.push(value)
                            }
                        })
                    })
                }
                GetGiftListDSet(datas)
            } else {
                LoadingSet(false)
            }
        }
    }
    // svg
    const resourceUrlF = (url) => {
        url = url?.replace('http:', '')?.replace('https:', '')
        console.log(url);
        var player = new SVGA.Player('#demoCanvas');
        var parser = new SVGA.Parser('#demoCanvas'); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        // require('../../../assets/image/live/zp/bj.svga')
        parser.load(url + '?a=1', function (videoItem) {
            player.setVideoItem(videoItem);
            player.startAnimation();
            player.onFrame(function (i) {

            })
        })
        svgSet(true)

    }
    useEffect(() => {
        console.log('user--------------', user);
    }, [user])
    // 切换座驾
    const setShowCarF = async (gid) => {
        let res = await setShowCar({ gid: gid })
        if (!(res instanceof Error)) {
            Toast.show({
                content: t('zhibojianjinfangzuojiashezhichenggong'),
            })
            freshUser()
            propCarGidSet(gid)
            GetGiftListF()
        }
    }
    const videoInfo3F = (info) => {
        // let { videoUrl, videoJson } = info;
        // if (videoUrl && videoJson) {
        //     playMP4Set(true)
        //     videoInfo2Set((e) => {
        //         return [...e, { src: videoUrl, config: videoJson }];
        //     });
        // } else {

        resourceUrlF(info?.resourceUrl);


        // }

    }
    return <div>
        <CNavBar title={t('wodedaoju')} left={true} />
        {/* 内容 */}
        <div className={style.bodys}>
            <div className={style.container}>
                {Loading ? <div className={style.prooSk}>
                    {Array(6).fill('').map((item, index) =>
                        <Skeleton key={index} animated className={style.customSkeleton} />
                    )}
                </div>
                    : (GetGiftListD[0] != undefined) ? <div className={style.center}>
                        {GetGiftListD.map((value, index, array) => {
                            return <div key={index} className={style.center_div} onClick={() => { setShowCarF(value.gid) }}>
                                <div className={style.center_left}>
                                    <div style={{ position: 'relative' }} onClick={(e) => {
                                        e.stopPropagation(), videoInfo3F(value)
                                        //  resourceUrlF(value.resourceUrl)
                                    }}>
                                        <img src={value.cover} alt="" className={style.center_div_img} />
                                        <img src={require('../../../assets/image/center/bf.png')} alt="" className={style.position_Img} />
                                    </div>
                                    <div className={style.center_left_font}>
                                        <div >{value.gname}</div>
                                        <div className={style.center_left_time}>{t('daoqishijian')}：{moment(propCarD[index]?.endTime).format('DD-MM-YYYY')}</div>
                                    </div>
                                </div>
                                <img className={style.center_right_img} src={require(`../../../assets/image/center/${propCarGid == value.gid ? 'xzlog' : 'wxzlog'}.png`)} alt="" />
                                {(GetGiftListD.length - 1) != index && <div className={style.center_border}></div>}
                            </div>
                        })}

                    </div> : <CEmpty description={t('zanwudaoju')} />
                }
            </div>
        </div>
        {/* 播放svg */}
        <div id="demoCanvas" style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: '0px', left: '0', zIndex: '99', display: `${svg ? 'block' : 'none'}` }}>
            <div onClick={() => { svgSet(false) }} className={style.sclog}>
                <img src={require('../../../assets/image/center/cha.png')} alt="" />
            </div>
        </div>

        {/* 礼物mp4 */}
        <div style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', position: 'fixed', top: '0px', left: '0', zIndex: '99', display: `${playMP4 ? 'block' : 'none'}` }}>
            <VAP data={videoInfo2} type="1" loop={true} />
            <div onClick={() => { playMP4Set(false) }} className={style.sclog}>
                <img src={require('../../../assets/image/center/cha.png')} alt="" />
            </div>
        </div>

    </div>
}

export default Index;
