import React from 'react'
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import MenuConfig from '../../utils/MenuConfig';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './index.less'

const SubMenu = Menu.SubMenu;

@withRouter
class Nav extends React.Component {
    state = {
        openKeys: [],
        selectKeys: '/'
    }
    componentWillMount() {
        const menuTreeNode = this.renderMenu(MenuConfig);

        this.setState({
            menuTreeNode
        })
    }
    onOpenChange = (openKeys) => {
        // console.log(openKeys)
        var latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        this.setState({
            openKeys: latestOpenKey ? [latestOpenKey] : []
        })
    }
    // 菜单渲染 采用递归
    renderMenu = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <SubMenu title={<span><Icon type={item.icon} /><span>{item.title}</span></span>} key={item.key}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                {
                    item.icon ?
                        <span><Icon type={item.icon} /><span>{item.title}</span></span>
                        : <span>{item.title}</span>
                }
            </Menu.Item>
        })
    }
    // 页面跳转
    toLink = (item, key, keyPath) => {
        this.props.history.push({
            pathname: item.key
        })
        this.setState({ selectKeys: item.key })
    }
    render() {
        const { openKeys, menuTreeNode, selectKeys } = this.state;
        const { MenuCollapsed } = this.props;
        return (
            <div>
                <Menu
                    selectedKeys={[selectKeys]}
                    mode="inline"
                    theme="dark"
                    onOpenChange={(e) => this.onOpenChange(e)}
                    openKeys={openKeys}
                    style={{ overflowY: 'auto', height: '100vh', width: MenuCollapsed ? 80 : 256 }}
                    inlineCollapsed={MenuCollapsed}
                    onClick={(item, key, keyPath) => this.toLink(item, key, keyPath)}
                >
                    {menuTreeNode}
                </Menu>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        MenuCollapsed: state.Home.MenuCollapsed,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // setState: bindActionCreators(setState, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Nav);