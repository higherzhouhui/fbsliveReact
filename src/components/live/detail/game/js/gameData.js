import i18n from '../../../../../language/config'
//越南30秒彩

export const nav6 = [
    { name: i18n.t('kauixuan'), type_name: '特码-快选', type: 'PTH_KX', split: '' },
    { name: i18n.t('xuanshuzi'), type_name: '特码-选号', type: 'PTH_XH', split: '' },
    { name: i18n.t('shurushuzi'), type_name: '特码-输入', type: 'PTH_SR', split: '' },
]

export const game6Data = [
    Array(100).fill('').map((v, i) => {
        return { name: [i], value: i, type_text: nav6[0].type_name, type: nav6[0].type, split: nav6[0].split, type_show: nav6[0].name }
    }),
    Array(10).fill('').map((v, i) => {
        return { name: [i], value: i, type_text: nav6[1].type_name, type: nav6[1].type, split: nav6[1].split, type_show: nav6[1].name }
    })
]

export const game6Type = [
    {
        name: i18n.t('quanxuan'),
        value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    {
        name: i18n.t('BetnavDa'),
        value: [5, 6, 7, 8, 9]
    },
    {
        name: i18n.t('BetnavXiao'),
        value: [0, 1, 2, 3, 4]
    },
    {
        name: i18n.t('BetnavDan'),
        value: [1, 3, 5, 7, 9]
    },
    {
        name: i18n.t('BetnavShuang'),
        value: [0, 2, 4, 6, 8]
    },
]

export const round6Type = [
    { name: i18n.t('suijishu1'), value: 1 },
    { name: i18n.t('suijishu5'), value: 5 },
    { name: i18n.t('suijishu10'), value: 10 },
    { name: i18n.t('delete'), value: 0 },
]

//幸运飞艇数据
export const gameFtData = [
    {
        title: i18n.t('feitingType0'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 0, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 0, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 0, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 0, type: "272", type_show: 3, split: '' },
            { name: [i18n.t('BetnavLong')], value: "2720019", type_text: 0, type: "272", type_show: 4, split: '' },
            { name: [i18n.t('BetnavHu')], value: "2720019", type_text: 0, type: "272", type_show: 5, split: '' }]
    },
    {
        title: i18n.t('feitingType1'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 1, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 1, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 1, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 1, type: "272", type_show: 3, split: '' },
            { name: [i18n.t('BetnavLong')], value: "2720019", type_text: 1, type: "272", type_show: 4, split: '' },
            { name: [i18n.t('BetnavHu')], value: "2720019", type_text: 1, type: "272", type_show: 5, split: '' }]
    },
    {
        title: i18n.t('feitingType2'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 2, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 2, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 2, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 2, type: "272", type_show: 3, split: '' },
            { name: [i18n.t('BetnavLong')], value: "2720019", type_text: 2, type: "272", type_show: 4, split: '' },
            { name: [i18n.t('BetnavHu')], value: "2720019", type_text: 2, type: "272", type_show: 5, split: '' }]
    },
    {
        title: i18n.t('feitingType3'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 3, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 3, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 3, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 3, type: "272", type_show: 3, split: '' },
            { name: [i18n.t('BetnavLong')], value: "2720019", type_text: 3, type: "272", type_show: 4, split: '' },
            { name: [i18n.t('BetnavHu')], value: "2720019", type_text: 3, type: "272", type_show: 5, split: '' }]
    },
    {
        title: i18n.t('feitingType4'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 4, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 4, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 4, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 4, type: "272", type_show: 3, split: '' },
            { name: [i18n.t('BetnavLong')], value: "2720019", type_text: 4, type: "272", type_show: 4, split: '' },
            { name: [i18n.t('BetnavHu')], value: "2720019", type_text: 4, type: "272", type_show: 5, split: '' }]
    },
    {
        title: i18n.t('feitingType5'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 5, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 5, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 5, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 5, type: "272", type_show: 3, split: '' }]
    },
    {
        title: i18n.t('feitingType6'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 6, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 6, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 6, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 6, type: "272", type_show: 3, split: '' }]
    },
    {
        title: i18n.t('feitingType7'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 7, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 7, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 7, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 7, type: "272", type_show: 3, split: '' }]
    },
    {
        title: i18n.t('feitingType8'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 8, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 8, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 8, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 8, type: "272", type_show: 3, split: '' }]
    },
    {
        title: i18n.t('feitingType9'),
        list: [
            { name: [i18n.t('BetnavDa')], value: "2720016", type_text: 9, type: "272", type_show: 0, split: '' },
            { name: [i18n.t('BetnavXiao')], value: "2720016", type_text: 9, type: "272", type_show: 1, split: '' },
            { name: [i18n.t('BetnavDan')], value: "2720016", type_text: 9, type: "272", type_show: 2, split: '' },
            { name: [i18n.t('BetnavShuang')], value: "2720016", type_text: 9, type: "272", type_show: 3, split: '' }]
    },
]
