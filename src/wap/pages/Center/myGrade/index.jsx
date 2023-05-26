import { Toast, Skeleton, Avatar, ProgressBar, Slider } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { GetGiftList, propCar, setShowCar } from "../../../server/live";
import { CNavBar, CEmpty } from '../../../components'
import { GetUserExperienceInfo } from "../../../server/live";
import moment from 'moment'
import useContextReducer from "../../../state/useContextReducer";
import { Local } from "../../../../common";


// const PointOut = React.lazy(() => import('../../../components/pointOut/index'))

const Index = () => {
    const {
        state: { user },
        fetchUtils,
    } = useContextReducer.useContextReducer();
    const { freshUser, loutOut } = fetchUtils;
    const { state } = useLocation()

    const [tabI, tabISet] = useState(1)
    const [experienceInfo, setExperienceInfo] = useState(0)
    const [Sliders, SlidersSet] = useState(1)
    const [icons, iconsSet] = useState([1, 2, 3])

    const history = useNavigate()
    useEffect(() => {
        tabISet(state)
    }, [])

    useEffect(() => {
        console.log('用户等级', user?.userLevel, '主播等级', user?.anchorLevel);
        let i = tabI == 1 ? (user?.userLevel == null || user?.userLevel == undefined || user?.userLevel == 0 || user?.userLevel == 1 ? 0 : 1) : ((user?.anchorLevel == null || user?.anchorLevel == undefined || user?.anchorLevel == 0 || user?.anchorLevel == 1 ? 0 : 1))
        console.log('--------------i', state, i);
        if (tabI == 1) {
            i == 0 ? iconsSet([1, 2, 3]) : user?.userLevel == 105 ? iconsSet([103, 104, 105]) : iconsSet([Number(user?.userLevel) - 1, Number(user?.userLevel), Number(user?.userLevel) + 1,])
        } else {
            i == 0 ? iconsSet([1, 2, 3]) : user?.userLevel == 105 ? iconsSet([103, 104, 105]) : iconsSet([Number(user?.anchorLevel) - 1, Number(user?.anchorLevel), Number(user?.anchorLevel) + 1,])
        }
        SlidersSet(i)
        getUserExperienceInfo()
    }, [tabI])

    // 获取用户等级信息
    const getUserExperienceInfo = async () => {
        // type==1主播经验
        const res = await GetUserExperienceInfo({ type: tabI == 1 ? 2 : 1, uid: Local('userInfo')?.uid })
        if (!(res instanceof Error)) {
            console.log('--------', res, 'user?.anchorExp', user?.anchorExp);
            let data = res || {}
            data.userExps = tabI == 1 ? (Number(data?.exp) - Number(user?.userExp)) : (Number(data?.exp) - Number(user?.anchorExp))
            data.Percentage = tabI == 1 ? (Number(user?.userExp) / Number(data?.exp) * 100) : (Number(user?.anchorExp) / Number(data?.exp) * 100)
            setExperienceInfo(data)
        }
    }

    return <div>
        <CNavBar title={t('wodedengji')} left={true} />
        <div className={style.tab_title}>
            <div className={style.tab_div} onClick={() => { tabISet(1) }}>
                {t('yonghudengji')}
                {tabI == 1 ? <img src={require('../../../assets/image/newImg/myGrade/bottom.png')} alt="" /> : <div></div>}
            </div>
            <div className={style.tab_div} onClick={() => { tabISet(2) }}>
                {t('zhubodengji')}
                {tabI == 2 ? <img src={require('../../../assets/image/newImg/myGrade/bottom.png')} alt="" /> : <div> </div>}
            </div>
        </div>
        {/* 内容 */}
        <div className={style.container}>
            <div className={style.content}>
                {/* title */}
                <div className={style.titles}>
                    {/* 头像 */}
                    <div className={style.Avatars}>
                        <Avatar src={user?.avatar} style={{ "--border-radius": "100%", border: '3px solid #fff', width: "50px", height: "50px" }} fallback={<img src={require("../../../assets/image/join/logo.png")} />} />
                        <div>{user?.nickname}</div>
                    </div>
                    {/* 进度条 */}
                    <div className={style.progressBar}>
                        {/* <ProgressBar percent={15} /> */}

                        <div className={style.icons}>
                            {/* icons  imgs.png */}
                            {icons.map((item, index) => <div className={style.imgs} key={index}>
                                {/* (user?.userLevel != 105 || user?.anchorLevel != 105) && */}
                                <img className={Sliders == 0 && (index == 1 || index == 2) ? style.imgh : (user?.userLevel == 105 || user?.anchorLevel == 105) ? '' : index == 2 ? style.imgh : ''} src={require(`../../../assets/image/live/level_${item}.png`)} alt="" />
                            </div>)}
                        </div>
                        {/* <Slider style={{ padding: '0px 0px' }} value={Sliders} className='myGrade_Slider' max={2} icon={<img src={require('../../../assets/image/newImg/myGrade/yuan.png')} alt="" className={style.Slider_img} />} /> */}
                        <div className={style.ProgressBbar_s} >
                            <div className={style.ProgressBbar_s2} style={{ width: `${experienceInfo?.Percentage}%` }}>
                            </div>
                            <img src={require('../../../assets/image/newImg/myGrade/yuan.png')} alt="" style={{ left: `calc(${experienceInfo?.Percentage}% - 8px)` }} className={style.Slider_img} />
                        </div>

                        {/* <p>Thiếu xxx điểm kinh nghiệm để nâng cấp độ</p> */}
                        {/* {experienceInfo?.exp}  */}
                        {experienceInfo?.exp ? <p>{t('haichaxxjinyanshendaoxiayiji', { 1: experienceInfo?.userExps })} </p> : ''}
                    </div>
                </div>

                {/* 特权 */}
                <div className={style.privilege}>
                    <div className={style.title_font}>{t('dagnqiandengjitequan')}</div>
                    <div className={style.privilege_div}>
                        {t('dangqiandengjizanwutequan')}
                    </div>
                </div>
                {/* 提升等级 */}
                <div className={style.grade}>
                    <div className={style.title_font}>{t('tishendegnji')}</div>
                    <div className={style.grade_div}>
                        <div className={style.grade_left}>
                            <img src={require('../../../assets/image/newImg/myGrade/lw.png')} alt="" />
                            <div className={style.characters}>
                                <p>{t('geizhubodashangsongli')}</p>
                                <p className={style.experience}>10xu=100{t('jinyanzhi')}</p>
                            </div>
                        </div>
                        <div className={style.but} onClick={() => history('/live')}>
                            {t('quwancheng')}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* <PointOut type={0} visible={visible} visibleSet={() => visibleSet(false)} but2={() => { console.log(111); }} /> */}
    </div>
}

export default Index;
