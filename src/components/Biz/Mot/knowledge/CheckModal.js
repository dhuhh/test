import React from 'react';
import { Form, Input, Button, Radio, message, Col, Row } from 'antd';
import moment from 'moment';
import BasicModal from '../../../Common/BasicModal';
import { DoMotCasesAudit } from '../../../../services/motbase/motType';

const FormItem = Form.Item;
const { TextArea } = Input;

class CheckModal extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedCaseOfActionPlan } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        DoMotCasesAudit({
          shzt: values.shyj,
          shyj: values.alshyj,
          alid: selectedCaseOfActionPlan.alid,
        }).then((ret = {}) => {
          const { code = 0 } = ret;
          if (code > 0) {
            message.success('操作成功');
            if (this.props.onCheckFinished) {
              this.props.onCheckFinished();
            }
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      } else {
        const errKey = Object.keys(err);
        if (errKey && errKey.length > 0) {
          message.error(err[errKey[0]].errors[0].message);
        }
      }
    });
  }
  render() {
    // const createDate = new moment().format('YYYY/MM/DD HH:mm:ss'); // eslint-disable-line
    const { getFieldDecorator } = this.props.form;
    const { selectedCaseOfActionPlan } = this.props;
    const modalProps = {
      width: '65rem',
      title: '审核',
      footer: null,
      ...this.props,
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <BasicModal {...modalProps}>
        <Form className="m-form" onSubmit={this.handleSubmit} style={{ padding: '0.5rem 2rem' }}>
          <Row>
            <Col>
              <FormItem {...formItemLayout} label="审核意见">
                {getFieldDecorator('shyj', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                  }],
                })( // eslint-disable-line
                  <Radio.Group name="radiogroup">
                    <Radio value={1} checked>通过</Radio>
                    <Radio value={2}>不采纳</Radio>
                  </Radio.Group>)}
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="归档行动方案">
                <span className="ant-form-text">{selectedCaseOfActionPlan.famc}</span>
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="案例主题">
                <span className="ant-form-text">{selectedCaseOfActionPlan.alzt}</span>
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="案例内容">
                <span className="ant-form-text">{selectedCaseOfActionPlan.alnr}</span>
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="案例审核意见">
                {getFieldDecorator('alshyj', {
                  rules: [{
                    required: true,
                    message: '请填写案例审核意见',
                  }, {
                    max: 500,
                    message: '不能超过500个字符',
                  }],
                })(<TextArea autosize={{ minRows: 4 }} />)}
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="营业部">
                <span className="ant-form-text">{selectedCaseOfActionPlan.yybmc}</span>
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="创建人">
                <span className="ant-form-text">{selectedCaseOfActionPlan.cjrxm}</span>
              </FormItem>
            </Col>
            <Col>
              <FormItem {...formItemLayout} label="创建时间">
                <span className="ant-form-text">{selectedCaseOfActionPlan.cjsj}</span>
              </FormItem>
            </Col>
          </Row>
          <div style={{ textAlign: 'center', width: '100%', paddingBottom: '1rem' }}>
            <Button className="m-btn-radius m-btn-headColor" htmlType="submit">确定</Button>
          </div>
        </Form>
      </BasicModal>
    );
  }
}

export default Form.create()(CheckModal);
