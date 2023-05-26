import React, { useState } from 'react';
import { Menu } from 'antd';
import { Button, Modal } from 'antd';
import { Local } from '../../common';
import { useTranslation } from "react-i18next";
import ZhIMG from '../../assets/images/header/zh_cn.svg';
import VieIMG from '../../assets/images/header/vie.png';
import i18n from '../../language/config'

export default () => {
    const languages = [
        { img: ZhIMG, name: '简体中文', lang: 'zh', key: 0, },
        { img: VieIMG, name: 'Tiếng Việt', lang: 'vie', key: 1, }
    ]
    const { t } = useTranslation()
    const [index, indexSet] = useState(languages.find(e => { return e.lang == Local('lang') })?.key || 0)
    const [bIndex, bIndexSet] = useState(0)
    const [visible, visibleSet] = useState(false)
    const handleOk = () => {
        const lang = languages[bIndex].lang;
        i18n.changeLanguage(lang);
        visibleSet(false)
        indexSet(bIndex)
        Local('lang', lang);
        window.eventBus.emit('langChange', lang)
    }
    const menuClick = (data) => {
        let key = data.key;
        if (index == key) return;
        bIndexSet(key)
        visibleSet(true)
    }
    return <div>
        <Menu className='langyage-menu' items={languages.map((item, index) => ({
            key: index,
            label: <div key={index} onClick={() => menuClick(item)}>
                <img style={{ width: '20px', marginRight: '10px' }} src={item.img} alt="" />
                <span className='language'>{item.name}</span>
            </div>
        }))} />
        <Modal className='small-alert' width={340} visible={visible} title={t('ui_hint')} onOk={() => handleOk()}
            onCancel={() => visibleSet(false)}
            footer={[
                <Button key="cancel" onClick={() => visibleSet(false)}>{t('cancel')}</Button>,
                <Button key="sure" type="primary" onClick={() => handleOk()}>{t('confirm')}</Button>
            ]}
        >
            <p>{t('tip_change_lang')}</p>
        </Modal>
    </div>
}