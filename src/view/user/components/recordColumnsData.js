import React from 'react';
import { FreeTime } from '../../../common'
import { t } from "i18next"
// 交易记录10000
export const jyTableHeader = [
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
    },
    {
        title: t('user_record_title2'),
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: t('user_record_title3'),
        dataIndex: 'goldCoin',
        key: 'name',
    },
    {
        title: t('ui_status'),
        dataIndex: 'status',
        key: 'status',
        render: (text) => <span>{text == 1 ? t('sys_check_pass') : t('user_record_title5')}</span>
    },
]
// 投注记录20000
export const tzTableHeader = [
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
export const xfTableHeader = [
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
    },
    {
        title: t('user_record_title4'),
        dataIndex: 'typeName',
        key: 'typeName',
    },
    {
        title: t('user_record_title3'),
        dataIndex: 'goldCoin',
        key: 'name',
    },
    {
        title: t('ui_status'),
        dataIndex: 'status',
        key: 'status',
        render: (text) => <span>{text == 1 ? t('sys_check_pass') : t('user_record_title5')}</span>
    },
]