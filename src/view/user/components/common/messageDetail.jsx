import React from 'react';
import { message } from 'antd';
import { useTranslation } from "react-i18next";
import { platformMessageDel } from '../../../../api/userInfo'
import { FreeTime, Local } from '../../../../common'
import './messageDetail.scss';
export default (props) => {
    let { hideMessage, changeItem, info } = props;
    const { t } = useTranslation()
    const onHideBind = () => {
        hideMessage()
    }
    const onDel = async () => {
        const rt = await platformMessageDel({ msgIds: info.id, uid: Local('userInfo2')?.uid })
        try {
            if (!(rt instanceof Error)) {
                message.success(t('user_message_success'));
                hideMessage();
            }
        } catch (error) {
            console.log(error)
        }
    }
    const onChangeItem = (data) => {
        changeItem(data)
    }
    return <div className='container-message-detail'>
        <div className='header'>
            <span onClick={() => onHideBind()} className='icon icon-back'></span>
            <span className='title'>{t('user_message_tzxq')}</span>
        </div>
        <div className='top'>
            <div className='title'>{info.title}</div>
            {info.id && <div className='operate-right-box'>
                <div className='operate-right-box-item' >
                    <span className='icon icon-msg-del' title={t('delete')} onClick={() => onDel()}></span>
                    <span className='prev icon-prev' title={t('user_opinion_prev')} onClick={() => onChangeItem('prev')}></span>
                    <span className='next icon-next' title={t * ('user_opinion_next')} onClick={() => onChangeItem('next')}></span>
                </div>
            </div>}
        </div>
        <div className='time'>
            {FreeTime(info.createTime, 'd-m-y')}
        </div>
        <div className='content' dangerouslySetInnerHTML={{ __html: info.messageContent }} />
    </div>
}