import React, { useState } from 'react';
import { Button, Empty, Modal } from 'antd';
import { useTranslation } from "react-i18next";
import { gameForwardGame, getGameListV2, getGameCollect, addCollect, delCollect, getBalance, backAllGameCoin, autoUpBalance } from '../../../api/game'
import { Local } from "@/common";
import useContextReducer from '@/state/useContextReducer.js'
import LoginBase from '@/components/header/login'

import './game.scss'

export default (props) => {
    const { t } = useTranslation()
    const { state: { user: userInfo, }, fetchUtils, } = useContextReducer.useContextReducer();
    const [loginVisible, setLoginVisible] = useState(false)

    const { freshUser } = fetchUtils;
    const { data } = props
    // 根据类型重构名称，防止数据变动找不到图片
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState([
        { index: 0, title: t('f_ui_all2'), num: 0 },
        { index: 1, title: t('f_ui_favorites'), num: 0 },
    ])
    const [goGameLoading, setGoGameLoading] = useState(false)
    // const [tipsModalOpen, setTipsModalOpen] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)
    const [gameList, setGameList] = useState([])
    const [gameCollectList, setGameCollectList] = useState([])
    const [formDatas, formDatasSet] = useState({})
    const [gameTitle, setGameTitle] = useState('')
    // 截取前三个进行展示
    const list = data.list
    // .slice(0, 3)
    // 0点击跳转游戏
    // 1查询游戏余额，游戏余额是否大于0，直接跳转，游戏余额小于等于0，调用一键回收
    // 2调用一键回收
    // 3判断是否开起自动转入 autoUpBalance == 1 开起自动转入
    // 4钱包余额大于等于1才一键上分
    const goGamePage = async (item, go) => {
        // 增加是否登录判定
        if (!Local('token2')) {
            setLoginVisible(true)
            return
        }
        setGameTitle(item.nameI18N)
        // isMore 是否展示详情（电子游戏为1，其他为0）
        setGoGameLoading(true)
        if (data.isMore == 1 && !go) {
            setIsModalOpen(true)
            formDatasSet({ parentId: data.typeId, type: item.type })
            init(data.typeId, item.type)
            setGoGameLoading(false)
        } else {
            // 1查询游戏余额，游戏余额是否大于0，直接跳转，游戏余额小于等于0，调用一键回收
            const res = await getBalance({ gameType: item.type })
            if (!(res instanceof Error)) {
                if (res.balance > 0) {
                    setGoGameLoading(false)
                    haveLook(item)
                } else {
                    // 2调用一键回收
                    const gameCoin = await backAllGameCoin();
                    if (!(gameCoin instanceof Error)) {
                        haveLook(item)
                        setGoGameLoading(false)
                        // 3判断是否开起自动转入 autoUpBalance == 1 开起自动转入
                        if (userInfo?.autoUpBalance == 1) {
                            // 4钱包余额大于等于1才一键上分
                            if (gameCoin?.allBalance >= 1) {
                                setTimeout(() => {
                                    autoUpBalance({
                                        amount: gameCoin?.allBalance,
                                        gameType: item.type,
                                        tradeType: 1,
                                    }).then((data) => {
                                        freshUser()
                                    });
                                }, 3500);
                            }
                        }
                    }
                }
            }
        }
    }

    // 游戏跳转
    const haveLook = async (item) => {
        try {
            let params = { gameId: item.gameId, gameType: item.type }
            const rt = await gameForwardGame(params)
            window.open(rt.url || rt.param || rt, '_blank')
        } catch (error) {
            console.log(error)
        }
    }
    // 收藏 取消收藏
    const onCollection = async (collectFlag, data) => {
        if (collectFlag == 1) {
            // 删除收藏
            const res = await delCollect({ gameId: data.gameId, gameType: formDatas.type, parentId: formDatas.parentId })
            if (!(res instanceof Error)) {
                init()
            }
        } else {
            // 收藏
            const res = await addCollect({ gameId: data.gameId, gameType: formDatas.type, parentId: formDatas.parentId })
            if (!(res instanceof Error)) {
                init()
            }
        }
    }
    // 点击x 默认初始化清空
    const initSet = () => {
        setTabIndex(0)
        setGameList([])
        setGameCollectList([])
        setTab([
            { index: 0, title: t('f_ui_all2'), num: 0 },
            { index: 1, title: t('f_ui_favorites'), num: 0 },
        ])
        setIsModalOpen(false)
    }
    // 获取全部/收藏的游戏数据
    const init = (parentId, type) => {
        try {
            setLoading(true)
            let params = { parentId: (parentId || formDatas.parentId), type: (type || formDatas.type), uid: Local('userInfo2').uid }
            Promise.all([getGameListV2(params), getGameCollect(params)]).then(rt => {
                if (!(rt instanceof Error)) {
                    setLoading(false)
                    setGameList(rt[0] || [])
                    setGameCollectList(rt[1] || [])
                    let tempTab = [...tab];
                    tempTab[0].num = rt[0].length
                    tempTab[1].num = rt[1].length
                    setTab(tempTab)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const gameListDom = () => {
        return <div className={`game-list`}>
            {[gameList, gameCollectList][tabIndex].map((item, index) => {
                return <div key={index} className="game-list-item" onClick={() => goGamePage(item, true)}>
                    <img className='icon' src={item.icon} />
                    <div className='bottom'>
                        {tabIndex == 0 && <span onClick={(e) => { e.stopPropagation(), onCollection(item.collectFlag, item) }} className={`item-love  ${item.collectFlag == 1 ? 'icon-game-love' : 'icon-game-unlove'}`}></span>}
                        {tabIndex == 1 && <span onClick={(e) => { e.stopPropagation(), onCollection(1, item) }} className={`item-love icon-game-love`}></span>}
                        <span className='item-name'>{item.name}</span>
                    </div>
                </div>
            })}
        </div>
    }

    return <div className="game-top-container">
        <div className={`game-top-content ${goGameLoading && 'loading'}`}>
            {/* 真人 */}
            {data.typeId == 12 && list.map((item, index) => {
                return <div className='game-item' key={index}>
                    <img className='game-icon' src={require(`../../../assets/images/header/game-bg/${data.typeId}-${index + 1}.png`)} alt="" />
                    <Button onClick={() => goGamePage(item)} className='game-name'>{item.nameI18N}</Button>
                </div>
            })}
            {/* 体育 */}
            {data.typeId == 13 && list.map((item, index) => {
                return <div className='game-item' key={index}>
                    <img className='game-icon' src={require(`../../../assets/images/header/game-bg/${data.typeId}-${index + 1}.png`)} alt="" />
                    <Button onClick={() => goGamePage(item)} className='game-name'>{item.nameI18N}</Button>
                </div>
            })}
            {/* 电子 */}
            {data.typeId == 14 && list.map((item, index) => {
                return <div className='game-item' key={index}>
                    <img className='game-icon' src={require(`../../../assets/images/header/game-bg/${data.typeId}-${index + 1}.png`)} alt="" />
                    <Button onClick={() => goGamePage(item)} className='game-name'>{item.nameI18N}</Button>
                </div>
            })}
            {/* 棋牌 */}
            {data.typeId == 16 && list.map((item, index) => {
                return <div className='game-item02' key={index}>
                    <img className='game-icon' src={require(`../../../assets/images/header/game-bg/${data.typeId}-${index + 1}.png`)} alt="" />
                    <div className='game-r'>
                        <div className='game-name'>{item.nameI18N}</div>
                        <Button onClick={() => goGamePage(item)} className='game-btn'>{t('home_48')}</Button>
                    </div>
                </div>
            })}
            {/* 捕鱼 */}
            {data.typeId == 18 && list.map((item, index) => {
                return <div className='game-item' key={index}>
                    <img className='game-icon' src={require(`../../../assets/images/header/game-bg/${data.typeId}-${index + 1}.png`)} alt="" />
                    <Button onClick={() => goGamePage(item)} className='game-name'>{item.nameI18N}</Button>
                </div>
            })}
            {/* 斗鸡 */}
            {data.typeId == 29 && list.map((item, index) => {
                return <div className='game-item02' key={index}>
                    <img className='game-icon' src={require(`../../../assets/images/header/game-bg/${data.typeId}-${index + 1}.png`)} alt="" />
                    <div className='game-r'>
                        <div className='game-name'>{item.nameI18N}</div>
                        <Button onClick={() => goGamePage(item)} className='game-btn'>{t('home_48')}</Button>
                    </div>
                </div>
            })}
            {/* 双赢(彩票) */}
            {data.typeId == 30 && list.map((item, index) => {
                return <div className='game-item02' key={index}>
                    <img className='game-icon' src={require(`../../../assets/images/header/game-bg/${data.typeId}-${index + 1}.png`)} alt="" />
                    <div className='game-r'>
                        <div className='game-name'>{item.nameI18N}</div>
                        <Button onClick={() => goGamePage(item)} className='game-btn'>{t('home_48')}</Button>
                    </div>
                </div>
            })}
        </div>

        <Modal title={gameTitle}
            visible={isModalOpen}
            width={890}
            footer={null}
            zIndex={9999999}
            onCancel={() => initSet(false)}
            className="game-content"
            maskClosable={false}
        >
            <div className="content">
                <div className="game-tabs">
                    {tab.map((item, index) => {
                        return <div onClick={() => setTabIndex(index)} key={index} className={`game-tab ${tabIndex == index ? 'active' : ''}`}>
                            <span className='title'>{item.title}</span>
                            <span className='num'>{item.num}</span>
                        </div>
                    })}
                </div>
                <div className={loading ? 'loading' : ''}>
                    {[gameList, gameCollectList][tabIndex].length > 0 ? gameListDom() : <Empty style={{ margin: '100px auto' }} description={t('noData')} />}
                </div>
            </div>
        </Modal>
        {/* 快捷登录 */}
        <Modal centered="true" destroyOnClose="true" width={380} className="login-modal" zIndex={2000} onCancel={() => { setLoginVisible(false) }}
            visible={loginVisible} footer={null}>
            <LoginBase type={0} FreshUser={freshUser} onOk={() => setLoginVisible(false)} />
        </Modal>
    </div>
}
