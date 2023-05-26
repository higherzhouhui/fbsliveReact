import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg';

import './leftdom.scss'
export default (props) => {
    const history = useNavigate()
    const { t } = useTranslation()
    const { userInfo } = props;
    const [activeIndex, setActiveIndex] = useState(0)
    const itemLink = [
        { click: 'deposit', name: 'f_btn_dep', icon: 'ck', type: 1 },
        { click: 'transfer', name: 'user_zz', icon: 'zz', type: 1 },
        { click: 'withdraw', name: 'user_qk', icon: 'qk', type: 1 },
        { click: 'info', name: 'user_info_grzl', icon: 'grzl', type: 2 },
        { type: 2 },
        { click: 'wallet', name: 'ui_my_wallet', icon: 'wdqb', type: 2 },
        { click: 'jyRecord', name: 'user_jyjl', icon: 'jyjl', type: 2 },
        { click: 'tzRecord', name: 'f_ui_bet_record', icon: 'tzjl', type: 2 },
        { click: 'xfRecord', name: 'user_xfjl', icon: 'xfjl', type: 2 },
        { type: 2 },
        { click: 'invite', name: 'ui_recommended_back', icon: 'yqhy', type: 2 },
        // { click: 'message', name: 'ui_message_center', icon: 'xxzx', type: 2 },
        { click: 'opinion', name: 'user_yjfk', icon: 'yjfk', type: 2 },
    ]
    const onItemClick = (item, index) => {
        setActiveIndex(index)
        switch (item.click) {
            case "jyRecord":
                history(`/user/record`, { state: { methodType: 10000 } })
                break;
            case "tzRecord":
                history(`/user/record`, { state: { methodType: 20000 } })
                break;
            case "xfRecord":
                history(`/user/record`, { state: { methodType: 30000 } })
                break;
            default:
                history(`/user/${item.click}`)
                break;
        }
        window.eventBus.emit('userInfoLink', item.click);
    }
    const userInfoLinkFun = (key) => {
        let index = itemLink.findIndex((item) => {
            return item.click == key
        })
        setActiveIndex(index)
    }
    useEffect(() => {
        window.eventBus.addListener('userInfoLink', userInfoLinkFun)
    }, [])
    return userInfo && <div className='left-dom-box'>
        <img className='avatar' src={userInfo.avatar} alt="" />
        <div className='nickname'>{userInfo.nickname}</div>
        <div className='join-day'>{t('user_hy')}
        </div>
        <div className='info-box'>
            {itemLink.map((item, index) => {
                return item.type === 1 && <div key={index} onClick={() => onItemClick(item, index)} className={[activeIndex == index ? 'active' : '', 'item1'].join(' ')}>
                    <ReactSVG className="link-img" src={require(`../../../assets/images/svg/${item.icon}.svg`)} ></ReactSVG>
                    <div className='link-name'>{t(item.name)}</div>
                </div>
            })}
        </div>
        <div className='list'>
            {itemLink.map((item, index) => (
                <div key={index} onClick={() => onItemClick(item, index)} className={[activeIndex == index ? 'active' : '', 'item'].join(' ')}>
                    {item.type === 2 && <>
                        {item.icon ? <div className='pd-10'>
                            <ReactSVG className="link-img" src={require(`../../../assets/images/svg/${item.icon}.svg`)} ></ReactSVG>
                            <span className="link-name">{t(item.name)}</span>
                        </div> : <div className='line' />}
                    </>}
                </div>
            ))}
        </div>
    </div>
}