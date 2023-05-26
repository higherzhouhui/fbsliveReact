import { Mask, NavBar } from "antd-mobile"
import { LuckyWheel } from '@lucky-canvas/react'
import React from "react"
import { useRef } from "react"
import { useState } from "react"
import style from './index.module.scss'
import { useLocation, useNavigate } from "react-router-dom"
import { useCallback } from "react"
import { getWheelInfo, startWheel } from "../../../server/live"
import { useEffect } from "react"
import { Local } from "../../../../common"
import { useTranslation } from 'react-i18next'
import i18n from '../../../lang/i18n'


const getUrlParams = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

const Prize = () => {
    let [lang, langSet] = useState(i18n.language)
    const history = useNavigate()
    const { t } = useTranslation()
    const { state, search } = useLocation()
    const [showRes, showResSet] = useState(false)
    const [detail, detailSet] = useState({
        title: "",//标题
        lotteries: 0,//抽奖次数
    })
    const [isGetData, isGetDataSet] = useState(false)
    const [resItem, resItemSet] = useState({})
    const [anchorId, anchorIdSet] = useState('')
    const device = getUrlParams('device')

    const [blocks] = useState([
        {
            padding: '30px', imgs: [{
                src: require('../../../assets/image/prize/wai.png'),
                top: 0,
                width: '325px',
                height: '325px'
            },
            {
                src: require('../../../assets/image/prize/nei.png'),
                top: '16px',
                width: '295px',
                height: '295px'
            }]
        }
    ])
    const [prizes, prizeSet] = useState([])
    const [buttons] = useState([
        {
            radius: '40%', imgs: [
                { src: require('../../../assets/image/prize/start.png'), width: "150px", height: "150px", top: "-75px" }
            ]
        },
    ])

    const init = useCallback(async () => {
        let aid
        if (location.search) {
            aid = getUrlParams('anchorId')
            Local('token', getUrlParams('token'))
        } else {
            aid = state.anchorId
        }
        anchorIdSet(aid)
        const info = await getWheelInfo({ anchorId: aid })
        if (!(info instanceof Error)) {
            detailSet(info)
            let color = ['#fffbe1', '#facf88']
            let arr = info.rouletteInfoResponseList.sort((a, b) => b.sort - a.sort).reduce((sum, item, index) => {
                sum.push({
                    background: color[index % 2], fonts: [{
                        top: "5px", fontSize: '14px', fontColor: "#6B00FF", lengthLimit: "33%", text: item.rouletteName
                    }], imgs: [{
                        src: item.roulettePic, width: "40px", height: "40px", top: "35px"
                    }],
                    item
                })
                return sum
            }, [])
            // 获取数据后动态设置奖品
            prizeSet(arr)
            isGetDataSet(true)
        }
    }, [])

    useEffect(() => {
        init()
        document.title = t('zhuan_pan_bt')
        let lg = getUrlParams('lang')
        if (lg) {
            let str = ''
            switch (lg) {
                case 'CN':
                    str = 'zh'
                    break;
                default:
                    str = 'vie'
                    break;
            }
            langSet(str)
            Local('lang', str)
            i18n.changeLanguage(str)
        }
        return () => {
            document.title = "FBS"
        }
    }, [init])
    const myLucky = useRef()
    return <div className={style.body} style={
        { paddingTop: device === 'android' ? '35px' : '0' }
    }>
        {device !== 'ios' && <NavBar onBack={() => {
            if (device === 'android') {
                window.fbsandroid.closeBrowser()
            } else if (device === 'ios') {
                window.webkit.messageHandlers.closeBrowser.postMessage('')
            } else {
                history(-1)
            }
        }} className={style.navTitle}>{t('zhuan_pan_bt')}</NavBar>}
        <img src={require('../../../assets/image/prize/topBg.png')} alt="" className={style.topBg} />
        <img src={require(`../../../assets/image/prize/title-${lang}.png`)} alt="" className={style.titleIcon} />
        <div className={style.titleText}>{detail.title}</div>
        <div className={style.listEnter} onClick={() => {
            let query = {}
            if (getUrlParams('device')) {
                query.device = getUrlParams('device')
            }
            history('/prizeList', { state: query })
        }} style={{ top: device === 'android' ? '230px' : '180px' }}>
            {t('wo_de_jl')}
        </div>
        {isGetData && <div className={style.LuckyWheel}>
            <div className={style.wheelBox}>
                <LuckyWheel
                    ref={myLucky}
                    width="325px"
                    height="325px"
                    blocks={blocks}
                    prizes={prizes}
                    buttons={buttons}
                    onStart={async () => { // 点击抽奖按钮
                        const res = await startWheel({ anchorId: anchorId })
                        if (!(res instanceof Error)) {
                            myLucky.current.play()
                            let lotteries = detail.lotteries - 1
                            detailSet(Object.assign(detail, { lotteries }))
                            let index = detail.rouletteInfoResponseList.findIndex(a => a.prizeId == res.prizeId)
                            myLucky.current.stop(index)
                        }
                        // 以下代码可以本地测试，报错后依旧模拟抽中第一个奖品
                        // else {
                        //     myLucky.current.play()
                        //     myLucky.current.stop(0)
                        // }
                    }}
                    onEnd={prize => { // 抽奖结束
                        console.log(prize);
                        resItemSet(prize.item);
                        showResSet(true)
                    }}
                />
            </div>
            <div className={style.wheelBottom}>
                <img src={require('../../../assets/image/prize/wheelBottom.png')} alt="" />
                <div className={style.text}>
                    {t('ci_shu')}：{detail.lotteries}
                </div>
            </div>
        </div>}
        <div className={style.ruleBottom}>
            <img src={require('../../../assets/image/prize/bottomBg.png')} alt="" className={style.bottomBg} />
            <div className={style.rtitle}>{t('huo_dong_gz')}</div>
            <div className={style.content}>
                <p>{t('zhuan_pan_gz.0')}</p>
                <p>{t('zhuan_pan_gz.1')}</p>
                <p>{t('zhuan_pan_gz.2')}</p>
                <p>{t('zhuan_pan_gz.3')}</p>
                <p>{t('zhuan_pan_gz.4')}</p>
                <p>{t('zhuan_pan_gz.5')}</p>
                <p>{t('zhuan_pan_gz.6')}</p>
                <p>{t('zhuan_pan_gz.7')}</p>
            </div>
        </div>
        {/* 抽奖结果弹窗 */}
        <Mask visible={showRes} onMaskClick={() => showResSet(false)}>
            <div className={style.resWindow}>
                <img src={require(`../../../assets/image/prize/prizeResult-${lang}.png`)} alt="" />
                <div className={style.resContent}>
                    <img src={resItem.roulettePic} alt="" />
                    <span>{resItem.rouletteName}</span>
                </div>
                <div className={style.resBtn} onClick={() => showResSet(false)}>{t('wo_zhi_dao')}</div>
            </div>
        </Mask>
    </div>
}

export default Prize