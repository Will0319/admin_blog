import React, { Component } from 'react';
import { Menu, Row, Col, Upload, Icon, message, Form, Input, Button, notification} from 'antd';
import ChangePwd from './ChangePwd';
import { POST, GET} from '../../utils/axios';
import './index.less';

const { TextArea } = Input;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}

class UserCenter extends Component {
    state = {
        loading: false,
        key:'1'
    };

    componentDidMount(){
        const user = JSON.parse(localStorage.getItem("will_blog_user"));
        
        this.setState({
            nick: user.nick,
            imageUrl: user.user_img,
            introduction: user.introduction
        })
    }

    handleChange = (info) => {
        getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
        }));
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading:true})
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const user = JSON.parse(localStorage.getItem("will_blog_user"));
                POST('/api/user/updateuserinfo',{
                    id:user.id,
                    nick:values.nick,
                    introduction: values.introduction,
                    user_img: this.state.imageUrl
                }).then(res=>{
                    this.setState({ loading: false })
                    const data = res.data;
                    if (data.error_code==0){
                        notification.success({
                            message: data.msg
                        })
                    }
                    GET('/api/user/getuserinfo',{
                        id: user.id,
                    }).then(res=>{
                        this.setState({ loading: false })
                        const data = res.data;
                        if (data.error_code == 0){
                            this.setState({
                                nick: data.user_info.nick,
                                imageUrl: data.user_info.user_img,
                                introduction: data.user_info.introduction
                            })
                            // 存入本地存储更新用户信息
                            localStorage.setItem("will_blog_user", JSON.stringify(data.user_info));
                        }
                    })
                })
            }
        });
    }
    worldhandleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
            }
        });
    }
    // 菜单切换
    MenuClick = (item, key, keyPath)=>{
        this.setState({key:item.key})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { nick, imageUrl, introduction, loading,key} = this.state;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        // const imageUrl = this.state.imageUrl;
        return (
            <Row className="usercenter-wrap">
                <Col span={4}>
                    <Menu
                        mode="inline"
                        selectedKeys={[key]}
                        onClick={(item, key, keyPath) => this.MenuClick(item, key, keyPath)}
                        style={{ width: '100%' }}
                    >
                        <Menu.Item key="1">
                            用户设置
                        </Menu.Item>
                        <Menu.Item key="2">
                            安全设置
                        </Menu.Item>
                    </Menu>
                </Col>
                <Col span={20}>
                    {
                        key=='1'?(
                            <Row>
                                <Col span={12} style={{ padding: '0px 20px 20px 20px' }}>
                                    <Form onSubmit={this.handleSubmit} className="login-form">
                                        <Form.Item
                                            label="昵称"
                                        >
                                            {getFieldDecorator('nick', {
                                                initialValue: nick || '',
                                                rules: [{}],
                                            })(
                                                <Input />
                                            )}
                                        </Form.Item>
                                        <Form.Item
                                            label="个人简介"
                                        >
                                            {getFieldDecorator('introduction', {
                                                initialValue: introduction || '',
                                                rules: [{}],
                                            })(
                                                <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                                            )}
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" loading={loading}>
                                                保存
                                    </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                                <Col span={12}>
                                    <p style={{ marginTop: 10 }}>头像：</p>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        // action="/upload"
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                                    </Upload>
                                </Col>
                            </Row>
                        ):(
                            <Row>
                                <Col span={12} style={{ padding: '0px 20px 20px 20px' }}>
                                        <ChangePwd />
                                </Col>
                            </Row>   
                        )
                    }

                </Col>
            </Row>
        )
    }
}

export default Form.create()(UserCenter);