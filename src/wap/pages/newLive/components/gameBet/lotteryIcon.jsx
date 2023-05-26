import React from "react"
import style from './common.module.scss'

const LotteryIcon = (props) => {
    const { children, type } = props
    return <div className={type === 'red' ? style.LotteryNumIcon1 : style.LotteryNumIcon}>
        {children}
    </div>
}

export default LotteryIcon