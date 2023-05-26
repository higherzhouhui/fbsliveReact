import React, { useMemo } from "react"
import style from './ball.module.scss'

const Ball = (props) => {
    const { list } = props
    const dataList = useMemo(() => {
        return (list || []).map(v => {
            return v === 'RED' ? 1 : 0
        })
    }, [list])
    return <div className={style.ballBox} data-layout={dataList.length}>
        {dataList.map((val, key) => {
            return <span key={key} className={`${style.span} ${val === 1 ? style.red : ''}`} />
        })}
    </div>
}

export default Ball