
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import './giftShow.scss'
import { CSSTransition } from 'react-transition-group'

class GiftShow extends Component {
    constructor(props) {
        super(props)
        this.getGiftMap = this.getGiftMap.bind(this)

    }
    getGiftMap(gid) {
        let { giftList } = this.props
        let cover = ''
        let gname = ''
        giftList.some(item => {
            if (item.gid == gid) {
                gname = item.gname
                return cover = item.cover
            }
        })
        return { cover, gname }
    }
    render() {

        let { showAniList } = this.props;
        return (
            <div className='gift-show-box'>
                {
                    showAniList.map((item) =>
                        <CSSTransition
                            key={item.timestamp}
                            in={item.isShow}
                            timeout={500}
                            classNames='fade'
                            unmountOnExit
                            appear={true}
                        >
                            <div className={'gift-show-box-item gift-show-box-item-' + (item.gid % 3)} key={item.timestamp}>
                                <img className='avater' src={item.avatar} alt="" />
                                <div>
                                    <div className='avatar-name'>{item.nickname}</div>
                                    <div className='avatar-dec'>{this.getGiftMap(item.gid).gname}</div>
                                </div>
                                <img className='game-gift-icon' src={this.getGiftMap(item.gid).cover} alt="" />
                                <CSSTransition 
                                    in={item.combo > 1}
                                    timeout={500}
                                    classNames='fade2'
                                    unmountOnExit
                                    appear={true}>
                                    <div className='combo-box'>x <span>{item.combo}</span></div>
                                </CSSTransition >
                            </div>
                        </CSSTransition>

                    )
                }
            </div>
        )
    }
}
export default withTranslation()(GiftShow)