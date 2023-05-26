import { Toast, Skeleton, NavBar, Tabs, Badge, Popup, SwipeAction, Modal, Button, Mask, ActionSheet, InfiniteScroll } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, useRef, } from "react";
import { useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { getTypeList, findListByTypePage, platformMessageRead, platformMessageReadAll, platformMessageDel } from '../../../server/notice'
import i18n from "../../../lang/i18n";

import { CEmpty } from '../../../components'
import moment from 'moment'
import { Local } from "../../../../common";

const Index = () => {
    const history = useNavigate()
    // 顶部
    const [TabsTab, TabsTabSet] = useState([])
    const TabsTabRef = useRef([])

    const [Loading, LoadingSet] = useState(true)
    const [tabsKey, tabsKeySet] = useState(0)
    const tabsKeyRef = useRef(0)

    const [visible, visibleSet] = useState(false)
    const [visibleMask, visibleMaskSet] = useState(false)
    const [ActionSheets, ActionSheetsSet] = useState(false)

    const [batchDelete, batchDeleteSet] = useState(false)

    const [batchsIndex, batchsIndexSet] = useState([])
    const [xtData, xtDataSet] = useState({})
    const [xtData2, xtDataSet2] = useState([])

    const [hasMore, setHasMore] = useState(false)
    const [nums, numsSet] = useState()
    const [pageNum, pageNumSet] = useState(1)
    const [xtData2Son, xtData2SonSet] = useState({})

    const pageNumsRef = useRef(1)


    // tab
    const getTypeListF = async () => {
        const res = await getTypeList(Local('userInfo')?.uid)
        if (!(res instanceof Error)) {
            let data = [...res]
            console.log('tab-----------------', res);
            let num = 0
            data.sort((a, b) => {
                num += Number(a.unread)
                return a.sortIdx - b.sortIdx
            })
            numsSet(num)

            TabsTabSet(data)
            TabsTabRef.current = data

            renovate()
        } else {
            LoadingSet(false)
        }
    }


    const loadMore = async () => {
        let data = {
            pageNum: pageNumsRef.current,
            pageSize: 10,
            uid: Local('userInfo')?.uid,
            typeId: TabsTabRef.current[tabsKeyRef.current]?.id
        }
        const res = await findListByTypePage(data)
        LoadingSet(false)
        if (!(res instanceof Error)) {
            console.log('findListByTypePage--', res);
            xtDataSet(res)
            xtDataSet2(val => [...val, ...res.list])

            setHasMore(res.list.length > 0) //是否有下页
            if (res.list.length > 0) {
                pageNumsRef.current = Number(pageNumsRef.current) + 1
                pageNumSet(pageNum + 1)
            } else {
                // pageNumsRef.current = Number(pageNumsRef.current) + 1
                // pageNumSet(pageNum + 1)
            }


        }
    }

    useEffect(() => {
        getTypeListF()
    }, [])

    const platformMessageDelF = async (da) => {
        let ids = ''
        batchsIndex.forEach((value) => {
            ids += `${value},`
        })
        let msgIds = ids.substring(0, ids.length - 1)
        console.log(msgIds);


        const res = await platformMessageDel({ msgIds: msgIds, uid: Local('userInfo')?.uid })
        batchsIndexSet([])
        if (!(res instanceof Error)) {
            console.log('--------------删除', res);
            visibleMaskSet(false)

            getTypeListF()
        }
    }
    // 单个删除
    const deleteF = (i) => {
        console.log('i', i);

        batchsIndexSet([i])

        visibleMaskSet(true)
    }
    // 批量删除单个选择
    const batchsIndexF = (id) => {
        console.log('index', id);
        if (batchsIndex.indexOf(id) == -1) {
            batchsIndexSet((a) => [...a, id])
        } else {
            let i = [...batchsIndex]
            i.splice(batchsIndex.indexOf(id), 1)
            batchsIndexSet(i)
        }
    }
    // 全选、取消
    const selectF = () => {
        let indexs = []
        if (xtData2?.length != batchsIndex.length) {
            xtData2.forEach((value, i) => {
                indexs.push(value.id)
            })
            batchsIndexSet(indexs)
        } else {
            batchsIndexSet([])
        }
    }
    // 批量删除操作
    const batchDeleteF = () => {
        visibleMaskSet(true)
        // let data = [...xtData]
        // let data2 = []
        // data.forEach((value, index) => {
        //     if (batchsIndex.indexOf(value.id) == -1) {
        //         console.log('选中删除数据', batchsIndex.indexOf(value.id), value.id);
        //         data2.push(value)
        //     }
        // })
        // console.log('删除后数据', data, data2);
        // xtDataSet(data2)
    }

    // 刷新数据
    const renovate = async () => {
        pageNumSet(1)
        pageNumsRef.current = 1
        xtDataSet({})
        xtDataSet2([])

        loadMore()
    }
    // 已读
    const platformMessageReadF = async (v) => {
        const res = await platformMessageRead({ msgId: v?.id })
        if (!(res instanceof Error)) {
            getTypeListF()
        }
    }
    // 一键已读
    const platformMessageReadAllF = async () => {
        const res = await platformMessageReadAll({ typeId: TabsTabRef.current[tabsKeyRef.current]?.id, uid: Local('userInfo')?.uid })
        if (!(res instanceof Error)) {
            console.log('platformMessageReadAllF', res);
            ActionSheetsSet(false)
            getTypeListF()
        }
    }


    return <div style={{ height: '100vh' }}>
        <NavBar
            back={null}
            left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
            className={style.wbg}
            right={<div className={style.NavBar} onClick={() => { }} >
                {
                    !batchDelete ? <img src={require('../../../assets/image/center/tz/right.png')} alt="" onClick={() => ActionSheetsSet(true)} />
                        : <div className={style.wcColor} onClick={() => { batchDeleteSet(false), batchsIndexSet([]) }}>
                            {t('wancheng')}
                        </div>
                }
            </div>}
        >
            <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                <Badge content={nums == 0 ? null : nums} wrapperClassName='wrapperStyles' style={{ '--right': '-10px', '--top': '-5px', '--color': '#D86361' }}>
                    {t('tongzhi')}
                </Badge>
            </div>
        </NavBar>
        <Tabs
            className={`${style.wbg2} TabsWbg2`}
            activeKey={tabsKeyRef.current}
            // renovate(e)
            onChange={(e) => { tabsKeySet(e), tabsKeyRef.current = e, LoadingSet(true), getTypeListF() }}
        >
            {/* i18n */}
            {
                TabsTabRef.current.map((value, index) => {
                    return <Tabs.Tab title={
                        <Badge content={value.unread == 0 ? null : value.unread} wrapperClassName='wrapperStyles' style={{ '--right': '-10px', '--top': '-5px', '--color': '#D86361' }}>
                            {i18n.language == 'zh' ? value?.typeNameZh : value?.typeNameVi}
                        </Badge>
                    } key={index}>
                    </Tabs.Tab>
                })
            }
        </Tabs>
        {/* 内容 */}
        <div className={`${style.container} ${batchDelete ? style.container2 : ''}`}>
            {
                Loading ? <div className={style.prooSk}>
                    {Array(6).fill('').map((item, index) =>
                        <Skeleton key={index} animated className={style.customSkeleton} />
                    )}
                </div>
                    :
                    <div className={`${style.center} `}>
                        {
                            xtData2?.length > 0 ? xtData2.map((value, index) => {
                                return !batchDelete ? <SwipeAction key={value.id}
                                    rightActions={
                                        [
                                            {
                                                key: 'delete',
                                                text: t('delete'),
                                                color: 'danger',
                                                onClick: () => { deleteF(value.id) }
                                            },
                                        ]
                                    }
                                >
                                    <div className={style.center_div} key={value?.id} onClick={() => { xtData2SonSet(value), visibleSet(true), platformMessageReadF(value) }}>
                                        <div className={style.contents}>
                                            <Badge content={value?.isRead == 0 ? Badge.dot : null} wrapperClassName='wrapperStyles' style={{ '--right': '0px', '--top': '0px', '--color': '#D86361' }}>
                                                {/*  || require('../../../assets/image/center/tz/flb.png') */}
                                                <img src={TabsTabRef.current[tabsKeyRef.current]?.icon} alt="" className={style.icons} />
                                            </Badge>
                                            <div className={style.fonts}>
                                                <div className={style.fonts_top}>
                                                    <div>{value?.title}</div>
                                                    <div className={style.font_time}>{moment(value?.createTime).format('DD-MM-YYYY')}</div>
                                                </div>
                                                <div className={style.fonts_bot} dangerouslySetInnerHTML={{ __html: value?.messageContent || '' }}>
                                                    {/* {value?.messageContent} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwipeAction>
                                    :
                                    // 批量删除数据
                                    <div className={`${style.center_div} `} key={value.id} onClick={() => batchsIndexF(value.id)}>
                                        <div className={style.contents}>
                                            <div className={style.contents_right}>
                                                <img src={require(`../../../assets/image/center/tz/${batchsIndex.indexOf(value?.id) == -1 ? 'wxz' : 'xz'}.png`)} alt="" className={style.batchs} />
                                                <Badge content={value?.isRead == 0 ? Badge.dot : null} wrapperClassName='wrapperStyles' style={{ '--right': '0px', '--top': '0px', '--color': '#D86361' }}>
                                                    {/* <img src={require('../../../assets/image/center/tz/flb.png')} alt="" className={style.icons} /> */}
                                                    <img src={TabsTabRef.current[tabsKeyRef.current]?.icon} alt="" className={style.icons} />
                                                </Badge>
                                            </div>
                                            <div className={style.fonts}>
                                                <div className={style.fonts_top}>
                                                    <div>{value?.title}</div>
                                                    <div className={style.font_time}>{moment(value?.createTime).format('DD-MM-YYYY')}</div>
                                                </div>
                                                <div className={style.fonts_bot}>{value?.messageContent}</div>
                                            </div>
                                        </div>
                                    </div>
                            }) : <CEmpty description={t('noData')} />
                        }

                        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                    </div>

            }
            {/* 批量删除的时候 */}
            {batchDelete && <div className={style.bottom_but}>
                <Button fill='none' onClick={() => selectF()} disabled={xtData2?.length == 0}>{xtData2?.length != batchsIndex.length ? t('quanxuan') : t('quxiaoquanxuan')}</Button>
                <Button fill='none' disabled={batchsIndex.length == 0 || xtData2?.length == 0} onClick={() => batchDeleteF()}>{t('delete')}</Button>
            </div>}
        </div>

        {/* 详细弹窗 */}
        <Popup
            position='right'
            visible={visible}
            onMaskClick={() => {
                visibleSet(false)
            }}
            bodyStyle={{ width: '100vw' }}
        >
            <div className={style.Popups}>
                <NavBar
                    back={null}
                    left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => visibleSet(false)} />}
                    className={style.wbg}
                >
                    <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                        <Badge content={nums == 0 ? null : nums} wrapperClassName='wrapperStyles' style={{ '--right': '-10px', '--top': '-5px', '--color': '#D86361' }}>
                            {t('tongzhi')}
                        </Badge>
                    </div>
                </NavBar>

                <div className={style.content}>
                    <div className={style.content_bg}>
                        <div className={style.center_div} >
                            <div className={style.contents}>
                                {/* <Badge content={Badge.dot} wrapperClassName='wrapperStyles' style={{ '--right': '0px', '--top': '0px', '--color': '#D86361' }}> */}
                                <img src={require('../../../assets/image/center/tz/flb.png')} alt="" className={style.icons} />
                                {/* </Badge> */}
                                <div className={style.fonts}>
                                    <div className={style.fonts_top}>
                                        <div>{xtData2Son?.title}</div>
                                        {/* <div className={style.font_time}>2023-02-16</div> */}
                                    </div>
                                    <div className={style.fonts_bot}>{moment(xtData2Son?.createTime).format('DD-MM-YYYY HH:mm:ss')}</div>
                                </div>
                            </div>
                        </div>
                        <div className={style.fontSizes} dangerouslySetInnerHTML={{ __html: xtData2Son?.messageContent || '' }}>
                            {/* {xtData2Son?.messageContent} */}
                        </div>

                        {/* <div className={style.detaileds}>
                            点击查看活动详情
                        </div> */}

                    </div>
                </div>
            </div>
        </Popup>
        {/* 提示弹窗 */}
        <Mask visible={visibleMask} onMaskClick={() => visibleMaskSet(false)}>
            <div className={style.Mask_content}>
                <div className={style.Mask_font}>
                    <div className={style.Mask_title}>{t('ui_prompt')}</div>
                    <div>
                        {t('quedingyaoshanchugaixiaoxima')}
                    </div>
                </div>
                <div className={style.buts}>
                    <Button className={style.buttons} onClick={() => visibleMaskSet(false)}>{t('btn_cancel')}</Button>
                    <Button className={`${style.buttons} ${style.Btcolor}`} loading='auto' onClick={() => platformMessageDelF()}>{t('btn_confirm')}</Button>
                </div>
            </div>
        </Mask>
        {/* 弹窗 */}
        <ActionSheet
            visible={ActionSheets}
            actions={[
                { text: t('yijianyidu'), key: 'Onekey', onClick: () => { platformMessageReadAllF() } },
                { text: t('piliangshanchu'), key: 'delete', onClick: () => { ActionSheetsSet(false), batchDeleteSet(true) } },
            ]}
            cancelText={t('cancel')}
            onClose={() => ActionSheetsSet(false)}
        />
    </div>
}

export default Index;
