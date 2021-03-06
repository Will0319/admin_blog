import React, { Component } from 'react';
import { Button, Table, Divider, Tag, Row, Col, Input, notification, Form, Modal } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './index.less';
// import { setState } from 'actions/blog';
// import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router-dom';
import { GET } from '../../../utils/axios';
import CollectionCreateForm from './Modal';
const confirm = Modal.confirm;


@withRouter
class Tags extends Component {
    state = {
        // 模态框状态
        visible: false,
        // 添加loading状态
        ModalLoading: false,
        // 标签默认数据
        tagsContent: {
            list: [],
            total: 0,
            pageNum: 1,
            pageSize: 10
        },
        // 表格加载
        tableLoading: false,
        // 是否是修改模态框
        isMod:false,
        // 修改的标签数据
        modData:''
    };

    componentDidMount() {
        // 获取Tag数据
        this.getTags(1, 10);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.getTags(1, 10, values.name);
            }
        });
    }

    // 打开添加弹窗
    showAddModal = () => {
        this.setState({ visible: true, isMod:false});
    }

    // 打开修改弹窗
    showModModal = (data) => {
        this.setState({ visible: true, isMod: true ,modData:data});
    }

    // 关闭添加弹窗
    handleCancel = () => {
        this.setState({ visible: false });
    }

    // 弹窗确定按钮事件
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            this.setState({ ModalLoading: true });
            if (err) {
                return;
            }
            const { isMod, modData } = this.state;
            if (isMod){
                const update = GET('api/blog/updatetags', {
                    id: modData.id,
                    color: values.color,
                    name: values.name,
                })
                update.then(res=>{
                    this.setState({ visible: false, ModalLoading: false });
                    const data = res.data;
                    if (data.error_code === 0) {
                        console.log(data)
                        notification.success({
                            message: data.msg,
                        })
                    } else {
                        notification.error({
                            message: data.msg,
                        })
                        return
                    }
                    this.getTags(1, 10);
                })
                return
            };
            GET('/api/blog/addtags', {
                color: values.color,
                name: values.name,
            }).then(res => {
                this.setState({ visible: false, ModalLoading: false });
                const data = res.data;
                if (data.error_code === 0) {
                    notification.success({
                        message: data.msg,
                    })
                }else{
                    notification.error({
                        message: data.msg,
                    })
                    return
                }
                this.getTags(1, 10);
            })
        });
    }


    // 重置搜索条件
    reset = () => {
        this.props.form.setFieldsValue({ name: '' });
        this.getTags(1, 10);
    }


    // 获取Tag
    getTags = (pageNum, pageSize, name = '') => {
        this.setState({ tableLoading: true })
        GET('/api/blog/gettags', {
            pageNum,
            pageSize,
            name
        }).then(res => {
            this.setState({ tableLoading: false })
            const data = res.data;
            this.setState({
                tagsContent: data
            })
        })
    }

    // 删除Tag
    delTag = (id, name) => {
        const _this = this;
        confirm({
            title: '操作提示',
            content: `确定删除【${name}】？`,
            okText: "确定",
            cancelText: "取消",
            onOk() {
                return GET('/api/blog/delTags', { id }).then(res => {
                    const data = res.data;
                    if (data.error_code == 0) {
                        notification.success({
                            message: data.msg,
                        })
                        _this.getTags(1, 10);
                    }
                })
            },
            onCancel() { },
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    changePage = (page, pageSize) => {
        this.getTags(page, pageSize);
    }
    render() {
        const { ModalLoading, visible, tagsContent, tableLoading, isMod, modData} = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '标签',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Tag color={record.color}>{text}</Tag>,
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button size="small" type="primary" onClick={() => this.showModModal(record)}>编辑</Button>
                        <Divider type="vertical" />
                        <Button size="small" type="danger" onClick={() => this.delTag(record.id, record.name)}>删除</Button>
                    </span>
                ),
            }
        ];
        // 表格分页属性
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: () => `共${tagsContent.total}条`,
            pageSize: tagsContent.pageSize,
            current: tagsContent.pageNum,
            total: tagsContent.total,
            onShowSizeChange: (page, pageSize) => this.changePage(page, pageSize),
            onChange: (page, pageSize) => this.changePage(page, pageSize),
        };
        return (
            <Row className='tags-wrap'>
                {/* 添加的表单 */}
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    loading={ModalLoading}
                    isMod={isMod}
                    modData={modData}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Form.Item
                                label="标签名"
                            >
                                {getFieldDecorator('name', {
                                    rules: [{}],
                                })(
                                    <Input placeholder="请输入关键字搜索" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    搜索
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    onClick={() => this.reset()}
                                >
                                    重置
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div>
                        <Button type="primary" style={{ float: 'right' }} onClick={() => this.showAddModal()}>添加标签</Button>
                    </div>
                </div>
                <Row style={{ marginTop: 20 }}>
                    <Table
                        pagination={paginationProps}
                        rowKey='id'
                        columns={columns}
                        dataSource={tagsContent.list}
                        locale={{ emptyText: '暂无Tag' }}
                        loading={tableLoading}
                        bordered
                    />
                </Row>
            </Row>
        )
    }
}


function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        // setState: bindActionCreators(setState, dispatch),
    }
}
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Tags));
