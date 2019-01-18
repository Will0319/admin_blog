import React, {Component} from 'react';
import { Card, Row, Col, Icon, Tooltip} from 'antd';
import { GET } from '../../utils/axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import echartTheme from './echartTheme';
// 引入饼图和折线图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import './index.less';
// import { setState, getIssuesInfo} from 'actions/home';

function secondToDate(result) {
    var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    var m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    var s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    return result = h + ":" + m + ":" + s;
}

class Home extends Component {

    state={
        loading:true,
        data:[]
    }

    componentDidMount(){
        GET('/api/getbaidu',{
            day:7
        }).then(res=>{
            this.setState({ loading: false })
            const data = res.data.body;
            const header = res.data.header;
            console.log(data, header,res)
            if (header.status===0){
                this.setState({data:data.data})
            }else{
                notification.error({
                    message: '服务器开了个小差，请稍后再试'
                })
            }
        })
        // 基于准备好的dom，初始化echarts实例
        echarts.registerTheme('blog', echartTheme);
    }
    getOption() {
        const {data} = this.state;
        let pv = [];
        if (data && data[0] && data[0].result){
            data[0].result.items[1].map(item => {
                pv.push(item[0])
            })
        }
        let option = {
            xAxis: {
                type: 'category',
                data: data && data[0] && data[0].result ? data[0].result.items[0]:[]
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: pv,
                type: 'line'
            }]
        }
        return option;
    }
    render() {
        const { loading, data} = this.state;
        const option =  {
            size:"small",
            hoverable:true,
            loading
        }
        let pv = 0;
        let uv = 0;
        let ip = 0;
        let Jumpout = 0;
        let toTime = 0;
        const a = data && data[0] &&data[0].result?(data[0].result.items[1].map(item=>{
            pv+=item[0]
            uv+=item[1]
            ip+=item[2]
            Jumpout+=item[3]
            toTime+=item[4]
        })):null

        return (
            <div className='home-wrap'>
                {console.log(data)}
                <Row gutter={16}>
                    <Col span={4}>
                        <Card
                            title="浏览量(PV)"
                            extra={
                                <Tooltip placement="bottom" title="即通常说的Page View(PV)，用户每打开一个网站页面就被记录1次。用户多次打开同一页面，浏览量值累计。">
                                    < Icon type="question-circle" />
                                </Tooltip>
                            }
                            {...option}
                        >
                            <h3>{pv}</h3>
                        </Card>
                    </Col>
                    <Col offset={1} span={4}>
                        <Card
                            title="访客数(UV)"
                            extra={
                                <Tooltip placement="bottom" title="一天之内您网站的独立访客数(以Cookie为依据)，一天内同一访客多次访问您网站只计算1个访客。">
                                    < Icon type="question-circle" />
                                </Tooltip>
                            }
                            {...option}
                        >
                            <h3>{uv}</h3>
                        </Card>
                    </Col>
                    <Col offset={1} span={4}>
                        <Card
                            title="IP数"
                            extra={
                                <Tooltip placement="bottom" title="一天之内您网站的独立访问ip数。">
                                    < Icon type="question-circle" />
                                </Tooltip>
                            }
                            {...option}
                        >
                            <h3>{ip}</h3>
                        </Card>
                    </Col>
                    <Col offset={1} span={4}>
                        <Card
                            title="跳出率"
                            extra={
                                <Tooltip placement="bottom" title="只浏览了一个页面便离开了网站的访问次数占总的访问次数的百分比。">
                                    < Icon type="question-circle" />
                                </Tooltip>
                            }
                            {...option}
                        >
                            <h3>{(Jumpout / 7).toFixed(2)}%</h3>
                        </Card>
                    </Col>
                    <Col offset={1} span={4}>
                        <Card
                            title="平均访问时间"
                            extra={
                                <Tooltip placement="bottom" title="访客在一次访问中，平均打开网站的时长。即每次访问中，打开第一个页面到关闭最后一个页面的平均值，打开一个页面时计算打开关闭的时间差。">
                                    < Icon type="question-circle" />
                                </Tooltip>
                            }
                            {...option}
                        >
                            <h3>{secondToDate(toTime / 7)}</h3>
                        </Card>
                    </Col>
                </Row>
                <Card 
                    title="最近一周PV折线图" 
                    style={{marginTop:20}}
                    {...option}
                    >
                    <ReactEcharts
                        option={this.getOption()}
                        theme="blog"
                        notMerge={true}
                        lazyUpdate={true}
                        />
                </Card>
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
