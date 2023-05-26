import React, { useEffect, useMemo, useState } from 'react';
import { Skeleton, Empty } from 'antd';
import { liveListV2, levelProp } from '@/api/live'
import { Modal, Input, Button } from 'antd'
import { Local } from '../../common'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'
import useContextReducer from '../../state/useContextReducer.js'
import LoginBase from '../../components/header/login/index'
import RightBar from './components/rightBar'
import LiveItem from './components/item'
import './list.scss'

export default () => {
    const history = useNavigate()
    const { t } = useTranslation()
    const [type, setType] = useState(1)
    const [rooms, setRoom] = useState([])
    const { fetchUtils, state: { liveTag, user, live: { liveData } }, dispatch } = useContextReducer.useContextReducer()
    const [tags, setTags] = useState(liveData)
    const [tagsLoading, setTagsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [url, setUrl] = useState('')
    const [Password, setPassword] = useState('')
    const [loginVisible, setLoginVisible] = useState(false)
    const { freshUser, updateLiveTagRooms } = fetchUtils
    const liveList = useMemo(() => {
        if (liveData.listDataVos != undefined && liveData.listDataVos[0] != undefined) {
            let listDataVosD = [];
            if (liveData.tagListVOS[type].liveIds != undefined && liveData.tagListVOS[type].liveIds[0] != undefined) {
                liveData.tagListVOS[type].liveIds.forEach((value) => {
                    liveData.listDataVos.forEach((value_2) => {
                        if (value == value_2.liveId) {
                            listDataVosD = [...listDataVosD, value_2];
                        }
                    });
                });
            }
            return listDataVosD;
        } else return [];
    }, [liveData, type]);

    // 密码房间跳转
    const setSearch = (item) => {
        console.log('item-----------------', item);

        const token = Local('token2')
        if (!token) return setLoginVisible(true)
        // 进房前将基础信息存储起来
        dispatch({ type: "live/SetLiveDetail", payload: item.storeDetail });
        let passUrl = `/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.roomPrice}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&isAutoLive=${item.isAutoLive}`;
        let url = `/live/detail?avatar=${item.avatar}&liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&manage=${user.manage}&price=${item.roomPrice}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}`


        history(url, { state: { liveId: item.liveId } })
        // // 如果是超管则不需要提示密码
        // if (item.type != 3 || user.manage === 1) {
        //     history(url, { state: { liveId: item.liveId } })
        // } else {
        //     setVisible(true)
        //     setUrl(passUrl)
        // }
    }
    const onChange = (type) => {
        setType(type)
    }
    const toApp = () => {
        window.open('https://jump.bjjyht.com.cn/app/4/i75ia2')
        setVisible(false)
    }
    const toRoom = () => {
        let link = `${url}&password=${Password}`
        history(link)
    }

    useEffect(() => {
        if (type) {
            const list = []
            liveList.forEach(detail => {
                detail.liveListRoomBaseVO.liveStartLottery = detail.liveListRoomLotterys || []
                const realDetail = {
                    ...detail.liveListRoomBaseVO,
                    ...detail.liveListAnchorInfoVO,
                    storeDetail: detail
                }
                list.push(realDetail)
            })
            setRoom(list)
        }
    }, [type, liveList])

    const SuspenseContent = (key) => {
        return (
            <div key={key} className='live-list-box-a2 live-list-box-a'>
                <div className='live-item'>
                    <div className='top-info'>
                        <div className="logo">
                            <Skeleton.Image active="true" className='logo-img' />
                        </div>
                    </div>
                    <div className='bottom-info flex f-a-c f-j-sb'>
                        <Skeleton.Input active="true" style={{ height: 20 }} />
                    </div>
                </div>
            </div>
        )
    }

    const getTagList = async (liveData) => {
        setTagsLoading(true)
        if (liveData.listDataVos.length) {
            setTags(liveTag)
        } else {
            const res = await liveListV2({ uid: Local("userInfo2")?.uid || "", type: 0 });
            if (!(res instanceof Error)) {
                if (res) {
                    const tagList = res?.tagListVOS || []
                    const listData = res?.listDataVos || []
                    tagList.map(item => {
                        item.liveDetails = []
                        item.liveIds.map(liveId => {
                            listData.forEach(detail => {
                                if (liveId === detail.liveId) {
                                    item.liveDetails.push(detail)
                                }
                            })
                        })
                    })
                    updateLiveTagRooms(tagList);
                    // setTags(tagList)
                    dispatch(() => {
                        return {
                            type: "live/SetLiveData",
                            payload: res,
                        };
                    });
                }
            }
        }
        setTagsLoading(false)
    }
    useEffect(() => {
        levelProp() //等级svga
        return () => {
            window.eventBus.emit('checkTolive', false)
        }
    }, [])
    useEffect(() => {
        window.eventBus.emit('checkTolive', true)
        // getTagList(liveTag)

        getTagList(liveData)
    }, [])

    useEffect(() => {
        // webSocketF();
        // window.eventBus.addListener("webSocketS", webSocketS);
        // return () => {
        //     window.eventBus.removeListener("webSocketS", webSocketS);
        // };
    }, []);

    return <div className='live-container'>
        <div className='w1200'>
            <div className={'live-list-box ' + (loading && 'loading')}>
                <div className={`tab-box ${tagsLoading && 'loading'}`}>
                    <div className='live-name'>{t('live')}</div>
                    {liveData.tagListVOS != undefined &&
                        liveData.tagListVOS.map((item, index) => (
                            <div key={index} onClick={() => onChange(index)} className={'tab-btn ' + (type == index && 'active')}>
                                {item.tagName}
                            </div>
                        ))}
                </div>
                <div className='live-group'>
                    {loading ? Array(8)
                        .fill('').map((item, index) => SuspenseContent(index)) :
                        rooms.map((item, index) => {
                            return <div key={item.anchorId.toString() + '-type-2'} className='live-list-box-a' onClick={() => setSearch(item)}>
                                <LiveItem info={item} />
                            </div>
                        })}
                </div>
                {!rooms.length && !loading ? <Empty style={{ margin: '150px auto' }} description={t('noData')} /> : ''}
            </div>
        </div>
        <Modal onCancel={() => setVisible(false)} title={t('ui_prompt')}
            footer={[<Button key="cansol" onClick={toApp}>{t('f_ui_download_theapp')}</Button>,
            <Button key="sure" type="primary" onClick={toRoom}>{t('enterRoom')}</Button>]}
            className='small-alert' visible={visible} width={380}>
            <Input.Password value={Password} onChange={(e) => { setPassword(e.target.value) }} placeholder={t('login__passwordPlaceholder')} style={{ marginBottom: 20 }} />
        </Modal>
        {/* 快捷登录 */}
        <Modal centered="true" destroyOnClose="true" width={380} className="login-modal" onCancel={() => { setLoginVisible(false) }}
            visible={loginVisible} footer={null}>
            <LoginBase type={0} FreshUser={freshUser} onOk={() => setLoginVisible(false)} />
        </Modal>
        <RightBar t={t} />
        {/* <Footer /> */}
    </div>
}