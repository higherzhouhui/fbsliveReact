import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { getUrlDomain } from "../../utils/tools";
import { useTranslation } from "react-i18next";
import './app.scss'
export default () => {
    const { t } = useTranslation()
    const [qrcodeUrlAPP, qrcodeUrlAPPSet] = useState("https://download.fbslive.com")
    const [qrcodeUrlH5, qrcodeUrlH5Set] = useState(getUrlDomain() || `http://fbslive.com/`)
    useEffect(() => {
        window.eventBus.emit('checkTolive', true)
        let agentId = sessionStorage.getItem("agentId");
        if (agentId != undefined && agentId != null) {
            qrcodeUrlAPPSet(`https://download.fbslive.com?agentId=${agentId}`)
            qrcodeUrlH5Set(`${getUrlDomain()}?agentId=${agentId}`)
        }
    }, [])
    return <div className="app-top-container">
        <div className='app-top-content'>
            <div className='app-con-left'>
                <div className='title'>{t('home_8')}</div>
                <div className='tips'>{t('home_9')}</div>
            </div>
            <div className='app-con-center'>
                <div className='qr-code'>
                    <div className='code' onClick={() => window.open(qrcodeUrlAPP, "_blank")}>
                        <div className='code-pd10'><QRCode value={qrcodeUrlAPP} size={80} /></div>
                        <span>{t('home_10')}</span>
                        <span>{t('home_11')}</span>
                    </div>
                    <div className='code' onClick={() => window.open(qrcodeUrlH5, "_blank")}>
                        <div className='code-pd10'><QRCode value={qrcodeUrlH5} size={80} /></div>
                        <span>{t('home_12')}</span>
                        <span>{t('home_13')}</span>
                    </div>
                </div>
            </div>
            <div className='app-con-right'></div>
        </div>
    </div>
}