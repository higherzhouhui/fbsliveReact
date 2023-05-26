import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import React, { Suspense, useCallback, useEffect } from "react";
import useContextReducer from './state/useContextReducer';
import GetUserInfo from './util/useUserInfo';
import GetGiftData from './util/useGiftData';
import { levelProp } from './server/live';
import { Local } from '../common';
import { ProGetUrl } from './server/promotion';

let onRouterBefore;
let RouterLoading;

//路由导航，设置redirect重定向 和 auth权限
function Guard({ element, meta }) {
    const { pathname } = useLocation();
    const nextPath = onRouterBefore ? onRouterBefore(meta, pathname) : pathname;
    if (nextPath && nextPath !== pathname) {
        element = <Navigate to={nextPath} replace={true} />;
    }
    return element;
}


// 路由懒加载
function lazyLoadRouters(page, meta) {
    const { pathname } = useLocation();

    meta = meta || {};
    const LazyElement = React.lazy(page);
    const GetElement = () => {
        const { dispatch,
            state: {
                isLogin,
                common: { Im },
            },
            fetchUtils: { HandleGetZj, userGetUserAsserGold, FollowList },
        } = useContextReducer.useContextReducer()
        const init = useCallback(async () => {
            // baseInfo获取
            // if (pathname == '/login' && !Local('baseInfo')?.wsServiceUrl) {
            //     await ProGetUrl()
            // }
            if (Local('token') && !Local('baseInfo')?.wsServiceUrl) {
                await ProGetUrl()
            }

            if (!isLogin && meta.auth) {
                const userInfo = await GetUserInfo(true)
                if (!(userInfo instanceof Error)) {
                    if (userInfo) {
                        dispatch(() => {
                            return {
                                type: "LOGIN",
                                payload: true
                            }
                        })
                        dispatch(() => {
                            return {
                                type: "UPDATE_USERINFO",
                                payload: userInfo
                            }
                        })
                    }
                }
                // 金额接口
                userGetUserAsserGold()
                // 直播间礼物
                const giftData = await GetGiftData(true)
                if (!(giftData instanceof Error)) {
                    if (giftData) {
                        console.log('giftData----', giftData);
                        dispatch(() => {
                            return {
                                type: "live/SetGiftData",
                                payload: giftData,
                            };
                        });
                    }
                }
                //  等级资源
                await levelProp()
                //座驾资源
                await HandleGetZj()
                // 直播列表
                FollowList()
            }
        }, [])
        useEffect(() => {
            init()
        }, [init])
        useEffect(() => {
            if (pathname != '/liveRoom') {
                dispatch({ type: "live/SetIssue", payload: {} })  //清除直播间开起游戏弹窗
            }

        }, [])
        return (
            <Suspense fallback={<RouterLoading />}>
                <LazyElement />
            </Suspense>
        );
    };
    return <Guard element={<GetElement />} meta={meta} />;
}

function transRoutes(routes) {
    const list = [];
    routes.forEach((route) => {
        const obj = { ...route };
        if (obj.redirect) {
            obj.element = <Navigate to={obj.redirect} replace={true} />
        }
        if (obj.page) {
            obj.element = lazyLoadRouters(obj.page, obj.meta)
        }
        if (obj.children) {
            obj.children = transRoutes(obj.children)
        }
        ['redirect', 'page', 'meta'].forEach(name => delete obj[name]);
        list.push(obj)
    });
    return list
}
function RouterGuard(params) {
    onRouterBefore = params.onRouterBefore;
    RouterLoading = () => params.loading || <></>;
    return useRoutes(transRoutes(params.routers));
}
export default RouterGuard;