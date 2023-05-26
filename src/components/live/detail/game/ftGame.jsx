import { message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { LotteryBet } from "../../../../api/game";
import { gameFtData } from "./js/gameData";
import style from './style/ftGame.module.scss'

const FtGame = (props, ref) => {
    const { liveId, money, issue, freshBalance, checkGame7, setCheckGame7 } = props

    let [game7Index, game7IndexSet] = useState([])

    const { t } = useTranslation()

    useImperativeHandle(ref, () => {
        return {
            handleBet,
            handleSelectGameFt
        }
    })

    //获取飞艇赔率
    const getOdds = (val) => {
        return _.head((issue?.ftPl || []).filter(v => v.methodId === val) || [])?.hprize
    }

    //飞艇游戏选中或取消选择事件  
    const handleSelectGameFt = (index, key) => {
        let select = `${index}${key}`
        if (game7Index.includes(select)) {
            let i = game7Index.findIndex(it => it === select)
            game7Index.splice(i, 1)
        } else {
            game7Index.push(select)
        }
        game7IndexSet([...game7Index])
        let list = [...checkGame7.list]
        let data = gameFtData[index].list[key]
        if (list.includes(data)) {
            let index = list.findIndex(item => JSON.stringify(item) === JSON.stringify(data))
            list.splice(index, 1)
        } else {
            list.push(data)
        }
        list.sort((a, b) => Number(`${a.type_text}${a.type_show}`) - Number(`${b.type_text}${b.type_show}`))
        setCheckGame7({ list })
    }

    const handleBet = async (times) => {
        let playNum = checkGame7.list.map(e => {
            return {
                money: money,
                notes: 1,
                num: e.name.join(e.split),
                rebate: 0,//不变
                type: e.type,
                type_text: e.type_text
            }
        })
        let param = {
            isStop: 0,
            playNum,
            liveId: liveId,
            expect: [{
                expect: issue.expect,
                isLHC: false,
                multiple: 1
            }],
            times,
            lotteryName: issue.name,
            isHemai: 0
        }
        const res = await LotteryBet(param, 'lottery')
        if (!(res instanceof Error)) {
            if (res) {
                message.info(t('betSuccess'))
                freshBalance()
                setCheckGame7({ list: [] })
                game7IndexSet([])
            }
        }
    }

    return <div className={style.feiting}>
        {gameFtData.map((item, index) => {
            return <div className={style.wrap} key={`wrap${index}`}>
                <div className={style.title}>{item.title}</div>
                <div className={style.list} data-layout={item.list.length}>
                    {item.list.map((val, key) => {
                        return <div className={`${style.box} ${game7Index.includes(index.toString() + key.toString()) ? style.active : ''}`} key={`box${key}`} onClick={() => handleSelectGameFt(index, key)}>
                            <div className={style.span}>{val.name}</div>
                            <p>{getOdds(val.value)}</p>
                        </div>
                    })}
                </div>
            </div>
        })}
    </div>
}

export default forwardRef(FtGame)