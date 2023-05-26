import React, { useCallback, useEffect, useState } from 'react';
import style from './index.module.scss'
import { Button, Image, Input, NavBar, Toast, Tabs, Empty } from "antd-mobile";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { WthdrawList } from '../../../server/deposit'
import { CEmpty } from '../../../components'

const WithdrawalRecord = () => {
    const history = useNavigate()
    const [list, listSet] = useState([])

    // 当前选中tab索引
    const [tabsDIndex, tabsDIndexSet] = useState(3)
    const [tabsD, tabsDSet] = useState(
        [{ id: 3, title: t('ui_all'), x: true },
        { id: 1, title: t('sys_check_pass'), x: false },
        { id: 0, title: t('shenhezhong'), x: false },
        { id: 2, title: t('bohui'), x: false },
        ]
    )
    useEffect(() => {
        WthdrawLists()
        listSet([])
    }, [tabsDIndex])
    // 切换
    const clicks = (e) => {
        let data = [...tabsD]
        data.forEach((value, index, array) => {
            if (value.id == e.id) {
                value.x = true
                tabsDIndexSet(value.id)
            } else {
                value.x = false
            }
        })
        tabsDSet(data)

        // 父级标签
        const element = document.getElementById('tabBig')
        //可视屏幕宽度
        let clientWidth = document.querySelector('body').offsetWidth;
        //可视屏幕中心点（减去的30是列表两边的15像素的留白）
        let center = (clientWidth + 39) / 2;
        const element2 = document.getElementById(`anchor-${e.id}`)
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
    // list数据
    const WthdrawLists = () => {
        WthdrawList({ page: 0, withdrawType: 1 }).then((item) => {
            let datas = [...item]
            datas.forEach((value, index) => {
                value.cardNo2 = `${value.cardNo.substring(0, 3)}****${value.cardNo.substring((value.cardNo.length - 4))}`
            })
            // console.log('ddddd', datas);


            console.log(item);
            // 过滤数据
            if (tabsDIndex !== 3) {
                let data = datas.filter((value, i, array) => {
                    return value.status == tabsDIndex
                })
                // console.log('过滤数据', data);
                listSet(data)
            }
            // 全部
            if (tabsDIndex == 3) {
                listSet(datas)
            }
        })
    }

    const dateToSrting = (da) => {
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
            str = `${h}:${min}:${s}  ${d}-${m}-${y}`;
        }
        return str;
    }
    return (
        <div>

            <NavBar
                back={null}
                left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
                onBack={() => history(-1)} className={style.wbg}
            // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
            >
                <div style={{ fontSize: '18px', color: '#1e1b27', fontWeight: '500' }}>
                    {t('rebate14')}
                </div>
            </NavBar>
            <div style={{ paddingTop: '8px' }}>
                {/* 顶部tab */}
                <div className={style.tabs} style={{ marginBottom: '20px' }} id={'tabBig'}>
                    {tabsD.map((item, index) => {
                        return (
                            <div key={item.id} id={`anchor-${item.id}`} className={`${style.tabs_demo1} ${item.x ? style.tabs_demo2 : ""}`} onClick={() => clicks(item)}>{item.title}</div>
                        )
                    })}
                </div>
                {/* 内容 */}
                <div className={style.centers}>
                    {
                        list[0] !== undefined ? list.map((item, index) => {
                            return (
                                <div key={index} className={style.single}>
                                    <div className={style.single_left}>
                                        <div>{item?.cardNo2}</div>
                                        <div className={style.single_left2}>{dateToSrting(item?.gmtCreate)}</div>
                                    </div>
                                    <div className={style.single_left} style={{ alignItems: 'center' }}>
                                        {
                                            <div>{item?.cash}</div>
                                        }
                                        <div className={`${item?.status == 0 ? style.single_left3 : item?.status == 1 ? style.single_left2 : style.single_left4}`}>{item?.status == 0 ? t('shenhezhong') : item?.status == 1 ? t('tikuanchenggong') : t('bohui')}</div>
                                    </div>
                                </div>
                            )
                        }) :
                            <CEmpty description={t('noData')} type={0} />
                    }
                </div>
            </div>

        </div >
    );
}

export default WithdrawalRecord;
