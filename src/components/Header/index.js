import React from 'react';
import { Modal, Dropdown, Menu, Icon, Avatar } from "antd";
import './index.less';
// 工具类
// import Util from '../../util/utils';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setState } from '../../redux/actions/home';
import { withRouter, Link } from 'react-router-dom';


const confirm = Modal.confirm;

@withRouter
class Header extends React.Component {

    state = {
        userName: '',
        userImg: '',
        // sysTime: Util.formateDate(new Date().getTime())
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.setState(
            {
                userName: JSON.parse(localStorage.getItem("will_blog_user")) ? JSON.parse(localStorage.getItem("will_blog_user")).name : '',
                userImg: JSON.parse(localStorage.getItem("will_blog_user")) ? JSON.parse(localStorage.getItem("will_blog_user")).user_img : ''
            }
        );
        // 调用工具类的时间类来获取时间
        // setInterval(() => {
        //     let sysTime = Util.formateDate(new Date().getTime());
        //     this.setState({
        //         sysTime
        //     })
        // }, 1000)
    }

    // 菜单收缩
    MenuCollapsed = () => {
        this.props.setState({ MenuCollapsed: !this.props.MenuCollapsed })
    }

    // 退出登录
    loginOut = () => {
        const _this = this;
        confirm({
            title: '操作提示',
            content: '确定退出博客管理后台？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                localStorage.clear();
                _this.props.history.push({
                    pathname: '/login'
                })
            },
            onCancel() { },
        });
    }

    // 跳转个人中心
    toUser = () => {
        this.props.history.push({
            pathname: '/user'
        })
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const { userName , userImg } = this.state;
        const { MenuCollapsed } = this.props;
        const menu = (
            <Menu>
                <Menu.Item onClick={() => this.toUser()}>
                    个人中心
                </Menu.Item>
                <Menu.Item onClick={() => this.loginOut()}>
                    退出登录
                </Menu.Item>
            </Menu>
        )
        return (
            <div className="header">
                <div className='header-menu-icon' style={{ padding: '0px 20px' }} onClick={() => this.MenuCollapsed()}>
                    <Icon type={MenuCollapsed ? "menu-unfold" : "menu-fold"} style={{ fontSize: 24 }} />
                </div>
                <div style={{ padding: '0px 20px' }}>
                    <Avatar src={userImg} style={{ marginRight: 10 }} />
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="#">
                            {userName} <Icon type="down" />
                        </a>
                    </Dropdown>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        MenuCollapsed: state.Home.MenuCollapsed,
        // loading: state.Home.loading,
        // list: state.Home.list,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setState: bindActionCreators(setState, dispatch),
        // getIssuesInfo: bindActionCreators(getIssuesInfo, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);