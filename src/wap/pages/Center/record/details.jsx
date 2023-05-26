import { Button, NavBar, Popup, Skeleton, DatePickerView, Toast } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './index.module.scss'
import {
    queryAssetTypeList,
    queryUserAssetList,
    queryUserAssetCount
} from '../../../server/record'

const Details = () => {
    const { state } = useLocation()
    const { title, item } = state
    const history = useNavigate()
    useEffect(() => {
        console.log('state', state);
    }, [])

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
                content: '复制成功',
                position: 'top',
                duration: 2000
            })
        }
        document.body.removeChild(textarea);
    }


    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            background: '#F6F7FC'
        }}>
            <NavBar
                back={null}
                left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
                className={style.wbg}
            // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
            >
                <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                    {title == 10000 ? '交易记录' : title == 20000 ? '投注记录' : '消费记录'}
                </div>
            </NavBar>
            <div className={style.Details}>
                <div className={style.title}>{item?.goldCoin}₫</div>
                <div className={`${style.bottom} ${style.divs}`}>
                    <div>{title == 10000 ? '交易类型' : title == 30000 ? '项目名称' : ''}</div>
                    <div>{item?.name}</div>
                </div>
                {/* <div className={`${style.bottom} ${style.divs}`}>
                    <div>交易方式</div>
                    <div>支付宝</div>
                </div> */}
                <div className={`${style.bottom} ${style.divs}`}>
                    <div>状态</div>
                    <div>{item?.status == 1 ? <span
                        style={{
                            color: '#2997F6'
                        }}>成功</span> : <span style={{
                            color: 'red'
                        }}>失败</span>}</div>
                </div>
                <div className={`${style.bottom} ${style.divs}`}>
                    <div>交易时间</div>
                    <div>{item?.gmtAllCreate}</div>
                </div>
                <div className={` ${style.divs}`} onClick={() => { copy(item?.trn) }}>
                    <div>订单号码</div>
                    <div>{item?.trn}<img src={require('../../../assets/image/center/fzlog.png')} alt="" /></div>
                </div>
            </div>

            <div className={style.Details2} onClick={() => { history('/service') }}>
                <div>您对这个交易有疑问</div>
                <img src={require('../../../assets/image/center/kflog.png')} alt="" />
            </div>
        </div>
    );
}

export default Details;
