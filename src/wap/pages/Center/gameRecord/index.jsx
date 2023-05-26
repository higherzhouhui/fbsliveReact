import { Button, Cascader, Image, NavBar, Space, Grid, Skeleton, Empty } from "antd-mobile";
import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { useTranslation } from "react-i18next";
import selectImg from '../../../assets/image/center/select.png'
import { GetGameHisRecord } from "../../../server/user";



export default function GameRecord() {
    const { t } = useTranslation()
    const history = useNavigate()
    // 日期 timeType: 1 2 3 4 5 今日 明日 3天之前 7天之前 30天之前
    const [timeType, setTimeType] = useState([0])
    const options = [
        { value: 0, label: t('ui_nowadays'), },
        { value: 1, label: t('ui_yesterday'), },
        { value: 3, label: t('ui_last_three_days'), },
        { value: 2, label: t('ui_last_seven_days'), },
        { value: 4, label: t('ui_last_month') }
    ]
    const [visible, setVisible] = useState(false)
    const [list, setList] = useState({
        resultList: [],
        totalBet: 0,
        totalProfit: 0
    })
    const [loading, setLoading] = useState(false)
    // 日期选择
    const right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ '--gap': '16px' }}>
                <div
                    className={style.selectDate}
                    onClick={() => {
                        setVisible(true)
                    }}
                >
                    {options.map(e => {
                        if (e.value == timeType) {
                            return e.label
                        }
                    })}
                    <Image
                        className={style.selectDateImg}
                        src={selectImg}
                        width={14}
                        height={14}
                        fit='cover'
                        style={{ borderRadius: 100 }}
                    />
                </div>
            </Space>
        </div>
    )

    const getList = async () => {
        const [type] = timeType
        setLoading(true)
        const res = await GetGameHisRecord({ type })
        setLoading(false)
        if (!(res instanceof Error)) {
            setList(res)
        }
    }
    //列表
    useEffect(() => {
        getList()
    }, [timeType])
    return <div className={style.gbg}>
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            onBack={() => history(-1)} className={style.wbg}
            right={right}
        >
            <div style={{ fontSize: '18px', color: '#1e1b27', fontWeight: '500' }}>
                {t('ui_report_betting')}
            </div>
        </NavBar>

        {/* 日期选择 */}
        <Cascader
            options={options}
            visible={visible}
            onClose={() => {
                setVisible(false)
            }}
            value={timeType}
            onConfirm={v => {
                setTimeType(v)
            }}
        />
        {/* 列表 */}
        <div className={style.list}>
            {loading ? <>
                {Array(4)
                    .fill('').map((item, index) => {
                        return <Suspense key={index}>
                            <Skeleton.Title></Skeleton.Title>
                            <Skeleton.Paragraph></Skeleton.Paragraph>
                        </Suspense>
                    })}
            </> : list.resultList.length === 0 ? <>
                <Empty image={<img className='emptyImg' src={require('../../../assets/image/center/xgjlnull.png')} />} description={t('dangqianmeiyouxiangguanjiluo')}></Empty>
            </> : <>
                {list.resultList.map((item, index) => {
                    let [time] = timeType
                    return <div className={style.listItem} onClick={() => history('/gameRecordDetailList', { state: Object.assign(item, { timeType: time }) })} key={index}>
                        <div className={style.listHeader}>
                            <Image className={style.gameImg} src={item.lotteryIcon} width={28} height={28} style={{ borderRadius: 28 }} fit='cover' />
                            <span className={style.gameName}>{item.nickName}</span>
                        </div>
                        <Grid columns={3} gap={15} className={style.gameGroup}>
                            <Grid.Item className={style.item}>
                                <span>{t('lotteryCount')}</span>
                                <span>{item.lotteryCount}</span>
                            </Grid.Item>
                            <Grid.Item className={style.item}>
                                <span>{t('betAmountAll')}</span>
                                <span>{item.betAmountAll}</span>
                            </Grid.Item>
                            <Grid.Item className={style.item}>
                                <span>{t('profitAmountAll')}</span>
                                <span>{item.profitAmountAll}</span>
                            </Grid.Item>
                        </Grid>
                    </div>
                })}</>}
        </div>
    </div>
}