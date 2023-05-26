import { Button, NavBar, Popup, Skeleton, Empty, DatePickerView, InfiniteScroll, Toast } from "antd-mobile";
import { t } from "i18next";
import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './index.module.scss'
import { activityConfig, queryCenterUserHandselActivityRecord } from "../../../server/goodCentre";
import moment from 'moment'
const Index = () => {
  const { state } = useLocation()
  const history = useNavigate()
  // 时间格式
  const dateToSrting = (da) => {
    let str = "";
    if (da != undefined) {
      let date = new Date(da.toString().length == 10 ? da * 1000 : da);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let min = date.getMinutes();
      let s = date.getSeconds();
      y = y < 10 ? "0" + y : y;
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : h;
      min = min < 10 ? "0" + min : min;
      s = s < 10 ? "0" + s : s;
      str = `${t('riyue', { 0: d, 1: m })}`;
    }
    return str;
  }
  const [goods, goodsSet] = useState(false)
  const [deposit, depositSet] = useState(false)
  const [times, timesSet] = useState(false)
  // 全部弹窗数据
  const [jyRecord, jyRecordSet] = useState([])
  // 时间弹窗数据
  const [jyRecord2, jyRecord2Set] = useState([])



  const [Loading, LoadingSet] = useState(false)
  const [Loading2, Loading2Set] = useState(false)

  const [queryUserAssetListD, queryUserAssetListDSet] = useState([])
  const [groupMonthDayD, groupMonthDayDSet] = useState([])
  const [queryUserAssetCountD, queryUserAssetCountDSet] = useState({})

  const [hasMore, setHasMore] = useState(true)

  const [visible4, visible4Set] = useState(false)
  const [PopupD, PopupDSet] = useState({})
  const [types, typesSet] = useState([])

  const datasRef = useRef([])
  const datas2Ref = useRef([
    { type: 1, name: t('sys_receive') },
    { type: 2, name: t('daillingqu') },
    { type: 3, name: t('daifafang') },
    { type: 4, name: t('yiguoqi') },
  ])
  const datas3Ref = useRef([
    { type: 0, name: t('today') },
    { type: 1, name: t('ui_yesterday') },
    { type: 3, name: t('jinsanri') },
    { type: 7, name: t('jinqiri') },
    { type: 30, name: t('jinsanshiri') },
  ])
  const typesRef = useRef([])
  const SelectsRef = useRef(0)
  const Selects2Ref = useRef(0)
  const Selects3Ref = useRef(0)

  const groupMonthDayDRef = useRef([])
  const queryUserAssetListDRef = useRef([])

  const pageNumsRef = useRef(0)
  useEffect(() => {
    LoadingSet(true)
    Loading2Set(true)
    queryAssetTypeListF()
  }, [])

  const queryAssetTypeListF = async () => {
    const res = await activityConfig()
    if (!(res instanceof Error)) {
      console.log('res活动中心配置', res);
      let types = []
      res.forEach((value, index) => {
        types = [...types, value.type]
      })
      typesRef.current = types
      res.unshift({ type: 99999, activityLanguage: t('quanbufuli') })

      console.log('res', res);
      datasRef.current = res
      jyRecordSet(res)

      doSearch()
      setHasMore(true)
    }

  }

  const loadMore = async () => {
    // let data = {
    //   startTime: datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 ? (startTimeD != null && startTimeD != undefined ? startTimeD : null) : null,
    //   endTime: datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 ? (endTimesD != null && endTimesD != undefined ? endTimesD : null) : null,
    //   methodType: state,  //当前记录类型
    //   assertCode: datasRef.current[SelectsRef.current]?.assertCode,  //全部弹窗 选中内容
    //   timeAssertCode: datas2Ref.current[Selects2Ref.current]?.assertCode == 99999 ? null : datas2Ref.current[Selects2Ref.current]?.assertCode,  //时间弹窗 选中内容
    //   pageNum: pageNumsRef.current,
    //   pageSize: 10,
    // }
    let data = {
      types: datasRef.current[SelectsRef.current]?.type == 99999 ? [...typesRef.current] : [datasRef.current[SelectsRef.current]?.type || []],  //活动类型
      day: datas3Ref.current[Selects3Ref.current].type,
      recordStatus: datas2Ref.current[Selects2Ref.current].type,

      pageNum: pageNumsRef.current,
      pageSize: 10,
    }
    const res = await queryCenterUserHandselActivityRecord(data)
    if (!(res instanceof Error)) {

      Loading2Set(false)
      console.log('多少数据', res, queryUserAssetListDRef.current);
      let data = [...(res.list || []), ...queryUserAssetListDRef.current]
      let itemData = []
      data.forEach((value, index) => {
        itemData.push(dateToSrting(value?.createTime))
        value.createTime2 = dateToSrting(value?.createTime)
      })
      console.log('获取所有日期', itemData);
      var obj = {};
      itemData = itemData.reduce(function (item, next) {
        obj[next] ? '' : obj[next] = true && item.push(next);
        return item;
      }, []);
      console.log('获取当前日期列表', itemData);

      // let daTimes = [...groupMonthDayDRef.current, ...(res.centerUserAssetsPlusDateVOs || [])]
      // var obj = {};
      // daTimes = daTimes.reduce(function (item, next) {
      //   obj[next.dateLabel] ? '' : obj[next.dateLabel] = true && item.push(next);
      //   return item;
      // }, []);

      // console.log('去重数据', groupMonthDayD, daTimes);


      // groupMonthDayDRef.current = res.centerUserAssetsPlusDateVOs || []
      // // let datas = res.groupMonthDay || []
      groupMonthDayDRef.current = itemData
      queryUserAssetListDRef.current = data
      groupMonthDayDSet(itemData)
      queryUserAssetListDSet(data)

      setHasMore((res.list || [])?.length > 0)
      if ((res.list || [])?.length > 0) {
        pageNumsRef.current = Number(pageNumsRef.current) + 1
      } else {
        pageNumsRef.current = 0
      }
    } else {
      Loading2Set(false)
      setHasMore(false)
    }
  }

  // 搜索
  const doSearch = () => {
    pageNumsRef.current = 0
    groupMonthDayDSet([])
    queryUserAssetListDSet([])

    groupMonthDayDRef.current = []
    queryUserAssetListDRef.current = []

    loadMore()
  }



  // 判断是否超出
  const getElementByIdWayIndex = () => {
    let data = [...datasRef.current]
    data.forEach((value, index) => {
      if (document.getElementById(`way-${index}`)?.scrollWidth > document.getElementById(`way-${index}`)?.offsetWidth) {
        value.goBeyond = true
      } else {
        value.goBeyond = false
      }
    })
    datasRef.current = data
    jyRecordSet(data)

    // let data2 = [...datas2Ref.current]
    // data2.forEach((value, index) => {
    //   if (document.getElementById(`way2-${index}`)?.scrollWidth > document.getElementById(`way2-${index}`)?.offsetWidth) {
    //     value.goBeyond = true
    //   } else {
    //     value.goBeyond = false
    //   }
    // })
    // datas2Ref.current = data2
    // jyRecord2Set(data2)
  }

  // 复制
  const copy = (e) => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', 'readonly');
    textarea.value = e;
    document.body.appendChild(textarea);
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      Toast.show({
        content: t('ui_successful_copy'),
        position: 'top',
        duration: 2000
      })
    }
    document.body.removeChild(textarea);
  }
  return (
    <div className={style.bodys}>
      <NavBar
        back={null}
        left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => history(-1)} />}
        className={style.wbg}
      // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
      >
        <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
          {t('fulizhongxing')}
        </div>
      </NavBar>
      {
        // Loading ? <div className={style.skBodysss}>
        //   {
        //     <Skeleton animated className={style.customSkeleton} />
        //   }
        // </div> :

        <div className={style.top2}>
          {/* <img src={require('../../../assets/image/center/zankailog.png')} alt="" /> */}
          <div className={style.top}>
            <div className={style.divs} onClick={() => { goodsSet(!goods), depositSet(false), setTimeout(() => { getElementByIdWayIndex() }, 100), timesSet(false) }}>
              <div className={style.divs_d}>
                {datasRef.current[SelectsRef.current]?.activityLanguage}
              </div>
              <img src={require('../../../assets/image/center/wzankailog.png')} alt="" className={goods ? style.zankailog : ''} />
            </div>
            <div className={style.divs} onClick={() => { goodsSet(false), depositSet(!deposit), setTimeout(() => { getElementByIdWayIndex() }, 100), timesSet(false) }}>
              <div className={style.divs_d}>
                {datas2Ref.current[Selects2Ref.current]?.name}
              </div>
              <img src={require('../../../assets/image/center/wzankailog.png')} alt="" className={deposit ? style.zankailog : ''} />
            </div>
            <div className={style.divs} onClick={() => { goodsSet(false), timesSet(!times), depositSet(false), setTimeout(() => { getElementByIdWayIndex() }, 100) }}>
              <div>
                {datas3Ref.current[Selects3Ref.current]?.name}
              </div>
              <img src={require('../../../assets/image/center/wzankailog.png')} className={times ? style.zankailog : ''} alt="" /></div>
          </div>
        </div>
      }
      {/* 全部福利 */}
      {goods && <div onClick={() => {
        goodsSet(false)
      }}
        className={style.deposits_bordy}
      >
        <div className={style.depositsS} onClick={(e) => { e.stopPropagation() }}>
          <div className={`${style.deposits}`}>
            {datasRef.current.map((value, index) => {
              return <div key={index} onClick={() => {
                SelectsRef.current = index
                pageNumsRef.current = 0
                doSearch()
                getElementByIdWayIndex()
                goodsSet(false)

              }} className={`${style.deposits_div} ${SelectsRef.current == index ? style.deposits_div2 : ''}`}>
                <div className={style.assertName}>
                  <div id={`way-${index}`} className={`${value?.goBeyond ? style.goBeyond : ''}`}>
                    {value?.activityLanguage}
                  </div>
                </div>
              </div>
            })
            }
          </div>
        </div>

        <div className={style.mak}></div>
      </div>
      }
      {/* 全部下拉框 */}
      {deposit && <div onClick={() => {
        depositSet(false)
      }}
        className={style.deposits_bordy}
      >
        <div className={style.depositsS} onClick={(e) => { e.stopPropagation() }}>
          <div className={`${style.deposits}`}>
            {datas2Ref.current.map((value, index) => {
              return <div key={index} onClick={() => {
                Selects2Ref.current = index
                pageNumsRef.current = 0
                doSearch()
                getElementByIdWayIndex()
                depositSet(false)

              }} className={`${style.deposits_div} ${Selects2Ref.current == index ? style.deposits_div2 : ''}`}>
                <div className={style.assertName}>
                  <div id={`way-${index}`} className={`${value?.goBeyond ? style.goBeyond : ''}`}>
                    {value?.name}
                  </div>
                </div>
              </div>
            })
            }
          </div>
        </div>

        <div className={style.mak}></div>
      </div>
      }
      {/* 时间下拉框 */}
      {times && <div onClick={() => {
        timesSet(false)
      }}
        className={style.deposits_bordy}
      >
        <div className={`${style.depositsS} ${state != 20000 ? style.depositsS2 : ''}`} onClick={(e) => { e.stopPropagation() }}>
          <div className={`${style.deposits} ${state != 20000 ? style.deposits2 : ''}`}>
            {datas3Ref.current.map((value, index) => {
              return <div key={index} onClick={() => {
                Selects3Ref.current = index
                doSearch()
                getElementByIdWayIndex()
                timesSet(false)

              }} className={`${style.deposits_div} ${Selects3Ref.current == index ? style.deposits_div2 : ''}`}>
                <div className={style.assertName}>
                  <div id={`way2-${index}`} className={`${value?.goBeyond ? style.goBeyond : ''}`}>
                    {value?.name}
                  </div>
                </div>
              </div>
            })
            }
          </div>
        </div>


        <div className={style.mak}></div>
      </div>
      }

      {/* 内容 */}
      {
        // Loading2 ? <div className={style.skBody2}>
        //   {
        //     <div>
        //       {<Skeleton animated className={style.customSkeleton2} />}
        //       {Array(6).fill('').map((item, index) =>
        //         <Suspense key={index}>
        //           <Skeleton animated className={style.customSkeleton} />
        //         </Suspense>
        //       )}
        //     </div>
        //   }
        // </div> 
        // :

        <div className={style.content_big}>
          <div className={style.content}>
            {
              <div>
                {
                  (queryUserAssetListD[0] == undefined || groupMonthDayD[0] == undefined) ?
                    <Empty className={style.Empty} image={<img className='emptyImg' src={require('../../../assets/image/center/xgjlnull.png')} />} description={t('noData')}></Empty>
                    :
                    groupMonthDayD.map((item_1, index_1) => {
                      return <div key={`${item_1}-${index_1}`}>
                        <div className={style.titles}>{item_1}</div>
                        {
                          queryUserAssetListD.map((item, index) => {
                            if (item?.createTime2 == item_1) {
                              return <div key={`${item?.id}_${index}`} className={style.content_div} onClick={() => {
                                // PopupDSet(item)
                                // visible4Set(true)
                              }}>
                                <div className={style.content_div_left}>
                                  <img src={item?.icon || require('../../../assets/image/login/logotitle.png')} alt="" />
                                  <div className={style.ck}>
                                    {/* name */}
                                    <div className={style.activityLanguage}>{item?.activityLanguage} <img src={require('../../../assets/image/center/moneyIcon.png')} alt="" />{item?.handsel}</div>
                                    {/* item?.createTimeStr   */}
                                    <div className={style.ck_time}>{item?.createTimeStr ? moment(item?.createTimeStr).format('DD-MM-YYYY HH-mm-ss') : ''}</div>
                                  </div>
                                </div>
                                <div className={style.content_div_right}>
                                  <div className={style.content_div_fonts}>
                                    <div>{
                                      item?.recordStatus == 1 ? <img src={require('../../../assets/image/center/ylq.png')} alt="" className={style.ylq_imgs} />
                                        : item?.recordStatus == 2 ? <Button className={style.good_div_but}>{t('btn_go_to_collect')}</Button>
                                          : item?.recordStatus == 3 ? <div className={`${style.good_div_but} ${style.good_div_but2}`} disabled={true}>{t('daifafang')}</div>
                                            : item?.recordStatus == -1 ? <div className={`${style.good_div_but} ${style.good_div_but2}`} disabled={true}>{t('yiguoqi')}</div> : ''
                                    }</div>
                                  </div>
                                  {/* <img src={require('../../../assets/image/center/jlright.png')} alt="" /> */}
                                </div>
                              </div>
                            }
                          })
                        }
                      </div>
                    })


                  // // 福利中心样式
                  // <div className={style.good_div}>
                  //   <div className={style.good_div_left}>
                  //     <img alt="" />
                  //     <div>
                  //       <div>今存明送  59</div>
                  //       <div>14:39:56</div>
                  //     </div>
                  //   </div>
                  //   <Button className={style.good_div_but}>领取</Button>
                  // </div>
                }
              </div>
            }
            {queryUserAssetListD.length > 0 && <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />}

            {/* 弹窗展示详情 */}
            <Popup
              visible={visible4}
              onMaskClick={() => {
                visible4Set(false)
              }}
              position='right'
              bodyStyle={{ width: '100vw' }}
            >
              <div style={{
                width: '100vw',
                minHeight: '100vh',
                background: '#F6F7FC'
              }}>
                <NavBar
                  back={null}
                  left={<img src={require('../../../assets/image/kf/left.png')} style={{ width: '22px', height: '26px' }} onClick={() => visible4Set(false)} />}
                  className={style.wbg}
                // right={<img style={{ width: '23px', height: '23px' }} onClick={() => history('/service')} src={require('../../../assets/image/tx/kf.png')} alt="" />}
                >
                  <div style={{ fontSize: '18px', fontWeight: '500', color: 'rgb(30, 27, 39)' }}>
                    {state == 10000 ? t('reportDetailTitle') : state == 20000 ? t('ui_bet_record') : t('xiaofeijilu')}
                  </div>
                </NavBar>
                <div className={style.Details}>
                  <div className={style.title}>{PopupD?.goldCoin}</div>
                  <div className={`${style.bottom} ${style.divs}`}>
                    <div>{state == 10000 ? t('reportDetail2') : state == 30000 ? t('reportDetail1') : ''}</div>
                    <div>{PopupD?.name}</div>
                  </div>
                  {/* <div className={`${style.bottom} ${style.divs}`}>
                    <div>交易方式</div>
                    <div>支付宝</div>
                </div> */}
                  <div className={`${style.bottom} ${style.divs}`}>
                    <div>{t('rp_status')}</div>
                    <div>{PopupD?.status == 1 ? <span
                      style={{
                        color: '#2997F6'
                      }}>{t('sys_check_pass')}</span> : <span style={{
                        color: '#999999'
                      }}>{t('sys_check_fail')}</span>}</div>
                  </div>
                  <div className={`${style.bottom} ${style.divs}`}>
                    <div>{t('reportDetail4')}</div>
                    <div>{PopupD?.gmtAllCreate}</div>
                  </div>
                  <div className={` ${style.divs}`} onClick={() => { copy(PopupD?.trn) }}>
                    <div>{t('dingdanhaoma')}</div>
                    <div>{PopupD?.trn}<img src={require('../../../assets/image/center/fzlog.png')} alt="" /></div>
                  </div>
                </div>

                <div className={style.Details2} onClick={() => { history('/service') }}>
                  <div>{t('ninduizhegejiaoyiyouyiwen')}</div>
                  <img src={require('../../../assets/image/center/kflog.png')} alt="" />
                </div>
              </div>

            </Popup>

          </div>
        </div>
      }
    </div >
  );
}

export default Index;
