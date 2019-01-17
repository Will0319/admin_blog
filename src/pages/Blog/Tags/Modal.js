import React, { Component } from 'react';
import {
    Button, Modal, Form, Input, Icon
} from 'antd';

function addNumber(_idx) {
    var str = '';
    for (var i = 0; i < _idx; i += 1) {
        str += Math.floor(Math.random() * 10);
    }
    return str;
}

const CollectionCreateForm = Form.create()(
    // eslint-disable-next-line
    class extends React.Component {

        state = {
            color: '#' + addNumber(6)
        }

        componentDidMount() {
            
        }
        afterClose = () => {
            this.setColor();
        }

        reloadIcon = () => {
            this.setColor();
        }

        setColor = () => {
            const color = '#' + addNumber(6)
            this.setState({color})
            this.props.form.setFieldsValue({ color })
        }

        render() {
            const {
                visible, onCancel, onCreate, form, loading, isMod, modData
            } = this.props;
            const {color} = this.state;
            const { getFieldDecorator } = form;

            return (
                <Modal
                    visible={visible}
                    title={isMod ? '修改标签' : "添加标签"}
                    okText="添加"
                    cancelText="取消"
                    onCancel={onCancel}
                    onOk={onCreate}
                    confirmLoading={loading}
                    afterClose={() => this.afterClose()}
                    destroyOnClose
                >
                    {console.log(modData)}
                    <Form layout="vertical">
                        <Form.Item label="标签名">
                            {getFieldDecorator('name', {
                                initialValue: isMod ? modData.name:'',
                                rules: [{}],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="颜色">
                            {getFieldDecorator('color', {
                                initialValue: isMod ? modData.color : color,
                                rules: [{}],
                            })(
                                <Input style={{ width: 'calc(100% - 40px)', marginRight: 10 }} />
                            )}
                            <Icon className="tags-addmodal-icon" style={{ background: this.props.form.getFieldValue('color') ||'#000000' }} type="reload" onClick={() => this.reloadIcon()} />
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);
export default CollectionCreateForm;