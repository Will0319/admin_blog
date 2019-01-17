import React, { Component } from 'react';
import {Row,Col,Button} from 'antd';
import './index.less';


export default class NotFound extends Component {

    // 跳转首页
    toHome=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    // 返回上一页
    toPreviousPage=()=>{
        history.back()
    }

    render() {
        return (
            <Row className="notfound-wrap">
                <Col span={12} className="notfound-text">
                    <Row style={{height:'50%'}}>
                        <img className="notfound-font-img" src={require('../../assets/images/404-font.png')} />
                    </Row>
                    <Row style={{ height: '50%' }}>
                        <div className="notfoud-font-text">
                            <h3 style={{ textAlign: 'right',color:'#2cb7fd'}}>哎呀迷路了...</h3>
                            <p style={{ textAlign: 'right'}}>可能...我们的服务器被外星人劫持了！</p>
                            <div className="notfound-font-btn">
                                <Button type="primary" onClick={()=>this.toHome()}>返回首页</Button>
                                <Button onClick={() => this.toPreviousPage()}>上一页</Button>
                            </div>
                        </div>
                    </Row>
                </Col>
                <Col span={12} className="notfound-bg">
                    <img src={require('../../assets/images/404-bg.png')} />
                </Col>
            </Row>
        )
    }
}