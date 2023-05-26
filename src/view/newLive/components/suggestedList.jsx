// 猜你喜欢
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LiveItem from '../components/item'
import './style/suggestedList.scss'
import useContextReducer from '../../../state/useContextReducer';
export default (props) => {
    const history = useNavigate()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [list, setLisst] = useState([])
    const { state: { user, liveTag, live: { liveData } }, fetchUtils, dispatch } = useContextReducer.useContextReducer()

    // 获取猜你喜欢数据
    const getSuggestedlist = async () => {
        let listDataVos = liveData.listDataVos || []
        let lists = []
        listDataVos.forEach(detail => {
            detail.liveListRoomBaseVO.liveStartLottery = detail.liveListRoomLotterys || []
            const realDetail = {
                ...detail.liveListRoomBaseVO,
                ...detail.liveListAnchorInfoVO,
                storeDetail: detail
            }
            lists.push(realDetail)
        })
        lists = lists.filter(v => {
            return v.anchorId != props.anchorId
        })
        setLisst([...lists] || [])
    }
    // window.location.reload()
    useEffect(() => {
        getSuggestedlist();
    }, [liveTag, liveData])
    return list.length >= 2 && <div className={`suggestedContainer ${loading && 'loading'}`}>
        <div className="title">{t('live_love')}</div>
        <div className="live-group black"> {
            list.map((item, index) => (
                // <Link
                //     key={index}
                //     target="_blank"
                //     to={`/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.price}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}`}
                // >
                //     <LiveItem info={item} />
                // </Link>
                <div
                    key={index}
                    onClick={() => {
                        dispatch({ type: "live/SetLiveDetail", payload: item.storeDetail });
                        history(`/live/detail?avatar=${item.avatar}&liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&manage=${user.manage}&price=${item.roomPrice}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}`, { state: { liveId: item.liveId } })
                        window.location.reload()
                    }}
                // target="_blank"
                // to={`/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.price}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}`}
                >
                    <LiveItem info={item} />
                </div>
            ))
        }
        </div>
    </div>
}