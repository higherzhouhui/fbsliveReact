import React, { useCallback, useEffect, useState } from 'react';
import style from './index.module.scss'
import { Button, Image, Input, NavBar, Toast, Tabs } from "antd-mobile";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Statement } from '../../../server/deposit'


const FirstWithdrawal = () => {
    const history = useNavigate()
    const [balance, setBalance] = useState({})

    useEffect(() => {
        StatementS()
    }, [])
    // 获取用户流水
    const StatementS = () => {
        Statement().then((item) => {
            console.log('这是提现数据', item);
            setBalance(item)
        })
    }

    return (
        <div>
            <NavBar
                back={null}
                left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
                onBack={() => history(-1)} className={style.wbg}
                right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
            >
                <div style={{ fontSize: '18px', color: '#1e1b27', fontWeight: '500' }}>
                    {t('ui_withdraw')}
                </div>
            </NavBar>

            <div style={{ background: '#f7f7f8', height: 'calc(100vh - 60px)', paddingTop: '12px' }}>
                <div style={{ height: '253px', whiteSpace: 'nowrap', background: `url(${require('../../../assets/image/tx/titleBj.png')})`, backgroundSize: "100% 100%", padding: '16.5px 25px 0 29px', marginBottom: '8px', position: 'relative' }}>
                    {/* 金币提现 */}
                    <div className={style.FirstWithdrawal_titles}>
                        <div className={style.titles_left}>
                            <div>{t('glod')}</div>
                            <div className={style.money}>{balance.goinCoin || 0}</div>
                        </div>
                        <div className={style.titles_right}>
                            <div className={style.titles_right_1} onClick={() => history('/WithdrawalRecord')} >{t('rebate14')} <img src={require('../../../assets/image/tx/right.png')} alt="" /></div>
                            <Button className={style.titles_right_but} onClick={() => history('/deposit')} >{t('ui_withdraw')}</Button>
                        </div>
                    </div>
                    {/* 流水信息 */}
                    <div className={style.flowingWater}>
                        <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.31)' }}>{t('dangqianzonglius')}：<span>{(balance.allNowStatement || 0) * 1000}₫</span></div>
                        <div>{t('zongliushuijilu')}：<span>{(balance.allStatement || 0) * 1000}₫</span></div>
                    </div>
                    {/* 兑换信息 */}
                    <div className={style.bottoms}>
                        <div className={style.divs}>{t('dangqianduihuanbili')} 1000₫=1{t('glod')}</div>
                        <div className={style.divs}>{t('dangqianliushuidayudengyu')} {balance.needStatement * 1000}₫ {t('nincaikeytixian')}</div>
                        <div className={`${style.divs} ${style.colors}`}>{t('youhuicaijinhuodong')}：{balance.activityGoinCoin}{t('glod')}</div>
                        <div className={style.colors}>{t('youhuicaijinliushui')}：{balance.activityGoinCoinRecord}{t('glod')}</div>
                    </div>
                </div>
                {/* 提现规则 */}
                <div className={style.rule}>
                    <div className={style.titles}><img src={require('../../../assets/image/tx/xxleft.png')} alt="" /> {t('tixianguize')} <img src={require('../../../assets/image/tx/xxright.png')} alt="" /></div>
                    <div className={style.center}>
                        {/* <div>
                            1.hương trình phát sóng trực tiếp bóng đá và trò chơi giải trí
                            bóngđá để tạo ra một môi trường xã hội mới và mang lại trải
                            nghiệm đặc biệt cho người hâm mộ
                        </div>
                        <div>
                            2.hương trình phát sóng trực tiếp bóng đá và trò chơi giải trí
                            bóngđá để tạo ra một môi trường xã hội mới và mang lại trải
                            nghiệm đặc biệt cho người hâm mộ
                        </div> */}
                        <div dangerouslySetInnerHTML={{ __html: balance.withDrawContent }}>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default FirstWithdrawal;
