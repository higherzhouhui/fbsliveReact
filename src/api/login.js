import { makeRequest } from "../utils/httpHelper";

//登录
export const login = (data) => makeRequest({ url: `/center-client/sys/auth/phone/login`, data });
//检车是否注册过手机号
export const isRegister = (data) => makeRequest({ url: `/center-client/sys/user/phone/isRegiste`, data });
// 发送验证码
export const SendSms = (data) => makeRequest({ url: `/center-client/sys/auth/send/vcode`, data });
//网易云验证码
export const WyVerify = (data) => makeRequest({ url: `/center-client/sys/user/captcha`, data });
//发送短信验证码2
export const SendSms2 = (data) => makeRequest({ url: `/center-client/sys/user/cash/sendCashCode`, data });