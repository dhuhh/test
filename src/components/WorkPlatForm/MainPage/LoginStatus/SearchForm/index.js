import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Button, Select } from 'antd';
import DeptTreeSelect from '../../Mot/MotAnalysis/DeptTreeSelect';
import BetweenDatePicker from '../../../../Common/Form/BetweenDatePicker';

const { Option } = Select;
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.handleSubmit();
  }


  // 提交按钮
  handleSubmit = () => {
    const { updatePayload } = this.props;
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    if (updatePayload && typeof updatePayload === 'function') {
      const { rq = '', zzjg = '' } = values;
      let { leftValue: ksrq = '', rightValue: jsrq = '' } = rq;
      ksrq = ksrq === '' ? ksrq : ksrq.format('YYYYMMDD');
      jsrq = jsrq === '' ? jsrq : jsrq.format('YYYYMMDD');
      updatePayload.call(this, {
        ksrq: Number(ksrq),
        jsrq: Number(jsrq),
        zzjg: Number(zzjg),
        khd: 1,
      });
    }
  }


  render() {
    const initialDateRange = { leftValue: moment().subtract(1, 'month').startOf('month'), rightValue: moment() };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 1 },
      wrapperCol: { span: 15 },
    };
    const formItemLayoutRq = {
      labelCol: { span: 1 },
      wrapperCol: { span: 18 },
    };
    return (
      <Row className="m-row-form">
        <Form className="m-form">
          <Col xs={24} sm={24} lg={12} xl={6}>
            <Form.Item {...formItemLayout} className="m-form-item m-form-item-mot" label="组织机构">
              {
                getFieldDecorator('zzjg', {
                  initialValue: this.props.orgid,
                  rules: [{ required: true, message: '请选择组织机构' }],
                })(<DeptTreeSelect placeholder="请选择组织机构" />)
              }
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={12} xl={8}>
            <Form.Item {...formItemLayoutRq} className="m-form-item m-form-item-mot" label="时间范围">
              {
                getFieldDecorator('rq', {
                  initialValue: initialDateRange,
                  rules: [{ required: true, message: '请输入查询时间' }],
                })(<BetweenDatePicker type={0} />)
              }
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={24} lg={12} xl={6}>
            <Form.Item {...formItemLayout} className="m-form-item m-form-item-mot" label="客户端">
              {
                getFieldDecorator('khd', {
                  initialValue: 1,
                  rules: [{ required: true, message: '请选择登录客户端' }],
                })(<Select className="m-select m-select-default" placeholder="请选择登录客户端"><Option value={1} >PC</Option><Option value={2} >APP</Option></Select>)
              }
            </Form.Item>
          </Col> */}
          <Col xs={24} sm={24} lg={12} xl={4}>
            <Form.Item style={{ paddingLeft: '3rem' }}>
              <Button className="m-btn-radius m-btn-headColor" onClick={this.handleSubmit}>查询</Button>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    );
  }
}
export default connect(({ global }) => ({
  orgid: global.userHighestLevelDept,
}))(Form.create()(SearchForm));
