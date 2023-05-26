import { Toast, NavBar, Popup, Avatar, Empty, Skeleton, Swiper } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getOssToken } from '../../../server/Personal'
import { feedbackSave, feedbackTypes, feedbackAll, feedbackRead } from "../../../server/opinion";
import OSS from 'ali-oss'

import style from './index.module.scss'
import { Local } from "../../../../common";

const MyFeedback = () => {
    const history = useNavigate()

    // const data = [
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     }, {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    //     {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     }, {
    //         icon: 'yx', type: '游戏问题', time: '2023-02-09', content: '怎么输赢的..............................',
    //     },
    // ]
    const [myFeedbackI, myFeedbackISet] = useState()
    const [visible1, visible1Set] = useState(false)

    const [feedbackAllD, feedbackAllDSet] = useState([])

    const [visible3, visible3Set] = useState(false)

    const [imgDatasI, imgDatasISet] = useState()

    const [loaging, loagingSet] = useState(false)


    // 复制
    const copy = (e) => {
        const textarea = document.createElement('textarea');
        textarea.setAttribute('readonly', 'readonly');
        textarea.value = e;
        document.body.appendChild(textarea);
        textarea.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            Toast.show({
                content: t('ui_successful_copy'),
                position: 'top',
                duration: 1000
            })
        }
        document.body.removeChild(textarea);
    }


    useEffect(() => {
        loagingSet(true)
        feedbackAllF()
    }, [])

    const feedbackAllF = async () => {
        const res = await feedbackAll()
        if (!(res instanceof Error)) {
            console.log('res', res);
            loagingSet(false)
            feedbackAllDSet(res)
        }
    }

    const dateToSrting = (da, i) => {
        let str = "";
        if (da != undefined) {
            let date = new Date(da.toString().length == 10 ? da * 1000 : da);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let h = date.getHours();
            let min = date.getMinutes();
            let s = date.getSeconds();
            y = y < 10 ? "0" + y : y;
            m = m < 10 ? "0" + m : m;
            d = d < 10 ? "0" + d : d;
            h = h < 10 ? "0" + h : h;
            min = min < 10 ? "0" + min : min;
            s = s < 10 ? "0" + s : s;
            i == 0 ? str = `${h}:${min}:${s} ${d}-${m}-${y}` : str = `${d}-${m}-${y}`
        }
        return str;
    }
    // 标记未读
    const feedbackReadF = (item) => {
        console.log('这是多少数据', item);
        visible1Set(true)
        if (item.status == 1) {
            feedbackRead({ id: item.id }).then((item) => {
                console.log('dasdsa', item);
                feedbackAllF()
            })
        }
    }

    return (
        <div className={style.myFeedback_body}>
            <NavBar
                back={null}
                left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
                className={style.wbg}
            // right={<div className={style.NavBar} onClick={() => history('/service')} >我的反馈</div>}
            >
                <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                    {t('wodefankui')}
                </div>
            </NavBar>
            <div className={style.myFeedback}>
                {
                    loaging ?
                        [1, 2, 3, 4, 5].map((value) => {
                            return <Skeleton key={value} animated className={style.customSkeleton2} />
                        })
                        :
                        feedbackAllD.length == 0
                            ?
                            <Empty className={style.Empty} image={<img className='emptyImg' src={require('../../../assets/image/center/xgjlnull.png')} />} description={t('noData')}></Empty>
                            :
                            feedbackAllD.map((item, index) => {
                                return <div key={index} className={style.divs} onClick={() => { myFeedbackISet(index), feedbackReadF(item) }}>
                                    <div className={style.divs_left}>
                                        {/* 红点 */}
                                        {item?.status == 1 && <div className={style.Unread}></div>}
                                        <img src={item?.icon} alt="" />
                                    </div>
                                    <div className={style.divs_content}>
                                        <div className={style.top_font}>
                                            <div>{item?.name}</div>
                                            <div className={style.top_time}>{dateToSrting(item?.createTime)}</div>
                                        </div>
                                        <div className={style.divs_content_font}>
                                            {item?.content}
                                        </div>
                                    </div>
                                </div>
                            })
                }
            </div>

            {/* 问题类型 */}
            <Popup
                visible={visible1}
                onMaskClick={() => {
                    visible1Set(false)
                }}
                position='right'
                bodyStyle={{ width: '100vw' }}
                destroyOnClose={true}
            >
                <div className={style.Popup_body3}>
                    <NavBar
                        back={null}
                        left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => visible1Set(false)} />}
                        className={style.wbg}
                    >
                        <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                            {t('fankuixiangqing')}
                        </div>
                    </NavBar>

                    <div className={style.divs} >
                        <div className={style.divs_left}>
                            {/* 红点 */}
                            {/* <div className={style.Unread}></div> */}
                            <img src={feedbackAllD[myFeedbackI]?.icon} alt="" />
                        </div>
                        <div className={style.divs_content}>
                            <div className={style.top_font}>
                                <div>{feedbackAllD[myFeedbackI]?.name}</div>
                            </div>
                            <div className={style.divs_content_font} onClick={() => { copy(feedbackAllD[myFeedbackI]?.orderNum) }}>
                                {t('rp_order')}：{feedbackAllD[myFeedbackI]?.orderNum}<img src={require('../../../assets/image/center/fk/fz.png')} alt="" />
                            </div>
                        </div>
                    </div>

                    <div className={style.Popup_body3_content}>
                        <div className={style.datas}>
                            <Avatar src={Local('userInfo')?.avatar} style={{ '--size': '30px', borderRadius: '100%', }} />
                            <div className={style.datas_right}>
                                <div className={style.datas_right_title}>
                                    {
                                        Local('userInfo')?.nickname
                                    }
                                </div>
                                <div className={style.datas_right_autograph}>
                                    {/* 怎么输赢的..................................... */}
                                    {
                                        feedbackAllD[myFeedbackI]?.content
                                    }
                                </div>
                                <div className={style.datas_right_imgs}>
                                    {
                                        feedbackAllD[myFeedbackI]?.photoAlbum != null && feedbackAllD[myFeedbackI]?.photoAlbum != undefined && feedbackAllD[myFeedbackI]?.photoAlbum.length > 0 ?
                                            feedbackAllD[myFeedbackI]?.photoAlbum.split(',').map((value, index) => {
                                                return value.length > 0 && < img key={index} src={value} alt="" onClick={() => { console.log(index), visible3Set(true), imgDatasISet(index) }} />
                                            })
                                            : ''
                                    }
                                </div>
                                <div className={style.datas_right_time}>
                                    {/* 2023-02-09 10:59:09 */}

                                    {dateToSrting(feedbackAllD[myFeedbackI]?.createTime, 0)}
                                </div>
                            </div>
                        </div>
                        {/* 客服 */}
                        {(feedbackAllD[myFeedbackI]?.replyTime != null && feedbackAllD[myFeedbackI]?.replyTime != undefined) && <div className={style.datas} style={{ marginTop: '21px' }}>
                            <Avatar src={require('../../../assets/image/center/fk/kflog.png')} style={{ '--size': '30px', borderRadius: '100%', }} />
                            <div className={style.datas_right}>
                                <div className={style.datas_right_title}>
                                    {/* fbs客服 */}
                                    {feedbackAllD[myFeedbackI]?.replyUser}
                                </div>
                                <div className={style.datas_right_fonts}>
                                    {feedbackAllD[myFeedbackI]?.replyContent}
                                </div>
                                <div className={style.datas_right_time}>
                                    {/* 2023-02-09 10:59:09 */}
                                    {dateToSrting(feedbackAllD[myFeedbackI]?.replyTime, 0)}
                                </div>
                            </div>
                        </div>}

                    </div>

                </div>
            </Popup>

            {/* 展开图片 */}
            <Popup
                visible={visible3}
                onMaskClick={() => {
                    visible3Set(false)
                    imgDatasISet()
                }}
                position='right'
                bodyStyle={{ width: '100vw' }}
                destroyOnClose={true}
            >
                <div style={{ width: '100%', height: '100vh', boxSizing: 'border-box' }}>
                    <NavBar
                        back={null}
                        left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => { visible3Set(false), imgDatasISet() }} />}
                        className={style.wbg}
                    // right={<div className={style.NavBar} onClick={() => history('/myFeedback')} >我的反馈</div>}
                    >
                        {/* <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                            {'查看图片'}
                        </div> */}
                    </NavBar>
                    {/* <div className={style.Popup_body4} style={{ height: 'calc(100vh - 45px)' }}>
                        <img src={photoAlbums} alt="" />
                    </div> */}
                    <Swiper defaultIndex={imgDatasI}>
                        {
                            feedbackAllD[myFeedbackI]?.photoAlbum != null && feedbackAllD[myFeedbackI]?.photoAlbum != undefined && feedbackAllD[myFeedbackI]?.photoAlbum.split(',').map((value, index) => {
                                return value != '' && <Swiper.Item className={style.Popup_body4} style={{ height: 'calc(100vh - 45px)' }} key={index}>
                                    <img src={value} alt="" />
                                </Swiper.Item>
                            })
                        }
                    </Swiper>
                </div>
            </Popup>
        </div>
    );
}

export default MyFeedback;
