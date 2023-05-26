import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { getUrlDomain } from "../../utils/tools";
import { Statistic, Carousel } from 'antd';
import { Local } from "../../common/index.js";
import { liveListV2 } from '../../api/live'
import { Modal, Input, Button, Skeleton } from 'antd'
import { useNavigate } from "react-router-dom";
import useContextReducer from '../../state/useContextReducer.js'
import LoginBase from '../../components/header/login/index'
import LiveItem from '../live/components/item'
import QRCode from 'qrcode.react';
import AOS from 'aos';
import CountUp from 'react-countup';
import Footer from '../../components/footer/index'
import 'aos/dist/aos.css';
import './index.scss'
const formatter = (value) => <CountUp end={value} separator="," />;

export default () => {
  const history = useNavigate();
  const { t } = useTranslation();

  const gameList = [
    { index: 0, title: t('home_20'), desc: t('home_21'), gameBg: "game01" },
    { index: 1, title: t('home_22'), desc: t('home_23'), gameBg: "game02" },
    { index: 2, title: t('home_24'), desc: t('home_25'), gameBg: "game03" },
    { index: 3, title: t('home_26'), desc: t('home_27'), gameBg: "game04" },
    { index: 4, title: t('home_28'), desc: t('home_29'), gameBg: "game05" },
    { index: 5, title: t('home_30'), desc: t('home_31'), gameBg: "game06" },
    { index: 6, title: t('home_32'), desc: t('home_33'), gameBg: "game07" },
  ]
  const serveList1 = [
    { index: 0, title: t('home_34'), subtitle: "AVERAGE TIME OF DEPO", unit: t('home_38'), num: "60" },
    { index: 1, title: t('home_35'), subtitle: "AVERAGE TIME OF WITH", unit: t('home_38'), num: "100" },
    { index: 2, title: t('home_36'), subtitle: "PAYMENT PLATFORM PAR", unit: t('home_39'), num: "26" },
    { index: 3, title: t('home_37'), subtitle: "GAMING PROVIDER PART", unit: t('home_39'), num: "17" },
  ]
  const serveList2 = [
    { index: 0, icon: "serve01", title: t('home_40'), desc: t('home_41') },
    { index: 1, icon: "serve02", title: t('home_42'), desc: t('home_43') },
    { index: 2, icon: "serve03", title: t('home_44'), desc: t('home_45') },
    { index: 3, icon: "serve04", title: t('home_46'), desc: t('home_47') },
  ]
  const {
    state: {
      user,
      common: { ad },
      liveBanner: StateLiveBanner,
      live: { liveData }
    },
    fetchUtils: { freshUser, updateLiveBanner, updateLiveTagRooms },
    dispatch
  } = useContextReducer.useContextReducer();

  // 首页活动banner
  const [banner, setBanner] = useState(StateLiveBanner);

  const [qrcodeUrlAPP, qrcodeUrlAPPSet] = useState("https://download.fbslive.com")
  const [qrcodeUrlH5, qrcodeUrlH5Set] = useState(getUrlDomain() || `http://fbslive.com/`)

  const [gameIndex, gameIndexSet] = useState(0)
  const [gameObj, gameObjSet] = useState(gameList[0])
  const [liveLoading, setLiveLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [url, setUrl] = useState('')
  const [Password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const carouselRef = useRef()
  // 获取banner，数据重构
  useEffect(() => {
    const banner = ad.filter((v) => v.jumpUrl && (v.pcContent.indexOf("http") == 0 || v.pcContent.indexOf("https") == 0) && v.type != 11)
      .map((item) => ({
        pid: item.pid,
        pcContent: item.pcContent,
        jumpUrl: item.pcJumpUrl,
      }))
    setBanner(banner);
    updateLiveBanner(banner);
  }, [ad]);


  AOS.init({
    duration: 1000,
    easing: 'ease-out-back',
    delay: 600
  })

  const setRoomsF = (liveDatas) => {
    const list = []
    liveDatas.listDataVos.forEach(detail => {
      detail.liveListRoomBaseVO.liveStartLottery = detail.liveListRoomLotterys || []
      const realDetail = {
        ...detail.liveListRoomBaseVO,
        ...detail.liveListAnchorInfoVO,
        storeDetail: detail
      }
      list.push(realDetail)
    })
    // 处理逻辑,数量是5的倍数5,10才显示,最多显示10个
    if (list.length >= 10) {
      setRooms(list.slice(0, 10))
    } else if (list.length >= 5 && list.length < 10) {
      setRooms(list.slice(0, 5))
    } else {
      setRooms(list)
    }
  }

  const getLiveList = async (liveData) => {
    setLiveLoading(true)
    if (liveData?.listDataVos?.length || liveData?.tagListVOS?.length) {
      setRoomsF(liveData) //判断是否展示
    } else {
      const res = await liveListV2({ uid: Local("userInfo2")?.uid || "", type: 0 });
      if (!(res instanceof Error)) {
        if (res) {
          const tagList = res.tagListVOS || []
          const listData = res.listDataVos || []
          tagList.map(item => {
            item.liveDetails = []
            item.liveIds.map(liveId => {
              listData.forEach(detail => {
                if (liveId === detail.liveId) {
                  item.liveDetails.push(detail)
                }
              })
            })
          })
          setRoomsF(res) //判断是否展示

          updateLiveTagRooms(tagList);
          // setTags(tagList)
          dispatch(() => {
            return {
              type: "live/SetLiveData",
              payload: res,
            };
          });
        }
      }
    }
    setLiveLoading(false)
  }








  const SuspenseContent = (key) => {
    return (
      <div key={key} className='live-list-box-a2 live-list-box-a'>
        <div className='live-item'>
          <div className='top-info'>
            <div className="logo">
              <Skeleton.Image active="true" className='logo-img' />
            </div>
          </div>
          <div className='bottom-info flex f-a-c f-j-sb'>
            <Skeleton.Input active="true" style={{ height: 20 }} />
          </div>
        </div>
      </div>
    )
  }
  // 密码房间跳转
  const setSearch = (item) => {
    const token = Local('token2')
    if (!token) return setLoginVisible(true)
    dispatch({ type: "live/SetLiveDetail", payload: item.storeDetail });
    let passUrl = `/live/detail?liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&price=${item.roomPrice}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&isAutoLive=${item.isAutoLive}`;
    let url = `/live/detail?avatar=${item.avatar}&liveId=${item.liveId}&anchorId=${item.anchorId}&type=${item.type}&manage=${user.manage}&price=${item.roomPrice}&isAd=${item.isAd}&pking=${item?.pking}&flvUrl=${item.flvUrl}&adJumpUrl=${item.adJumpUrl}&webRtcUrl=${item.webRtcUrl}&isAutoLive=${item.isAutoLive}&loopVideoUrl=${item.loopVideoUrl}`
    // if (item.type != 3) {
    history(url, { state: { liveId: item.liveId } })
    // } else {
    // setVisible(true)
    // setUrl(passUrl)
  }

  //    // 密码房间跳转
  //    const setSearch = (item) => {
  //     console.log('item-----------------', item);

  //     const token = Local('token2')
  //     if (!token) return setLoginVisible(true)
  //     // 进房前将基础信息存储起来


  //     history(url, { state: { liveId: item.liveId } })
  //     // // 如果是超管则不需要提示密码
  //     // if (item.type != 3 || user.manage === 1) {
  //     //     history(url, { state: { liveId: item.liveId } })
  //     // } else {
  //     //     setVisible(true)
  //     //     setUrl(passUrl)
  //     // }
  // }



  const toApp = () => {
    window.open('https://jump.bjjyht.com.cn/app/4/i75ia2')
    setVisible(false)
  }
  const toRoom = () => {
    let link = `${url}&password=${Password}`
    history(link)
  }
  const itemClick = (data) => {
    const w = window.open('about:blank');
    switch (data.pid) {
      case 1001:
        w.location.href = "/saveMoney"
        break;
      case 1005:
        w.location.href = `/weeklyDeposit?src=${data.jumpUrl}`
        break;
        // case 1006:
        //   w.location.href = `/sendLottery?src=${data.jumpUrl}`
        break;
      default:
        w.location.href = `/activeDetail?src=${data.jumpUrl}`
        break
    }
  }
  useEffect(() => {
    getLiveList(liveData)
  }, [liveData])
  useEffect(() => {
    window.eventBus.emit('checkTolive', true)
    let agentId = sessionStorage.getItem("agentId");
    if (agentId != undefined && agentId != null) {
      qrcodeUrlAPPSet(`https://download.fbslive.com?agentId=${agentId}`)
      qrcodeUrlH5Set(`${getUrlDomain()}?agentId=${agentId}`)
    }
  }, [])
  const handlePre = () => {
    carouselRef.current.prev()
  }
  const handleNext = () => {
    carouselRef.current.next()
  }
  return <div className='homeContainer'>
    <div className={'banner '}>
      <Carousel autoplay effect="fade" ref={carouselRef}>
        {banner.map((item, index) => {
          return <div key={index} onClick={() => itemClick(item)} className='bannerWrapper'>
            <img src={item.pcContent} alt='1' className={'bg-img'} />
          </div>
        })}
      </Carousel>
      <img src={require('../../assets/images/home/pre-btn.png')} alt="prev" className='btn pre-btn' onClick={() => handlePre()} />
      <img src={require('../../assets/images/home/next-btn.png')} alt="next" className='btn next-btn' onClick={() => handleNext()} />
    </div>
    <div className={`container-live ${liveLoading ? 'loading' : ''}`}>
      <div className='w1200'>
        {/* 热门直播 */}
        {rooms.length > 0 &&
          <div>
            <div className='homo-title'>
              <div className='title'>{t('home_6')}</div>
              <div className='subtitle'>{t('home_7')}</div>
            </div>
            <div className='live-content'>
              <div className='live-group'>
                {liveLoading ? Array(5)
                  .fill('').map((item, index) => SuspenseContent(index)) :
                  rooms.map((item, index) => {
                    return <div key={item.anchorId.toString() + '-type-2'} className='live-list-box-a' onClick={() => setSearch(item)}>
                      <LiveItem info={item} />
                    </div>
                  })}
              </div>
            </div>
          </div>
        }
        {/* APP下载 */}
        <div className='homo-title'>
          <div className='title'>{t('home_18')}</div>
          <div className='subtitle'>{t('home_19')}</div>
        </div>
        <div className='app-content'>
          <div className='app-con-left'>
            <div className='title'>{t('home_8')}</div>
            <div className='tips'>{t('home_9')}</div>
            <div className='qr-code'>
              <div className='code' onClick={() => window.open(qrcodeUrlAPP, "_blank")}>
                <div className='code-pd10'><QRCode value={qrcodeUrlAPP} size={170} /></div>
                <span>{t('home_10')}</span>
                <span>{t('home_11')}</span>
              </div>
              <div className='code' onClick={() => window.open(qrcodeUrlH5, "_blank")}>
                <div className='code-pd10'><QRCode value={qrcodeUrlH5} size={170} /></div>
                <span>{t('home_12')}</span>
                <span>{t('home_13')}</span>
              </div>
            </div>
          </div>
          <div className='app-con-right'></div>
        </div>
        {/* 热门游戏 */}
        <div className='homo-title'>
          <div className='title'>{t('home_14')}</div>
          <div className='subtitle'>{t('home_15')}</div>
        </div>
        <div className='game-content'>
          <div className='left-item'>
            {gameList.map((item, index) => {
              return <div key={index} className={`item ${index == gameIndex && 'game-active'}`} onClick={() => { gameIndexSet(index), gameObjSet(item) }}>
                <span className="num">0{index + 1}</span>
                <span className="title">{item.title}</span>
                <span className="icon-game-right"></span>
              </div>
            })}
          </div>
          <div className='right-bg'>
            <div className='title'>{gameObj.title}</div>
            <div className='desc'>{gameObj.desc}</div>
            <img className='game-bg' src={require(`../../assets/images/home/${gameObj.gameBg}.png`)} />
          </div>
        </div>
        {/* 优质服务 */}
        <div className='homo-title'>
          <div className='title'>{t('home_16')}</div>
          <div className='subtitle'>{t('home_17')}</div>
        </div>
        <div className='serve-content'>
          <div className='nav-list1'>
            {serveList1.map((item, index) => {
              return <div key={index} className='list1'>
                <div className='icon-bg'>
                  <div className='num'>
                    <Statistic title={null} value={item.num} formatter={formatter} valueStyle={{ color: "#FC708B", fontSize: "40px" }} />
                  </div>
                  <div className='unit'>{item.unit}</div>
                </div>
                <div className='title'>{item.title}</div>
                <div className='subtitle'>{item.subtitle}</div>
              </div>
            })}
          </div>
          <div className='nav-list2'>
            {serveList2.map((item, index) => {
              return <div key={index} className='list2'>
                <img className='icon' src={require(`../../assets/images/home/${item.icon}.png`)} alt="" />
                <div className='con'>
                  <div className='title'>{item.title}</div>
                  <div className='desc'>{item.desc}</div>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>

    <Footer />
    <Modal onCancel={() => setVisible(false)} title={t('ui_prompt')}
      footer={[<Button key="cansol" onClick={toApp}>{t('f_ui_download_theapp')}</Button>,
      <Button key="sure" type="primary" onClick={toRoom}>{t('enterRoom')}</Button>]}
      className='small-alert' visible={visible} width={380}>
      <Input.Password value={Password} onChange={(e) => { setPassword(e.target.value) }} placeholder={t('login__passwordPlaceholder')} style={{ marginBottom: 20 }} />
    </Modal>
    {/* 快捷登录 */}
    <Modal centered="true" destroyOnClose="true" width={380} className="login-modal" onCancel={() => { setLoginVisible(false) }}
      visible={loginVisible} footer={null}>
      <LoginBase type={0} FreshUser={freshUser} onOk={() => setLoginVisible(false)} />
    </Modal>
  </div>
}