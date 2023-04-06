import React from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleSearch = () => {
    const values = this.props.form.getFieldsValue();
    const { handleSearch } = this.props;
    if (handleSearch && typeof handleSearch === 'function') {
      handleSearch.call(this, values);
    }
  };

  handleReset = () => {
    const { setFieldsValue } = this.props.form;
    const { handleReset } = this.props;
    setFieldsValue({
      cooperationAccess: '',
      cooperationLevel: '',
      orgStatus: '',
    });
    if (handleReset && typeof handleReset === 'function') {
      handleReset.call();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isAlreadyList = [] } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };

    return (
      <Form className="m-form" style={{ marginLeft: '-2rem' }}>
        <Scrollbars autoHide style={{ width: '100%', height: `${window.innerHeight - 170}px` }}>
          <Row className="m-row-form">
            <Col span={24}>
              <FormItem
                label="合作准入"
                {...formItemLayout}
              >
                {getFieldDecorator('cooperationAccess', { initialValue: '' })( // eslint-disable-line
                  <Select className="m-select m-select-white" labelName="" placeholder="请选择合作准入" allowClear showSearch optionFilterProp="children" style={{ width: '100%' }}>
                    {isAlreadyList.map(item => <Option value={item.ibm} key={item.ibm}>{item.note}</Option>)}
                  </Select>)
              }
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label="合作等级"
                {...formItemLayout}
              >
                {getFieldDecorator('cooperationLevel', { initialValue: '' })( // eslint-disable-line
                  <Select className="m-select m-select-white" labelName="" placeholder="请选择合作等级" allowClear showSearch optionFilterProp="children" style={{ width: '100%' }}>
                    {isAlreadyList.map(item => <Option value={item.ibm} key={item.ibm}>{item.note}</Option>)}
                  </Select>)
              }
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label="机构状态"
                {...formItemLayout}
              >
                {getFieldDecorator('orgStatus', { initialValue: '',  rules: [{ required: true, message: '机构状态' }] })( // eslint-disable-line
                  <Select className="m-select m-select-white" labelName="" placeholder="请选择机构状态" allowClear showSearch optionFilterProp="children" style={{ width: '100%' }}>
                    {isAlreadyList.map(item => <Option value={item.ibm} key={item.ibm}>{item.note}</Option>)}
                  </Select>)
              }
              </FormItem>
            </Col>
          </Row>

        </Scrollbars>
        <Row className="m-row-form" style={{ borderTop: '1px solid #e9e9e9', position: 'fixed', bottom: '0', margin: '0', width: '500px' }}>
          <Col span={24} style={{ textAlign: 'right', marginTop: '1rem' }}>
            <FormItem
              wrapperCol={{ span: 24 }}
              className={`m-product-search-item ${styles.mitem}`}
            >
              <Button className="m-btn-radius m-btn-headColor" onClick={this.handleSearch}> 查询 </Button>
              <Button className="m-btn-radius" style={{ marginLeft: '1rem' }} onClick={this.handleReset}> 重置 </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Filter);
