import React, { useEffect, useState } from 'react';
import style from './index.module.scss'
import { t } from "i18next";
import { getCserver } from '../../../server/user'
import { CNavBar } from '../../../components'
import { Toast } from 'antd-mobile';

const Services = () => {
    const [getCservers, getCserversSet] = useState([])
    const configCservers = () => {
        getCserver().then((res) => {
            getCserversSet(res)
        })
    }

    useEffect(() => {
        configCservers()
    }, []);

    const click = (d) => {
        if (d.type == 1) {
            copy(d.phone, 1)
        }
        if (d.type == 2) {
            if (d.url !== null && d.url !== undefined && d.url.length > 0) {
                window.open(d?.url)
            }
            if (d.url === null || d.url === undefined || d.url.length == 0) {
                copy(d.phone)
            }
        }
        if (d.type == 4) {
            copy(d.phone, 4)
        }
    }

    // 复制
    const copy = (e, i) => {
        const textarea = document.createElement('textarea');
        textarea.setAttribute('readonly', 'readonly');
        textarea.value = e;
        document.body.appendChild(textarea);
        textarea.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            Toast.show({
                content: t('ui_successful_copy'),
                position: 'center',
                // duration: 500
            })
            if (i == 1) {
                window.open('mqqwpa://im/chat?chat_type=wpa&uin=123456&version=1&src_type=web&web_src=oicqzone.com')
            }
            if (i == 4) {
                window.open('Zalo://')
            }
        }
        document.body.removeChild(textarea);
    }
    return <div>
        <div className={style.header} >
            <CNavBar title={t('customerService')} styles={{ background: 'transparent' }} left={true} />
            <div className={style.titles}>
                <div className={style.titles1}>{t('helpYou')}</div>
                <div className={style.titles2}>{t('choiceService')}</div>
            </div>
        </div>
        <div className={style.content}>
            {/* 客服 */}
            {getCservers.map((item, index) => {
                return <div className={style.box} key={`${item?.customId}_${index}`} style={{ position: 'relative', background: `url(${item?.icon})`, backgroundSize: '100% 100%' }} >
                    <div className={style.box_center}>
                        <div className={style.box_center_left}>
                            <div style={{ fontWeight: '600' }}>{item?.nickname}</div>
                            <div style={{ marginTop: '4px', display: `${item?.phone !== null ? 'block' : 'none'}` }} className={style.font}>{item?.phone} </div>
                        </div>
                        <div className={style.box_botton2}>
                            <div className={style.box_botton} onClick={() => { click(item) }}><div>{t('ConsultImmediately')}</div> <img src={require('../../../assets/image/kf/right.png')} alt="" style={{ width: '14px', height: '14px', marginLeft: '2px' }} /></div>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default Services;
