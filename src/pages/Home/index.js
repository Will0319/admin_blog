import React, {Component} from 'react';
import { Button, Table} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './index.less';
// import { setState, getIssuesInfo} from 'actions/home';

class Home extends Component {

    render() {
        return (
            <div className='home-wrap'>
                欢迎进入后台管理系统
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);