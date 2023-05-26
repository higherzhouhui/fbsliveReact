import React, { useEffect, useState } from "react"
import Draggable from 'react-draggable';
import { Local } from '@/common'
import { useNavigate } from "react-router";
import { getUserAsserGold } from '@/api/live'
import './style/gameiframe.scss';

export default function GameIframe(props) {
    const { currentGame, onClose } = props
    const [game, setGame] = useState('saiche')
    const [locationHost, setLocationHost] = useState('https://game.testlive.vip')
    const token = Local('token2')
    const device = 'pc'
    const udid = Local("finger") || "empty";
    const [iframeSrc, setIframeSrc] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useNavigate();
    const gameList = [
        {url: 'saiche', code: 'race1m'},
        {url: 'toubao', code: 'tz'},
        {url: 'xocdia', code: 'ft'},
        {url: 'jsks', code: 'jsks'},
        {url: 'yuxx', code: 'yuxx'},
        {url: 'txssc', code: 'txssc'},
        {url: 'pk10', code: 'pk10'},
        {url: 'xyft', code: 'xyft'},
        {url: 'yflhc', code: 'yflhc'},
    ]
    const locationHostList = [
        {hostKey: '.fbs98.com', href: 'https://game.fbs98.com'},
        {hostKey: '.fbslive.com', href: 'https://game.fbslive.com'}
    ]
    const lhost = location.host
    locationHostList.forEach(item => {
        if (item.hostKey.includes(lhost)) {
            setLocationHost(item.href)
        }
    })

    useEffect(() => {
        const fliterGame = gameList.filter(item => {return item.code === currentGame})
        if (fliterGame.length) {
            setGame(fliterGame[0].url)
        }
    }, [currentGame])

    useEffect(() => {
        const src = `${locationHost}/${game}?token=${token}&udid=${udid}&device=${device}`
        setIframeSrc(src)
        document.getElementById('myGameIframe').onload = function() {
            setLoading(false)
        }
    }, [locationHost, game ])

    useEffect(() => {
        const receiveMessageIframePage = (data) => {
            const { type } = data.data
            switch (type) {
                case 'jumpCharge' : history('/user/wallet'); break;
                case 'closeGame' : onClose && onClose(); break;
                case 'freshMoney' : getUserAsserGold(); break;
            }
        }
        window.addEventListener('message', receiveMessageIframePage, false);

        // 根据当前location.href

        return () => window.removeEventListener('message', receiveMessageIframePage);
    }, [])

    return <Draggable>
       <div className={`gameiframeContainer ${loading && 'loading'}`}>
        <iframe src={iframeSrc} id="myGameIframe" />
        {/* <div className="closeArea" onClick={() => onClose && onClose()}/> */}
       </div>
    </Draggable>
}