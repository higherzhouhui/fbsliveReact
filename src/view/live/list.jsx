import React, { useEffect, useState } from 'react';
import { Skeleton, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { GetLiveList, GetLiveTag } from '../../api/live'
import { Modal, Input, Button } from 'antd'
import { Local } from '../../common'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'
import { webSocket } from "../../wap/util/websockets";
import useContextReducer from '../../state/useContextReducer.js'
import LoginBase from '../../components/header/login/index'
import RightBar from './components/rightBar'
import Footer from '../../components/footer/index'
import LiveItem from './components/item'
import './list.scss'

export default () => {
    const history = useNavigate()
    const { t } = useTranslation()
    const [type, setType] = useState(1)
    const [rooms, setRoom] = useState([])
    const [tags, setTags] = useState([{ type: 1 }, { type: 2 }, { type: 3 }, { type: 4 }, { type: 5 }])
    const [tagsLoading, setTagsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [url, setUrl] = useState('')
    const [Password, setPassword] = useState('')
    const [loginVisible, setLoginVisible] = useState(false)
    const { fetchUtils } = useContextReducer.useContextReducer()
    const { freshUser } = fetchUtils

    // 密码房间跳转
    const setSearch = (item) => {
        const token = Local('token2')
        if (!token) return setLoginVisible(true)
        let passUrl = `/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.price}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&isAutoLive=${item.isAutoLive}`;
        let url = `/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.price}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}`
        if (item.type != 3) {
            history(url)
        } else {
            setVisible(true)
            setUrl(passUrl)
        }
    }
    const onChange = (type) => {
        setType(type)
        getLiveList(type)
    }
    const getLiveList = (type) => {
        setLoading(true)
        // GetLiveList({ type })
        //     .then(rt => {
        //         rt ? setRoom(rt) : []
        //         setLoading(false)
        //     });
    }
    const toApp = () => {
        window.open('https://jump.bjjyht.com.cn/app/4/i75ia2')
        setVisible(false)
    }
    const toRoom = () => {
        let link = `${url}&password=${Password}`
        history(link)
    }
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
    const getTagList = async () => {
        setTagsLoading(true)
        let tags = await GetLiveTag();
        tags.forEach(item => {
            item.type = String(item.type);
        })
        setTagsLoading(false)
        setTags(tags)
    }
    const webSocketF = () => {
        webSocket({ type: 'pc' })
            .then((item) => {
                console.log("webSocketFItemsss", item);
            })
            .catch((err) => {
                console.log("cuowu", err);
            });
    };
    useEffect(() => {
        return () => {
            window.eventBus.emit('checkTolive', false)
        }
    }, [])
    // 刷新list
    const webSocketS = async () => {
        getLiveList(type)
    };
    useEffect(() => {
        window.eventBus.emit('checkTolive', true)
        getLiveList(type)
        getTagList()
    }, [])

    useEffect(() => {
        webSocketF();
        window.eventBus.addListener("webSocketS", webSocketS);
        return () => {
            window.eventBus.removeListener("webSocketS", webSocketS);
        };
    }, []);

    return <div className='live-container'>
        <div className='w1200'>
            <div className={'live-list-box ' + (loading && 'loading')}>
                <div className={`tab-box ${tagsLoading && 'loading'}`}>
                    <div className='live-name'>{t('live')}</div>
                    {tags.map((item, index) => (
                        <div key={index} onClick={() => onChange(item.type)} className={'tab-btn ' + (type == item.type && 'active')}>
                            {item.name}
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