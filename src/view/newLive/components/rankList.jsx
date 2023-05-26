// 直播礼物排行榜
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Empty } from 'antd';
import { rankAnchorList, liveFollow } from '../../../api/live'
import DefaultImg from '../../../assets/images/default_avatar.png'
import './style/rankList.scss'
export default (props) => {
    const { t } = useTranslation()
    let { anchorId } = props
    const [loading, setLoading] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)
    const [allList, setAllList] = useState([])
    const [dayList, setDayList] = useState([])
    let list = [dayList, allList][tabIndex];
    // 获取排行榜数据
    const getRankAnchorList = async () => {
        try {
            if (!anchorId) return
            setLoading(true)
            const rt = await rankAnchorList({ anchorId })
            if (!(rt instanceof Error)) {
                let { allList, dayList } = rt;
                setAllList(allList)
                setDayList(dayList)
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const changeFollow = async (item) => {
        try {
            const rt = await liveFollow({ isFollow: !item.isFollow, targetId: item.uid })
            if (!(rt instanceof Error)) {
                if(!rt) return
                let data = tabIndex == 0 ? dayList : allList
                let index = data.findIndex(v => { return v.uid == item.uid })
                data[index].isFollow = !item.isFollow
                tabIndex == 0 ? setDayList([...dayList]) : setDayList([...allList])
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getAnchorList = () => {
            getRankAnchorList();
        }
        getAnchorList()
        window.eventBus.addListener('freshAnchorList', getAnchorList)
        return () => window.eventBus.removeListener('freshAnchorList', getAnchorList)
    }, [])
    return <div className={`rank-list-box ${loading && 'loading'}`}>
        <div className='title'>{t('f_ui_wap_text_028')}</div>
        <div className='content'>
            <div className='content-tabs'>
                <div className={`tab ${tabIndex == 0 && 'active'}`} value={0} onClick={() => setTabIndex(0)}>{t('rb')}</div>
                <div className={`tab ${tabIndex == 1 && 'active'}`} value={1} onClick={() => setTabIndex(1)}>{t('yb')}</div>
            </div>
            {[dayList, allList][tabIndex].length ? <div className='top-rank'> {
                [dayList, allList][tabIndex].map((item, index) => (
                    <div className={'rank-user rank-user-' + index} key={index}>
                        <span className={`index ${index + 1 <= 3 && `icon-No${index + 1}`} `}>{index + 1}</span>
                        <img className='avatar' src={item.avatar || DefaultImg} alt="" />
                        <div className='nickname'>{item.nickname}</div>
                        <div className='rankValue'>{item.rankValue}</div>
                        {/* <div onClick={() => changeFollow(item)} className={`icon ${item.isFollow ? 'icon-live-love' : 'icon-live-unlove'}`}></div> */}
                    </div>
                ))}
            </div> : <Empty style={{ margin: '100px auto', color: '#fff' }} description={t('noData')} />}
        </div>
    </div>
}