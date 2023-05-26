import React from "react"
import style from './index.module.scss'
import IconGame from '../../assets/image/tab/tab-game.png'
import IconGameActive from '../../assets/image/tab/tab-game-active.png'
import IconGift from '../../assets/image/tab/tab-gift.png'
import IconGiftActive from '../../assets/image/tab/tab-gift-active.png'
import IconRank from '../../assets/image/tab/tab-rank.png'
import IconRankActive from '../../assets/image/tab/tab-rank-active.png'
import IconMy from '../../assets/image/tab/tab-my.png'
import IconMyActive from '../../assets/image/tab/tab-my-active.png'
import IconLive from '../../assets/image/tab/tab-live.png'
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"



const Tab = (props) => {
    const { t } = useTranslation()
    const history = useNavigate()
    const { active } = props
    const tabs = [
        {
            key: '/game',
            title: t('rp_game'),
            icon: (item) =>
                item.key === active ? <img alt="" src={IconGameActive} className={style.tabIcon} /> : <img alt="" src={IconGame} className={style.tabIcon} />,
        },
        {
            key: '/home',
            title: t('ui_discount'),
            icon: (item) =>
                item.key === active ? <img alt="" src={IconGiftActive} className={style.tabIcon} /> : <img alt="" src={IconGift} className={style.tabIcon} />,
        },
        {
            key: '/live',
            title: t('live'),
            icon: () => <img alt="" src={IconGiftActive} className={style.tabIcon} />
        },
        {
            key: '/rankingList',
            title: t('ui_wap_text_028'),
            icon: (item) =>
                item.key === active ? <img alt="" src={IconRankActive} className={style.tabIcon} /> : <img alt="" src={IconRank} className={style.tabIcon} />,
        },
        {
            key: '/my',
            title: t('btn_main_footer'),
            icon: (item) =>
                item.key === active ? <img alt="" src={IconMyActive} className={style.tabIcon} /> : <img alt="" src={IconMy} className={style.tabIcon} />,
        },
    ]

    const changeTab = (val) => {
        history(val)
    }

    return <>
        <div className={style.tabBody}>
            {tabs.map((item, index) => {
                return item.key === '/live' ?
                    <div className={`${style.liveBox} ${active === item.key ? style.active : ''}`} key={index} onClick={() => changeTab('/live')}>
                        <div className={style.center_y}>
                        </div>
                        <img alt="" src={IconLive} />
                        {/* {t('live')} */}
                    </div> :
                    <div className={`${style.box} ${active === item.key ? style.active : ''}`} key={index} onClick={() => changeTab(item.key)}>
                        {item.icon(item)}
                        {item.title}
                    </div>
            })}
        </div>
    </>
}
export default Tab