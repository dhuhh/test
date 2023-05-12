import React from 'react';
import { Input, Icon, Col, Select, Row } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
import Content from './Content';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    const { value = [], limit = null } = props;
    const tempValues = Array.isArray(value) ? value : value.split(',');
    const selectedRowKeys = [];
    const selectedTitles = [];
    let limitValue = '';
    tempValues.forEach((element, index) => {
      const temps = element.split('-');
      selectedRowKeys.push(temps[0]);
      selectedTitles.push(temps[1]);
      if (index === 0) {
        limitValue = temps[2] || '';
      }
    });
    limitValue = limitValue || (limit ? limit.options[0].value : '');
    this.state = {
      visible: false,
      selectedRowKeys,
      selectedTitles,
      limitValue,
    };
  }
  handleLimit = (value) => {
    this.state.limitValue = value;
    this.setState({
      limitValue: value,
    });
    this.handleSearch();
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  showModal = () => {
    const { value = [] } = this.props;
    const tempValues = Array.isArray(value) ? value : value.split(',');
    const selectedRowKeys = [];
    const selectedTitles = [];
    let limitValue = '';
    tempValues.forEach((element, index) => {
      const temps = element.split('-');
      selectedRowKeys.push(temps[0]);
      selectedTitles.push(temps[1]);
      if (index === 0) {
        limitValue = temps[2] || '';
      }
    });
    this.setState({
      selectedRowKeys,
      selectedTitles,
      limitValue: limitValue || this.state.limitValue,
      visible: true,
    });
  }
  handleSearch = (value) => {
    if (this.table) {
      this.table.handleSearch(value, this.state.limitValue);
    }
  }
  handleOk = () => {
    const { onChange } = this.props;
    let tempSelectedTitles = [];
    let tempSelectedRowKeys = [];
    if (onChange && this.table) {
      const { selectedRowKeys, selectedTitles } = this.table.getValues();
      tempSelectedTitles = selectedTitles;
      tempSelectedRowKeys = selectedRowKeys;
      const values = [];
      tempSelectedTitles.forEach((element, index) => {
        const title = element;
        const value = tempSelectedRowKeys[index];
        if (value) {
          values.push(`${value}-${title}-${this.state.limitValue}`);
        }
      });
      onChange(values);
    }
    this.setState({
      visible: false,
      selectedTitles: tempSelectedTitles,
      selectedRowKeys: tempSelectedRowKeys,
    });
  }
  render() {
    const { valueKey = '', url = '', columns = [], nameKey = '', type = '', limit = {}, params = {} } = this.props;
    const { options = [], limitKey = '' } = limit;
    const { visible, selectedTitles, selectedRowKeys } = this.state;
    const names = [];
    if (Array.isArray(selectedTitles)) {
      selectedTitles.forEach((item) => {
        names.push(item);
      });
    }
    const modalProps = {
      width: '70rem',
      title: (
        <Row>
          {
            options[0] && (
            <Col span={12}>
              <Select onChange={this.handleLimit} value={this.state.limitValue} defaultValue={options[0] && options[0].value}>
                {
            options.map((element) => {
              const { value, note } = element;
              return <Select.Option key={value} value={value} >{note}</Select.Option>;
            })
          }
              </Select>
            </Col>
          )
          }
          <Col span={12}>
            <Input.Search
              placeholder="请输入关键字"
              style={{ width: '20rem' }}
              onSearch={this.handleSearch}
              enterButton
            />
          </Col>
        </Row>),
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <React.Fragment>
        <BasicModal {...modalProps}>
          <Content limitValue={this.state.limitValue || ''} params={params} limitKey={limitKey} type={type} valueKey={valueKey} nameKey={nameKey} columns={columns} url={url} selectedTitles={selectedTitles} selectedRowKeys={selectedRowKeys} ref={(c) => { this.table = c; }} />
        </BasicModal>
        <Input
          value={names.join(',')}
          readOnly
          className="m-input"
          suffix={<Icon type="search" onClick={this.showModal} className="certain-category-icon" />}
          onClick={this.showModal}
        />
      </React.Fragment>
    );
  }
}

export default Modal;
