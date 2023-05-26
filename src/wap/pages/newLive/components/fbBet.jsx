import { Button, Collapse, Ellipsis, InfiniteScroll, Input, Popup, Toast, NoticeBar, Image } from "antd-mobile";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { fbBet, getBetMatchDetail, getBetMatchList, getBetOdds, getCollectList, getHisTotal, getOtherUrl, getRecordList, getUnRes } from "../../../server/fbBet";
import { GetBtiType, GetHistorLottery, Getissue, LotteryResult, LotteryType, gameBalanceInLiveRoom } from "../../../server/live";
import { freeTime, getLength } from "../../../util/tool";
import { BackAllGameCoin, autoUpBalance, getBalance, gameForwardGame } from "../../../server/balance";

import style from './common.module.scss'
import MatchItem from "./gameBet/matchItem";
import useContextReducer from '../../../state/useContextReducer.js'
import { DownCircleOutline } from 'antd-mobile-icons'
import { useNavigate } from "react-router-dom";
import { useCopy } from '../../../../utils/copy'
import { Local } from "../../../../common";
import { accountGetbalance } from "../../../server/tipsPopUp";
import { uuidv4 } from "../../../../utils/tools";
const TransferAccounts = React.lazy(() => import("../../Center/balance/transferAccounts"));
// const PointOut = React.lazy(() => import('../../../components/pointOut/index'))
let time = null
let betTime = null
export default function FbBet() {
  const history = useNavigate()
  const { t } = useTranslation()
  const copy = useCopy()
  const [showBody, setShowBody] = useState(false)
  let [tabIndex, setTabIndex] = useState(0)
  let [pointTabIndex, setPointTabIndex] = useState(0)
  let [showMore, setShowMore] = useState(false)
  let [moreIndex, setMoreIndex] = useState(0)
  let [moreIndex1, setMoreIndex1] = useState(0)
  let [moreIndex2, setMoreIndex2] = useState(0)

  let [moreUuidv4, setMoreUuidv4] = useState('')
  let [showBetInfo, setShowBetInfo] = useState(false)
  let [matchList, setMatchList] = useState({ list: [], total: 0 })
  let [matchList2, setMatchList2] = useState({ list: [], total: 0 })

  let [matchDetail, setMatchDetail] = useState({ dx: [], dy: [], bd: [] })
  let [money, setMoney] = useState('')
  let [collect, setCollect] = useState([])
  let [unRes, setUnRes] = useState(0)
  let [totalPage, setTotalPage] = useState(1)
  let [listHasMore, setListHasMore] = useState(true)
  let [statistics, setStatistics] = useState({
    betAmount: 0,
    betNum: 0
  })
  let [renovate, renovateSet] = useState(false)
  let [filterD, filterDSet] = useState('') //更多比赛输入框
  let [focusD, focusDSet] = useState(false) //输入框聚焦

  const [v30Money, v30MoneySet] = useState(0);
  const [autoUpBalances, autoUpBalancesSet] = useState({});
  const [showTrans, setShowTrans] = useState(false);
  const [transformations, transformationsSet] = useState(true);

  const [showRecord, setShowRecord] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const {
    state: { user, assergoldData },
    fetchUtils
  } = useContextReducer.useContextReducer();
  const { freshUser, userGetUserAsserGold } = fetchUtils;

  const oddsList = useMemo(() => {
    if (pointTabIndex === 0) return matchDetail.dx
    if (pointTabIndex === 1) return matchDetail.dy
    if (pointTabIndex === 2) return matchDetail.bd
    return []
  })
  const goItemData = useRef()
  const tab = [{ name: t('gun_qiu'), type: 1 }, { name: t('zao_pan'), type: 4 }, { name: t('shou_cang'), type: 99 }, { name: t('wan_zheng') }]
  const pointTab = [{ name: t('da_xiao') }, { name: t('du_ying') }, { name: t('bo_dan') }]

  useEffect(() => {
    if (showBody && tabIndex < 3) {
      setMatchDetail({ dx: [], dy: [], bd: [] })
      setListHasMore(true)
      getMatchList()
    }
  }, [tabIndex])

  useEffect(() => {
    return () => {
      clearTimeout(time)
    }
  }, [])

  //获取比赛列表
  const getMatchList = async () => {
    const res = await getBetMatchList({ current: totalPage, matchType: tab[tabIndex].type })
    if (!(res instanceof Error)) {
      console.log('获取比赛信息', res);

      if (totalPage <= res?.pageTotal) {
        let list = matchList.list
        // uuidv4
        res.records.forEach((value) => {
          value.uuidv4 = uuidv4()
        })
        setMatchList({ list: [...list, ...res?.records], total: res?.total })
        setMatchList2({ list: [...list, ...res?.records], total: res?.total })
        setTotalPage(totalPage + 1)
        // getMatchDetail() //获取投注信息
      } else {
        setListHasMore(false)
      }
    } else {
      setMatchList({ list: [], total: 0 })
      setMatchList2({ list: [], total: 0 })
    }
  }
  const getMatchDetail = async () => {
    clearTimeout(time)
    const res = await getBetMatchDetail({ matchId: match?.id })
    if (!(res instanceof Error)) {
      console.log('getBetMatchDetail', res);
      const jsn = { dx: [], dy: [], bd: [] }
      const type = [1007, 1005, 1099]//亚盘大小球，独赢，波胆
      let list = res?.mg.filter((item) => { return item?.pe === 1001 && type.includes(item?.mty) })
      for (let item of list) {
        item.mks = item.mks?.map(item => {
          return { ...item, matchId: res.id }
        })
        switch (item?.mty) {
          case 1007:
            jsn.dx = item?.mks;
            break
          case 1005:
            jsn.dy = item?.mks;
            break
          case 1099:
            jsn.bd = item?.mks
        }
      }
      setMatchDetail(jsn)
      if (showBody) {
        time = setTimeout(() => {
          !showMore && !showBetInfo && !showRecord && getMatchDetail()
        }, 10000);
      }
    } else {
      console.log('错误错误');
    }
  }

  useEffect(() => {
    if (matchList.list.length > 0 && showBody) {
      getMatchDetail()
    }
  }, [moreIndex, moreIndex1, moreIndex2, matchList, showBody])
  const match = useMemo(() => {
    if (matchList.list?.length > 0) {
      return (tabIndex == 0 ? matchList.list[moreIndex] : tabIndex == 1 ? matchList.list[moreIndex1] : tabIndex == 2 ? matchList.list[moreIndex2] : matchList.list[0]) || {}
    } else return {}
  })

  const getCollect = async () => {
    const res = await getCollectList()
    if (!(res instanceof Error)) {
      setCollect(res?.map(item => item?.matchId))
    }
  }

  //获取未结算数据
  const getUnResult = async () => {
    const res = await getUnRes()
    if (!(res instanceof Error)) {
      setUnRes(res)
    }
  }

  const getTotal = async () => {
    const res = await getHisTotal({ type: nav[navIndex]?.type })
    if (!(res instanceof Error)) {
      setStatistics(res)
    }
  }

  const init = useCallback(() => {
    getMatchList()
    getCollect()
    getUnResult()
  }, [])
  useEffect(() => {
    if (showBody) {
      init()
    }
  }, [init])

  const jumpFb = async () => {
    // let params = { gameId: 400, gameType: 5 }
    let data = {
      banlance: v30Money,
      gameId: "400",
      nameI18N: "FB Sports",
      type: 5,
    }
    history("/gameIframe", { state: data })
    // const res = await gameForwardGame(params)
    // // const res = await getOtherUrl()

    // if (!(res instanceof Error)) {
    //     console.log('jumpFb', res);
    //     location.href = res.url
    // }
  }

  const changeCollect = (e) => {
    let arr = JSON.parse(JSON.stringify(collect))
    let index = arr.findIndex(item => item === e)
    if (index < 0) {
      arr.push(e)
    } else {
      arr.splice(index, 1)
    }
    setCollect(arr)
  }

  const complete = () => {
    return <div className={style.complete}>
      <img src={require('../../../assets/image/live/lottery/fbwz.png')} alt="" className={style.completeBg} />
      {t('geng_duo_wf')}
      <Button color="primary" className={style.completeBtn} loading="auto" onClick={() => jumpFb()}>{t('que_ren')}</Button>

      {/* 底部 */}
      <div className={style.fbBody_bottom}>
        <div className={style.money}>
          <img src={require("../../../assets/image/center/icon-gold.png")} className={style.iconGold} /> {v30Money || 0}
        </div>
        <img
          className={style.zzImg}
          onClick={() => {
            // window.eventBus.emit("setShowTransD");

            console.log(goItemData.current);
            setShowTrans(true)
          }}
          src={require("../../../assets/image/live/lottery/zzicon.png")}
          alt=""
        />
        <img onClick={() => {
          FbrenovateF()
        }} className={renovate ? style.lotteryFresh2Z : ''} src={require('../../../assets/image/live/lottery/lotteryFresh2.png')} alt="" />
      </div>
    </div>
  }

  const FbrenovateF = async () => {
    renovateSet(true)
    const moneyRes = await getBalance({ gameType: 5 })
    if (!(moneyRes instanceof Error)) {
      // window.eventBus.emit("freshYnOpen"); //关闭转圈
      // console.log("新查询游戏余额", moneyRes);
      if (moneyRes != undefined) {
        v30MoneySet(moneyRes?.balance);
        goItemData.current = {
          ...goItemData.current,
          banlance: moneyRes?.balance || 0,
        };
      } else {
        goItemData.current = {
          ...goItemData.current,
          banlance: 0,
        };
        v30MoneySet(0);
      }
      goItemData.current = {
        ...goItemData.current,
        banlance: moneyRes?.balance || 0,
      };
      renovateSet(false)
    } else {
      v30MoneySet(0);
      goItemData.current = {
        ...goItemData.current,
        banlance: 0,
      };
      renovateSet(false)
    }
  }

  const betBody = () => {
    return <div className={style.fbBody}>
      {/* 顶部 */}
      <div className={style.fbBody_top}>
        <div className={style.fbBody_top_left}>
          <img src={require('../../../assets/image/live/live-icon-b5.png')} alt="" />
          {t('FBtiyu')}
        </div>

        <div className={style.fbBody_top_right}>
          <div onClick={() => { setShowRecord(true) }}>
            <img src={require('../../../assets/image/live/lottery/gzicon.png')} alt="" />
            <div>{t('jilu')}</div>
          </div>
          <div onClick={() => history('/recharge')}>
            <img src={require('../../../assets/image/live/lottery/czicon.png')} alt="" />
            <div>
              {t('ui_dep')}
            </div>
          </div>
        </div>
      </div>
      <div className={style.tab}>
        {/* <div className={style.records} onClick={() => setShowRecord(true)} >
                    <img src={require('../../../assets/image/live/live-record.png')} alt="" />
                    {unRes > 0 && <span>{unRes > 9 ? '9+' : unRes}</span>}
                </div> */}
        {tab?.map((item, index) => <div className={`${style.box} ${tabIndex === index ? style.active : ''}`} key={item?.name} onClick={() => {
          setMatchList({ list: [], total: 0 })
          setMatchList2({ list: [], total: 0 })

          setTabIndex(index)
          setTotalPage(1)
        }}>{item?.name}</div>)}

        {/* <img src={require('../../../assets/image/live/fb-close.png')} alt="" className={style.close} onClick={() => setShowBody(false)} /> */}
      </div>
      {tabIndex === 3 ? complete() : <div className={style.matchInformation_padd}>
        {/* {Object.keys(match).length > 0 && <MatchItem changeCollect={changeCollect} match={match} collect={collect} />}
                <div className={style.more} onClick={() => setShowMore(true)}>
                    {t('geng_duo_bs')} {matchList.total}+
                    <img src={require('../../../assets/image/live/fb-more.png')} alt="" />
                </div> */}
        {/* 头部 */}

        {/* 选中当前比赛 */}
        <div className={style.matchInformation}>
          {Object.keys(match)?.length > 0 && <MatchItem changeCollect={changeCollect} match={match} collect={collect} />}
          <div className={style.moreD}>
            <div className={style.more} onClick={() => setShowMore(true)}>
              {t('geng_duo_bs')} {matchList?.total}+
              {/* <img src={require('../../../assets/image/live/fb-more.png')} alt="" /> */}
            </div>
          </div>
        </div>
        {/* tab */}
        <div className={style.pointTab}>
          {pointTab?.map((item, index) =>
            <div className={`${style.box} ${pointTabIndex === index ? style.active : ''}`}
              key={`tab${index}`}
              id={`tab${index}`}
              onClick={() => setPointTabIndex(index)}>
              <span className={`${style.name} ${getLength(item?.name) >= 15 ? style.goBeyond : ""}`}>{item?.name}</span>
            </div>)}
        </div>
        {/* 内容 */}
        <div className={style.pointList}>
          {oddsList.length > 0 ? oddsList?.map((item, index) => {
            return <React.Suspense key={`boxTop${index}`}>
              {item.op?.map((val, key) => {
                // jinyong.png
                return <div className={`${style.box} ${!val?.od ? style.box2s : ''}`} key={`point${key}`} onClick={() => toBetDetail(item, val)}>
                  <div className={style.left}>{val?.nm}</div>
                  <div className={style.pointList_right}>
                    {betDataInfo?.change > 0 ? <img src={require('../../../assets/image/live/icon-shang.png')} className={style.pointList_right_img} />
                      : betDataInfo?.change < 0 ? <img src={require('../../../assets/image/live/icon-xia.png')} className={style.pointList_right_img} /> : ''}
                    {val?.od ? <span>{val?.od}</span> : <img className={style.lock} src={require('../../../assets/image/live/fb-lock.png')} />}
                  </div>
                </div>
              })}
            </React.Suspense>
          }) : <div className={style.empty}>{t('noData')}</div>}
        </div>
        {/* 底部 */}
        <div className={style.fbBody_bottom}>
          <div className={style.money}>
            <img src={require("../../../assets/image/center/icon-gold.png")} className={style.iconGold} /> {v30Money || 0}
          </div>
          <img
            className={style.zzImg}
            onClick={() => {
              // window.eventBus.emit("setShowTransD");
              setShowTrans(true)
            }}
            src={require("../../../assets/image/live/lottery/zzicon.png")}
            alt=""
          />
          <img onClick={() => {
            FbrenovateF()

            // userGetUserAsserGold()
            // renovateSet(true)
            // setTimeout(() => {
            //     renovateSet(false)
            // }, 1000)
          }} className={renovate ? style.lotteryFresh2Z : ''} src={require('../../../assets/image/live/lottery/lotteryFresh2.png')} alt="" />
        </div>
      </div>
      }
    </div>
  }

  const focusF = () => {
    focusDSet(true)
    // setMatchList({ list: [], total: 0 })
  }
  const filterDF = (e) => {
    filterDSet(e)
    console.log('matchList2?.listssssss', matchList2?.list);
    let data = matchList2?.list.filter((value, index) => {
      // return value.lg.na.indexOf(e) != -1 || value.lg.rnm.indexOf(e) != -1
      return value.nm.indexOf(e) != -1
    })
    console.log('data数据', data);
    // setMatchList(data)

    setMatchList({ list: data, total: data.length })
  }
  // 更多比赛列表
  const betMore = () => {
    return <div className={`${style.fbBodyMore} `}>
      <div className={style.title}>
        <img className={style.moreImg} src={require('../../../assets/image/live/fb-back.png')} alt="" onClick={() => { setShowMore(false), filterDSet(''), setMatchList(matchList2) }} />
        <div className={style.name}>{t('geng_duo_bs')}</div>
      </div>
      {/* setMatchList2 */}
      {/* 搜索 */}
      <div className={style.filter_div}>
        <Input
          className={style.filter_input}
          clearable
          value={filterD}
          onChange={(e) => filterDF(e)}

          onFocus={() => focusF()}
          onBlur={() => focusDSet(false)}
        />
        <div onClick={() => focusF()} className={`${style.filter_font} ${(focusD || filterD.length != 0) ? style.filter_font2 : ''}`}>
          <img src={require('../../../assets/image/game/zx/fdjb.png')} alt="" />
          {focusD || filterD.length != 0 ? '' : t('sousuobisai')}
        </div>
      </div>
      <div className={style.moreList}>
        {matchList?.list?.map((item, index) => {
          // uuidv4  active={moreIndex === index}  active={moreUuidv4 == item.uuidv4}
          return <MatchItem changeCollect={changeCollect} collect={collect} active={(tabIndex == 0 ? moreIndex : tabIndex == 1 ? moreIndex1 : tabIndex == 2 ? moreIndex2 : 0) === index} match={item} key={`more-key${index}`} handleClick={() => {
            tabIndex == 0 && setMoreIndex(index)
            tabIndex == 1 && setMoreIndex1(index)
            tabIndex == 2 && setMoreIndex2(index)


            // setMoreUuidv4(item.uuidv4)
            setShowMore(false)
          }} />
        })
        }
        <InfiniteScroll hasMore={listHasMore} loadMore={() => getMatchList()}></InfiniteScroll>
      </div>
    </div>
  }

  let [betDataInfo, setBetDataInfo] = useState({ min: 0, max: 0 })
  const toBetDetail = (item, val) => {
    val.id = item.id
    val.matchId = item.matchId
    setBetDataInfo(val)
    setShowBetInfo(true)
  }

  //投注前信息
  const betBefore = async () => {
    let params = {
      "betMatchMarketList": [
        {
          "marketId": betDataInfo?.id,
          "matchId": betDataInfo?.matchId,
          "type": betDataInfo?.ty
        }
      ],
      "isSelectSeries": true
    }
    const res = await getBetOdds(params)
    if (!(res instanceof Error)) {
      let [bms] = res.bms
      setBetDataInfo(Object.assign(betDataInfo, { min: bms?.smin, max: bms?.smax, change: bms?.op.od - betDataInfo?.od, od: bms?.op.od }))
      betTime = setTimeout(() => {
        betBefore()
      }, 4000)
    }
  }

  useEffect(() => {
    if (showBetInfo) {
      betBefore()
    }
    else {
      clearTimeout(betTime)
    }
  }, [showBetInfo])

  const handleBet = async () => {
    // if (money > v30Money) {
    //   setVisible2(true)

    //   return
    // }

    let params = {
      betOptionList: [{
        marketId: betDataInfo?.id,
        odds: betDataInfo?.od,
        oddsFormat: 1,
        optionType: betDataInfo?.ty
      }],
      oddsChange: 1,
      unitStake: money
    }
    console.log('params------------------', params);
    const res = await fbBet(params)
    if (!(res instanceof Error)) {
      Toast.show(t('betSuccess'))
      // freshUser()
      userGetUserAsserGold()

      getBalanceF() //刷新金额

      getUnResult()
      setRecordPage(0)
      setNavIndex(0)
      setHasMore(true)
      setRecordList({ list: [] })
      setShowBetInfo(false)
      setMoney('')
    }
  }

  // 注单详情
  const betInfo = () => {
    return <div className={style.fbBodyMore}>
      <div className={style.title}>
        <img src={require('../../../assets/image/live/fb-back.png')} alt="" onClick={() => setShowBetInfo(false)} />
        <div className={style.name}>{t('ui_betslip')}</div>
      </div>
      <div className={style.info}>
        <div className={style.timeBg}>
          <div className={style.time}>{match.bt ? freeTime(match?.bt, 'm-d h:i') : ''}</div>
        </div>
        {/* <dd>
                    <span>{match.ts[0].na}</span>
                    <span>VS</span>
                    <span>{match.ts[1].na}</span>
                </dd> */}
        <div className={style.home}>
          <Image src={match?.ts[0]?.lurl} className={style.logo} />
          <NoticeBar
            style={{
              '--background-color': 'transparent',
              '--border-color': 'transparent',
              '--font-size': '12px',
              'padding': '0',
              'height': '24px',
              'width': '100%',
              'color': 'rgba(255, 255, 255, .5)',
            }} icon={''} content={match?.ts[0]?.na}
          />

        </div>
        {/* <img className={style.center_img} src={require('../../../assets/image/live/lottery/vsicon.png')} alt="" /> */}
        {/* <dt>{betDataInfo?.nm} @ {betDataInfo?.od} {betDataInfo?.change > 0 ? <img src={require('../../../assets/image/live/icon-shang.png')} /> : betDataInfo?.change < 0 ? <img src={require('../../../assets/image/live/icon-xia.png')} /> : ''}</dt> */}
        <div className={style.center_font}>
          <div className={style.center_font_top}>
            <div>{betDataInfo?.nm}</div> @ <div>{betDataInfo?.od}</div>
          </div>
          <div className={style.font_bottom}>{t('bet')}</div>
        </div>

        <div className={style.away}>
          <Image src={match?.ts[1]?.lurl} className={style.logo} />
          <NoticeBar style={{
            '--background-color': 'transparent',
            '--border-color': 'transparent',
            '--font-size': '12px',
            'padding': '0',
            'height': '24px',
            'width': '100%',
            'color': 'rgba(255, 255, 255, .5)',
          }} icon={''} content={match?.ts[1]?.na}
          />
        </div>
      </div>
      <Input className={style.betInput} placeholder={`${betDataInfo?.min || 0}-${betDataInfo?.max || 0}`} value={money} style={{ '--color': "#fff" }} onChange={setMoney} type="number" />
      <Button className={style.betBtn} loading="auto" disabled={money < betDataInfo?.min || money > betDataInfo?.max} onClick={() => handleBet()
      }>
        <p>
          {/* {t('bet')}  */}
          {t('lijitouzhu')}
        </p>

      </Button>
      <div className={style.balance}>
        <span>{t('yu_ji_ky')}：{Math.floor(money * betDataInfo?.od * 100) / 100}</span>
        {/* {t('dang_qian_yue')}：{assergoldData?.goldCoin} <span onClick={() => history('/recharge')}>{t('ui_dep')}</span> */}
      </div>

      {/* 底部 */}
      <div className={style.fbBody_bottom}>
        <div className={style.money}>
          <img src={require("../../../assets/image/center/icon-gold.png")} className={style.iconGold} /> {v30Money || 0}
        </div>
        <img
          className={style.zzImg}
          onClick={() => {
            // window.eventBus.emit("setShowTransD");
            // history('/balance')
            setShowTrans(true)
          }}
          src={require("../../../assets/image/live/lottery/zzicon.png")}
          alt=""
        />
        <img className={renovate ? style.lotteryFresh2Z : ''} onClick={() => FbrenovateF()} src={require('../../../assets/image/live/lottery/lotteryFresh2.png')} alt="" />
      </div>

      {/* 提示 */}
      {/* <PointOut visible={visible2} visibleSet={() => setVisible2(false)} but2={() => history('/recharge')} type={2} /> */}
    </div>
  }

  const nav = [{ name: t('ui_bets_search_options.2'), type: 0 }, { name: t('ui_bets_search_options.1'), type: 5 }]
  const [navIndex, setNavIndex] = useState(0)
  const [recordPage, setRecordPage] = useState(0)
  const [recordList, setRecordList] = useState({ list: [] })
  const [hasMore, setHasMore] = useState(true)
  useEffect(() => {
    if (showBody) {
      getTotal()
    }
  }, [navIndex])

  // 状态
  const statusF = (i) => {
    switch (i) {
      case 0:
        return 'wjs';
      case 2:
        return 'jujue';
      case 3:
        return 's';
      case 4:
        return 'y';
      case 5:
        return 'yb';
      case 6:
        return 'sb';
      case 7:
        return 'qx';
    }
  }
  //  获取投注记录
  const getList = async () => {
    let params = {
      page: recordPage,
      type: nav[navIndex]?.type
    }
    const res = await getRecordList(params)
    if (!(res instanceof Error)) {
      if (typeof res === 'object' && res?.length > 0) {
        let list = recordList?.list
        setRecordPage(recordPage + 1)
        console.log('{ list: [...list, ...res] }-------', { list: [...list, ...res] });
        setRecordList({ list: [...list, ...res] })
      } else setHasMore(false)
    } else {
      setHasMore(false)
    }
  }
  const recordBody = () => {
    const esCenter = (e) => {
      return `${e?.substr(0, 5)} *** ${e?.substr(e.length - 2, e.length - 1)}`
    }
    const orderStatusB = (e) => {
      switch (e) {
        case 0:
          return style.orderStatus0
        case 1:
          return style.orderStatus0
        case 2:
          return style.orderStatus2
        case 3:
          return style.orderStatus3
        case 4:
          return style.orderStatus4
        case 5:
          return style.orderStatus5

      }
    }
    return <div className={`${style.fbBodyMore} ${style.recordList} nbg`}>
      <div className={style.head}>
        <img src={require('../../../assets/image/live/fb-back.png')} alt="" className={style.back} onClick={() => {
          setShowRecord(false)
        }} />
        <div className={style.nav}>
          {nav?.map((v, key) => {
            return <div className={`${style.box} ${navIndex === key ? style.active : ''}`} key={v.name} onClick={() => {
              setRecordPage(0)
              setNavIndex(key)
              setHasMore(true)
              setRecordList({ list: [] })
            }}>{v?.name}</div>
          })}
        </div>
      </div>
      <div className={style.rdBody}>
        <Collapse>
          {recordList.list?.map((item, index) => {
            return <Collapse.Panel key={index}
              title={
                <div className={style.colTitle}>
                  <div className={style.top}>
                    <div className={style.disFlex_fb}>
                      <div className={style.disFlex}>
                        <div className={style.orderNum}>{item?.orderNum ? esCenter(item?.orderNum) : ''}</div>
                        <img src={require('../../../assets/image/newImg/fb/fz.png')} alt="" className={style.copy} onClick={(e) => {
                          e.stopPropagation()
                          copy(item?.orderNum)
                        }} />
                      </div>
                      {navIndex == 0 && <div className={`${style.orderStatus} ${orderStatusB(item?.orderStatus)}`}>{t(`betOrderStatus${item?.orderStatus}`)}</div>}
                    </div>
                    <div>
                      <div className={style.time}>{item.createTime ? freeTime(item?.createTime, 'y-m-d h:i') : ''}</div>
                    </div>
                  </div>

                  <div className={style.moneyBottom}>
                    <div className={style.left}>
                      {t('ben_jin')}：{item?.stakeAmount}
                    </div>
                    <div className={style.right}>
                      {/* {t('ui_winable')}: {navIndex === 0 ? <span>{item?.maxWinAmount || 0}</span> : <span>{item?.settleAmount || 0}</span>} */}
                      {t('keying')}: {navIndex === 0 ? <span>{item?.maxWinAmount || 0}</span> : <span>{item?.settleAmount || 0}</span>}
                    </div>
                  </div>
                  <img src={require(`../../../assets/image/newImg/fb/${statusF(item?.settleResult)}.png`)} alt="" className={style.position_img} />
                </div>
              } arrow={<img src={require('../../../assets/image/newImg/fb/xia.png')} alt="" style={{ width: '15px', height: '15px' }} />} className={style.cardCol}>
              {/* style={{ backgroundImage: getStatusIcon(item, val) }} */}
              {item.details?.map((val, key) => <div className={style.details} key={key} >
                <p>{val?.matchName} {item?.orderStatus}</p>
                <p>{val?.optionName} @{val?.betOdds}</p>
              </div>)}
            </Collapse.Panel>
          })}
        </Collapse>
        <InfiniteScroll hasMore={hasMore} loadMore={() => getList()}></InfiniteScroll>
      </div>
      <div className={style.disFlexb}>
        <div>{t('rp_total_amount')}:{statistics?.betNum}</div>
        <div>{t('rp_bet')}:{statistics?.betAmount}</div>
      </div>
    </div>
  }

  const getStatusIcon = (item, val) => {
    const lang = Local('lang') || 'vie'
    let url = ''
    if (item?.orderStatus === 2) url = require(`../../../assets/image/fb/${lang}/icon-status2.png`)
    if (item?.orderStatus === 3) url = require(`../../../assets/image/fb/${lang}/icon-status3.png`)
    if (item?.orderStatus === 5 && val?.settleResult) url = require(`../../../assets/image/fb/${lang}/icon${val?.settleResult}.png`)
    return url ? `url(${url})` : 'auto'
  }
  // 转换
  const transformation = () => {
    // console.log('这是什么数据', info, user.goldCoin);
    // if (transformations) {
    //     setMoney2(user.goldCoin)
    // } else {
    //     setMoney2(info.balance)
    // }

    transformationsSet(!transformations);
  };
  // 打开弹窗
  const fbPhysicalCultureF = async () => {
    setShowBody(true)
    filterDSet('')


    if (tabIndex < 3) {
      setMatchDetail({ dx: [], dy: [], bd: [] })
      setListHasMore(true)
      getMatchList()
    }

    // getMatchDetail() //刷新数据

    userGetUserAsserGold()
    goItemData.current = {
      ...goItemData.current,
      gameName: 'FB Sports',
      // banlance: balance,
      type: 5,
    };

    const moneyRes = await getBalance({ gameType: 5 })
    if (!(moneyRes instanceof Error)) {
      // window.eventBus.emit("freshYnOpen"); //关闭转圈
      // console.log("新查询游戏余额", moneyRes);
      if (moneyRes != undefined) {
        v30MoneySet(moneyRes?.balance);
      } else {
        v30MoneySet(0);
      }
      goItemData.current = {
        ...goItemData.current,
        banlance: moneyRes?.balance || 0,
      };

      let da = {
        amount: assergoldData?.goldCoin || 0,
        gameType: 5,
        tradeType: 1,
      };
      autoUpBalancesSet({ ...da, gameName: 'FB Sports' });

      if (moneyRes?.balance == 0) {
        //游戏余额为0  才一键转入
        const res2 = await BackAllGameCoin();
        if (!(res2 instanceof Error)) {
          // freshUser()
          userGetUserAsserGold()
          if (user?.autoUpBalance == 1) {
            console.log('res2一键回收', res2);
            if (res2?.allBalance >= 1) {
              //钱包余额大于等于1 才自动上分
              goItemData.current = {
                ...goItemData.current,
                gameName: 'FB Sports',
                // banlance: balance,
                type: 5,
              };
              const data = await autoUpBalance(da);
              if (!(data instanceof Error)) {
                console.log("开起自动转入 带入金额", data);
                // window.eventBus.emit("freshYn");
                // accountGetbalances() //查询游余额接口
                v30MoneySet(data?.balance || 0);

                userGetUserAsserGold()
                // freshUser();

              }
            }
          } else {
            //未开起自动转入开起弹窗
            goItemData.current = {
              ...goItemData.current,
              gameName: 'FB Sports',
              // banlance: balance,
              type: 5,
            };
            const data = {
              amount: assergoldData?.goldCoin || 0,
              gameType: 5,
              tradeType: 1,
              gameName: 'FB Sports',
            };
            autoUpBalancesSet(data);

            setShowTrans(true)
          }
        }
      } else {
        //未开起自动转入开起弹窗
        goItemData.current = {
          ...goItemData.current,
          gameName: 'FB Sports',
          // banlance: balance,
          type: 5,
        };
        const data = {
          amount: assergoldData?.goldCoin || 0,
          gameType: 5,
          tradeType: 1,
          gameName: 'FB Sports',
        };
        autoUpBalancesSet(data);
      }
    }

    console.log('goItemData.current', goItemData.current);
  }


  // 刷新金额
  const getBalanceF = async () => {
    const moneyRes = await getBalance({ gameType: 5 })
    if (!(moneyRes instanceof Error)) {
      // window.eventBus.emit("freshYnOpen"); //关闭转圈
      // console.log("新查询游戏余额", moneyRes);
      if (moneyRes != undefined) {
        v30MoneySet(moneyRes?.balance);
      } else {
        v30MoneySet(0);
      }
      goItemData.current = {
        ...goItemData.current,
        banlance: moneyRes?.balance || 0,
      };

      let da = {
        amount: assergoldData?.goldCoin || 0,
        gameType: 5,
        tradeType: 1,
      };
      autoUpBalancesSet({ ...da, gameName: 'FB Sports' });
    }
  }
  return <>
    <img src={require('../../../assets/image/live/live-icon-b5.png')} alt="" onClick={() => {
      fbPhysicalCultureF()
      // setMatchDetail({ dx: [], dy: [], bd: [] })
      // setListHasMore(true)
      // getMatchList()
    }} />
    {/* showBody */}
    <Popup visible={showBody} onMaskClick={() => setShowBody(false)} bodyClassName={`${style.liveRoomPopup3} ${focusD ? style.fbBodyMores2 : ''}`} >
      {showMore ? betMore() :
        //    showBetInfo ? betInfo() :
        showRecord ? recordBody() : betBody()
      }
    </Popup>
    <Popup visible={showBetInfo} onMaskClick={() => setShowBetInfo(false)} bodyClassName={`${style.betPopup}`} >
      {showBetInfo && betInfo()}
    </Popup>

    {
      showTrans && <TransferAccounts
        onMaskClick={() => {
          setShowTrans(false); //关闭弹窗
          transformationsSet(true);
        }}
        fresh={(e) => {
          v30MoneySet(e),
            (goItemData.current = {
              ...goItemData.current,
              banlance: e || 0,
            });
        }} //游戏余额
        visible={showTrans}
        transformations={transformations} //是否切换判断
        transformation={() => transformation()} //切换转入转出
        info={goItemData.current || {}}
      />
    }
  </>
}