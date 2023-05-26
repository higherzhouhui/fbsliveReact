import React, { useEffect, useState } from 'react';
import { NavBar, Input } from 'antd-mobile';
import style from './index.module.scss'
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"
import { info } from '../../../../server/Personal'
const ModifyName = () => {
    const { t } = useTranslation()
    const history = useNavigate()
    const { state } = useLocation()
    const [center, centerSet] = useState('')

    useEffect(() => {
        console.log('这是什么数据', state);
        centerSet(state.nickname)
    }, []);
    // 保存
    const preservation = () => {
        infoD({ nickname: center })
    }

    // 修改
    const infoD = (data = {}) => {
        info({ ...data }).then((item) => {
            history(-1)
        })
    }
    return (
        <div>
            <NavBar
                backArrow={<img src={require('../../../../assets/image/kf/left.png')} style={{ width: '18px', height: '18px' }} />}
                onBack={() => history(-1)}
                className={style.wbg}
                right={<div className={style.right_font} onClick={() => preservation()}>
                    {t('baocun')}
                </div>}
            >{t('nickName')}</NavBar>
            <div className={style.center2}>

                <Input className={style.assembly} placeholder={t('shuruyigexianglingdemingcen')} value={center} maxLength='16' onChange={centerSet} />
                <div className={style.center_title2}><div>{t('zuiduoshuru')}</div> <div>{center?.length}</div></div>

            </div>

        </div>
    );
}

export default ModifyName;
