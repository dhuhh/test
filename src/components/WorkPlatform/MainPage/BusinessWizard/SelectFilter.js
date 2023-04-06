import React from 'react';
import { Row, Col, Form, Button, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class SelectFilter extends React.Component {
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
      prodName: undefined, // 产品代码/名称
    });
    if (handleReset && typeof handleReset === 'function') {
      handleReset.call();
    }
  };

  // enter 事件
  KeyUpHandle = (e) => {
    const values = this.props.form.getFieldsValue();
    const { KeyUpHandle } = this.props;
    KeyUpHandle(e, values);
  };

  handleSearchValue = (data) => {
    const { handleSearchValue } = this.props;
    if (handleSearchValue && typeof handleSearchValue === 'function') {
      handleSearchValue.call(this, data);
    }
  }

  handleChangeValue = (data) => {
    const prodCode = data ? data.split('_')[0] : data;
    const { handleChangeValue } = this.props;
    if (handleChangeValue && typeof handleChangeValue === 'function') {
      handleChangeValue.call(this, prodCode);
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { prodSelectList } = this.props;

    return (
      <div className=" clearfix">
        <div className="m-yxhd-form-box">
          <Form className="m-form-default ant-advanced-search-form" >
            <Row>
              <Col xs={24} sm={24} md={12} xl={8}>
                <FormItem className="m-form-item" label="产品代码/名称">
                  {getFieldDecorator('prodName', {
                    initialValue: undefined,
                  })(// eslint-disable-line
                    <Select
                      showSearch
                      allowClear
                      placeholder="产品代码/名称"
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={value => this.handleSearchValue(value)}
                      onChange={value => this.handleChangeValue(value)}
                      notFoundContent={null}
                    >
                      {
                        prodSelectList ?
                        prodSelectList.map((item) => {
                            return <Option value={`${item.cpdm}_${item.id}`} key={item.id}>{`${item.cpmc}(${item.cpdm})`}</Option>;
                          }) :
                          null
                      }
                    </Select>)}
                </FormItem>
              </Col>
              <Col xs={24} sm={24} md={12} xl={7} >
                <div className="m-form-padding">
                  <Button className="m-btn-radius m-btn-red" type="primary" onClick={this.handleSearch}>查询</Button>
                  <Button className="m-btn-radius m-btn-gray" onClick={this.handleReset}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(SelectFilter);
