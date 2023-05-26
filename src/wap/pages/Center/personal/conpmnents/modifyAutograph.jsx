import React, { useEffect, useState } from 'react';
import { NavBar, TextArea } from 'antd-mobile';
import style from './index.module.scss'
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { info } from '../../../../server/Personal'
const ModifyAutograph = () => {
    const { t } = useTranslation()
    const history = useNavigate()
    const { state } = useLocation()
    const [center, centerSet] = useState('')

    useEffect(() => {
        console.log('这是什么数据', state);
        centerSet(state.signature)
    }, []);
    // 保存
    const preservation = () => {
        infoD({ signature: center })
    }

    // 修改
    const infoD = async (data = {}) => {
        const res = await info({ ...data })
        if (!(res instanceof Error)) {
            console.log('12323', res);
            history(-1)
        }
    }
    return (
        <div>
            <NavBar
                backArrow={<img src={require('../../../../assets/image/kf/left.png')} style={{ width: '18px', height: '18px' }} />}
                onBack={() => history(-1)}
                className={style.wbg}
                right={<div className={style.right_font} onClick={() => preservation()}>
                    {t('baocun')}
                </div>}
            >{t('gexingqianm')}</NavBar>
            <div className={style.center}>
                <div className={style.center_title}>{t('jiesaoyixiazijiba')}</div>
                <div className={style.center_title2}>{t('youqudeqianminghuijidaditishengnidemeili')}</div>
                <TextArea className={style.assembly} placeholder={t('shuruyiduanhuagengduorongyidedaohudongo')} value={center} onChange={centerSet} />


            </div>

        </div>
    );
}
export default ModifyAutograph;
