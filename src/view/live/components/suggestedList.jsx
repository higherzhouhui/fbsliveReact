// 猜你喜欢
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { GetLiveList } from '../../../api/live'
import { Link } from 'react-router-dom';
import LiveItem from '../components/item'
import './style/suggestedList.scss'
export default (props) => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [list, setLisst] = useState([])
    // 获取猜你喜欢数据
    const getSuggestedlist = async () => {
        try {
            setLoading(true)
            const rt = await GetLiveList({ type: 0 })
            if (!(rt instanceof Error)) {
                let tempArray = rt.filter(v => {
                    return v.anchorId != props.anchorId
                })
                setLisst([...tempArray] || [])
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        // getSuggestedlist();
    }, [])
    return list.length >= 2 && <div className={`suggestedContainer ${loading && 'loading'}`}>
        <div className="title">{t('live_love')}</div>
        <div className="live-group black"> {
            list.map((item, index) => (
                <Link
                    key={index}
                    target="_blank"
                    to={`/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.price}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}`}
                >
                    <LiveItem info={item} />
                </Link>
            ))
        }
        </div>
    </div>
}