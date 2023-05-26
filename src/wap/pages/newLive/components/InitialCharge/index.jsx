import React, { useState, useEffect } from 'react';
import style from './index.module.scss'
import { useNavigate } from "react-router-dom";
import { Button, Mask } from 'antd-mobile'
import { giftList } from '../../../../server/live';
import { useTranslation } from "react-i18next";
const Index = (props) => {
    const { hide, open, close } = props
    const { t } = useTranslation();
    const history = useNavigate()
    const [visible, setVisible] = useState(false)
    const [tabs, tabsSet] = useState([
        { money: 100 },
        { money: 200 },
        { money: 500 },
        { money: 1000 },
        { money: 5000 },
        { money: 5000 },
        { money: 5000 },
        { money: 5000 },
        { money: 5000 },
        { money: 5000 },
        { money: 5000 },
        { money: 5000 },
    ])
    const [tabsI, tabsISet] = useState(0)
    // 贵族名称
    const names = [
        'vàng',
        'Bạch kim',
        'Kim cương',
        'Trưởng sư',
        'Vua'
    ]
    const [giftListD, giftListDSet] = useState([])


    useEffect(() => {
        if (open != undefined) {
            setVisible(open)
        }
    }, [open])

    useEffect(() => {
        if (visible) {
            giftListF()
        }
    }, [visible])
    const giftListF = async () => {
        const res = await giftList()
        if (!(res instanceof Error)) {
            if (res) {
                res.forEach((value) => {
                    if (value.gifts.length < 4) {
                        for (let index = 0; index <= 4 - value.gifts.length; index++) {
                            value.gifts.push({ t: true })
                        }
                    }
                })
            }
            giftListDSet(res || [])
        }
    }

    const tabsIF = (e) => {
        // 父级标签
        const element = document.getElementById('tabBig')
        //可视屏幕宽度
        let clientWidth = document.querySelector('body').offsetWidth;
        //可视屏幕中心点（减去的30是列表两边的15像素的留白）
        let center = (clientWidth - 60) / 2;
        const element2 = document.getElementById(`anchor-${e}`)
        //计算当前标签到最左侧的宽度
        let valLeft = element2.offsetLeft;
        //计算当前标签本身的宽度
        let valWidth = element2.clientWidth;
        //当前标签中心点到最左侧的距离
        let valCenter = valLeft + valWidth / 2;

        if (valCenter > center) {
            element.scrollTo({
                left: valCenter - center,
                behavior: 'smooth'
            });
        } else {
            element.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    }


    return (
        <>
            {
                !hide && <div className={style.InitialCharge_rk} onClick={() => { setVisible(true) }}>
                    <div className={style.fonts}>
                        Nạp tiền có quà
                        <div className={style.bunt}>
                            {t('lijichakan')}
                        </div>
                    </div>
                </div>
            }
            <Mask visible={visible} destroyOnClose onMaskClick={() => {
                close && close(false)
                setVisible(false)
            }}>
                <div className={style.InitialCharge_body}>
                    <img onClick={() => {
                        close && close(false)
                        setVisible(false)
                    }} src={require('../../../../assets/image/newImg/sc/gb.png')} alt="" className={style.close} />
                    {/* tabs  giftListD*/}
                    <div className={style.tabs2} id={'tabBig'}>
                        <div className={style.tabs} >
                            {
                                giftListD.map((value, index) => {
                                    return <div key={index} id={`anchor-${index}`} onClick={() => { tabsISet(index), tabsIF(index) }} className={`${style.tab_div} ${tabsI == index ? style.tab_div2 : ''}`}>
                                        {value?.rechargeAmount || value.money}xu
                                        {
                                            value?.tag == '热门' ?
                                                <img className={style.tj} src={require('../../../../assets/image/newImg/sc/rm.png')} alt="" /> :
                                                value?.tag == '推荐' ? <img className={style.tj} src={require('../../../../assets/image/newImg/sc/tjbj.png')} alt="" /> : ''
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className={style.tabs3}>

                    </div>

                    {/* content */}
                    <div className={style.content}>
                        {
                            giftListD[tabsI] && giftListD[tabsI].gifts?.map((value, index) => {
                                return <div key={index} className={`${style.content_div} ${value.t ? style.content_div_2 : ''}`}>
                                    <div className={style.name}>{value?.type == 4 ? t('jinyanzhi') : value?.giftName}</div>
                                    <div className={style.icon}>
                                        <img src={value?.type == 1 ? require(`../../../../assets/image/live/jw/jw${value.gid && value.gid || 1}.png`)
                                            : value?.type == 4 ? require('../../../../assets/image/newImg/sc/jy.png') : value?.giftCover} alt="" />
                                    </div>
                                    <div className={style.bottom}>{value?.giftNum}{(value?.type == 1 || value?.type == 2) ?
                                        t('tian') : value?.type == 3 ? t('ge') : value?.type == 4 ? 'EXP' : ''}</div>
                                </div>
                            })
                        }
                    </div>
                    {/* bottom */}
                    <div className={style.bottoms_position}>
                        <p><span>{t('jiazhi')}{giftListD[tabsI] && giftListD[tabsI]?.totalValue}Xu</span>（{t('mianfeisong')}）</p>
                        {/* , { state: { bizNumber: 1, bizType: 2 } } */}
                        <div className={style.buts} onClick={() => { history('/recharge', { state: { bizType: 'rechargeGift' } }) }}>
                            {t('li_ji_cz')}
                        </div>
                    </div>
                </div>
            </Mask>
        </>
    );
}

export default Index;
