import React, { useCallback, useEffect } from "react";
import useContextReducer from '../../state/useContextReducer.js'
import { Local } from "../../common/index.js";

export default function redux(props) {
    const { state: { user, live }, fetchUtils } = useContextReducer.useContextReducer()
    //  
    const { freshUser } = fetchUtils
    const init = () => {
        let { initFreshUser, getFreshUser } = props
        getFreshUser && getFreshUser(freshUser)
        const token = Local('token2')
        if (!token) return;
        initFreshUser && freshUser()
    }
    const update = useCallback(() => {
        let { getUser } = props
        getUser && getUser(user)
    }, [user])
    const updateLiveRoom = useCallback(() => {
        let { getLive } = props
        getLive && getLive(live)
    }, [live])
    useEffect(init, []);
    useEffect(update, [user])
    useEffect(updateLiveRoom, [live])

    return <div className="redux"></div>
}