import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { getLotteryDetailsHistory } from '../../../../api/userInfo';
import { RightOutlined } from '@ant-design/icons'
import { Radio } from 'antd';
import { Local } from '../../../../common';
class RewardDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryType: 0,
            table: [],
            loading: false
        }

        this.handleCancel = this.handleCancel.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    componentDidMount() {
        this.GetLotteryDetailsHistory();
    }
    onChange(data) {
        let value = data.target.value
        this.setState({ queryType: value, loading: true }, () => {
            this.GetLotteryDetailsHistory();
        });

    }
    GetLotteryDetailsHistory() {
        let { queryType } = this.state;
        let { detailData: { lotteryName }, type } = this.props
        getLotteryDetailsHistory({
            queryType,
            lotteryName,
            type,
            page: 0
        }).then(rt => {
            this.setState({
                table: rt,
                loading: false
            })
        })
    }
    handleCancel() {
        this.props.onClose();
    }
    render() {
        let { detailData, t, onClose  } = this.props;
        let { table, queryType, loading } = this.state;
        let lang = Local('lang') || 'vie'
        return (
            <div>
                <div className='link-to flex'>
                    <div className='f-link' onClick={onClose}>{t('btn_bet_record')}</div>
                    <RightOutlined className='jt' />
                    <div className='c-link'>{detailData.title}</div>
                </div>
                <Radio.Group value={queryType} onChange={this.onChange} style={{ marginBottom: 16, marginTop: 20 }}>
                    <Radio.Button value={0}>{t('f_ui_all2')}</Radio.Button>
                    <Radio.Button value="1">{t('sys_no_reward')}</Radio.Button>
                    <Radio.Button value="2">{t('sys_no_bingo')}</Radio.Button>
                    <Radio.Button value="3">{t('bet_history_lab_t_prize')}</Radio.Button>
                </Radio.Group>
                <div style={{ minHeight: 200 }} className={'a ' + (loading && 'loading')}>
                    {
                        table.map((item, index) => (
                            <div key={`${queryType}-${index}`}
                                className='user-info-reward-box-item'>
                                <div className='user-info-reward-box-item-top flex f-a-c'>
                                    <div>{t("f_ui_num_period", { num: item.expect })}</div>
                                </div>
                                <div className='user-info-reward-box-item-bottom flex f-a-c'>
                                    <div style={{whiteSpace: 'nowrap'}}>{t('rp_bet_amount')} <span className='amount-value'>{item.betAmount}</span></div>
                                    {item.realProfitAmount && <div style={{ marginLeft: 100, whiteSpace: 'nowrap' }}>{t('rp_win_amount')} <span className='amount-value'>{item.realProfitAmount}</span></div> || ''}
                                    <img src={require(`../../../../assets/images/liveDetail/${item.awardStatus == 2 ? ('jsuccess-' + lang) : ('jfail-' + lang)}.png`)} alt="" />

                                </div>
                            </div>
                        ))
                    }
                    {
                        !table.length && <div style={{ lineHeight: '200px', textAlign: 'center' }}>{t('noData')}</div>
                    }
                </div >
            </div>
        )
    }
}

export default withTranslation()(RewardDetail)