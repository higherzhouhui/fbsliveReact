import { useLocation, useNavigate } from "react-router-dom";
import { NavBar, Image, List } from "antd-mobile";
import style from './detail.module.scss'
import { t } from "i18next";
import { freeTime } from "../../../util/tool";
import { Local } from "../../../../common";
import React from "react";

export default function GameRecordDetail() {
    const history = useNavigate()
    const { state } = useLocation()
    const win = state.awardStatus == 2

    return <div className={style.gbg}>
        <NavBar className={`${style.navbar} ${style.wbg}`} onBack={() => history(-1)}></NavBar>
        <div className={style.content}>
            <div className={style.money}>{state.playNumReq.awardMount}</div>
            <div className={style.tips}>{t('rp_win_amount')}</div>
            <div className={style.date}>{freeTime(state.createTime, 'y-m-d h:i')}</div>
            <Image className={style.img} src={require(`../../../assets/image/fb/${Local('lang') || 'vie'}/${state.awardStatus == 2 ? 'win' : 'lose'}.png`)} width={80} height={80} fit='cover' />
            <List className={style.list} style={{
                '--font-size': '14px',
                '--padding-left': '16px',
                '--padding-right': '16px',
                '--border-top': 'none',
                '--border-bottom': 'none',
                '--prefix': 'red'
            }}>
                <List.Item extra={state.nickName} arrow={false} >
                    <span className={style.item}>{t('czmc')}</span>
                </List.Item>
                <List.Item extra={state.expect} arrow={false}>
                    <span className={style.item}>{t('issues')}</span>
                </List.Item>
                <List.Item extra={state.betAmount} arrow={false}>
                    <span className={style.item}>{t('rp_bet_amount')}</span>
                </List.Item>
                <List.Item extra={state.times} arrow={false}>
                    <span className={style.item}>{t('beishu')}</span>
                </List.Item>
                <List.Item extra={state.playNumReq.num} arrow={false}>
                    <span className={style.item}>{t('xzxq')}</span>
                </List.Item>
                <List.Item extra={freeTime(state.createTime, 'y-m-d h:i')} arrow={false}>
                    <span className={style.item}>{t('xzsj')}</span>
                </List.Item>
                {/* <List.Item extra={'鱼虾蟹'} arrow={false}>
                    <span className={style.item}>{t('jieshu')}</span>
                </List.Item> */}
                <List.Item extra={`${win ? t('win') : t('lose')}(${win ? t('bet_status_id.2') : t('bet_status_id.3')})`} arrow={false}>
                    <span className={style.item}>{t('ui_status')}</span>
                </List.Item>
                <List.Item extra={state.payMethd == 1 ? t('zidongpaijiang') : t('sys_receive')} arrow={false}>
                    <span className={style.item}>{t('pjfs')}</span>
                </List.Item>
                <List.Item extra={freeTime(state.updateTime, 'y-m-d h:i')} arrow={false}>
                    <span className={style.item}>{t('ui_time_amount')}</span>
                </List.Item>
            </List>
        </div>
    </div>
}

