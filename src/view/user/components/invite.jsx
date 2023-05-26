import React, { useEffect, useState, useCallback } from 'react';
import { Table, Popover, Modal } from 'antd';
import { userInviteInfo, shareIncomeDetail, userIndex, baseInfo } from '../../../api/userInfo';
import { Local } from '../../../common';
import { useTranslation } from "react-i18next";
import Copy from '../../../components/common/copy'
import QRCode from 'qrcode.react';
import './invite.scss'
export default () => {
    const { t } = useTranslation()
    const [baseInfoData, setBaseInfoData] = useState({})
    const codeUrl = `${baseInfoData?.shareUrl || ''}?puid=${Local("userInfo2")?.uid}`;
    const [baseData, setBaseData] = useState({
        allProfit: 0,
        shareCount: 0,
        promotionGiftFee: 0,
        promotionLotteryFee: 0,
    })
    const [activeKeys, setActiveKeys] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tabs = [
        { name: t('bet_history_tab_today'), code: 1 },
        { name: t('bet_history_tab_yesterday'), code: 2 },
        { name: t('user_invite_z'), code: 3 },
        { name: t('user_invite_m'), code: 4 },
        { name: t('user_invite_3m'), code: 5 },
    ]
    const [inviteInfoList, setInviteInfoList] = useState([
        { name: t('download'), num: 0 },
        { name: t('user_invite_az'), num: 0 },
        { name: t('ui_registered'), num: 0 },
        { name: t('user_invite_ls'), num: 0 },
        { name: t('bet_history_lab_profit_amount'), num: 0 },
        { name: t('user_invite_ds'), num: 0 }
    ])
    const [inviteInfo, setInviteInfo] = useState({})
    const [shareList, setShareList] = useState(0);
    const columns = [
        { title: t('ui_user_user'), dataIndex: 'nickname', },
        { title: t('user_invite_ds'), dataIndex: 'giftIncome' },
        { title: t('user_invite_cp'), dataIndex: 'lotteryIncome' }
    ]
    // 查询邀请明细数据
    const getInviteInfo = async (e) => {
        let code = e || activeKeys
        const rt = await userInviteInfo({ code });
        if (!(rt instanceof Error)) {
            let tempData = [
                { name: t('download'), num: rt?.downNum || 0 },
                { name: t('user_invite_az'), num: rt?.installNum || 0 },
                { name: t('ui_registered'), num: rt?.registerNum || 0 },
                { name: t('user_invite_ls'), num: rt?.flow || 0 },
                { name: t('bet_history_lab_profit_amount'), num: rt?.lotteryProfit || 0 },
                { name: t('user_invite_ds'), num: rt?.giftProfit || 0 },
            ]
            setInviteInfoList(tempData)
            setInviteInfo(rt)
        }
    }
    // 查询收益明细
    const getShareIncomeDetail = useCallback(async () => {
        const rt = await shareIncomeDetail({ page:0 });
        if (!(rt instanceof Error)) {
            setShareList(rt || []);
        }
    }, []);
    // 查询总收益，分享人数
    const getUserIndex = useCallback(async () => {
        const rt = await userIndex();
        if (!(rt instanceof Error)) {
            console.log(rt, "rt")
            setBaseData({
                allProfit: rt?.allProfit || 0,
                shareCount: rt?.shareCount || 0,
                promotionGiftFee: rt?.promotionGiftFee || 0,
                promotionLotteryFee: rt?.promotionLotteryFee || 0,
            })
        }
    }, []);
    const getBaseInfo = async () => {
        const rt = await baseInfo();
        if (!(rt instanceof Error)) {
            console.log(rt, "rt")
            setBaseInfoData(rt)
        }
    }
    const init = () => {
        getBaseInfo()
        getShareIncomeDetail()
        getUserIndex();
    }
    useEffect(() => {
        init();
    }, []);
    useEffect(() => {
        getInviteInfo()
    }, [activeKeys])
    return <div className='user-info-invite-box'>
        <div className='invite-top'>
            <div className='min-title'>{t('ui_recommended_back')}</div>
            {
                baseInfoData?.promotionShareIsOpen == 1 && <div className='invite-bg'>
                    <div className='p1'>{t('user_invite_tips1')}</div>
                    <div className='p2'>{t('user_invite_tips2').replace('{num1}', inviteInfo?.promotionGiftFee || 0).replace('{num2}', inviteInfo?.promotionLotteryFee || 0)}</div>
                    <img src={require('../../../assets/images/userInfo/invite-icon.png')} alt="" />
                </div>
            }
            {/* 分享 */}
            <div className='user-info-invite-box-base'>
                <div className='user-info-invite-box-base-code'>
                    <div className='code-box'>
                        <QRCode className='code' value={codeUrl} size={90} />
                    </div>
                    <div className='link-box'>
                        <div className='title'> {t('referral_qr_code_title')} </div>
                        <Popover content={codeUrl}>
                            <div className='link'>{codeUrl}</div>
                        </Popover>
                        <Copy text={codeUrl}><div className='copy-btn'>{t('copy')}</div></Copy>
                    </div>
                </div>
                <div className='user-info-invite-box-base-right'>
                    <div className='user-info-invite-box-base-right-left'>
                        <div className='text'>{t('total_revenue')}</div>
                        <div className='num'>{baseData?.allProfit}</div>
                    </div>
                    <div className='user-info-invite-box-base-right-right'>
                        <div className='text'>{t('referral_share_number')}</div>
                        <div className='num'>{baseData?.shareCount}</div>
                    </div>
                </div>
            </div>
        </div>
        <div className='invite-bottom'>
            <div className='invite-bottom-left'>
                <div className='top'>
                    <div className='min-title'>{t('user_invite_yqmx')}</div>
                    <div className='tips' onClick={() => setIsModalOpen(true)}>{t('huodongshuoming')}</div>
                </div>
                <div className='tabs'>
                    {tabs.map((item, index) => (
                        <div key={index} className={`tab ${activeKeys === item.code && 'active'}`} value={item.code}
                            onClick={() => { setActiveKeys(item.code) }}>
                            {item.name}
                        </div>
                    ))}
                </div>
                {/* 数据 */}
                <div className="content-data">
                    {inviteInfoList.map((value, index) => {
                        return <div key={index} className="item">
                            <div className='num'>{value.num}</div>
                            <div className='name'>{value.name}</div>
                        </div>
                    })}
                </div>
            </div>
            <div className='invite-bottom-right'>
                <div className='min-title'>{t('user_invite_symx')}</div>
                <Table columns={columns} dataSource={shareList} scroll={{ y: 290 }} bordered={false} pagination={false} className='user-info-reward-box-tables' />
            </div>
        </div>

        <Modal title={t('huodongshuoming')}
            visible={isModalOpen}
            width={600}
            footer={null}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}>
            <div className="desc">
                <div className="desc_tips">
                    <div>
                        1、mời bạn cùng chơi game, mỗi ngày nhận thưởng không giới hạn! bạn cược càng nhiều, người mời nhận thưởng càng lớn.
                    </div>
                </div>
                <div className="desc_tips">
                    <div>
                        2、Thời gian tham gia hoạt động chia sẻ không giới hạn, hoa hồng khổng lồ đang đợi bạn (tham gia khi nào nhận tiền khi đó)
                    </div>
                </div>
                <div className="desc_tips">
                    <div>
                        3、mời bạn bè cá cược thành công,hoàn thành hồ sơ cá nhân và nạp tiền thành công đồng thời có doanh thu cược hiệu quả thì coi như mời thành công.
                    </div>
                </div>
                <div className="desc_tips">
                    <div>
                        4、Người mời có thể hưởng {inviteInfo?.promotionLotteryFee}% tổng tiền cá cược hợp lệ của xổ số và tổng doanh thu cá cược hợp lệ của trò chơi từ bạn bè, đồng thời nhận được {inviteInfo?.promotionGiftFee}% tổng số tiền mà người bạn đó đã thưởng cho idol.
                        <br /> Ví dụ：
                        <br /> bạn cược 1000 tổng tiền hợp lệ, người mời sẽ nhận được {(inviteInfo?.promotionLotteryFee * 1000) / 100} xu
                        <br />bạn cược 2000 tổng tiền hợp lệ, người mời sẽ nhận được {(inviteInfo?.promotionLotteryFee * 2000) / 100} xu
                        <br />bạn cược 100000 tổng tiền hợp lệ, người mời sẽ nhận được {(inviteInfo?.promotionLotteryFee * 100000) / 100} xu, không giới hạn
                        <br />bạn thưởng idol 1000, người mời sẽ được {(inviteInfo?.promotionGiftFee * 1000) / 100} xu
                        <br />bạn thưởng idol 2000, người mời sẽ được {(inviteInfo?.promotionGiftFee * 2000) / 100} xu
                    </div>
                </div>
                <div className="desc_tips">
                    <div>
                        5、chia sẻ hoạt động chỉ nhằm vào " xổ số, game" như: "tài xỉu, xóc đĩa, bầu cua, đua xe, khí cầu...
                    </div>
                </div>
                <div className="desc_tips">
                    <div>
                        6、không bao gồm thể thao, giải trí trực tiếp.
                    </div>
                </div>
            </div>
        </Modal>
    </div>
}