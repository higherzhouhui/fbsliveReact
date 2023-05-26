import request from "./server";


// 修改用户信息
const info = data => request('/center-client/sys/user/modify/user/info', 'POST', data)

const getOssToken = data => request('/config-client/config-client/base/ossToken', 'get', data)

export {
    info,
    getOssToken
}
