import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Local } from '../../common';
import LeftDom from './components/leftdom';
import useContextReducer from "../../state/useContextReducer";
import Footer from '../../components/footer/index'
import './index.scss'
export default () => {
    const { state: { user } } = useContextReducer.useContextReducer();
    useEffect(() => {
        if (!Local('token2')) window.location.href = '/'
    }, [])
    return <div className='user-container'>
        <div className='center-box'>
            <div className='left'>
                <LeftDom userInfo={user} />
            </div>
            <div className='right'>
                <Outlet />
            </div>
        </div>
        <Footer />
    </div>
}