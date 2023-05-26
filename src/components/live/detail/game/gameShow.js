const yuxxData = [
    {
        iconType: 'img',
        name: '一同号',
        type_text: '一同号',
        data: [],
        dataLang: [],
        value: 1.98,
        type: 'YTH',
        split: '',
        lang: 'Betnav1Title1'
    },
    {
        iconType: 'img',
        name: '二同号复选',
        type_text: '二同号',
        data: [],
        dataLang: [],
        value: 12.88,
        type: 'ETH',
        lang: 'Betnav1Title2',
        split: '',
    },
    {
        iconType: 'img',
        name: '二不同号',
        type_text: '二不同',
        data: [],
        dataLang: [],
        value: 6.98,
        type: 'EBT',
        lang: 'Betnav1Title3',
        split: ',',
    },
]
const jsksData = [
    {
        iconType: 'text',
        name: '一分快三',
        type_text: '和值',
        data: [['大'], ['小'], ['单'], ['双']],
        dataLang: [['BetnavDa'], ['BetnavXiao'], ['BetnavDan'], ['BetnavShuang']],
        value: 1.97,
        type: '1',
        lang: 'Betnav2Title1',
        split: '',
    },
    {
        iconType: 'text',
        name: '二同号复选',
        type_text: '二同号复选',
        data: [],
        dataLang: [],
        value: 12.8,
        type: '6',
        lang: 'Betnav2Title2',
        split: ',',
    },
    {
        iconType: 'text',
        name: '一同号',
        type_text: '三军',
        data: [],
        dataLang: [],
        value: 1.97,
        type: '7',
        lang: 'Betnav1Title1',
        split: '',
    },
]
const txsscData = [
    {
        iconType: 'text',
        name: '个位',
        type_text: '个位',
        data: [['大'], ['小'], ['单'], ['双']],
        dataLang: [['BetnavDa1'], ['BetnavXiao1'], ['BetnavDan1'], ['BetnavShuang1']],
        value: 1.97,
        type: '7.1',
        lang: 'Betnav4Title1',
        split: '0|',
    },
    {
        iconType: 'text',
        name: '龙虎万千',
        type_text: '龙虎万千',
        data: [['龙'],['虎'],['和']],
        dataLang: [['BetnavLong'], ['BetnavHu'], ['BetnavHe']],
        value: 12.8,
        valueList: [1.99, 1.99, 10.18],
        type: '9.1',
        lang: 'Betnav4Title2',
        split: ',',
    },
    {
        iconType: 'text',
        name: '十位',
        type_text: '十位',
        data: [['大'], ['小'], ['单'], ['双']],
        dataLang: [['BetnavDa'], ['BetnavXiao'], ['BetnavDan'], ['BetnavShuang']],
        value: 1.97,
        type: '7.1',
        lang: 'Betnav4Title3',
        split: '|0',
    },
]
const yflhcData = [
    {
        iconType: 'text',
        name: '特码',
        type_text: '特码两面',
        data: [['单'], ['双'], ['大'], ['小']],
        dataLang: [['BetnavDan'], ['BetnavShuang'], ['BetnavDa'], ['BetnavXiao']],
        value: 1.97,
        type: 'TMLM',
        lang: 'BetnavTm',
        split: '',
    },
    {
        iconType: 'text',
        name: '特码色波',
        type_text: '特码色波',
        data: [['红'], ['绿'], ['蓝']],
        dataLang: [['BetnavHong'], ['BetnavLv'], ['BetnavLan']],
        valueList: [2.82, 2.97, 2.97],
        type: 'TMSB',
        lang: 'BetnavTmsb',
        split: '',
    }
]
const pk10Data = [
    {
        iconType: 'text',
        name: '猜冠军',
        type_text: '猜冠军',
        data: [],
        dataLang: [],
        value: 9.7,
        type: 'GJ',
        lang: 'BetnavGj',
        split: ''
    },
    {
        iconType: 'text',
        name: '大小单双-冠亚',
        type_text: '冠亚和大小单双',
        data: [['大'], ['小'], ['单'], ['双']],
        dataLang: [['BetnavDa'], ['BetnavXiao'], ['BetnavDan'], ['BetnavShuang']],
        value: 1.97,
        type: 'DXDS',
        lang: 'BetnavGy',
        split: ''
    }
]
class Game {
    constructor() {
        this.inityuxx(6);
        this.initjsksData(6);
        this.inittxsscData();
        this.inityflhcData();
        this.initpk10Data(10);
    }
    //初始化yuxx游戏
    inityuxx(num) {
        for(let i = 1; i < num + 1 ; i ++) {
            yuxxData[0].data.push([i]);
            yuxxData[1].data.push([i, i]);
            yuxxData[0].dataLang.push([i]);
            yuxxData[1].dataLang.push([i, i]);
            for(let j = i + 1; j < num + 1; j ++) {
                yuxxData[2].data.push([i, j]);
                yuxxData[2].dataLang.push([i, j]);
            }
        }
        this.yuxx = yuxxData;
    }
    inityflhcData() {
        this.yflhc = yflhcData;
    }
    initpk10Data(num) {
        for(let i = 1; i < num + 1 ; i ++) {
            pk10Data[0].data.push([i]);
            pk10Data[0].dataLang.push([i]);
        }
        this.pk10 = pk10Data;
    }
    inittxsscData() {
        this.txssc = txsscData;
    }
    //初始化游戏二
    initjsksData(num) {
        for(let i = 1; i < num + 1 ; i ++) {
            jsksData[1].data.push([i, i]);
            jsksData[2].data.push([i]);
            jsksData[1].dataLang.push([i, i]);
            jsksData[2].dataLang.push([i]);
        }
        this.jsks = jsksData;
    }
    getValue(arr = []) {
        if(arr.length == 2 && arr[0] != arr[1]) {return arr.join(',')};
        return arr.join('');
    }

}

