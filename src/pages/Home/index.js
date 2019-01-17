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
                 < small >您正在< b > {process.env.NODE_ENV} </ b >模式。</ small >
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
