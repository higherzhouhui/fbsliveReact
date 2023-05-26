import { Empty, InfiniteScroll, List, NavBar, Skeleton } from "antd-mobile";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ProWithdrawLog } from "../../../server/center";
import style from './index.module.scss'

export default function List2() {
    const { t } = useTranslation()
    const history = useNavigate()

    const [list, setList] = useState({ list: [] })
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(0)

    const getData = (async () => {
        setLoading(true)
        const res = await ProWithdrawLog({ page })
        setLoading(false)
        if (!(res instanceof Error)) {
            if (res.length > 0) {
                const nList = list.list
                setList({ list: [...res, ...nList] })
                setPage(page + 1)
            } else setHasMore(false)
        }
    })

    const init = useCallback(() => {
        getData()
    }, [])

    useEffect(() => {
        init()
    }, [init])

    return <div className={style.recordListBody}>
        {/* <NavBar onBack={() => history(-1)} className={style.wbg}>{t('rebate14')}</NavBar> */}
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            onBack={() => history(-1)} className={style.wbg}
        // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
        >
            <div style={{ fontSize: '18px', fontWeight: '500' }}>
                {t('rebate14')}
            </div>
        </NavBar>
        {loading ? <>
            {Array(2).fill('').map((item, index) => {
                return <div className={style.skBody} key={index}>
                    <Skeleton.Title />
                    <Skeleton.Paragraph />
                </div>
            })}
        </> : list.list.length > 0 ? <> <List className="recordList">
            {list.list.map((item, index) => <List.Item key={index}>{item.nickname}</List.Item>)}
        </List>
            <InfiniteScroll hasMore={hasMore} loadMore={getData}></InfiniteScroll>
        </> : <Empty description={t('noData')}></Empty>}

    </div>
}