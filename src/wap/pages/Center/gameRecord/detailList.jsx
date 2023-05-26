import { Image, NavBar, CapsuleTabs, Grid, InfiniteScroll } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './detailList.module.scss'
import { useTranslation } from "react-i18next";
import { GetGameHisRecordDetail } from "../../../server/user";
import useContextReducer from "../../../state/useContextReducer";
import { Local } from "../../../../common";



export default function GameRecordDetailList() {
    const { t } = useTranslation()
    const { state: { user } } = useContextReducer.useContextReducer()
    const query = useLocation()
    const history = useNavigate()
    const option = [
        { text: t('bet_status_id.0'), value: 0 },
        { text: t('bet_status_id.1'), value: 1 },
        { text: t('bet_status_id.3'), value: 2 },
        { text: t('bet_status_id.2'), value: 3 },
    ]
    const [tabIndex, setTabIndex] = useState(0)
    const [page, setPage] = useState(0)
    const [list, setList] = useState({ list: [] })
    const [hasMore, setHasMore] = useState(true)

    const getList = async () => {
        const res = await GetGameHisRecordDetail({
            queryType: tabIndex,
            type: query.state.timeType,
            uid: user.uid,
            page: page,
            lotteryName: query.state.lotteryName
        })
        if (!(res instanceof Error)) {
            if (res.length > 0) {
                const item = list.list
                setList({ list: [...item, ...res] })
                setPage(page + 1)
            } else {
                setHasMore(false)
            }
        }
    }
    useEffect(() => {
        setPage(0)
        setList({ list: [] })
        setHasMore(true)
    }, [tabIndex])

    const loadMore = () => {
        return getList()
    }

    return <div className={style.gbg}>
        <NavBar onBack={() => history(-1)} className={style.wbg}>{t('ui_report_betting')}</NavBar>
        <CapsuleTabs defaultActiveKey={`${tabIndex}`} className={style.tabs} onChange={setTabIndex}>
            {option.map(item => <CapsuleTabs.Tab title={item.text} key={item.value} />)}
        </CapsuleTabs>
        <div className={style.list}>
            {list.list.map((item, index) => {
                return <div className={style.listItem} onClick={() => history('/gameRecordDetail', { state: item })} key={index}>
                    <div className={style.listHeader}>
                        {/* <Image className={style.gameImg} src={demoSrc} width={28} height={28} style={{ borderRadius: 28 }} fit='cover' /> */}
                        <span className={style.gameName}>{item.nickName}</span>
                        <span className={style.gameDate}>{t('issues')} {item.expect}</span>
                    </div>
                    <Grid columns={3} gap={15} className={style.gameGroup}>
                        <Grid.Item className={style.item}>
                            <span className={style.moneyLable}>{t('ui_bet_amount_colon')}</span>
                        </Grid.Item>
                        <Grid.Item className={style.item}>
                            <span className={style.money}>{item.betAmount}</span>
                        </Grid.Item>
                        <Grid.Item className={style.item}>
                            <span className={style.imgBox}>
                                <Image className={style.img} src={require(`../../../assets/image/fb/${Local('lang') || 'vie'}/${item.awardStatus == 2 ? 'win' : 'lose'}.png`)} width={80} height={80} fit='cover' />
                            </span>
                        </Grid.Item>
                    </Grid>
                </div>
            })}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </div>
    </div>
}