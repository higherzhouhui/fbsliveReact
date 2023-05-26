import { Button, Cascader, Image, Input, NavBar, NoticeBar, Toast, Tabs, InfiniteScroll, List, Empty, Space, Skeleton } from "antd-mobile";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FreeTime, Local } from "../../../../common";
import { GetAssetType, GetRecord } from "../../../server/user";
import style from './index.module.scss'
import { useCopy } from '../../../../utils/copy'
import { useTranslation } from "react-i18next";
import selectImg from '../../../assets/image/center/select.png'



export default function TradeRecord() {
    const { t } = useTranslation()
    const history = useNavigate()
    const [page, setPage] = useState(0)
    const [timeType, setTimeType] = useState([])
    const [hasMore, setHasMore] = useState(true)

    const [nav, setNav] = useState([])
    // 类型
    const typeList = useMemo(() => {
        return nav.filter(item => item.queryType === 1)
    })
    const [type, setType] = useState()
    //加载type
    const [typeLoading, setTagLoading] = useState(true)
    // 记录
    const [recordList, setRecord] = useState({
        list: [],
        in: 0,
        out: 0
    })
    // 获取类型列表的数据
    const getAssetType = useCallback(async () => {
        setTagLoading(true)
        const typeResult = await GetAssetType()
        if (!(typeResult instanceof Error)) {
            setTagLoading(false)
            setNav(typeResult)
            let [{ type }] = typeResult.filter((item) => item.queryType === 2)
            setTimeType([type])
            let [itemType] = typeResult.filter((item) => item.queryType === 1)
            setType(itemType.type);
        }
    }, [])
    //切换tap时触发
    const handleChangeTag = (data) => {
        setPage(0)
        setHasMore(true)
        setRecord({
            list: [],
            in: 0,
            out: 0
        })
        // console.log(data);
        setType(data)
    }
    // 初始化
    useEffect(() => {
        getAssetType()
    }, [getAssetType])
    // 获取列表
    useEffect(() => {
        getList()
    }, [timeType, type])

    const getList = async () => {
        if (timeType.length === 0) return
        let [time] = timeType
        console.log({ type, timeType: time, page });
        const res = await GetRecord({ type, timeType: time, page })
        if (!(res instanceof Error)) {
            if (res.centerUserAssetsPlusVOS.length > 0) {
                setPage(page + 1)
                const list = recordList.list
                setRecord({
                    in: res.totalIncome,
                    out: res.totalExpenditure,
                    list: [...list, ...res.centerUserAssetsPlusVOS]
                })
            } else setHasMore(false)
        }
    }

    //加载更多
    const loadMore = async () => {
        if (recordList.list.length === 0) return
        return await getList()
    }


    const options = useMemo(() => {
        return nav.filter(item => item.queryType === 2).map(v => {
            return {
                label: v.name,
                value: v.type
            }
        })
    })
    const [visible, setVisible] = useState(false)
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
    return <div className={style.gbg}>
        {/* <NavBar onBack={() => history(-1)} className={style.wbg} right={right}>{t('reportDetailTitle')}
        </NavBar> */}
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            onBack={() => history(-1)} className={style.wbg}
            right={right}
        >
            <div style={{ fontSize: '18px', color: '#1e1b27', fontWeight: '500' }}>
                {t('reportDetailTitle')}
            </div>
        </NavBar>

        {/* type */}
        {!typeLoading ? <Tabs defaultActiveKey={type} className={style.tabs} onChange={handleChangeTag}>
            {typeList.map((item, index) => {
                return <Tabs.Tab title={item.name} key={item.type}>
                </Tabs.Tab>
            })}
        </Tabs> :
            <Skeleton animated className={[style.tagSkeleton]} />
        }
        <div className={style.list}>
            {recordList.list.map((item, index) => {
                return <div className={style.listItem} key={index} onClick={() => history('/tradeRecordDetail', { state: item })}>
                    <div className={style.left}>{FreeTime(item.gmtCreate, 'y-m-d h:i')}</div>
                    <div className={style.center}>{item.name}</div>
                    <div className={`${item.goldCoin < 0 ? style.money : style.green}`}>
                        <div className={style.text}>{t('detailText')}</div>
                        <div className={style.num}>{item.goldCoin}</div>
                        <img src={require("../../../assets/image/live/icon-dbr.png")} alt="" className={style.dbr} />
                    </div>
                </div>
            })}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            <div className={style.bottom}>
                <div className={style.green}><span>{t('hisIn')}</span> {recordList.in}</div>
                <div className={style.red}>{recordList.out} <span>{t('hisOut')}</span></div>
            </div>
        </div>
        {/* 日期选择 */}
        <Cascader
            options={options}
            visible={visible}
            onClose={() => {
                setVisible(false)
            }}
            value={timeType}
            onConfirm={v => {
                setPage(0)
                setHasMore(true)
                setRecord({
                    list: [],
                    in: 0,
                    out: 0
                })
                setTimeType(v)
            }}
        />
    </div>
}