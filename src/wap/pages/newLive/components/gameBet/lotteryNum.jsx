import React, { useCallback, useEffect, useState } from "react"

const LotteryNum = (props) => {
    const { children, className, index } = props
    const [num, numSet] = useState(0)
    const [fixed, fixedSet] = useState(false)
    const init = useCallback(() => {
        setTimeout(() => {
            fixedSet(true)
        }, index * 500);
        setInterval(() => {
            let n = getNum(Number(`1e${children.length - 1}`), Number(`1e${children.length}`) - 1)
            numSet(n)
        }, 100)
    }, [])
    useEffect(() => {
        init()
        return () => {
            fixedSet(false)
        }
    }, [init])
    const getNum = (x, y) => {
        return Math.round(Math.random() * (y - x) + x)
    }
    return <div className={`${className} ${fixed ? 'fixed' : ''}`}>
        {fixed ? children : num}
    </div>
}

export default LotteryNum