export const NumMap = {
    BetnavDa: '大',
    BetnavDa1: '大',
    BetnavXiao: '小',
    BetnavXiao1: '小',
    BetnavDan: '单',
    BetnavDan1: '单',
    BetnavShuang: '双',
    BetnavShuang1: '双',
    BetnavLong: '龙',
    BetnavHu: '虎',
    BetnavHe: '和',
    BetnavHong: '红',
    BetnavLv: '绿',
    BetnavLan: '蓝'

}
export const gameNameMap = {
    yuxx: {
        th: 'น้ำเต้าปูปลา',
        default: 'yuxx'
    },
    jsks: {
        th: 'ลูกเต๋าไฮโล',
        default: 'jsks'
    },
    txssc: {
        th: 'Fast 5D',
        default: 'txssc'
    },
    yflhc: {
        th: 'Mark Six',
        default: 'yflhc'
    },
    pk10: {
        th: 'PK10',
        default: 'pk10'
    }
}
export function getGameName(key, lang) {
    let nameData = gameNameMap[key]
    if(!nameData || lang != 'th') return key;
    return nameData.th
}
export const GameObj = new Game;
export const gameIconMap = {
    yuxx: {
        icon: {
            '1': require('../../../../assets/images/liveDetail/fllu.png'),
            '2': require('../../../../assets/images/liveDetail/flxie.png'),
            '3': require('../../../../assets/images/liveDetail/frji.png'),
            '4': require('../../../../assets/images/liveDetail/frfish.png'),
            '5': require('../../../../assets/images/liveDetail/flpangxie.png'),
            '6': require('../../../../assets/images/liveDetail/flxia.png'),
        },
        active: {
            '1': require('../../../../assets/images/liveDetail/fllu-active.png'),
            '2': require('../../../../assets/images/liveDetail/flxie-active.png'),
            '3': require('../../../../assets/images/liveDetail/frji-active.png'),
            '4': require('../../../../assets/images/liveDetail/frfish-active.png'),
            '5': require('../../../../assets/images/liveDetail/flpangxie-active.png'),
            '6': require('../../../../assets/images/liveDetail/flxia-active.png'),
        },
        text: {
            1: 'lu',
            2: 'hulu',
            3: 'ji',
            4: 'yu',
            5: 'xie',
            6: 'xia'
        },
        type: 'img'
    },
    jsks: {
        type: 'img',
        icon: {
            '1': require('../../../../assets/images/liveDetail/dot01.png'),
            '2': require('../../../../assets/images/liveDetail/dot02.png'),
            '3': require('../../../../assets/images/liveDetail/dot03.png'),
            '4': require('../../../../assets/images/liveDetail/dot04.png'),
            '5': require('../../../../assets/images/liveDetail/dot05.png'),
            '6': require('../../../../assets/images/liveDetail/dot06.png'),
        }
    }
}
export const getIconOrText = (type, val)=>{
    if(!gameIconMap[type]) return val;
    return gameIconMap[type].icon[val];
}


