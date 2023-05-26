import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { NavBar, Mask, Toast, SpinLoading } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { giftApply, giftGetParticipateRecord, giftInfo } from '../../server/activityBox'
import { Local } from "../../../common"
import style from './index.module.scss'
import i18n from '../../lang/i18n'

const getUrlParams = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

const SaveMoney = () => {
    const history = useNavigate()
    const { t } = useTranslation()
    const device = getUrlParams('device')

    let [lang, langSet] = useState(i18n.language)
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [Data, DataSet] = useState('')
    const [dotLoading1, dotLoading1Set] = useState(false)
    // 头部
    const tables = [
        { title: t('danbicunkuan'), key: 'demo1' },
        { title: t('dancilingqu'), key: 'demo2' },
        { title: t('zongjihongli'), key: 'demo3' },
        { title: t('shenqingrukou'), key: 'demo4' },
    ]
    // 表格数据
    const [tablesD, tablesDSet] = useState({})

    // 头部
    const tables2 = [
        { title: 'Ngày', key: 'demo1' },
        { title: 'Nạp tiền', key: 'demo2' },
        { title: 'Yêu cầu vòng cược', key: 'demo3' },
        { title: 'Nhận thưởng', key: 'demo4' },
    ]
    // 表格数据
    const [tablesD2, tablesDSet2] = useState(
        [{
            demo1: "19/1",
            demo2: "600",
            demo3: "Không",
            demo4: "60",
        },
        {
            demo1: "22/1",
            demo2: null,
            demo3: "Trong 3 ngày 19/1-21/1 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "25/1",
            demo2: null,
            demo3: "Trong 3 ngày 22/1-24/1 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "28/1",
            demo2: null,
            demo3: "Trong 3 ngày 25/1-27/1 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "31/1",
            demo2: null,
            demo3: "Trong 3 ngày 28/1-30/1 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "3/2",
            demo2: null,
            demo3: "Trong 3 ngày 31/1-2/2 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "6/2",
            demo2: null,
            demo3: "Trong 3 ngày 3/2-5/2 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "9/2",
            demo2: null,
            demo3: "Trong 3 ngày 6/2-8/2 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "12/2",
            demo2: null,
            demo3: "Trong 3 ngày 9/2-11/2 đáp ứng đủ 600*4",
            demo4: "60",
        },
        {
            demo1: "15/2",
            demo2: null,
            demo3: "Trong 3 ngày 12/2-15/2 đáp ứng đủ 600*4",
            demo4: "60",
        },]
    )





    const [giftGetParticipateRecordData, giftGetParticipateRecordDataSet] = useState([])
    const [giftGetParticipateRecordsId, giftGetParticipateRecordsIdSet] = useState({})


    const init = useCallback(async () => {
        // let aid
        if (location.search) {
            console.log(getUrlParams('token'));
            // aid = getUrlParams('anchorId')
            Local('token', getUrlParams('token'))
        }
        // else {
        //     aid = state?.anchorId
        // }
        // anchorIdSet(aid)

        // { anchorId: aid }
        const item = await giftInfo()
        if (!(item instanceof Error)) {
            // console.log('获取活动信息', item);
            // 换行处理
            let a = item
            if (a !== undefined) {
                if (a.activityRules != undefined && a.activityRules.toString().length > 0) {
                    // console.log(a.activityRules);
                    a.activityRules = a?.activityRules?.replace(/\n/g, "<br>")
                }

                if (a.descriptions != undefined && a.descriptions.toString().length > 0) {
                    a.descriptions = a?.descriptions?.replace(/\n/g, "<br>")
                }
                giftGetParticipateRecords(item.id, a)
            }
            giftGetParticipateRecordsIdSet(a)
            tablesDSet(a)
        }
    }, [])

    useEffect(() => {
        init()
        // document.title = t('zhuan_pan_bt')
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


    // useEffect(() => {
    //     // giftGetParticipateRecords()
    //     giftInfos()
    //     init()
    // }, [])


    // 活动信息
    const giftInfos = () => {
        giftInfo().then((item) => {
            // console.log('获取活动信息', item);
            // 换行处理
            let a = item
            if (a !== undefined) {
                if (a.activityRules != undefined && a.activityRules.toString().length > 0) {
                    // console.log(a.activityRules);
                    a.activityRules = a?.activityRules?.replace(/\n/g, "<br>")
                }

                if (a.descriptions != undefined && a.descriptions.toString().length > 0) {
                    a.descriptions = a?.descriptions?.replace(/\n/g, "<br>")
                }
                giftGetParticipateRecords(item.id, a)
            }
            giftGetParticipateRecordsIdSet(a)
            tablesDSet(a)
        })
    }
    // 领取记录
    const giftGetParticipateRecords = (id, d) => {
        // console.log('这是领取记录id', id, d, giftGetParticipateRecordsId);
        giftGetParticipateRecord({ activityBaseId: id }).then((item) => {
            // console.log('领取记录', item);
            giftGetParticipateRecordDataSet(item)
            if (item != undefined) {
                let as = d != undefined ? JSON.stringify(d) : JSON.stringify(giftGetParticipateRecordsId)
                let data = JSON.parse(as)
                if (data != undefined && data.giftConditionsResponseList != undefined) {
                    item.forEach((value) => {
                        data.giftConditionsResponseList.forEach((value_2) => {
                            let c = 0
                            if (value_2.id == value.conditionsId) {
                                c += 1
                                if (c != data.receiveNum) {
                                    value_2.but = true
                                } else {
                                    value_2.but = false
                                }
                            }
                        })
                    })
                }
                tablesDSet(data)
                // console.log('shuj1', data);
            }
        })
    }
    // 领取
    const giftApplys = (row) => {
        dotLoading1Set(true)
        let data = {
            conditionsId: row.id,
            activityBaseId: row.giftBaseId
        }
        setTimeout(() => {
            giftApply(data).then((item) => {
                //    setVisible(true)
                // console.log('items', item);
                dotLoading1Set(false)
                // 判断失败
                if (item.code == 14121) {
                    setVisible(true)
                    DataSet(item.msg)
                }
                // 领取成功
                if (item == 'true') {
                    // console.log('成功');
                    Toast.show(t('tip_receive_success'))
                }

                // debugger
                giftInfos()
                // giftGetParticipateRecords(giftGetParticipateRecordsId)
            })
        }, 500)
    }
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
            str = `${h}:${min}:${s} ${d}-${m}-${y}`;
            // console.log(date, y);
        }
        return str;
    }
    const dateToSrting2 = (da) => {
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
            // console.log(date, y);
        }
        return str;
    }

    return (
        <div className={style.saveMoney}>
            <div className={style.bodys} style={
                // { paddingTop: device === 'android' ? '35px' : '0' }
                { paddingTop: device === 'android' ? '0' : '0' }
            }>
                {/* <NavBar
                back={null}
                left={<img src={require('../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
                onBack={() => history(-1)} className={style.wbg}
            // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
            >
                <div style={{ fontSize: '18px', color: '#1e1b27' }}>
                    {t('ui_promo')}
                </div>
            </NavBar> */}
                {device !== 'ios' && device !== 'android' && <NavBar
                    style={{ position: 'absolute', top: '0', left: '0', height: '45px', width: '100%', }}
                    back={null}
                    left={<img src={require('../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => {
                        if (device === 'android') {
                            window.fbsandroid.closeBrowser()
                            // window.webkit.messageHandlers.closeBrowser.postMessage('')
                        } else if (device === 'ios') {
                            window.webkit.messageHandlers.closeBrowser.postMessage('')
                        } else {
                            history(-1)
                        }
                    }} />}
                > <div style={{ fontSize: '18px', color: '#1e1b27', fontWeight: '500' }}>
                        {t('ui_promo')}
                    </div></NavBar>}
                <div className={style.saveMoney_scrolls}>
                    {/* title */}
                    <div className={style.titles}>
                        <img src={require('../../assets/image/activity/banner1.png')} alt="" />
                    </div>
                    {/* 内容 */}
                    <div className={style.center}>
                        {/* 活动内容 */}
                        <div className={style.center_big}>
                            <div className={style.center_titles}>
                                <div className={style.titledspli2}>
                                    <div className={style.titledspli}>
                                        <div className={style.titles_left}></div>
                                        <div>{t('huodongneirong')}</div>
                                    </div>
                                    <div className={`${style.titledspli} ${style.colors}`} onClick={() => { giftGetParticipateRecords(giftGetParticipateRecordsId?.id), setVisible2(true) }}>
                                        <img src={require('../../assets/image/center/jl.png')} alt="" />
                                        <div>{t('lingqujilu')}</div>
                                    </div>
                                </div>
                                {/* 表 */}
                                <div className={style.tables}>
                                    {/* 头 */}
                                    <div className={style.tables_title}>
                                        {
                                            tables.map((value, index) => {
                                                return (
                                                    <span key={value.key}>{value.title}</span>
                                                )
                                            })
                                        }
                                    </div>
                                    {/* 内容 */}
                                    <div className={style.tables_centers}>
                                        {
                                            (tablesD != undefined && tablesD?.giftConditionsResponseList != undefined) ? tablesD?.giftConditionsResponseList.map((value, index, array) => {
                                                return (
                                                    <div className={`${style.tableDs} ${(array.length - 1) != index ? style.borderR : ''}`} key={value.id}>
                                                        <span>{value?.payAmount}</span>
                                                        <span>{value?.discountAmount}</span>
                                                        <span>{(value?.discountAmount * tablesD?.receiveNum)}</span>
                                                        {!dotLoading1 ? <div className={`${style.buts}  ${value.but == false ? style.buts2 : ''}`} onClick={() => { value.but == false ? '' : giftApplys(value) }}>{t('btn_receive')}</div>
                                                            : <div className={`${style.buts} `} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <SpinLoading color='#fff' style={{ '--size': '16px' }} /></div>}
                                                    </div>
                                                )
                                            }) : <div className={style.bottomFont}>{t('noData')}</div>
                                        }
                                    </div>
                                </div>
                                <div className={style.bottom}>{t('shenqingshijian')}：{dateToSrting2(tablesD?.startTime)} {t('zhi')} {dateToSrting2(tablesD?.endTime)}</div>
                            </div>
                        </div>
                        {/* 示例 */}
                        <div className={style.center_big}>
                            <div className={style.center_titles}>
                                <div className={style.titledspli2}>
                                    <div className={style.titledspli}>
                                        <div className={style.titles_left}></div>
                                        <div>{'Vuốt sang để xem ví dụ'}</div>
                                    </div>
                                </div>
                                {/* 表 */}
                                <div className={`${style.tables} ${style.tables2}`}>
                                    {/* 头 */}
                                    <div className={style.tables_title2} style={{ width: '650px' }}>
                                        {
                                            tables2.map((value, index) => {
                                                return (
                                                    <div style={{ width: `${index !== 2 ? '100px' : '350px'}`, height: "36px", lineHeight: '36px' }} key={value.key}>{value.title}</div>
                                                )
                                            })
                                        }
                                    </div>
                                    {/* 内容 */}
                                    <div className={style.tables_centers} style={{ width: '650px' }}>
                                        {
                                            tablesD2.map((value, index, array) => {
                                                return (
                                                    <div className={`${style.tableDs2} `} key={index}>
                                                        <div style={{ width: '100px', height: "36px" }} className={`${(array.length - 1) != index ? style.borderR : ''} ${style.borderR2}`}>{value?.demo1}</div>
                                                        <div style={{ width: '100px', height: "36px" }} className={`${index == 0 ? style.borderR : ''} ${style.borderR2}`}>{value?.demo2}</div>
                                                        <div style={{ width: '350px', height: "36px" }} className={`${(array.length - 1) != index ? style.borderR : ''} ${style.borderR2}`}>{value?.demo3}</div>
                                                        <div style={{ width: '100px', height: "36px" }} className={`${(array.length - 1) != index ? style.borderR : ''} `}>{value?.demo4}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={style.center_big_bottom}>
                                Lưu ý: Sau khi lĩnh thưởng 72 tiếng mới được lĩnh thưởng lần tiếp theo
                            </div>
                        </div>
                        {/* 活动说明 */}
                        <div className={style.center_big}>
                            <div className={style.center_titles}>
                                <div className={style.titledspli}>
                                    <div className={style.titles_left}></div> <div>{t('huodongshuoming')}</div>
                                </div>
                                {/* 活动时间 */}
                                <div className={`${style.displ} ${style.marginBottom} ${style.marginTop}`}>
                                    <div className={style.displ2}>
                                        <div className={style.displ2_left}></div>
                                        <div>{t('ActivityTime')}</div>
                                    </div>
                                    <div className={style.displ_center}>{dateToSrting(tablesD?.startTime)} {t('zhi')} {dateToSrting(tablesD?.endTime)}</div>
                                </div>
                                {/* 活动内容 */}
                                <div className={`${style.displ} ${style.marginBottom} `}>
                                    <div className={style.displ2}>
                                        <div className={style.displ2_left}></div>
                                        <div>{t('huodongneirong')}</div>
                                    </div>
                                    <div className={style.displ_center} dangerouslySetInnerHTML={{ __html: (tablesD != undefined && tablesD?.descriptions !== undefined && tablesD?.descriptions.length > 0) ? tablesD.descriptions.split('||')[0] : '' }}>
                                        {/* 活动期间单笔存款600送600，2000送2000；分10次领
                                取，每三天领取一次。 */}
                                        {/* {(tablesD.descriptions !== undefined && tablesD.descriptions.length > 0) ? tablesD.descriptions.split('||')[0] : ''} */}
                                    </div>
                                </div>
                                {/* 提款要求 */}
                                <div className={`${style.displ} ${style.marginBottom} `}>
                                    <div className={style.displ2}>
                                        <div className={style.displ2_left}></div>
                                        <div>{t('tikuanxuqiu')}</div>
                                    </div>
                                    <div className={style.displ_center} dangerouslySetInnerHTML={{ __html: (tablesD != undefined && tablesD?.descriptions !== undefined && tablesD?.descriptions.length > 0) ? tablesD.descriptions.split('||')[1] : '' }}>
                                        {/* （存款+红利）任意游戏四倍流水 */}
                                        {/* {(tablesD.descriptions !== undefined && tablesD.descriptions.length > 0) ? tablesD.descriptions.split('||')[1] : ''} */}
                                    </div>
                                </div>
                                {/* 满足条件 */}
                                <div className={`${style.displ} `}>
                                    <div className={style.displ2}>
                                        <div className={style.displ2_left}></div>
                                        <div>{t('mianzutiaojian')}</div>
                                    </div>
                                    <div className={style.displ_center} dangerouslySetInnerHTML={{ __html: (tablesD != undefined && tablesD?.descriptions !== undefined && tablesD?.descriptions.length > 0) ? tablesD.descriptions.split('||')[2] : '' }}>
                                        {/* 1. 存600送600：领取下一次彩金前须投注完成2400的
                                有效流水。<br />
                                2. 存2000送2000：领取下一次彩金前须投注完成8000
                                的有效流水。<br />
                                3. 每位会员限参与一次，彩金日未点击领取彩金，视为
                                逾期放弃领取。每次彩<br />
                                金日的领取条件为独立计算，若中断领取在下个彩金日
                                前完成该次条件可继续领取。<br />
                                4. 领取下次彩金流水计算方式：上一笔彩金日及后两日
                                有效流水。 */}
                                        {/* {(tablesD.descriptions !== undefined && tablesD.descriptions.length > 0) ? tablesD.descriptions.split('||')[2] : ''} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 活动规则 */}
                        <div className={style.center_big}>
                            <div className={style.center_titles}>
                                <div className={style.titledspli}>
                                    <div className={style.titles_left}></div> <div>{t('huo_dong_gz')}</div>
                                </div>
                                {/* 规则 */}
                                <div className={`${style.displ} ${style.marginTop}`}>
                                    <div className={style.displ_center} dangerouslySetInnerHTML={{ __html: (tablesD != undefined && tablesD?.activityRules !== undefined && tablesD?.activityRules.length > 0) ? tablesD?.activityRules : '' }}>
                                        {/* 1.每位真实有效玩家、手机号码、电子邮箱、银行卡、IP地址、
                                登录设备， 除活动特别说明外，仅能申请并享受一次每项优
                                惠活动，若有违规者，本公司将保留扣除账号盈利及红利的
                                权力。<br />
                                2.本公司绝不容许任何诈欺行为，若发现有违背或利用规则
                                与条款进行不当获利的会员，本公司将保留终止会员使用本
                                网站 以及没收奖金及盈利的绝对权力。<br />
                                3.FBSlive保留对活动的最终解释权和修改或终止活动的权利，
                                恕不另行通知，相关活动规则与条款的最终解释权归FBSlive
                                所有。<br />
                                4关于团队套利和其他不法获利行为，经平台查实针对情节严
                                重的会进行封号处理。<br /> */}
                                        {/* {tablesD?.activityRules} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <Mask visible={visible} onMaskClick={() => setVisible(false)}>
                    <div className={style.popUp}>
                        <div className={style.popUp_center}>
                            <div className={style.popUp_center_title}>
                                {t('lingqushibai')}
                            </div>
                            <div className={style.popUp_centers}>
                                {`${t('nintouzhudeyouxixiaoliushuidiyudangqianlinqu')}${Data}，${t('qingtouzhuhouzailai')}`}
                            </div>
                        </div>
                        <div className={style.popUp_but}>
                            <div className={`${style.popUp_but_s}`} style={{ color: '#666666', borderRight: '1px solid rgba(0,0,0,0.05)' }} onClick={() => { setVisible(false) }}>{t('btn_cancel')}</div>
                            <div className={`${style.popUp_but_s}`} onClick={() => { setVisible(false) }}>{t('btn_confirm')}</div>
                        </div>
                    </div>

                </Mask>
                <Mask visible={visible2} onMaskClick={() => setVisible2(false)}>
                    <div className={style.popUp2}>
                        {/* 背景 */}
                        {/* <div className={style.popUp2_top}>
                    </div> */}
                        <div className={style.popUp_center}>
                            <div className={style.popUp_center_title}>
                                {t('lingqujilu')}
                            </div>
                            <img src={require('../../assets/image/center/gbicon.png')} alt="" className={style.popUp_right_img} onClick={() => { setVisible2(false) }} />
                            <div className={style.centers_bigs} >
                                {
                                    (giftGetParticipateRecordData !== undefined && giftGetParticipateRecordData[0] !== undefined) ? giftGetParticipateRecordData.map((item, index) => {
                                        return (
                                            <div className={style.centers} key={index}>
                                                <div className={style.centers_left}>
                                                    <div className={style.centers_left1}>{item?.title}</div>
                                                    <div>{dateToSrting(item?.createTime)}</div>
                                                </div>
                                                <div>+{item?.discountAmount}</div>
                                            </div>
                                        )
                                    }) : <div className={style.centers_Bottom}>{t('noData')}</div>
                                }
                            </div>
                        </div>
                        {/* <div className={style.popUp_but}>
                        <div className={`${style.popUp_but_s}`} style={{ color: '#666666', borderRight: '1px solid rgba(0,0,0,0.05)' }} onClick={() => { setVisible(false) }}>取消</div>
                        <div className={`${style.popUp_but_s}`} onClick={() => { setVisible(false) }}>确定</div>
                    </div> */}
                    </div>

                </Mask>
            </div >
        </div>
    );
}

export default SaveMoney;
