import React from 'react'
import { useTranslation } from 'react-i18next'
import { CNavBar } from '../../../components'
import style from './index.module.scss'
const AboutFbs = () => {
    const { t } = useTranslation()
    return <div style={{ height: '100vh', background: '#fbfcfe', overflow: 'hidden' }}>
        <CNavBar left={true} title={t('gaunyuFbs')} />
        <div className={style.bodys}>
            <div className={style.scrolls}>
                <div className={style.gyFbslog}>
                    <img src={require('../../../assets/image/center/gyfbstitle.png')} className={style.imgs} />
                </div>
            </div>
        </div>
    </div>
}
export default AboutFbs;
