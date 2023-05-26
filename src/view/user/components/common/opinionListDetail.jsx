import React from 'react';
import { useTranslation, } from "react-i18next";
import { Image } from "antd";
import './opinionList.scss';
export default (props) => {
    let { hideOpinionListDetail, changeItem, info } = props;
    const { t } = useTranslation()
    const onHideOpinionListDetail = () => {
        hideOpinionListDetail()
    }
    const onChangeItem = (data) => {
        changeItem(data)
    }
    return <div className='container-opinionList'>
        <div className='header'>
            <span onClick={() => onHideOpinionListDetail()} className='icon icon-back'></span>
            <span className='title'>{t('user_opinion_fkxq')}</span>
        </div>
        <div className='top'>
            <div className='title'>
                <img src={info.icon} alt="" />
                <span>{info.name}</span>
            </div>
            {info.id && <div className='operate-right-box'>
                <div className='operate-right-box-item' >
                    <span className='prev icon-prev' title={t('user_opinion_prev')} onClick={() => onChangeItem('prev')}></span>
                    <span className='next icon-next' title={t('user_opinion_next')} onClick={() => onChangeItem('next')}></span>
                </div>
            </div>}
        </div>
        <div className='content'>
            {info.content || '-'}
            {info.photoAlbum && <div className='imgs' >
                {info.photoAlbum.split(',') && info.photoAlbum.split(',').map(v => {
                    return <Image style={{ marginRight: 10 }} width={173} src={v} />
                })}
            </div>
            }
        </div>
    </div>
}