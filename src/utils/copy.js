import { Toast } from "antd-mobile";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useCopy() {
    const { t } = useTranslation()
    const copy = useCallback(function (str) {
        return new Promise((resolve, reject) => {
            const el = document.createElement('textarea')
            const body = document.body
            const isRTL = document.documentElement.getAttribute('dir') == 'rtl'
            el.value = str
            el.setAttribute('readonly', '')
            el.style = {
                position: 'absolute',
                [isRTL ? 'right' : 'left']: '-9999px',
                top: `${window.pageYOffset || document.documentElement.scrollTop}px`,
                border: '0',
                padding: '0',
                margin: '0',
            }
            body.appendChild(el)
            el.select()
            try {
                document.execCommand('copy')
                body.removeChild(el)
                Toast.show(t('ui_successful_copy'))
                resolve(str)
            } catch (error) {
                reject(error)
            }
        })
    }, []);

    return copy;
}