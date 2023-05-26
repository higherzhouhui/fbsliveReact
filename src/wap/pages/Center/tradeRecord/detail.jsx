import { useLocation, useNavigate } from "react-router-dom";
import { NavBar, Image, List } from "antd-mobile";
import style from './detail.module.scss'
import successImg from '../../../assets/image/center/success.png'
import { FreeTime } from "../../../../common";
import { useCopy } from "../../../../utils/copy";
import { useTranslation } from "react-i18next";
import React from "react";

export default function TradeRecordDetail() {
    const { t } = useTranslation()
    const history = useNavigate()
    const { state } = useLocation()
    const copy = useCopy()

    return <div className={style.gbg}>
        <NavBar onBack={() => history(-1)} className={style.wbg}></NavBar>
        <div className={style.successLogo}>
            <Image

                src={successImg}
                width={100}
                height={100}
                fit='cover'
                style={{ borderRadius: 100 }}
            />
        </div>
        <div className={style.money}>{state.goldCoin}</div>
        <div className={style.tips}>{t('reportDetail3')}</div>
        <div className={style.date}>{FreeTime(state.gmtCreate, 'y-m-d h:i')}</div>
        <List className={`${style.list} tradeDetailList`} style={{
            '--font-size': '14px',
            '--padding-left': '16px',
            '--padding-right': '16px',
            '--border-top': 'none',
            '--border-bottom': 'none',
            '--prefix': 'red'
        }}>
            <List.Item extra={state.name} arrow={false} >
                <span className={style.item}>{t('reportDetail1')}</span>
            </List.Item>
            <List.Item extra={t('reportDetail3')} arrow={false}>
                <span className={style.item}>{t('reportDetail2')}</span>
            </List.Item>
            <List.Item extra={<div className={style.orderNo} onClick={() => copy(state.trn)}>
                <div className={style.onum}>{state.trn}</div>
                <img src={require('../../../assets/image/live/icon-copy.png')} /></div>} arrow={false} onClick={() => copy(state.trn)}>
                <span className={style.item}>{t('rp_order')}</span>
            </List.Item>
        </List>
        <div className={style.kefu}>
            {t('reportDetail5')}
        </div>
    </div>
}

