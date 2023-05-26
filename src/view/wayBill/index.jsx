import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { GetGameList } from "@/api/live";
import { GetissueInfo, GetOpenRewardHistroyList, GetOpenResultRatio, GetAskWayResult, GetGoodWayResult } from "@/api/game";
import { setDataList, goodWayList } from './util'
import { Empty } from 'antd'
import style from "./index.module.scss";

const WayBillComp = () => {
    const { t } = useTranslation();
    const history = useNavigate();
    const { state } = useLocation();
    const countTime = useRef();
    // 倒计时
    const [downTime, setDownTime] = useState(0);
    // 说明modal
    const tabList = [
        { title: t("路子图"), key: "luzitu" },
        { title: t("好路"), key: "haolu" },
    ];
    // 进入页面的loading
    const [loading, setLoading] = useState(true)
    // 问路下一期的结果
    const [queryType, queryTypeSet] = useState(''); // 1:大小，2:单双
    const [wholeData, setWholeData] = useState({
        1: {
            title: '大小',
            bigRatio: '50%',
            smallRatio: '50%',
            listData: [
                {type: 'normal', list: goodWayList.changlong},
                {type: 'dyl', list: goodWayList.changlian},
                {type: 'xl', list: goodWayList.changtiao},
                {type: 'xql', list: goodWayList.lflt},
            ]
        },
        2: {
            title: '单双',
            bigRatio: '50%',
            smallRatio: '50%',
            listData: [
                {type: 'normal', list: setDataList([])},
                {type: 'dyl', list: setDataList([])},
                {type: 'xl', list: setDataList([])},
                {type: 'xql', list: setDataList([])},
            ]
        },
    })

    const [goodWayData, setGoodWayData] = useState([
       
    ])
    //  {title: '单挑冠军大小', list: setDataList([])}
    // 路子图/好路tab
    const [currentTab, setCurrentTab] = useState(tabList[0]);
    const handleShiftTab = (item) => {
        setCurrentTab(item);
        if (item === 'luzitu') {
            getData()
        } else {
            getGoodWayData()
        }
    };
    const [cplist, cplistSet] = useState([]);
    const [cplistActive, cplistActiveSet] = useState(0);
    // 获取游戏列表
    const getCpList = async () => {
        const res = await GetGameList();
        let cl = res.filter((a) => a.ludanUrl);
        cplistSet(cl);
        const name = "" || state?.name;
        if (name) {
            let index = cl.findIndex((a) => a.name === name);
            if (index >= 0) cplistActiveSet(index);
        }
    };
    // 当前游戏期号,倒计时
    const [issue, setIssue] = useState({});
    const getIssue = () => {
        GetissueInfo({ name: cplist[cplistActive].name }).then((res) => {
            if (res) {
                setIssue(res);
            }

        });
    };
    const getData = () => {
        setLoading(true)
        // 获取当前游戏的开奖列表
        GetOpenRewardHistroyList({
            type: cplist[cplistActive].name,
            queryType: queryType || 1,
        }).then((res) => {
            setLoading(false)
            console.log(res);
            getPerData()
        });
    };
    //获取百分比
    const getPerData = async () => {
        const res = await GetOpenResultRatio({ type: cplist[cplistActive].name, queryType });
        console.log(res, '百分比')
        if (res) {

        }
    };
    // 获取好路结果列表
    const getGoodWayData = () => {
        GetGoodWayResult({
            type: issue.name,
            issue: `${Number(issue.expect) - 1}`,
        }).then(res => {
            console.log(res)
        })
    }
    // 将数值转为时间格式
    const numberToOlock = (time) => {
        let minute = Math.floor(time / 60);
        let second = time - minute * 60;
        if (second < 10) {
            second = "0" + second;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        return `${minute}:${second}`;
    };
    useEffect(() => {
        getCpList();
    }, []);
    useEffect(() => {
        if (cplist.length) {
            // 获取当前游戏开奖相关信息
            getIssue();
        }
    }, [cplistActive, cplist]);

    useEffect(() => {
        if (cplist.length) {
            getData();
        }
    }, [cplistActive, cplist]);

    useEffect(() => {
        //问路下一期的结果
        if (cplist.length) {
            if (queryType) {
                GetAskWayResult({ type: issue.name, issue: `${Number(issue.expect) - 1}`, queryType: 1, resultType: queryType })
            } else {
                // 将最后一个值给去掉
            }
        }
    }, [queryType])

    useEffect(() => {
        // 监听当前选中的游戏的变化
        if (!cplist.length) return;
        countTime.current = issue.down_time;
        const timer = setInterval(() => {
            countTime.current -= 1;
            setDownTime(countTime.current);
            if (countTime.current === 0) {
                countTime.current = Number(issue.timelong) * 60;
                if (currentTab === 'luzitu') {
                    getData();
                } else {
                    getGoodWayData()
                }
                getIssue();
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [cplist, cplistActive, issue]);

    return (
        <div className={`${style.container} ${loading && 'loading'}`}>
            <div className={style.titleBg}>
                <div className={style.titleContent}>
                    <div className={style.topWrapper}>
                        {tabList.map((item, index) => {
                            return (
                                <div
                                    className={`${style.tab} 
                                ${item.key === currentTab.key
                                            ? style.activeTab
                                            : ""
                                        }`}
                                    key={index}
                                    onClick={() => handleShiftTab(item)}
                                >
                                    {item.title}
                                </div>
                            );
                        })}
                    </div>
                    <div className={style.botWrapper}>
                        <div className={style.threeColumn}>
                            <div className={style.leftSide}>
                                {cplist.length ? (
                                    <div className={style.logoTitle}>
                                        <img src={cplist[cplistActive].icon} />{" "}
                                        {cplist[cplistActive].chinese}
                                    </div>
                                ) : null}
                            </div>
                            <div className={style.middleSide}>
                                <div className={style.allNumber}>
                                    {issue.expect ? Number(issue.expect) - 1 : ''}{t('期')}
                                    {[1, 3, 4, 5, 10].map((item, index) => {
                                        const addZere = (e) => {
                                            return e > 9 ? e : "0" + e;
                                        };
                                        return (
                                            <div
                                                className={`${style.color} color${addZere(item)}`}
                                                key={index}
                                            >
                                                {item}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={style.rightSide}>
                                <div className={style.desc}>
                                <p className={style.first}>{t("投注中")}</p>
                                <p className={style.sub}>
                                    {issue.expect}
                                    {t("期")}
                                </p>
                                </div>
                                <div className={style.countTimeWrapper}>{numberToOlock(downTime)}</div>
                            </div>
                        </div>
                        {
                            currentTab.key === 'luzitu' ? 
                            <div className={style.askRoad}>
                                <div className={style.hint}>
                                    <span className={style.hintWord}>{t('问路')}</span>
                                    <div className={style.hintfh}>
                                        ?
                                    </div>
                                    <div className={style.hintContent}>
                                        <div className={style.realContent}>
                                            <div className={style.hintStyle}>{t('模拟下一期开奖后路子图的绘制情况')}</div>
                                            <div className={style.hintStyle}>{t('如')}:</div>
                                            <div className={style.nextIssue}>
                                                <span className={style.nextIssueWord}>{t("下期")}</span>
                                                <span className={style.big}>{t('大')}</span>
                                                <div className={style.hollow} />
                                                <div className={style.solid} />
                                                <div className={style.line} />
                                            </div>
                                            <div className={style.hintStyle}>{t('表示下一期如果开大,则')}:</div>
                                            <div className={style.hintStyle}>{t('大眼路为')}<div className={style.hollow} />,</div>
                                            <div className={style.hintStyle}>{t('小路为')}<div className={style.solid} />,</div>
                                            <div className={style.hintStyle}>{t('小强路为')}<div className={style.line} />,</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.playTabs}>
                                    <div
                                        className={`${style.playTab} ${queryType === 1 ? style.playTabActive : ""}`}
                                        onClick={() => {
                                            if (queryType === 1) {
                                                queryTypeSet('')
                                            } else {
                                                queryTypeSet(1);
                                            }
                                        }}>
                                        {t("下期大")}
                                    </div>
                                    <div
                                        className={`${style.playTab} ${style.small} ${queryType === 2 ? style.playTabActive : ""}`}
                                        onClick={() => {
                                            if (queryType === 2) {
                                                queryTypeSet('')
                                            } else {
                                                queryTypeSet(2);
                                            }
                                        }}>
                                        {t("下期小")}
                                    </div>
                                </div>
                            </div> : null
                        }
                    </div>
                    <div className={style.gameList}>
                        {cplist.map((item, index) => {
                            return (
                                <div
                                    className={`${style.tab} ${cplistActive === index ? style.activeTab : ""
                                        }`}
                                    key={index}
                                    onClick={(e) => cplistActiveSet(index)}
                                >
                                    <img src={item.icon} alt="logo" className={style.logo} />
                                    <div>{item.chinese}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={`${style.content} ${currentTab.key === 'haolu' ? style.adjustContenPos : ''}`}>
                <div className={style.repeatPos} style={{zIndex: currentTab.key === 'luzitu' ? 2 : -1}}>
                    {
                        Object.keys(wholeData).map(key => {
                            return <WholeTabBill data={wholeData[key]} key={key}/>
                        })
                    }
                </div>
                <div className={`${style.repeatPos} ${!goodWayData.length && currentTab.key === 'haolu' ? style.emptyContent : ''}`} style={{zIndex: currentTab.key === 'haolu' ? 2 : -1}}>
                    {
                        goodWayData.map((item, index) => {
                            return <GoodWayUnitComp data={item} key={index}/>
                        })
                    }
                    {
                        !goodWayData.length ? <Empty description={null}/> : null
                    }
                </div>
            </div>
        </div>
    );
};

const WholeTabBill = (props) => {
    const { t } = useTranslation()
    const { data } = props
    return <div className={style.wholeTabBill}>
        <div className={style.title}>{data.title}</div>
        <div className={style.divide}/>
        <div className={style.top}>
            <TableBill type={data.listData[0].type} list={data.listData[0].list} />
        </div>
        <div className={style.bottom}>
            <TableBill type={data.listData[1].type} list={data.listData[1].list} />
            <TableBill type={data.listData[2].type} list={data.listData[2].list} />
            <TableBill type={data.listData[3].type} list={data.listData[3].list} />
        </div>
        <div className={style.statistics}>
            <span className={style.big}>{t('大')}</span>
            <span className={style.ratio}>{data.bigRatio}</span>
            <span className={style.small}>{t('小')}</span>
            <span className={style.ratio}>{data.smallRatio}</span>
            <div className={style.nextIssue}>
                {/* <span className={style.nextIssueWord}>{t("下期")}</span> */}
                <span className={style.big}>{t('大')}</span>
                <div className={style.hollow} />
                <div className={style.solid} />
                <div className={style.line} />
            </div>
            <div className={style.nextIssue}>
                {/* <span className={style.nextIssueWord}>{t("下期")}</span> */}
                <span className={style.small}>{t('小')}</span>
                <div className={`${style.hollow} ${style.hotherColor}`} />
                <div className={`${style.solid} ${style.otherColor}`} />
                <div className={`${style.line} ${style.otherColor}`} />
            </div>
        </div>
    </div>
}

const GoodWayUnitComp = (props) => {
    const { data } = props
    const [showDescModal, setShowDescModal] = useState(false)
    return <div className={style.goodWayUnitContainer}>
        <div className={style.title}>
            <div className={style.leftSide}>
                <div className={style.oneTitle}>单跳</div>
                <div className={style.twoTitle}>冠军</div>
                <div className={style.twoTitle}>大小</div>
            </div>
            <div className={style.rightSide}>
                <img 
                    src={require('../../assets/images/wayBill/question.png')} 
                    alt="question" 
                    width={16} 
                    height={16} 
                    className={style.question}
                    onClick={() => setShowDescModal(true)}
                />
            </div>
        </div>
        <div className={style.divide}></div>
        <TableBill type={'normal'} list={data.list} />
        {
            showDescModal ? <DescModal  onClose={() => setShowDescModal(false)}/> : null
        }
        
    </div>
}

const DescModal = (props) => {
    const { onClose } = props
    const { t } = useTranslation()
    const data = [
        {
            type: 'normal', 
            title: t('长龙'), 
            desc: t('某形态连续次数达到5次及以上时，形成长龙。'),
            list: goodWayList.changlong,
        },
        {
            type: 'normal', 
            title: t('单跳'), 
            desc: t('不同形态间隔出现连续次数达到5次及以上时，形成单跳。'),
            list: goodWayList.dantiao,
        },
        {
            type: 'normal', 
            title: t('两房两厅'), 
            desc: t('不同形态间隔连续开出2期，且总期数达到6期及以上，形成两房两厅。'),
            list: goodWayList.lflt,
        },
        {
            type: 'normal', 
            title: t('两房一厅'), 
            desc: t('不同结果2期1期间隔出现，且总期数达到6期及以上，形成两房一厅。'),
            list: goodWayList.lfyt,
        },
        {
            type: 'normal', 
            title: t('连续长连'), 
            desc: t('结果连续间隔出现4列及以上，形成连续长连。'),
            list: goodWayList.lxcl,
        },
        {
            type: 'normal', 
            title: t('不过三'), 
            desc: t('15列以内相同结果都没有连续超过3次， 形成不过三。'),
            list: goodWayList.buguosan,
        },
        {
            type: 'normal', 
            title: t('常连'), 
            desc: t('15列以内某一种结果都是连续出现，形成长连。如下图中的大。'),
            list: goodWayList.changlian,
        },
        {
            type: 'normal', 
            title: t('常跳'), 
            desc: t('15列以内某一种结果从没有连续出现，形成长连。如下图中的大。'),
            list: goodWayList.changtiao,
        },
    ]
    return <div className={style.descModal}>
        <div className={style.wholeScreen} onClick={() => onClose && onClose()}/>
        <div className={style.mainContent}>
            <div className={style.mtitle}>
                {t('说明')}
                <img 
                    src={require('../../assets/images/wayBill/close.png')} 
                    alt="close" 
                    width={16} 
                    height={16} 
                    className={style.close}
                    onClick={() => onClose && onClose()}
                />
            </div>
            <div className={style.divide} />
            <div className={style.descWords}>
                <p>{t('*好路推荐仅对大路中的好路进行推荐.')}</p>
                <p>{t('*若出现形态为「和」，该期形态则统计到上一个形态中.')}</p>
            </div>
            <div className={style.allGoodwayBills}>
                {
                    data.map((item, index) => {
                        return <div className={style.mwayBill} key={index}>
                            <DescGoodWayUnitComp data={item} index={index + 1} />
                        </div>
                    })
                }
            </div>

        </div>
    </div>
}

const DescGoodWayUnitComp = (props) => {
    const { data, index } = props
    return <div className={style.descWayUnitContainer}>
        <div className={style.desctitle}>
            {index}、<span>{data.title}:</span>{data.desc}
        </div>
        <TableBill type={'normal'} list={data.list} />
    </div>
}

const TableBill = (props) => {
    const { type, list } = props
    let timer = useRef()
    const getClassName = () => {
        if (type === 'normal') {
            return style.normal
        }
        if (type === 'dyl') {
            return style.dyl
        }
        if (type === 'xl') {
            return style.xl
        }
        if (type === 'xql') {
            return style.xql
        }
    }
    useEffect(() => {
        timer.current =  setTimeout(() => {
            for (let item of document.getElementsByClassName("scrollRight")) {
              item.scrollTo(99999, 0);
            }
          }, 100);
        return () => clearTimeout(timer.current)
    }, [list])
    return <div className={style.tabBillContainer}>
    <div className={`${style.wayBody} scrollRight ${getClassName()}`}>
      {list.map((item, index) => {
        return (
          <div key={index} className={style.grid}>
            {item.map((val, key) => (
              <div className={`${style.box} ${style[val?.value]} ${val?.bg ? style.deepen : ''}`} key={`${index}-${key}`}>
                <div className={style.issue}>{val?.issue}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  </div>
}

export default WayBillComp;
