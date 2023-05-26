import { Local } from "../../common";
import request from "./server";


//添加反馈
export const feedbackSave = (data) => {
    return request("/center-client/feedback/save", 'post', data)
}

//获取反馈类型
export const feedbackTypes = (data) => {
    return request("/center-client/feedback/feedbackTypes", 'get', data)
}

//我的反馈
export const feedbackAll = (data) => {
    return request("/center-client/feedback/all", 'get', data)
}

// 
export const feedbackRead = (data) => {
    return request('/center-client/feedback/read', 'post', data)
}