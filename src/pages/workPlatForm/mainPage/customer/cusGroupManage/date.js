import React, { Component } from 'react';
import { Row, Col, Form, Radio, message } from 'antd';
import styles from './index.less';
import { FetchCusLifeCycleConditionConfig } from '../../../../../services/customerbase/index';

class Date extends Component {
  state={
    conditionConfig: [],
  }

  componentDidMount = () => {
    this.getCondition();
  }
  
  getCondition = () => {
    FetchCusLifeCycleConditionConfig({}).then((response) => {
      const { records = [], code = 0 } = response || {};
      if (code > 0) {
        this.setState({
          conditionConfig: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  render(){
    const { conditionConfig = [] } = this.state;
    return (
      <React.Fragment>
        <Row type="flex" justify="center">
          <Form.Item  className="m-form-item">
            <div className={styles.myCarousel}>
              <Radio.Group className={styles.m_carousel} defaultValue="1" buttonStyle="solid" style={{ width: '100%', textAlign: 'center' }}>
                {
                  conditionConfig.map((item) => {
                    return (
                      <Radio.Button value={item.optionValue} style={{ width: '8rem', margin: '0 2rem 0 2rem', height: '8rem', lineHeight: '8rem', borderRadius: '50%' }}>
                        <Row>
                          <Col><i className={item.optionIcon} /></Col>
                          <Col style={{ margin: '0', lineHeight: '4rem', fontSize: '1.4rem', color: 'white' }}>{item.optionName}</Col>
                        </Row>
                      </Radio.Button>
                    )
                  })
                }
              </Radio.Group>
            </div>
          </Form.Item>
        </Row>
      </React.Fragment>
    )
  }
}
export default Form.create()(Date);
