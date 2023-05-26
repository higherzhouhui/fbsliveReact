import React, { useEffect, useState } from "react"
import Style from './index.module.scss'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { Input } from "antd-mobile"

const Inputs = (props) => {

    const { type, placeholder, maxLength, onChange, value, disabled, colors, color1, placeholderColor } = props

    //是否为密码数据框
    const [showPass, setShowPass] = useState(false)
    const inputRightIcon = () => {
        if (type === 'password') {
            return showPass ? <EyeOutline color={color1 ? '#fff' : ''} onClick={switchEyes} fontSize={18} /> : <EyeInvisibleOutline color={color1 ? '#fff' : ''} onClick={switchEyes} fontSize={18} />
        } else return <div></div>
    }

    //切换可见密码
    const switchEyes = () => {
        setShowPass(!showPass)
    }

    //当密码框可显示时切换
    useEffect(() => {
        setInputType(type === 'password' && !showPass ? 'password' : type === 'account' ? 'tel' : type === 'number' ? 'number' : 'text')
    }, [showPass])

    const [inputType, setInputType] = useState('text')

    return <>
        <div className={`${props.colors === undefined ? Style.inputBox : Style.inputBox2} ${props.className}`}>
            <Input type={inputType} placeholder={placeholder} style={{ paddingRight: '18px', '--placeholder-color': `${placeholderColor ? '#cccccc7d' : 'var(--adm-color-light)'}` }} maxLength={maxLength || 16} onChange={onChange} value={value} disabled={disabled} />
            {inputRightIcon()}
        </div>
    </>
}

export default Inputs