import { Empty, NavBar, Skeleton } from "antd-mobile";
import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { freeTime } from "../../../../utils/tools";
import { getWheelGift } from "../../../server/live";
import style from './index.module.scss'

const List = () => {
    const { t } = useTranslation()
    const [list, listSet] = useState([])
    const [loading, loadingSet] = useState(false)
    const { state } = useLocation()
    //status	integer($int32) 奖品状态:0中奖待发放 1已处理
    const history = useNavigate()
    const init = useCallback(async () => {
        loadingSet(true)
        const res = await getWheelGift()
        loadingSet(false)
        if (!(res instanceof Error)) {
            listSet(res);
        }
    }, [])

    useEffect(() => {
        init()
    }, [init])
    return <div style={{ paddingTop: state?.device == "android" ? '35px' : '0px' }}>
        <NavBar onBack={() => history(-1)}>{t('wo_de_jl')}</NavBar>
        <div className={style.prizeList}>
            {loading ? <>
                <Skeleton animated className={style.skeleton} />
                <Skeleton animated className={style.skeleton} />
                <Skeleton animated className={style.skeleton} />
            </> : list.length > 0 ?
                list.map((item, index) => {
                    return <div className={style.box} key={index}>
                        <img src={item.roulettePic} alt="" />
                        <dt>{item.rouletteName}</dt>
                        <dd>{freeTime(item.createTime, 'y-m-d h:i')}</dd>
                        <div className={style.btn}>{item.status === 1 ? t('at_bonus_status.3') : t('at_bonus_status.0')}</div>
                    </div>
                }) :
                <Empty style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} image={<img style={{ width: '182px', height: '162px' }} src={require('../../../assets/image/center/xgjlnull.png')} />} description={<div style={{
                    fontSize: '18px',
                    fontFamily: 'PingFang SC',
                    fontWeight: '400',
                    color: '#666666',
                    marginTop: '20px',
                    whiteSpace: 'nowrap'
                }}>
                    {t('noData')} ~
                </div>} />
            }
        </div>
    </div>
}

export default List