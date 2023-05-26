import { Popup, Mask, Button } from 'antd-mobile';
import React from 'react';
import { useState } from 'react';
import style from './index.module.scss'
import { t } from "i18next";
const Index = (props) => {
    const { type, money, visible, visibleSet, but2 } = props
    const datas = [
        {
            name: t('gongxininchenggonglingqu'), but2: t('qukankan')
        },
        {
            name: t('quedingyaoshanchugaixiaoxima'), but2: t('delete')
        },
        {
            name: t('jingbiyuebuzhuqingchongzhi'), but2: t('ui_dep')
        },
        {
            name: t('wuwangluolianjieqingjianchashifoulianjiedao'), but2: t('btn_set')
        },
        {
            name: t('nindzhanghaoweibangding'), but2: t('bangding')
        },
    ]
    return (
        // visible
        <Mask visible={visible} style={{ "--z-index": "3000" }} onMaskClick={() => visibleSet()}>
            <div className={style.content}>
                <div className={style.title}>
                    <div className={style.disp}>
                        {type == 0 && <p className={style.top}><img src={require('../../wap/assets/image/center/icon-gold.png')} alt="" />{money || 0}</p>}
                        <p>{datas[type].name}</p>
                    </div>
                </div>
                <div className={style.buts}>
                    <Button className={`${style.but} ${style.borderRight}`} onClick={() => visibleSet()}>{t('btn_cancel')}</Button>
                    <Button className={style.but} onClick={() => but2()}>{datas[type].but2}</Button>
                </div>
            </div>
        </Mask>
    );
}

export default Index;
