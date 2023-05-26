import request from "./server";


// 获取分类名称信息列表
export const getTypeList = (data) => {
    return request(`/service-business-center/platformMessage/v1/getTypeList/${data}`, 'GET')
}
// 分页获取消息列表
export const findListByTypePage = (data) => {
    return request(`/service-business-center/platformMessage/v1/findListByTypePage/${data.typeId}/${data.uid}`, 'GET', data)
}
// 消息已读
export const platformMessageRead = (data) => {
    return request(`/service-business-center/platformMessage/v1/read?msgId=${data.msgId}`, 'POST')
}

// 一键已读
export const platformMessageReadAll = (data) => {
    return request(`/service-business-center/platformMessage/v1/readAll?typeId=${data.typeId}&uid=${data.uid}`, 'POST')
}
// 删除消息
export const platformMessageDel = (data) => {
    return request(`/service-business-center/platformMessage/v1/del?msgIds=${data.msgIds}&uid=${data.uid}`, 'POST')
}


