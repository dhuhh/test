import React from 'react';
import { Form, Radio, DatePicker, Button, Row, Col } from 'antd';
import styles from './form.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class InformationUpdateLogSearchForm extends React.Component {
  render() {
    return (
      <Form layout="inline" style={{ padding: '2rem' }}>
        <Row>
          <Col>
            <FormItem className="m-form-item">
              <RadioGroup className="m-product-radio-group" style={{ width: '18rem', float: 'left' }} value="oneWeekAgo">
                <RadioButton value="oneWeekAgo">近一周</RadioButton>
                <RadioButton value="oneMonthAgo">近一月</RadioButton>
                <RadioButton value="threeMonthAgo">近三月</RadioButton>
              </RadioGroup>
            </FormItem>

            <FormItem className="m-form-item">
              <DatePicker className={styles.m_Input} style={{ width: '10rem' }} format="YYYY/MM/DD" placeholder="" />
            </FormItem>
            <span style={{ display: 'inline-block', textAlign: 'center' }}>-</span>
            <FormItem className="m-form-item">
              <DatePicker className={styles.m_Input} style={{ width: '10rem', marginLeft: '1rem' }} format="YYYY/MM/DD" placeholder="" />
            </FormItem>
            <Button className="m-btn-radius m-btn-headColor" htmlType="submit">查询</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InformationUpdateLogSearchForm;
