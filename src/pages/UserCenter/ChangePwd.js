import React, { Component } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { POST } from '../../utils/axios';
import md5 from 'md5';

class ChangePwd extends Component {
    state={
        loading:false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true })
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.newpwd != values.newpwdtwo){
                    notification.warning({
                        message:'输入的两次新密码不相同'
                    })
                    return;
                }
                const user = JSON.parse(localStorage.getItem("will_blog_user"));
                POST('/api/user/changepwd',{
                    id: user.id,
                    oldpwd: md5(values.oldpwd),
                    newpwd: md5(values.newpwd),
                }).then(res=>{
                    this.setState({ loading: false })
                    const data = res.data;
                    if(data.error_code==0){
                        notification.success({
                            message:data.msg
                        })
                    }else{
                        notification.error({
                            message: data.msg
                        })
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading} = this.state;
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="旧密码"
                    >
                        {getFieldDecorator('oldpwd', {
                            rules: [{ required: true ,message:'必须填写旧密码'}],
                        })(
                            <Input type='password' />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="新密码"
                    >
                        {getFieldDecorator('newpwd', {
                            rules: [{ required: true, message: '必须填写新密码' }],
                        })(
                            <Input type='password' />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="确认新密码"
                    >
                        {getFieldDecorator('newpwdtwo', {
                            rules: [{ required: true, message: '必须确认新密码' }],
                        })(
                            <Input type='password' />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            修改
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create()(ChangePwd);