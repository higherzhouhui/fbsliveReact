import { Button, NavBar, Popup, Skeleton, Empty, DatePickerView, InfiniteScroll, Toast } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './index.module.scss'
import {
    queryAssetTypeList,
    queryUserAssetList,
    queryUserAssetCount
} from '../../../server/record'

const Index = () => {
    const { state } = useLocation()
    const history = useNavigate()
    // 时间格式
    const dateToSrting = (da) => {
        let str = "";
        if (da != undefined) {
            let date = new Date(da.toString().length == 10 ? da * 1000 : da);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let h = date.getHours();
            let min = date.getMinutes();
            let s = date.getSeconds();
            y = y < 10 ? "0" + y : y;
            m = m < 10 ? "0" + m : m;
            d = d < 10 ? "0" + d : d;
            h = h < 10 ? "0" + h : h;
            min = min < 10 ? "0" + min : min;
            s = s < 10 ? "0" + s : s;
            str = `${d}-${m}-${y}`;
        }
        return str;
    }
    const [deposit, depositSet] = useState(false)
    const [times, timesSet] = useState(false)

    const [Select, SelectSet] = useState(0)
    const [Select2, SelectSet2] = useState(0)

    // 开始时间展示
    const [startTimes, startTimesSet] = useState(false)
    // 结算时间展示
    const [endTimes, endTimesSet] = useState(false)
    // 开始时间时间戳
    const [startTimeD, startTimeDSet] = useState(new Date().getTime())
    // 结束时间时间戳
    const [endTimesD, endTimesDSet] = useState(new Date().getTime())
    // 全部弹窗数据
    const [jyRecord, jyRecordSet] = useState([])
    // 时间弹窗数据
    const [jyRecord2, jyRecord2Set] = useState([])

    // 当前记录类型  10000(交易记录) 20000（投注记录） 30000 （消费记录）
    // const [methodTypes, methodTypesSet] = useState(10000)

    // 翻页数据
    const [pageNums, pageNumsSet] = useState(0)

    const [Loading, LoadingSet] = useState(false)
    const [Loading2, Loading2Set] = useState(false)

    const [queryUserAssetListD, queryUserAssetListDSet] = useState([])
    const [groupMonthDayD, groupMonthDayDSet] = useState([])
    const [queryUserAssetCountD, queryUserAssetCountDSet] = useState({})

    const [hasMore, setHasMore] = useState(true)

    const [visible4, visible4Set] = useState(false)
    const [PopupD, PopupDSet] = useState({})

    const datasRef = useRef([])
    const datas2Ref = useRef([])
    const SelectsRef = useRef(0)
    const Selects2Ref = useRef(0)

    const groupMonthDayDRef = useRef([])

    const pageNumsRef = useRef(0)
    useEffect(() => {
        LoadingSet(true)
        Loading2Set(true)
        queryAssetTypeListF()
    }, [])

    const queryAssetTypeListF = async () => {
        const res = await queryAssetTypeList({ pid: state })
        if (!(res instanceof Error)) {
            // jyRecordSet(res)
            datasRef.current = res
            // queryAssetTypeListF2()

            const res_2 = await queryAssetTypeList({ pid: 40000 })
            if (!(res_2 instanceof Error)) {
                // console.log('请求数据', res);
                let date = [...res_2, { assertCode: '99999', assertName: t('zidingyi') }]
                // jyRecord2Set(date)
                datas2Ref.current = date
                LoadingSet(false)
                // 获取数据
                // queryUserAssetListF(res, date)
                doSearch()
                setHasMore(true)
            }
        }


    }

    const loadMore = async () => {
        let data = {
            startTime: datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 ? (startTimeD != null && startTimeD != undefined ? startTimeD : null) : null,
            endTime: datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 ? (endTimesD != null && endTimesD != undefined ? endTimesD : null) : null,
            methodType: state,  //当前记录类型
            assertCode: datasRef.current[SelectsRef.current]?.assertCode,  //全部弹窗 选中内容
            timeAssertCode: datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 ? null : datas2Ref.current[Selects2Ref.current]?.assertCode,  //时间弹窗 选中内容
            pageNum: pageNumsRef.current,
            pageSize: 10,
        }
        const res = await queryUserAssetList(data)
        if (!(res instanceof Error)) {

            state != 20000 && Loading2Set(false)
            // console.log('多少数据', res,);
            // let datas = res.centerUserAssetsPlusDateVOs || []
            let daTimes = [...groupMonthDayDRef.current, ...(res.centerUserAssetsPlusDateVOs || [])]
            var obj = {};
            daTimes = daTimes.reduce(function (item, next) {
                obj[next.dateLabel] ? '' : obj[next.dateLabel] = true && item.push(next);
                return item;
            }, []);

            console.log('去重数据', groupMonthDayD, daTimes);


            groupMonthDayDRef.current = [...groupMonthDayDRef.current, ...res.centerUserAssetsPlusDateVOs] || []
            // let datas = res.groupMonthDay || []
            groupMonthDayDSet(daTimes)
            console.log('数据打印', [...queryUserAssetListD, ...res.centerUserAssetsPlusVOS]);
            queryUserAssetListDSet(val => [...val, ...res.centerUserAssetsPlusVOS])

            setHasMore(res.centerUserAssetsPlusVOS.length > 0)
            if (res.centerUserAssetsPlusVOS.length > 0) {
                pageNumsRef.current = Number(pageNumsRef.current) + 1
            } else {
                pageNumsRef.current = 0
            }
            if (state == 20000) {
                const res2 = await queryUserAssetCount(data)
                if (!(res2 instanceof Error)) {
                    // console.log('总投注', res2);
                    queryUserAssetCountDSet(res2)

                    Loading2Set(false)
                } else {
                    Loading2Set(false)
                }
            }
        } else {
            Loading2Set(false)
            setHasMore(false)
        }
    }

    // 搜索
    const doSearch = () => {
        pageNumsRef.current = 0
        groupMonthDayDSet([])
        queryUserAssetListDSet([])
        queryUserAssetCountDSet({})

        loadMore()
    }



    // 判断是否超出
    const getElementByIdWayIndex = () => {
        let data = [...datasRef.current]
        data.forEach((value, index) => {
            if (document.getElementById(`way-${index}`)?.scrollWidth > document.getElementById(`way-${index}`)?.offsetWidth) {
                value.goBeyond = true
            } else {
                value.goBeyond = false
            }
        })
        datasRef.current = data
        jyRecordSet(data)

        let data2 = [...datas2Ref.current]
        data2.forEach((value, index) => {
            if (document.getElementById(`way2-${index}`)?.scrollWidth > document.getElementById(`way2-${index}`)?.offsetWidth) {
                value.goBeyond = true
            } else {
                value.goBeyond = false
            }
        })
        datas2Ref.current = data2
        jyRecord2Set(data2)
    }

    // 复制
    const copy = (e) => {
        const textarea = document.createElement('textarea');
        textarea.setAttribute('readonly', 'readonly');
        textarea.value = e;
        document.body.appendChild(textarea);
        textarea.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            Toast.show({
                content: t('ui_successful_copy'),
                position: 'top',
                duration: 2000
            })
        }
        document.body.removeChild(textarea);
    }
    return (
        <div className={style.bodys}>
            <NavBar
                back={null}
                left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
                className={style.wbg}
            // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
            >
                <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                    {state == 10000 ? t('reportDetailTitle') : state == 20000 ? t('ui_bet_record') : t('xiaofeijilu')}
                </div>
            </NavBar>
            {
                Loading ? <div className={style.skBodysss}>
                    {
                        <Skeleton animated className={style.customSkeleton} />
                    }
                </div> : <div className={style.top2}>
                    {/* <img src={require('../../../assets/image/center/zankailog.png')} alt="" /> */}
                    <div className={style.top}>
                        <div className={style.divs} onClick={() => { depositSet(!deposit), setTimeout(() => { getElementByIdWayIndex() }, 100), timesSet(false) }}>
                            <div className={style.divs_d}>
                                {datasRef.current[SelectsRef.current]?.assertName}
                            </div>
                            <img src={require('../../../assets/image/center/wzankailog.png')} alt="" className={deposit ? style.zankailog : ''} />
                        </div>
                        <div className={style.divs} onClick={() => { timesSet(!times), depositSet(false), setTimeout(() => { getElementByIdWayIndex() }, 100) }}>
                            <div className={datas2Ref.current[Selects2Ref.current]?.assertCode != 99999 ? style.divs_d : ''}>
                                {datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 ?
                                    <div>
                                        <div>{dateToSrting(startTimeD)}</div>
                                        <div>{dateToSrting(endTimesD)}</div>
                                    </div>
                                    : datas2Ref.current[Selects2Ref.current]?.assertName}
                            </div>
                            <img src={require('../../../assets/image/center/wzankailog.png')} className={times ? style.zankailog : ''} alt="" /></div>
                    </div>
                    {/* 投注记录统计 */}
                    {
                        state == 20000 && <div className={style.flowingWater}>
                            <div className={style.flowingWater_div}>
                                <div><img src={require('../../../assets/image/center/jllog.png')} alt="" />{t('bishu')}:</div>
                                <div className={style.flowingWater_span}>{queryUserAssetCountD?.totalNum}</div>
                            </div>
                            <div className={style.flowingWater_div}>
                                <div>{t('liushui')}(Xu):</div>
                                <div className={style.flowingWater_span}>{queryUserAssetCountD?.betMoney}</div>
                            </div>
                            <div className={style.flowingWater_div}>
                                <div>{t('shuying')}(Xu):</div>
                                <div className={style.flowingWater_span}>{queryUserAssetCountD?.winLose}</div>
                            </div>
                        </div>
                    }
                </div>
            }
            {/* 全部下拉框 */}
            {deposit && <div onClick={() => {
                depositSet(false)
            }}
                className={style.deposits_bordy}
            >
                <div className={style.depositsS} onClick={(e) => { e.stopPropagation() }}>
                    <div className={`${style.deposits}`}>
                        {datasRef.current.map((value, index) => {
                            return <div key={index} onClick={() => {
                                SelectsRef.current = index
                                pageNumsRef.current = 0
                                doSearch()
                                getElementByIdWayIndex()
                                depositSet(false)

                                groupMonthDayDRef.current = []
                            }} className={`${style.deposits_div} ${SelectsRef.current == index ? style.deposits_div2 : ''}`}>
                                <div className={style.assertName}>
                                    <div id={`way-${index}`} className={`${value?.goBeyond ? style.goBeyond : ''}`}>
                                        {value?.assertName}
                                    </div>
                                </div>
                            </div>
                        })
                        }
                    </div>
                </div>

                <div className={style.mak}></div>
            </div>
            }
            {/* 时间下拉框 */}
            {times && <div onClick={() => {
                timesSet(false)
            }}
                className={style.deposits_bordy}
            >
                <div className={`${style.depositsS} ${state != 20000 ? style.depositsS2 : ''}`} onClick={(e) => { e.stopPropagation() }}>
                    {state == 20000 && <div className={style.depositsS_title_font}>{t('dangqianxitongzhichichaxunzuijin')}</div>}
                    <div className={`${style.deposits} ${state != 20000 ? style.deposits2 : ''}`}>
                        {datas2Ref.current.map((value, index) => {
                            return <div key={index} onClick={() => {
                                Selects2Ref.current = index
                                value.assertCode != 99999 && doSearch()
                                getElementByIdWayIndex()
                                value.assertCode != 99999 && timesSet(false)

                                if (value.assertCode != 99999) groupMonthDayDRef.current = []


                            }} className={`${style.deposits_div} ${Selects2Ref.current == index ? style.deposits_div2 : ''}`}>
                                <div className={style.assertName}>
                                    <div id={`way2-${index}`} className={`${value?.goBeyond ? style.goBeyond : ''}`}>
                                        {value?.assertName}
                                    </div>
                                </div>
                            </div>
                        })
                        }
                    </div>
                    {
                        datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 && <div className={style.zdy_body}>
                            <div className={style.zdy_body_time} >
                                <div className={style.divs} onClick={() => { startTimesSet(!startTimes), endTimesSet(false) }}>
                                    <div>{t('ui_start_date')}</div>
                                    <div className={style.times}>{startTimeD != null && startTimeD != undefined ? dateToSrting(startTimeD) : ''}<img className={style.imgs} src={require('../../../assets/image/center/jlright.png')} alt="" /></div>
                                    <div className={style.border}></div>
                                </div>
                                {
                                    startTimes && <DatePickerView
                                        onChange={(e) => { startTimeDSet(e.getTime()) }}
                                        // new Date(new Date().setDate(new Date().getDate() - 30))
                                        min={state == 20000 ? new Date(new Date().setDate(new Date().getDate() - 30)) : new Date('1900.01.01')}
                                        max={new Date()}
                                        defaultValue={new Date()}
                                        style={{ '--height': '214px' }}
                                    />
                                }
                                <div className={style.divs} onClick={() => { startTimesSet(false), endTimesSet(!endTimes) }}>
                                    <div>{t('jieshuriqi')}</div>
                                    <div className={style.times}>{endTimesD != null && endTimesD != undefined ? dateToSrting(endTimesD) : ''}<img className={style.imgs} src={require('../../../assets/image/center/jlright.png')} alt="" /></div>
                                </div>
                                {
                                    endTimes && <DatePickerView
                                        onChange={(e) => { console.log('e---------------', Number(e.getTime()) + 86399000), endTimesDSet(Number(e.getTime()) + 86399000) }}
                                        min={state == 20000 ? new Date(new Date().setDate(new Date().getDate() - 30)) : new Date('1900.01.01')}
                                        max={new Date()}
                                        defaultValue={new Date()}
                                        style={{ '--height': '214px' }}
                                    />
                                }
                            </div>
                            <div className={style.bottom_but}>
                                <div className={style.but} onClick={() => { timesSet(false) }}>{t('btn_cancel')}</div>
                                <div className={style.but2} onClick={() => {
                                    timesSet(false)
                                    pageNumsRef.current = 0
                                    doSearch()

                                }}>{t('btn_confirm')}</div>
                            </div>
                        </div>
                    }
                </div>


                <div className={style.mak}></div>
            </div>
            }

            {/* 内容 */}
            {Loading2 ? <div className={style.skBody2}>
                {
                    <div>
                        {<Skeleton animated className={style.customSkeleton2} />}
                        {Array(6).fill('').map((item, index) =>
                            <Suspense key={index}>
                                <Skeleton animated className={style.customSkeleton} />
                            </Suspense>
                        )}
                    </div>
                }
            </div> : <div className={style.content}>
                {
                    state != 20000 && <div>
                        {
                            (queryUserAssetListD[0] == undefined || groupMonthDayD[0] == undefined) ?
                                <Empty className={style.Empty} image={<img className='emptyImg' src={require('../../../assets/image/center/xgjlnull.png')} />} description={t('noData')}></Empty>
                                : groupMonthDayD.map((item_1, index_1) => {
                                    return <div key={`${item_1}-${index_1}`}>
                                        <div className={style.titles}>{item_1?.dateLabel}</div>
                                        {
                                            queryUserAssetListD.map((item, index) => {
                                                if (item?.monthDay == item_1?.dateLabel) {
                                                    return <div key={`${item.uid}_${index}`} className={style.content_div} onClick={() => {
                                                        PopupDSet(item)
                                                        visible4Set(true)
                                                    }}>
                                                        <div className={style.content_div_left}>
                                                            <img src={item?.icon || require('../../../assets/image/login/logotitle.png')} alt="" />
                                                            <div className={style.ck}>
                                                                {/* name */}
                                                                <div>{item?.typeName}</div>
                                                                <div className={style.ck_time}>{item?.gmtCreate}</div>
                                                            </div>
                                                        </div>
                                                        <div className={style.content_div_right}>
                                                            <div className={style.content_div_fonts}>
                                                                <div>{item?.status == 1 ? <span
                                                                    style={{
                                                                        color: '#2997F6'
                                                                    }}>{t('sys_check_pass')}</span> : <span style={{
                                                                        color: '#999999'
                                                                    }}>{t('sys_check_fail')}</span>}</div>
                                                                <div className={style.content_div_money}>{item?.goldCoin}</div>
                                                            </div>
                                                            <img src={require('../../../assets/image/center/jlright.png')} alt="" />
                                                        </div>
                                                    </div>
                                                }
                                            })
                                        }
                                    </div>
                                })
                        }
                    </div>
                }
                {/* 投注记录 */}
                {
                    state == 20000 && <div>
                        {
                            (queryUserAssetListD[0] == undefined || groupMonthDayD[0] == undefined) ?
                                <Empty className={style.Empty} image={<img className='emptyImg' src={require('../../../assets/image/center/xgjlnull.png')} />} description={t('noData')}></Empty>
                                : groupMonthDayD.map((item_1, index_1) => {
                                    return <div key={`${item_1}-${index_1}`}>
                                        <div className={style.titles2}>
                                            <div >{item_1?.dateLabel}</div>
                                            <div className={style.tj_div}>
                                                <img src={require('../../../assets/image/center/jllog.png')} alt="" />
                                                <div>{t('bishu')}:{item_1?.centerUserAssetsPlusCountVO.totalNum}</div>

                                                <div>{t('liushui')}(xu):{item_1?.centerUserAssetsPlusCountVO.betMoney}</div>
                                                <div>{t('shuying')}(xu):{item_1?.centerUserAssetsPlusCountVO.winLose}</div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '0 13px' }}>
                                            {
                                                queryUserAssetListD.map((item, index) => {
                                                    if (item?.monthDay == item_1?.dateLabel) {

                                                        return <div key={`${item.uid}_${index}`} className={style.content_div2} >
                                                            <div className={style.content_div_top}>
                                                                {item?.gameName}
                                                            </div>
                                                            <div className={style.content_div_center}>
                                                                <div>
                                                                    <div className={style.title}>
                                                                        <div className={style.title_left}></div>
                                                                        <div>{item?.name}</div>
                                                                    </div>
                                                                    <div className={style.content_s}>
                                                                        <div className={style.content_left}>
                                                                            {t('liushui')}(xu)：{item?.betAmount}
                                                                        </div>
                                                                        <div className={style.content_right}>
                                                                            {t('shu/ying')}(xu)：<span style={{ color: `${Number(item?.profitAmount) > 0 ? '#D1657D' : '#333333'}` }}>{item?.profitAmount}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={style.content_div_bottom}>
                                                                {t('ui_bet_time_colon')}<span>{item?.gmtCreate}</span>
                                                            </div>
                                                        </div>
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                })
                        }
                    </div>
                }
                {queryUserAssetListD.length > 0 && <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />}

                {/* 弹窗展示详情 */}
                <Popup
                    visible={visible4}
                    onMaskClick={() => {
                        visible4Set(false)
                    }}
                    position='right'
                    bodyStyle={{ width: '100vw' }}
                >
                    <div style={{
                        width: '100vw',
                        minHeight: '100vh',
                        background: '#F6F7FC'
                    }}>
                        <NavBar
                            back={null}
                            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => visible4Set(false)} />}
                            className={style.wbg}
                        // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
                        >
                            <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                                {state == 10000 ? t('reportDetailTitle') : state == 20000 ? t('ui_bet_record') : t('xiaofeijilu')}
                            </div>
                        </NavBar>
                        <div className={style.Details}>
                            <div className={style.title}>{PopupD?.goldCoin}</div>
                            <div className={`${style.bottom} ${style.divs}`}>
                                <div>{state == 10000 ? t('reportDetail2') : state == 30000 ? t('reportDetail1') : ''}</div>
                                <div>{PopupD?.name}</div>
                            </div>
                            {/* <div className={`${style.bottom} ${style.divs}`}>
                    <div>交易方式</div>
                    <div>支付宝</div>
                </div> */}
                            <div className={`${style.bottom} ${style.divs}`}>
                                <div>{t('rp_status')}</div>
                                <div>{PopupD?.status == 1 ? <span
                                    style={{
                                        color: '#2997F6'
                                    }}>{t('sys_check_pass')}</span> : <span style={{
                                        color: '#999999'
                                    }}>{t('sys_check_fail')}</span>}</div>
                            </div>
                            <div className={`${style.bottom} ${style.divs}`}>
                                <div>{t('reportDetail4')}</div>
                                <div>{PopupD?.gmtAllCreate}</div>
                            </div>
                            <div className={` ${style.divs}`} onClick={() => { copy(PopupD?.trn) }}>
                                <div>{t('dingdanhaoma')}</div>
                                <div>{PopupD?.trn}<img src={require('../../../assets/image/center/fzlog.png')} alt="" /></div>
                            </div>
                        </div>

                        <div className={style.Details2} onClick={() => { history('/service') }}>
                            <div>{t('ninduizhegejiaoyiyouyiwen')}</div>
                            <img src={require('../../../assets/image/center/kflog.png')} alt="" />
                        </div>
                    </div>

                </Popup>

            </div>}
        </div >
    );
}

export default Index;
