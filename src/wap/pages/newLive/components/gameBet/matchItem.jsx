import { Image, NoticeBar } from "antd-mobile";
import React, { useEffect, useMemo, useState } from "react";
import { collectBet } from "../../../../server/fbBet";
import { freeTime } from "../../../../util/tool";
import style from '../common.module.scss'

export default function MatchItem(props) {
    const { match, active, collect, changeCollect } = props
    const isCollect = useMemo(() => collect.includes(match.id))
    // 收藏
    const handleCollect = async (e) => {
        e.stopPropagation()
        let params = {
            matchId: match.id,
            type: Number(!isCollect)
        }
        const res = await collectBet(params)
        if (!(res instanceof Error)) {
            changeCollect(match.id)
        }
    }
    return <div className={`${style.match} ${active ? style.active : ""}`} onClick={props.handleClick}>
        <div className={style.home}>
            <Image src={match.ts[0].lurl} className={style.logo} />
            <NoticeBar
                style={{
                    '--background-color': 'transparent',
                    '--border-color': 'transparent',
                    '--font-size': '12px',
                    'padding': '0',
                    'height': '24px',
                    'width': '100%',
                    'color': 'rgba(255, 255, 255, .5)',
                }} icon={''} content={match.ts[0].na}
            />

        </div>
        {/* <span className={style.center}>VS</span> */}
        <img className={style.center_img} src={require('../../../../assets/image/live/lottery/vsicon.png')} alt="" />
        <div className={style.away}>
            <Image src={match.ts[1].lurl} className={style.logo} />
            <NoticeBar style={{
                '--background-color': 'transparent',
                '--border-color': 'transparent',
                '--font-size': '12px',
                'padding': '0',
                'height': '24px',
                'width': '100%',
                'color': 'rgba(255, 255, 255, .5)',
            }} icon={''} content={match.ts[1].na}
            />
        </div>
        <div className={`${style.timeBg} ${!active ? style.timeBg2 : ""}`}>
            <img src={isCollect ? require('../../../../assets/image/live/fb-collect-active.png') : require('../../../../assets/image/live/fb-collect.png')} alt="" className={style.collet} onClick={handleCollect} />
            <div className={style.time}>{freeTime(match.bt, 'm-d h:i')}</div>
        </div>


    </div>
}