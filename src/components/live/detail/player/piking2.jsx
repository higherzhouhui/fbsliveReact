import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Progress } from 'antd'
import { GetPkStatus } from '../../../../api/live';
import { formatSeconds } from '../../../../utils/tools'
import useContextReducer from '../../../../state/useContextReducer'
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import './piking.scss'
let defaultImg = require('../../../../assets/images/live/default_img_s.png')
let setPkTimer
const Piking2 = (props) => {
    const { t } = useTranslation();
    const history = useNavigate();
    const {
        state: {
            live: { liveDetail },
        },
        dispatch
    } = useContextReducer.useContextReducer();
    const { liveListRoomBaseVO, liveId, liveListAnchorInfoVO } = liveDetail

    const [status, statusSet] = useState(false)
    const [CF_TIME, CF_TIMESet] = useState(-1800)
    const [PK_TIME, PK_TIMESet] = useState(300)
    const [pkTime, pkTimeSet] = useState(0)
    const [pkStatus, pkStatusSet] = useState({
        listA: [],
        listB: [],
        scoreA: 0,
        scoreB: 0,
        startTime: 0
    })
    const [index, indexSet] = useState(0)
    const pkStatusRef = useRef({
        listA: [],
        listB: [],
        scoreA: 0,
        scoreB: 0,
        startTime: 0
    })

    const pkPer = () => {
        let num = pkStatusRef.current.scoreA * 100 / (pkStatusRef.current.scoreA + pkStatusRef.current.scoreB)
        return isNaN(num) ? 50 : num
    }
    // 获取数据
    const getPkStatus = () => {
        GetPkStatus({ anchorId: liveListRoomBaseVO?.anchorId }).then(res => {
            if (res) {
                console.log('res------', res);
                pkStatusSet(Object.assign({}, pkStatus, res))
                pkStatusRef.current = Object.assign({}, pkStatusRef.current, res)

                statusSet(true)
                beginPk();
            } else {
                checkPkStatus(false);
            }
        })
    }

    useEffect(() => {
        window.eventBus.addListener("UPpkStatusF", UPpkStatus);
        return () => {
            window.eventBus.removeListener("UPpkStatusF", UPpkStatus);
        }
    }, [])
    // 更新数据
    const UPpkStatus = (data) => {
        pkStatusSet(Object.assign({}, pkStatusRef.current, data))
        pkStatusRef.current = Object.assign({}, pkStatusRef.current, data)
    }

    useEffect(() => {
        if (liveListRoomBaseVO?.anchorId) {
            getPkStatus()
        }
        return () => {
            clearTimeout(setPkTimer)
        }
    }, [liveDetail, liveListRoomBaseVO?.anchorId])
    //开始pk
    const beginPk = () => {
        if (pkStatusRef.current.startTime == 0) {
            // setTimeout(() => {
            beginPk()
            // }, 200)
            return
        }
        // pkTime = PK_TIME - parseInt((new Date().getTime() - pkStatusRef.current.startTime) / 1000);

        pkTimeSet(PK_TIME - parseInt((new Date().getTime() - pkStatusRef.current.startTime) / 1000))

        if (pkTime > CF_TIME) {
            setPkTimer = setTimeout(() => {
                beginPk()
            }, 1000)
        } else {
            //pk结束，更改当前pk状态
            checkPkStatus(false);
        }
    }
    // 切换状态
    const checkPkStatus = (status) => {
        statusSet(status)
        if (!status) {
            dispatch({ type: "live/SwitchPk", payload: false });
            // let search = location.search;
            // search = search.replace('pking=true', 'pking=false')
            // history.pushState({}, '', search)
            // history({}, '', search)
            // props.close()
        }
    }

    return (
        <div className='piking-box'>
            {
                status &&
                <>
                    <div className='processing flex f-a-c'>
                        {pkTime < 0 && pkPer() != 50 ? <>
                            <img className={'s-icon ' + (pkPer() > 50 ? 'left-cf' : 'right-cf')} src={require('../../.../../../../assets/images/live/pk/win.png')} />
                            <img className={'s-icon ' + (pkPer() < 50 ? 'left-cf' : 'right-cf')} src={require('../../.../../../../assets/images/live/pk/lose.png')} />
                        </> : ''}
                        <div className='s-icon left'> {t('wofang')} {pkStatusRef.current.scoreA}</div>
                        <div className='s-icon right'>{pkStatusRef.current.scoreB}  {t('duifang')}</div>
                        <Progress className='left-align' strokeWidth={30} gapPosition="left" percent={pkPer()} />
                    </div>
                    <div className='djs-box'>
                        {
                            pkTime > 0 ? <div><img style={{ height: 12 }} src={require('../../.../../../../assets/images/live/pk/pk.png')} /> {pkTime}</div>
                                :
                                // pkPer() != 50 ?
                                <div>{t('chenfa')} {pkTime > -180 ? 180 + pkTime : 0}</div>
                            // : ''
                        }
                    </div>
                    {pkTime < 0 && pkPer() == 50 && <img style={{ height: 25 }} src={require('../../.../../../../assets/images/live/pk/he.png')} />}
                    <div className='flex head-icon-box'>
                        <div className='left-head head-icon flex'>
                            {
                                pkStatusRef.current.listA.slice(0, 3).map((item, index) => <img key={index} src={item.avatar || defaultImg} />)
                            }
                        </div>
                        <img src={require('../../../../assets/images/live/pk/pk.png')} alt="" />
                        <div className='right-head head-icon flex'>
                            {
                                pkStatusRef.current.listB.slice(0, 3).map((item, index) => <img key={index} src={item.avatar || defaultImg} />)
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default Piking2;
