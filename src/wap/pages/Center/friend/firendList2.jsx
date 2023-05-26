import { Empty, List, NavBar, Skeleton } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ProShareLog } from "../../../server/center";
import style from './index.module.scss'

export default function List2() {
    const { t } = useTranslation()
    const history = useNavigate()

    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)

    const getData = useCallback(async () => {
        setLoading(true)
        const res = await ProShareLog()
        setLoading(false)
        if (!(res instanceof Error)) {
            console.log('friendList2', res);
            setList(res)
        }
    }, [])

    useEffect(() => {
        getData()
    }, [getData])

    return <div className={style.recordListBody}>
        {/* <NavBar onBack={() => history(-1)} className={style.wbg}>{t('rebate9')}</NavBar> */}
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            onBack={() => history(-1)} className={style.wbg}
        // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
        >
            <div style={{ fontSize: '18px', fontWeight: '500' }}>
                {t('rebate9')}
            </div>
        </NavBar>

        {loading ? <>
            {Array(2).fill('').map((item, index) => {
                return <div className={style.skBody} key={index}>
                    <Skeleton.Title />
                    <Skeleton.Paragraph />
                </div>
            })}
        </> : list.length > 0 ? <List className="recordList">
            {list.map((item, index) => <List.Item key={index}>{item.nickname}</List.Item>)}
        </List> : <Empty description={t('noData')}></Empty>}

    </div>
}