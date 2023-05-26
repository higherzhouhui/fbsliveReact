import React from "react"
import style from './index.module.scss'
const CEmpty = (props) => {
    // description 空数据的描述
    // type 根据类型展示
    const { description,subtitleDescription, type } = props
    let emptyImgArr = [
        { type: 0, imgBg: require('../../assets/image/empty/bg-record.png') },//记录为空
        { type: 1, imgBg: require('../../assets/image/empty/bg-focus.png') },//关注为空
        { type: 2, imgBg: require('../../assets/image/empty/bg-result.png') },//搜索为空
    ]
    return <div className={style.emptyContainer}>
        <img className={style.emptyBg} src={emptyImgArr[type || 0].imgBg} />
        <div className={style.emptyText}>{description}</div>
        <div className={style.subtitleEmptyText}>{subtitleDescription}</div>
    </div>
}
export default CEmpty