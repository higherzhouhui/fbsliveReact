// 直播間 頂部 組件
import React, { useState, useEffect } from 'react';
import { liveFollow, GetUserCard } from '../../../api/live'
import { getBaseInfo } from '../../../api/userInfo'
import { useTranslation } from "react-i18next";
import { Dropdown, message } from "antd";

import DefaultImg from '../../../assets/images/default_avatar.png'
import './style/topInfo.scss'
export default (props) => {
    const { t } = useTranslation()
    let { baseInfo, onGetBase } = props
    const [follow, setFollow] = useState(false)
    const [tag, setTag] = useState(false)
    const [collectLoding, setCollectLoding] = useState(false)
    // 收藏 取消收藏
    const changeFollow = async (isFollow) => {
        try {
            setCollectLoding(true)
            const rt = await liveFollow({ isFollow, targetId: baseInfo.anchorId })
            if (!(rt instanceof Error)) {
                console.log('rt---------', rt);



                onGetBase(() => { setCollectLoding(false) })
                if (true) {
                    window.eventBus.emit("topFollow");
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const shareList = [
        { index: 0, name: "whatsAPP", shareUrl: `https://api.whatsapp.com/send/?phone&app_absent=0&text=${location.href}`, },
        { index: 1, name: "facebook", shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${location.href}` },
        { index: 2, name: "messenger", shareUrl: `https://www.messenger.com/` },
        { index: 3, name: "instagram", shareUrl: `https://www.instagram.com/` },
        { index: 4, name: "telegram", shareUrl: `https://telegram.org/` },
        { index: 5, name: "zalo", shareUrl: `https://chat.zalo.me/` },
        { index: 6, name: "twitter", shareUrl: `https://www.twitter.com/share/?text=${location.href}` },
        // { index: 7, name: "other" },
    ]
    const shareDom = () => {
        return <div className='share-box-warp'>
            {shareList.map((item, index) => {
                return <div key={index} className="item" onClick={() => { onShare(item) }}>
                    <div className={`share-icon icon-share-${item.name}`}></div>
                    <div className='share-name'>{item.name}</div>
                </div>
            })}
        </div>
    }
    const onShare = (item) => {
        if (!item.shareUrl) return
        window.open(item.shareUrl, '_blank')
    }
    const chatFollow = (data) => {
        onGetBase(() => { setFollow(true), setTag(true) })
    }
    useEffect(() => {
        window.eventBus.addListener("chatFollow", chatFollow);
        return () => {
            window.eventBus.removeListener("chatFollow", chatFollow);
        };
    }, []);


    useEffect(() => {
        console.log('baseInfo--------__________________________________', baseInfo);
    }, [baseInfo])
    return <div className='container-live-top'>
        {/* 左側主播信息 */}
        <div className='container-live-top-left'>
            <img className='avatar' src={baseInfo.avatar || DefaultImg} alt="" />
            <div className='content'>
                <div className='title'> {baseInfo?.nickname} </div>
                <div className='signature'>{baseInfo?.signature || t('live_stitle')}</div>
            </div>
        </div>
        {/* 右側收藏 */}
        <div className='container-live-top-right'>
            <div className='collect-box'>
                <div className='collect-box-count collect-box-item' >{baseInfo.fans}</div>
                <div className={`collect-box-status collect-box-item ${collectLoding && 'loading'}`}
                    onClick={() => changeFollow(!baseInfo.isFollow)}
                >
                    {
                        // tag ?
                        //     follow ? t('yiguanzhu')
                        //         : `+${t('guanzhu')}` :
                        baseInfo.isFollow ? t('yiguanzhu') : `+${t('guanzhu')}`

                    }
                </div>
            </div>
            <Dropdown overlay={() => shareDom()} placement="bottomRight" arrow overlayClassName='share-dropdown'>
                <div className='share-box'>
                    <span className='icon icon-share'></span>
                    <span className='text'>{t('live_share')}</span>
                </div>
            </Dropdown>
        </div>
    </div>
}