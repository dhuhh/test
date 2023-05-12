import React from 'react';
import classnames from 'classnames';
import { Form, Input, DatePicker } from 'antd';

const FormItem = Form.Item;

class GroupModify extends React.Component {
  state={
    khqid: this.props.khqid,
    khqmc: '',
    cjrq: '',
    jzrq: '',
  }
  componentDidMount() {
    const { khqid } = this.state;
    if (khqid !== '') {
      // this.getCusGroupDetails();
    }
  }
  getCusGroupDetails = () => {

  }
  render() {
    const { khqid, khqmc, cjrq, jzrq } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className={classnames('m-form-default m-form')}>
        <FormItem
          label="客户群名称"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          {getFieldDecorator('khqmc', {
            initialValue: khqmc,
            rules: [{ required: true, message: '请输入客户群名称!' }],
          })(<Input placeholder="客户群名称" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="群编号"
        >
          <span className="ant-form-text">{khqid}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="创建日期"
        >
          <span className="ant-form-text">{cjrq}</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="截止日期"
        >
          {getFieldDecorator('jzrq', {
            initialValue: jzrq,
          })(<DatePicker />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="群共享"
        >
          群共享
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(GroupModify);
