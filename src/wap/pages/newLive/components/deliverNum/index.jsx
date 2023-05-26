import React, { useRef, useState } from 'react';
import style from './index.module.scss'
import { Button, Input } from 'antd-mobile';
import { useTranslation } from "react-i18next";

const Index = (props) => {
    const { t } = useTranslation();
    const { deliver } = props
    const [num, numSet] = useState([
        { num: 1, code: 1 },
        { num: 10, code: 2 },
        { num: 99, code: 3 },
        { num: 188, code: 4 },
        { num: 999, code: 5 },
        // { num: '', code: 6 },
    ])

    const [inputs, inputsSet] = useState('')
    const [numIndex, numIndexSet] = useState(0)
    const [selects, selectsSet] = useState(false)
    const inputRef = useRef()
    return (
        <div className={`${style.deliverNum} ${selects ? '' : style.deliverNum2}`}>
            <div className={`${style.demos} ${selects ? '' : style.selectsT}`}>
                {selects ? <div className={style.demos2}>
                    {
                        num.map((value, index) => {
                            return index != 5 ? <div key={value.code} onClick={() => { selectsSet(false), numIndexSet(index) }} className={`${style.nums} ${numIndex == index ? style.select : ''}`}>
                                {
                                    value.num
                                }
                            </div> :
                                <Input
                                    ref={inputRef}
                                    onBlur={(e) => {
                                        if (e.target.value.length > 0) {
                                            numIndexSet(5)
                                        }
                                    }}
                                    onEnterPress={(e) => {
                                        if (e.target.value.length > 0) {
                                            numIndexSet(5)
                                            inputRef.current.blur()
                                        }
                                    }}
                                    type='number'
                                    className={style.inputs} style={{ '--color': '#fff', }} value={inputs} onChange={inputsSet} placeholder={t('live_other')} />
                        })
                    }
                </div> :
                    // className={style.selectsT}
                    <div onClick={() => selectsSet(true)} className={style.demosNum}>
                        {
                            numIndex != 5 ? num[numIndex].num : inputs
                        }
                        <img src={require('../../../../assets/image/kf/left.png')} alt="" />
                    </div>
                }
            </div>
            <Button className={style.buts} onClick={() => deliver(numIndex != 5 ? num[numIndex].num : inputs)}>
                Go
            </Button>
        </div >
    );
}

export default Index;
