import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { Local } from '../../common'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg';
import useContextReducer from '../../state/useContextReducer.js'
import './userInfo.scss'

export default () => {
    const history = useNavigate()
    const { t } = useTranslation()
    const { fetchUtils } = useContextReducer.useContextReducer()
    const { loutOut } = fetchUtils
    const itemLink = [
        { index: 0, click: 'deposit', name: 'btn_dep', icon: "ck", },
        { index: 1, click: 'withdraw', name: 'user_qk', icon: 'qk', },
        { index: 2, click: 'info', name: 'user_info_grzl', icon: 'grzl', },
        { index: 3, click: 'tzRecord', name: 'ui_report_betting_v2', icon: 'tzjl', },
        { index: 4, click: 'invite', name: 'ui_recommended_back', icon: 'yqhy', },
        // { index: 5, click: 'message', name: 'ui_message_center', icon: 'xxzx', },
        { index: 6, click: 'logout', name: 'f_sign_out', },
    ]
    const [activeIndex, setActiveIndex] = useState(0)
    const onItemClick = (item, index) => {
        setActiveIndex(index)
        switch (item.click) {
            case 'logout': {
                loutOut()
                history('/')
                message.success({
                    content: `${t('f_sign_out')}${t('ui_success')}`,
                    duration: .5
                })
                break
            }
            case "tzRecord":
                history(`/user/record`, { state: { methodType: 20000 } })
                break;
            default:
                history(`user/${item.click}`)
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
    return <div className='group-user'>
        {itemLink.map((item, index) => {
            return <div key={index}
                onClick={() => onItemClick(item, index)}
            >
                <div className='item-content'>
                    {index + 1 != itemLink.length ?
                        <div className={[activeIndex == index ? 'active' : '', 'link-item'].join(' ')}>
                            <ReactSVG className="link-img" src={require(`../../assets/images/svg/${item.icon}.svg`)} ></ReactSVG>
                            <span className='link-name'>{t(item.name)}</span>
                        </div>
                        :
                        <Button className='login-out'>{t('f_sign_out')}</Button>}
                </div >
            </div>
        })}
    </div >
}
