import React, { Component } from 'react';
import { Modal, Row, Col } from 'antd';
import { withRouter } from 'react-router-dom';
import Header from '../components/Header';
import Nav from '../components/Nav';
import './index.less';

@withRouter
class HomeLayout extends Component {

    componentDidMount() {
        const userInfo = JSON.parse(localStorage.getItem("will_blog_user"));
        const token = localStorage.getItem('will_blog_user_token');
        // 判断是否登录了
        if (!userInfo || !token) {
            const _this = this;
            Modal.warning({
                title: '操作提示',
                content: '账户异常，请重新登录',
                onOk() {
                    _this.props.history.push({
                        pathname: '/login'
                    })
                },
            });
        }
    }

    render() {
        return (
            <Row style={{ height: '100%', display: 'flex' }}>
                <Col>
                    <Nav />
                </Col>
                <Col style={{ width: '100%' }}>
                    <Header />
                    <Row style={{ width: '100%', height: 'calc(100% - 64px)', padding: 20, background: '#F0F2F5', overflowY: 'auto' }}>
                        {/* 进行路由嵌套 */}
                        {this.props.children}
                    </Row>
                    {/* <Footer /> */}
                </Col>
            </Row>
        )
    }
}

export default HomeLayout;