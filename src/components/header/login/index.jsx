import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Login from './login';
import Register from './register';
import './index.scss'
class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: props.type
        }
        this.onOk = this.onOk.bind(this)
    }
    onOk() {
        let { onOk } = this.props;
        onOk()
    }
    render() {
        let { type } = this.state
        let { FreshUser } = this.props
        return (
            <div className='login-regist-box'>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img src={require('../../../assets/images/header/logo.png')} alt="" />
                </div>
                {
                    type == 0 ? <Login FreshUser={FreshUser} onOk={this.onOk} onCheck={() => { this.setState({ type: 1 }) }} /> :
                        <Register FreshUser={FreshUser} onOk={this.onOk} onCheck={() => { this.setState({ type: 0 }) }} />
                }
            </div>
        )
    }
}
export default withTranslation()(Index)

