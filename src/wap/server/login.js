import request from "./server";

//登录
const accountLogin = (data) => {
  data.model = 'mobile'
  return request("/center-client/sys/auth/phone/login", 'POST', data)
}


//检车是否注册过手机号
const isRegister = (data) => {
  return request("/center-client/sys/user/phone/isRegiste", 'POST', data)
}

//网易云验证码
const WyVerify = () => {
  return request("/center-client/sys/user/captcha", 'POST')
}


/**
 * 
 * @returns 发送验证码
 */
const SendSms = (data) => {
  return request("/center-client/sys/auth/send/vcode", 'POST', data)
}

//发送短信验证码2
const SendSms2 = data => request('/center-client/sys/user/cash/sendCashCode', 'POST', data)
/**
 * 
 * @returns 注册
 */
const register = (data) => {
  return request("/center-client/sys/auth/phone/reg/info", 'POST', data)
}


//检查短信验证码
const CheckSms = data => request('/center-client/sys/auth/phone/reg/codeValidate', 'POST', data)


//facebook 登录
const doFaceBookLogin = data => request('/cms-auth/cms/v1/auth/doFaceBookLogin', 'POST', data)
//facebook 绑定手机号
const doBandingPhone = data => request('/cms-auth/cms/v1/auth/doBandingPhone', 'POST', data)
//facebook 跳过绑定手机号
const doJumpBandingPhone = data => request('/cms-auth/cms/v1/auth/doJumpBandingPhone', 'POST', data)
//facebook 绑定第三方账号
const doBandingThird = data => request('/cms-auth/cms/v1/auth/doBandingThird', 'POST', data)
//facebook 解绑第三方账号
const doUnBandingThird = data => request('/cms-auth/cms/v1/auth/doUnBandingThird', 'POST', data)
//facebook 完善用户信息
const phoneRegisterInfo = data => request('/cms/v1/auth/phoneRegisterInfo', 'POST', data)
//facebook 获取第三方授权信息
const queryCenterUserThirdInfoVOList = data => request(`/cms-auth/cms/v1/auth/queryCenterUserThirdInfoVOList`, 'get', data)
//facebook 是否是已经注册用户
const flagRegisterUser = data => request(`/cms-auth/cms/v1/auth/flagRegisterUser`, 'get', data)
//facebook 验证验证码
const authCheckSms = data => request(`/cms-auth/cms/v1/auth/checkSms`, 'get', data)



export {
  accountLogin,
  isRegister,
  WyVerify,
  SendSms,
  register,
  CheckSms,
  SendSms2,
  doFaceBookLogin,
  doBandingPhone,
  doJumpBandingPhone,
  doBandingThird,
  doUnBandingThird,
  phoneRegisterInfo,
  queryCenterUserThirdInfoVOList,
  flagRegisterUser,
  authCheckSms
}