import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { t } from 'i18next';
import useContextReducer from "../../state/useContextReducer";
import './activity.scss'

export default () => {
    const {
        state: { common: { activity }, },
    } = useContextReducer.useContextReducer();
    const [allActivity, setAllActivity] = useState(activity)
    useEffect(() => {
        setAllActivity(activity)
    }, [activity])
    const getMenuItem = (item) => {
        return <div className='item' onClick={() => itemClick(item)}>
            <img className="info-banner" src={item.activityHomePage} alt="" />
        </div>
    }
    const itemClick = (data) => {
        const w = window.open('about:blank');
        switch (data.activityType) {
            case 1001:
                w.location.href = "/saveMoney"
                break;
            case 1005:
                w.location.href = `/weeklyDeposit?src=${data.activityDetail}`
                break;
            // case 1006:
                //   w.location.href = `/sendLottery?src=${data.activityDetail}`
                break;
            default:
                w.location.href = `/activeDetail?src=${data.activityDetail}`
                break
        }
    }
    return <div className='group-activity'>
        <Menu className='active-menu' style={{ minHeight: '200px', maxHeight: "560px", overflowY: 'scroll' }}>
            {allActivity.length > 0 ?
                allActivity.map((item, index) => {
                    return <Menu.Item key={`${item.click} ${index}`} style={{ height: 'auto', padding: 0 }}>
                        {getMenuItem(item)}
                    </Menu.Item>
                }) : <div className='activity-nodata'>{t('noData')}</div>}
        </Menu>
    </div>
}