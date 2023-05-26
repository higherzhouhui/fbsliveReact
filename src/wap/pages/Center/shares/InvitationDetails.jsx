import { NavBar, Tabs, Mask, Button, Popup, Toast } from "antd-mobile";
import React, { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./index.module.scss";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { inviteInfo } from '../../../server/center'
import { Local } from "../../../../common";

const InvitationDetails = () => {
    const { t } = useTranslation()
    const history = useNavigate()
    const { state } = useLocation()
    const [activeKeys, activeKeysSet] = useState('1')
    const [inviteInfoD, inviteInfoDSet] = useState([
        { name: t('xiazai'), da: 0 },
        { name: t('anzhuang'), da: 0 },
        { name: t('ui_registered'), da: 0 },
        { name: t('liushui'), da: 0 },
        { name: t('shouyi'), da: 0 },
        { name: t('dashang'), da: 0 },])
    const [inviteInfos, inviteInfosSet] = useState({})
    const [visible, setVisible] = useState(false)


    const data = [
        { name: t('ui_nowadays'), code: '1' },
        { name: t('zuotian'), code: '2' },
        { name: t('paihangbangzhou'), code: '3' },
        { name: t('paihangbangyue'), code: '4' },
        { name: t('sangeyue'), code: '5' },
    ]
    useEffect(() => {
        inviteInfoF()
    }, [])

    const inviteInfoF = (e) => {
        let i = e || activeKeys
        inviteInfo(i).then((res) => {
            console.log('详细数据', res);
            inviteInfosSet(res)
            let a = [
                { name: t('xiazai'), da: res?.downNum || 0 },
                { name: t('anzhuang'), da: res?.installNum || 0 },
                { name: t('ui_registered'), da: res?.registerNum || 0 },
                { name: t('liushui'), da: res?.flow || 0 },
                { name: t('shouyi'), da: res?.lotteryProfit || 0 },
                { name: t('dashang'), da: res?.giftProfit || 0 },
            ]
            inviteInfoDSet(a)
        })
    }

    // 保存二维码
    const createPicture = (ids) => {
        html2canvas(document.querySelector(`#${ids}`)).then((res) => {
            let imgUrl = res.toDataURL("image/png");
            // console.log('图片临时地址',imgUrl)
            let aLink = document.createElement("a");
            aLink.href = imgUrl;
            aLink.download = new Date().toLocaleString() + ".png"; //导出文件名，这里以时间命名
            document.body.appendChild(aLink);
            // 模拟a标签点击事件
            aLink.click();
            // 事件已经执行，删除本次操作创建的a标签对象
            document.body.removeChild(aLink);
        });
    };

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
            })
        }
        document.body.removeChild(textarea);
    }
    return (
        <div className={style.InvitationDetails}>
            <NavBar back={null} left={<img src={require("../../../assets/image/kf/left.png")}
                style={{ width: "22px", height: "26px" }}
                onClick={() => history(-1)}
            />
            }
                className={style.wbg}>
                <div style={{ fontSize: "18px", fontWeight: "500", color: "rgb(30, 27, 39)" }}>{t('yaoqingmingxi')}</div>
            </NavBar>
            <div className={style.titles}>
                <div className={style.titles_left}>
                    {state}
                </div>
                <div className={style.titles_right} onClick={() => { setVisible(true) }}>
                    {t('live_invitation')}<img src={require('../../../assets/image/my/gb/dbright.png')} alt="" />
                </div>
            </div>
            <div className={style.bodys}>
                <div className={style.contents}>
                    <div className={style.tables}>
                        {/* .adm-tabs-tab */}
                        <Tabs
                            className='tabs_adm_tabs_tab'
                            activeKey={activeKeys}
                            onChange={(e) => {
                                activeKeysSet(e)
                                inviteInfoF(e)
                            }}
                            activeLineMode='fixed'
                            style={{
                                "--fixed-active-line-width": "12px",
                                "--active-title-color": "#333333",
                                "--active-line-color": "#333333",
                                "--active-line-height": "2px"
                            }}
                        >
                            {data.map((value, index) => {
                                return <Tabs.Tab title={value.name} key={value.code}>
                                </Tabs.Tab>
                            })}
                        </Tabs>
                        {/* 数据 */}
                        <div className={style.datas}>
                            {
                                inviteInfoD.map((value, index) => {
                                    return <div key={index} className={style.div}>
                                        <span>{value.da}</span>
                                        <div>{value.name}</div>
                                    </div>
                                })
                            }
                        </div>

                        <div className={style.fx_contetn}>
                            <div className={style.titles}>
                                {t('fenxianghuodongshuoming')}
                            </div>
                            <div className={style.div}>
                                <div className={style.div_demo}>
                                    <img src={require('../../../assets/image/my/fxlog.png')} alt="" />
                                    <div>
                                        1、mời bạn cùng chơi game, mỗi ngày nhận thưởng không giới hạn! bạn cược càng nhiều, người mời nhận thưởng càng lớn.
                                    </div>
                                </div>
                                <div className={style.div_demo}>
                                    <img src={require('../../../assets/image/my/fxlog.png')} alt="" />
                                    <div>
                                        2、Thời gian tham gia hoạt động chia sẻ không giới hạn, hoa hồng khổng lồ đang đợi bạn (tham gia khi nào nhận tiền khi đó)
                                    </div>
                                </div>
                                <div className={style.div_demo}>
                                    <img src={require('../../../assets/image/my/fxlog.png')} alt="" />
                                    <div>
                                        3、mời bạn bè cá cược thành công,hoàn thành hồ sơ cá nhân và nạp tiền thành công đồng thời có doanh thu cược hiệu quả thì coi như mời thành công.
                                    </div>
                                </div>
                                <div className={style.div_demo}>
                                    <img src={require('../../../assets/image/my/fxlog.png')} alt="" />
                                    <div>
                                        4、Người mời có thể hưởng {inviteInfos?.promotionLotteryFee}% tổng tiền cá cược hợp lệ của xổ số và tổng doanh thu cá cược hợp lệ của trò chơi từ bạn bè, đồng thời nhận được {inviteInfos?.promotionGiftFee}% tổng số tiền mà người bạn đó đã thưởng cho idol.
                                        <br /> Ví dụ：
                                        <br /> bạn cược 1000 tổng tiền hợp lệ, người mời sẽ nhận được {(inviteInfos?.promotionLotteryFee * 1000) / 100} xu
                                        <br />bạn cược 2000 tổng tiền hợp lệ, người mời sẽ nhận được {(inviteInfos?.promotionLotteryFee * 2000) / 100} xu
                                        <br />bạn cược 100000 tổng tiền hợp lệ, người mời sẽ nhận được {(inviteInfos?.promotionLotteryFee * 100000) / 100} xu, không giới hạn
                                        <br />bạn thưởng idol 1000, người mời sẽ được {(inviteInfos?.promotionGiftFee * 1000) / 100} xu
                                        <br />bạn thưởng idol 2000, người mời sẽ được {(inviteInfos?.promotionGiftFee * 2000) / 100} xu
                                    </div>
                                </div>
                                <div className={style.div_demo}>
                                    <img src={require('../../../assets/image/my/fxlog.png')} alt="" />
                                    <div>
                                        5、chia sẻ hoạt động chỉ nhằm vào " xổ số, game" như: "tài xỉu, xóc đĩa, bầu cua, đua xe, khí cầu...
                                    </div>
                                </div>
                                <div className={style.div_demo}>
                                    <img src={require('../../../assets/image/my/fxlog.png')} alt="" />
                                    <div>
                                        6、không bao gồm thể thao, giải trí trực tiếp.
                                    </div>
                                </div>


                            </div>

                        </div>

                    </div>
                </div>

            </div>
            <Mask visible={visible}
                onMaskClick={() => setVisible(false)}
            >
                {/* 保存图片内容 */}
                <div id="QRCodes" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '302px', height: '511px', background: `url(${require('../../../assets/image/center/fx/fxtanc.png')})`, backgroundSize: '100% 100%', }}>
                    <QRCode value={state} style={{ width: "130px", height: "130px", position: 'absolute', bottom: '134px', left: '86px' }} />

                    <img src={require('../../../assets/image/center/fx/fz.png')} alt="" className={style.fz_img} onClick={() => { copy(state) }} />
                    <img src={require('../../../assets/image/center/fx/xiaz.png')} alt="" className={style.fz_xiaz} onClick={() => { createPicture('QRCodes') }} />

                    <img src={require('../../../assets/image/center/fx/gb.png')} alt="" className={style.imgs} onClick={() => { setVisible(false) }} />

                </div>
            </Mask>


        </div>
    );
}

export default InvitationDetails;
