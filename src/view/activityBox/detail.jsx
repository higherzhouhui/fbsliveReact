import React from "react";
import Footer from "../../components/footer/index";
import { useLocation } from 'react-router-dom'
import style from './index.module.scss'
import { getParams } from '../../utils/tools'
export default () => {
    const { state } = useLocation()
    const params = getParams(location.href)
    return <div>
        <div className={style.activeImgContainer}>
            <img src={params.src} alt="" />
        </div>
        <Footer />
    </div>
};
