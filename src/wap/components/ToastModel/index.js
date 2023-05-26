import React from 'react'
import ReactDOM from 'react-dom'
import ToastLoading from './loading'
import i18n from '../../lang/i18n'

let freshFn //刷新页面事件

function createNotification() {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const notification = ReactDOM.render(<ToastLoading />, div)
    return {
        addNotice(notice) {
            return notification.addNotices(notice)
        },
        destroy() {
            ReactDOM.unmountComponentAtNode(div)
            document.body.removeChild(div)
        }
    }
}

let notification
/**
 * 
 * @param {*} type 
 * @param {*} content 
 * @param {*} duration 
 * @param {*} onClose 
 * @param {*} opt backColor:蒙层颜色
 * @returns 
 */
const notice = (type, content, duration = 2000, onClose, opt = {}) => {
    if (!notification) notification = createNotification()
    return notification.addNotice({ type, content, duration, onClose, opt })
}

const loading = (content = 'loading...', duration = 0, onClose) => {
    return notice('loading', content, duration, onClose)
}

const link = (content = '', duration = 0, onClose) => {
    return notice('link', content, duration, onClose)
}

const msg = (content = '', duration = 2000, onClose, opt = {}) => {
    return notice('msg', content, duration, onClose, opt)
}

const fresh = (content = '', duration, onClose, opt = {}) => {
    return notice('fresh', content, duration, onClose, opt)
}

window.addEventListener("online", function () {
    freshFn && freshFn()
    // location.reload() //刷新页面
    console.log("-----网络连接了-----")
})
window.addEventListener("offline", function () {
    msg(i18n.t('wang_luo_dk'), 2000, () => {
        freshFn = fresh('', 0, null, { backColor: "transparent" })
    }, { backColor: "transparent" })
    console.log("-----网络断开了-----")
})

export default {
    /**
     * 
     * @param {*} content 内容
     * @param {*} duration 持续时间，传0时一直持续
     * @param {*} onClose 关闭弹窗后回调函数
     * @returns 返回一个关闭函数
     */
    loading,
    link,
    msg,
    fresh
}