import React from 'react';
import { Card, Form, Row, Col } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

class PotentialCustomerBasicInfo extends React.Component {
  render() {
    return (
      <Card title={<span className={styles.infoheader}>基本信息</span>}>
        <Form key="1" className="m-form-default ant-advanced-search-form" style={{ marginTop: '-1.5rem' }}>
          <Row>
            <Col sm={8} md={8} xxl={8} >
              <FormItem labelCol={{ span: 5 }} className="m-form-item" label="客户名称" colon wrapperCol={{ span: 12 }}>
                <a href="#" className="ant-form-text" style={{ color: '#40a9ff' }}>王二</a>
              </FormItem>
            </Col>
            <Col sm={8} md={8} xxl={8} >
              <FormItem labelCol={{ span: 5 }} className="m-form-item" label="手机号" colon wrapperCol={{ span: 12 }}>
                <span className="ant-form-text">18771761111</span>
              </FormItem>
            </Col>
            <Col sm={8} md={8} xxl={8} >
              <FormItem labelCol={{ span: 5 }} className="m-form-item" label="地址" colon wrapperCol={{ span: 12 }}>
                <span className="ant-form-text">福州</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={8} md={8} xxl={8} >
              <FormItem labelCol={{ span: 5 }} className="m-form-item" label="客户来源" colon wrapperCol={{ span: 12 }}>
                <span className="ant-form-text">银行网点</span>
              </FormItem>
            </Col>
            <Col sm={8} md={8} xxl={8} >
              <FormItem labelCol={{ span: 5 }} className="m-form-item" label="预开户营业部" colon wrapperCol={{ span: 12 }}>
                <span className="ant-form-text">--</span>
              </FormItem>
            </Col>
            <Col sm={8} md={8} xxl={8} >
              <FormItem labelCol={{ span: 5 }} className="m-form-item" label="备注" colon wrapperCol={{ span: 12 }}>
                <span className="ant-form-text">--</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(PotentialCustomerBasicInfo);
