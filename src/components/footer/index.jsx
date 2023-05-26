import React from 'react';
import { useTranslation } from "react-i18next";
import './index.scss'

export default () => {
    const { t } = useTranslation()
    const navList = [
        { index: 0, title: "首页" },
        { index: 1, title: "真人娱乐" },
        { index: 2, title: "体育赛事" },
        { index: 3, title: "电子竞技" },
        { index: 4, title: "棋盘游戏" },
        { index: 5, title: "捕鱼游戏" },
        { index: 6, title: "斗鸡游戏" },
        { index: 6, title: "双赢游戏" },
    ]
    const navImageList = [
        { index: 0, name: "21", title: "21+" },
        { index: 1, name: "gamcare", title: "Gamcare" },
        { index: 2, name: "PAGCOR", title: t('footer_01') },
        { index: 3, name: "sun", title: t('footer_02') },
        { index: 4, name: "iovation", title: "Lovation" },
    ]
    return <footer className="container-footer">
        <div className="img-tabs">
            {Array(7).fill('').map((e, index) => {
                return <div key={index} className={`icon-0${index} tabs-icon`}></div>
            })}
        </div>
        {/* <nav className="nav-list">
            {navList.map((item, index) => {
                return <span className="item" key={index}>{item.title}</span>
            })}
        </nav> */}
        <nav className="nav-image-list">
            {navImageList.map((item, index) => {
                return <div key={index} className='nav-image' >
                    <div className={`icon-${item.name} nav-item-icon`}></div>
                    <span className="nav-item-title">{item.title}</span>
                </div>
            })}
        </nav>
        <p className='footer-tips'>{t('footer_tips')}</p>
    </footer>
}