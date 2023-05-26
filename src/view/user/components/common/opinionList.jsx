import React, { useState } from 'react';
import { Empty } from 'antd';
import { useTranslation } from "react-i18next";
import { FreeTime } from '../../../../common'
import OpinionListDetail from './opinionListDetail';
import './opinionList.scss';
export default (props) => {
    let { hideOpinion, list } = props;
    const { t } = useTranslation()
    const [info, setInfo] = useState([])
    const [detailShow, setDetailShow] = useState(false)
    const onHideOpinion = () => {
        hideOpinion()
    }
    const onItem = (data) => {
        setInfo(data)
        setDetailShow(true)
    }
    const hideOpinionListDetail = () => {
        setDetailShow(false)
    }
    // 上一页/下一页切换
    const changeItem = (data) => {
        let length = list.length
        let index = list.findIndex(v => { return v.id == info.id })
        let obj = {}
        if (data == 'prev') {
            // 如果上一条是第0条，那么切换就是从数组的最后一条开始 else 正常切换index-1
            index == 0 ? obj = list[length - 1] : obj = list[index - 1]
        } else {
            // 如果下一条是最后一条，那么切换就是从0开始  else 正常切换index+1
            index + 1 == length ? obj = list[0] : obj = list[index + 1]
        }
        setInfo(obj)
    }
    return <div className='container-opinionList'>
        <div className='header'>
            <span onClick={() => onHideOpinion()} className='icon icon-back'></span>
            <span className='title'>{t('user_opinion_wdfk')}</span>
        </div>
        <div className='feedback'>
            {list.map((item, index) => {
                return <div key={index} className="feedback-item" onClick={() => onItem(item)}>
                    <img className='feedback-item-icon' src={item.icon} alt="" />
                    <div className='feedback-item-name'>{item.name}</div>
                    <div title={item.content} className='feedback-item-content'>{item.content}</div>
                    <div className='feedback-item-time'>{FreeTime(item.createTime, 'd-m-y')}</div>
                </div>
            })}
            {list.length == 0 && <Empty description={null} />}
        </div>
        <div className={`drawer-body ${detailShow ? 'show' : 'hide'}`}>
            <OpinionListDetail hideOpinionListDetail={() => hideOpinionListDetail()} changeItem={(data) => changeItem(data)} info={info} />
        </div>
    </div>
}