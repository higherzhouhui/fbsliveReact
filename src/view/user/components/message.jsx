
import React, { useState, useEffect } from 'react';
import { Tabs, Empty, message, Pagination } from 'antd';
import { getTypeList, findListByTypePage, platformMessageRead, platformMessageReadAll, platformMessageDel } from '../../../api/userInfo'
import { Local } from '../../../common';
import { useTranslation } from "react-i18next";
import { FreeTime } from '../../../common'
import { getPlainText } from '../../../utils/tools'
const { TabPane } = Tabs;
import MessageDetail from './common/messageDetail'
import './message.scss'

export default () => {
    const { t } = useTranslation()
    const [tabLoading, setTabLoading] = useState(true)
    const [tabList, setTabList] = useState([])
    const [tabIndex, setTabIndex] = useState(0)
    const [iconImg, setIconImg] = useState('')
    const [pageNum, setPageNum] = useState(1)
    const [loading, setLoading] = useState(false)
    const [list, setList] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [isAll, setIsAll] = useState(false)
    const [ids, setIds] = useState([])//选中的
    const [detailShow, setDetailShow] = useState(false)
    const [messageInfo, setMessageInfo] = useState({})
    const [total, setTotal] = useState(0)
    // 获取消息分类
    const init = async () => {
        let rt = await getTypeList({ uid: Local('userInfo2')?.uid });
        try {
            if (!(rt instanceof Error)) {
                setTabLoading(false)
                if (!rt) return
                let tempData = rt.sort((a, b) => { return a.sortIdx - b.sortIdx })
                setTabList(tempData)
                setTabIndex(tempData[0].id)
                getFindListByTypePage(tempData[0].id)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTabLoading(false)
        }
    }
    // 点击切换tab
    const onChangeTab = (data) => {
        setTabIndex(data)
        getFindListByTypePage(data)
        setIds([])
        setIsEdit(false)
        setIsAll(false)
        setPageNum(1)
        setTotal(0)
        let tab = tabList.find(v => { return v.id == data })
        setIconImg(tab.icon)
    }
    // 根据typeId查询消息
    const getFindListByTypePage = async (typeId, current = 1) => {
        setLoading(true)
        let params = {
            pageNum: current ? current : pageNum,
            pageSize: 10,
            uid: Local('userInfo2')?.uid,
            typeId
        }
        const rt = await findListByTypePage(params)
        try {
            if (!(rt instanceof Error)) {
                setLoading(false)
                setList(rt.list || [])
                setTotal(rt.total || 0)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // 单个消息已读
    const getPlatformMessageRead = async (data) => {
        setDetailShow(true)
        setMessageInfo(data)
        if (data.isRead == 1) return
        const rt = await platformMessageRead({ msgId: data?.id })
        try {
            if (!(rt instanceof Error)) {
                // 消息已读 -1
                let tab = tabList.find((item) => { return item.id == tabIndex })
                if (tab.unread == 0) return
                tab.unread = tab.unread - 1
                setTabList([...tabList])
                // 重新刷新查询页面数据
                getFindListByTypePage(tabIndex)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const onChange = (data) => {
        setPageNum(data)
        getFindListByTypePage(tabIndex, data)
    }
    // 一键已读
    const onReadAll = async () => {
        let params = { typeId: tabIndex, uid: Local('userInfo2')?.uid }
        const rt = await platformMessageReadAll(params)
        try {
            if (!(rt instanceof Error)) {
                message.success(t('user_message_success'));
                getFindListByTypePage(tabIndex)
                let tab = tabList.map(v => { return { ...v, unread: 0 } })
                setTabList([...tab])
            }
        } catch (error) {
            console.log(error)
        }
    }
    // 全选/全不选
    const onIsAll = () => {
        isAll ? setIds([]) : setIds([...list.map((v) => v.id)])
        setIsAll(!isAll)
    }
    // 编辑&删除
    const onEditDel = async () => {
        // 存在就是删除
        if (isEdit) {
            if (ids.length === 0) return message.error(t('user_message_deltips'));
            // 选中的删除
            const rt = await platformMessageDel({ msgIds: ids.join(','), uid: Local('userInfo2')?.uid })
            try {
                if (!(rt instanceof Error)) {
                    message.success(t('user_message_success'));
                    // 全选的时候清除顶部的数字
                    if (ids.length == list.length) {
                        let tab = tabList.find((item) => { return item.id == tabIndex })
                        tab.unread == 0
                        setTabList([...tab])
                    } else {
                        // 选中全选的未读消息，会根据数量减少
                        let selectIsReadNum = list.filter(e => {
                            return e.isRead == 0 && ids.includes(e.id);
                        })
                        let tab = tabList.find((item) => { return item.id == tabIndex })
                        tab.unread = tab.unread - selectIsReadNum.length
                        setTabList([...tabList])
                    }
                    getFindListByTypePage(tabIndex)
                }
            } catch (error) {
                console.log(error)
            }
        }
        setIsEdit(!isEdit)
    }
    // 选择/取消 选择的消息
    const selectMsgId = ({ id }) => {
        let index = ids.indexOf(id)
        let tempIds = ids;
        if (index != -1) {
            tempIds.splice(index, 1)
        } else {
            tempIds.push(id)
        }
        setIds([...tempIds])
    }
    // 触发点击返回隐藏页面
    const hideMessage = () => {
        setDetailShow(false)
    }
    // 上一页/下一页切换
    const changeItem = (data) => {
        let length = list.length
        let index = list.findIndex(v => { return v.id == messageInfo.id })
        let obj = {}
        if (data == 'prev') {
            // 如果上一条是第0条，那么切换就是从数组的最后一条开始 else 正常切换index-1
            index == 0 ? obj = list[length - 1] : obj = list[index - 1]
        } else {
            // 如果下一条是最后一条，那么切换就是从0开始  else 正常切换index+1
            index + 1 == length ? obj = list[0] : obj = list[index + 1]
        }
        getPlatformMessageRead(obj)
    }
    useEffect(() => {
        init()
    }, [])
    return <div className='container-message'>
        <div className='min-title'>{t('ui_message_center')}</div>
        <div >
            <Tabs className={tabLoading && 'loading'} activeKey={String(tabIndex)} onChange={(data) => onChangeTab(data)}>
                {tabList.map((item) => (<TabPane
                    key={item.id}
                    tab={<div className='tabs'>
                        <span className='typeName'>{Local('lang') === 'zh' ? item.typeNameZh : item.typeNameVi}</span>
                        {item.unread > 0 && <span className='unread'>{item.unread}</span>}
                        {/* {<span className='unread'>{item.unread}</span>} */}
                    </div>}
                />))}
            </Tabs>
            {list.length > 0 && <div className='operate-box'>
                {isEdit && <div className='operate-box-item' onClick={() => onIsAll()}>
                    <span className={`icon ${isAll ? 'icon-msg-select' : 'icon-msg-unselect'}`}></span>
                    <span className='title'>{t('user_message_all')}</span>
                </div>}
                <div className='operate-box-item' onClick={() => onReadAll()}>
                    <span className='icon icon-msg-read'></span>
                    <span className='title'>{t('user_message_allread')}</span>
                </div>
                <div className='operate-box-item' onClick={() => onEditDel()}>
                    <span className='icon icon-msg-edit'></span>
                    <span className='title'>{isEdit ? t('delete') : t('user_message_edit')}</span>
                </div>
                {isEdit && <div className='operate-box-item' onClick={() => { setIsEdit(false), setIds([]) }}>
                    <span className='title del'>{t('user_message_wc')}</span>
                </div>}
            </div>}
            <div className={'a ' + (loading && 'loading')} style={{ height: '645px', overflowY: 'auto' }}>
                {!loading && list.length == 0 && <Empty className='empty-data' description={null} />}
                {list.map((item, index) => {
                    return <div key={index} className='message-item-box'>
                        <div className='message-item-box-in'>
                            {isEdit && <span onClick={(e) => { selectMsgId(item), e.stopPropagation() }}
                                className={`icon-select ${ids.indexOf(item.id) != -1 ? 'icon-msg-select' : 'icon-msg-unselect'}`}>
                            </span>}
                            <img className='icon' src={iconImg} alt="" />
                            {item.isRead == 0 && <div className='isRead' />}
                            <div className='content' onClick={() => getPlatformMessageRead(item)}>
                                <div className='top'>
                                    <span className='title'>{item.title}</span>
                                    <span className='timer'>{FreeTime(item.createTime, 'd-m-y')}</span>
                                </div>
                                <div className='msg'>{getPlainText(item.messageContent)}</div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
            <Pagination className='page' hideOnSinglePage={true} current={pageNum} onChange={onChange} total={total} />
        </div>
        <div className={`drawer-body ${detailShow ? 'show' : 'hide'}`}>
            <MessageDetail hideMessage={() => hideMessage()} changeItem={(data) => changeItem(data)} info={messageInfo} />
        </div>
    </div>
}