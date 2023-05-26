
import { t } from 'i18next'
import React from 'react'
import { message } from 'antd'
import PropTypes from 'prop-types'
 
// text为要复制的内容，children为复制改该文本时显示的内容
const Copy = props => {
    const {
        text,
        children,
    } = props
    // const copyStart = (e) => {
    //     document.execCommand('copy')
    //     copyEnd(e)
    // }
    const copyEnd = e => {
        e.preventDefault()
        e.stopPropagation()
        var aux = document.createElement("input");
        // 设置元素内容
        aux.setAttribute("value", text);
 
        // 将元素插入页面进行调用
        document.body.appendChild(aux);
 
        // 复制内容
        aux.select();
 
        // 将内容复制到剪贴板
        document.execCommand("copy");
 
        // 删除创建元素
        document.body.removeChild(aux);
        message.success(t('ui_successful_copy'))
      
    }
    return (
        <span onClick={copyEnd} onCopy={copyEnd} style={{ color: '#3484FE', cursor: 'pointer' }}>{children || '复制'}</span>
    )
}
Copy.propTypes = {
    text: PropTypes.string.isRequired,
}
 
export default Copy
