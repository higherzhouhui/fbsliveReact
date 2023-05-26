import React, { useState, useEffect, useCallback } from 'react';
import { Table, Select, DatePicker, Button, Tooltip } from 'antd';
import { queryAssetTypeList, queryUserAssetList } from '../../../api/userInfo';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { FreeTime } from '../../../common'
const { RangePicker } = DatePicker;
const { Option } = Select;
import moment from 'moment'
import './record.scss'

export default () => {
    const { t } = useTranslation()
    // 交易记录10000
    const jyTableHeader = [
        {
            title: t('user_record_date'),
            dataIndex: 'yearMonthDay',
            key: 'yearMonthDay',
            width: "15%",
            render: (yearMonthDay) => <span>{FreeTime(yearMonthDay, 'd-m-y')}</span>
        },
        {
            title: t('user_record_title1'),
            dataIndex: 'trn',
            width: "25%",
            key: 'trn',
        },
        {
            title: t('user_record_title2'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            ),
        },
        {
            title: t('user_record_title3'),
            dataIndex: 'goldCoin',
            key: 'name',
            width: "10%",
        },
        {
            title: t('ui_status'),
            dataIndex: 'status',
            key: 'status',
            width: "15%",
            render: (text) => <span>{text == 1 ? t('sys_check_pass') : t('user_record_title5')}</span>
        },
    ]
    // 投注记录20000
    const tzTableHeader = [
        {
            title: t('user_record_date'),
            dataIndex: 'yearMonthDay',
            key: 'yearMonthDay',
            render: (yearMonthDay) => <span>{FreeTime(yearMonthDay, 'd-m-y')}</span>
        },
        {
            title: t('user_record_title1'),
            dataIndex: 'trn',
            key: 'trn',
            width: "25%",
        },
        {
            title: t('user_record_pt'),
            dataIndex: 'gameName',
            key: 'gameName',
        },
        {
            title: t('user_record_title6'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            ),
        },
        {
            title: t('user_record_title7'),
            dataIndex: 'status',
            key: 'status',
            render: (text) => <span>{text == 1 ? t('sys_check_pass') : t('user_record_title5')}</span>
        },
        {
            title: t('bet'),
            dataIndex: 'betAmount',
            key: 'betAmount',
        },
        {
            title: t('user_record_title8'),
            dataIndex: 'profitAmount',
            key: 'profitAmount',
        },
    ]
    // 消费记录30000
    const xfTableHeader = [
        {
            title: t('user_record_date'),
            dataIndex: 'yearMonthDay',
            key: 'yearMonthDay',
            render: (yearMonthDay) => <span>{FreeTime(yearMonthDay, 'd-m-y')}</span>,
            width: "15%",
        },
        {
            title: t('user_record_title1'),
            dataIndex: 'trn',
            width: "25%",
            key: 'trn',
        },
        {
            title: t('user_record_title4'),
            dataIndex: 'typeName',
            key: 'typeName',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            ),
        },
        {
            title: t('user_record_title3'),
            dataIndex: 'goldCoin',
            key: 'name',
            width: "10%",
        },
        {
            title: t('ui_status'),
            dataIndex: 'status',
            key: 'status',
            width: "15%",
            render: (text) => <span>{text == 1 ? t('sys_check_pass') : t('user_record_title5')}</span>
        },
    ]
    const { state } = useLocation();
    const methodType = state?.methodType || 100000;
    const [type, setType] = useState(null);
    const [time, setTime] = useState(null);
    const [timeSelect, setTimeSelect] = useState([])
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const [timeList, setTimeList] = useState([]);
    const columns = methodType === 10000 ? jyTableHeader : methodType === 20000 ? tzTableHeader : xfTableHeader
    // 选择类型
    const onChangeType = (data) => {
        setType(data)
    }
    // 选择时间
    const onChangeTime = (data) => {
        setTimeSelect([])
        if(data){
            setTime(data)
        }
    }
    // 选择自定义时间
    const onChangeTimeData = (data) => {
        setTimeSelect(data)
        setTime(null)
    }
    // 点击面板清空数据
    const onOpenChange = useCallback((data) => {
        !data ? setTime(data) : setTimeSelect([]);
    }, []);
    // 设置30天之前不能选择,今日之后不能选择
    const disabledDate = (current) => {
        if (timeSelect) {
            //设置默认的结束时间为当前点击的时间的一个月以后
            let stage = moment(timeSelect).add(1, 'months');
            //如果一个月以后的时间大于明天，则结束时间以明天为准
            if (moment(timeSelect).add(1, 'months') > moment().endOf('day')) {
                stage = moment().endOf('day');
            }
            //返回的范围为：【当前点击时间往前推一个月，当前点击时间往后推一个月不能超过明天以后】
            return current < moment(timeSelect).subtract(1, 'months') || current > stage;
        } else {
            //未点击的时候，时间不可选为明天以后
            return current && current > moment().endOf('day');
        }
    }
    // 查询数据
    const getQueryUserAssetList = async (timeAssertCode, assertCode) => {
        setLoading(true)
        let params = {
            timeAssertCode,
            assertCode,
            methodType: methodType,
            pageNum: 0,
            pageSize: 999,
            startTime: null,
            endTime: null,
        }
        // alert(timeSelect.length)
        if (timeSelect.length > 0) {
            params.startTime = moment(timeSelect[0]).startOf('day').format('x')
            params.endTime = moment(timeSelect[1]).endOf('day').format('x')
        }
        const rt = await queryUserAssetList(params);
        if (!(rt instanceof Error)) {
            setLoading(false)
            setList(rt?.centerUserAssetsPlusVOS || [])
        } else {
            setLoading(false)
        }
    }
    const onSet = () => {
        setTimeSelect([])
        setTime(null)
        init()
    }
    const onSearch = () => {
        getQueryUserAssetList(time, type);
    }
    const init = () => {
        Promise.all([queryAssetTypeList({ pid: 40000 }), queryAssetTypeList({ pid: methodType })]).then(rt => {
            if (!(rt instanceof Error)) {
                let timeList = rt[0]
                let typeList = rt[1]
                setTimeList(timeList || [])
                setTypeList(typeList || [])
                setTime(timeList[0]?.assertCode || 0)
                setType(typeList[0]?.assertCode || 0)
                getQueryUserAssetList(timeList[0]?.assertCode, typeList[0]?.assertCode)
            }
        })
    }
    useEffect(() => {
        setList([])
        init()
    }, [methodType])
    return <div className='container-reward'>
        <div className='reward-search'>
            <div className='min-title'>
                {methodType === 10000 ? t('user_jyjl') : methodType === 20000 ? t('f_ui_bet_record') : t('user_xfjl')}
            </div>
            {methodType === 20000 && <div className='tips'>{t('user_record_tips')}</div>}
            <div className='search'>
                <div className='item'>
                    <div className='label'>{t('user_record_pt')}</div>
                    <Select
                        placeholder={t('f_ui_select')}
                        onChange={(data) => onChangeType(data)}
                        value={type}
                    >
                        {typeList.map((item, index) => {
                            return <Option key={index} value={item.assertCode}>{item.assertName}</Option>
                        })}
                    </Select>
                    <div className='label'>{t('user_record_date')}</div>
                    <RangePicker
                        placeholder={[t('user_record_start'), t('user_record_end')]}
                        value={timeSelect}
                        allowClear={false}
                        disabledDate={methodType === 20000 ? disabledDate : null}
                        // onOpenChange={onOpenChange}
                        onChange={(data) => onChangeTimeData(data)}
                    />
                </div>
                <div className='item'>
                    <div className={`tabs ${loading && 'loading'}`} value={time}>
                        {timeList.map((item, index) => (
                            <div className={`tab ${time === item.assertCode && 'active'}`} key={index} value={item.assertCode}
                                onClick={() => onChangeTime(item.assertCode)}>
                                {item.assertName}
                            </div>
                        ))}
                    </div>
                    <div className='btn-group'>
                        <Button className='btn' type='primary' onClick={() => onSearch()}>{t('user_record_search')}</Button>
                        <Button className='btn' type='info' onClick={() => onSet()}>{t('user_record_set')}</Button>
                    </div>
                </div>
            </div>
        </div>
        <div className={`reward-table ${methodType === 20000 && 'tzHeight'}`}>
            {<div className={'box ' + (loading && 'loading')}>
                <Table columns={columns} scroll={{ y: methodType === 20000 ? 508 : 535 }} dataSource={list} bordered={false} pagination={false} className={`user-info-reward-box-tables`} />
            </div>}
        </div>
    </div>
}