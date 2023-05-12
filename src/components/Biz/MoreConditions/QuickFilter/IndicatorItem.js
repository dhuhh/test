import React from 'react';
import moment from 'moment';
import { Input, Select, Form, DatePicker } from 'antd';
import Modal from '../AdvanceFilter/Common/Indicator/FormItem/Modal';

class IndicatorItem extends React.Component {
  handleChange=(value) => {
    const { form, subKey, handleHotChange } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({
      [subKey]: value,
    });
    handleHotChange();
  }
  render() {
    const { datas = {}, keyName, subKey, style = {}, dictionary, getFieldDecorator, objectDictionary } = this.props;
    const { type, zdDatas = [], bkx = [], zddm = '', required = false } = datas;
    let data = [];
    if (zddm !== '') {
      data = dictionary[zddm] || [];
      if (data.length === 0) {
        data = objectDictionary[zddm] || [];
      }
    } else {
      data = zdDatas;
    }
    const tempData = data.filter((item) => {
      return !bkx.includes(item.ibm);
    });
    switch (type) {
      case 'Select':
        return (
          <Form.Item required={required} label={keyName}>
            {
            getFieldDecorator(subKey, {
        initialValue: (tempData.length > 0 ? tempData[0].ibm : ''),
        rules: [{
          required, message: '请输入值',
        }],
      })(<Select getPopupContainer={() => document.getElementById('moreConditions_indexCard')} onChange={this.handleChange} style={{ width: '100%', ...style }}>
        { tempData.length > 0 ? tempData.map((item) => {
        const { ibm, note } = item;
        return <Select.Option key={ibm} value={ibm}>{note}</Select.Option>;
      }) : <Select.Option key={-1} value="">暂无数据</Select.Option> }
    </Select>) //eslint-disable-line
    }
          </Form.Item>);
      case 'MultiSelect':
        return (
          <Form.Item required={required} label={keyName}>
            {
            getFieldDecorator(subKey, {
        initialValue: (tempData.length > 0 ? tempData[0].ibm : []),
        rules: [{
          required, message: '请输入值',
        }],
      })(<Select getPopupContainer={() => document.getElementById('moreConditions_indexCard')} onChange={this.handleChange} mode="multiple" style={{ width: '100%', ...style }}>
        { tempData.length > 0 ? tempData.map((item) => {
        const { ibm, note } = item;
        return <Select.Option key={ibm} value={ibm}>{note}</Select.Option>;
    }) : <Select.Option key={-1} value="">暂无数据</Select.Option> }
    </Select>) //eslint-disable-line
    }
          </Form.Item>);
      case 'Date':
        return (
          <Form.Item required={required} label={keyName}>
            {getFieldDecorator(subKey, {
            initialValue: moment(new Date()),
            rules: [{
              required, message: '请输入值',
            }],
          })(<DatePicker onChange={this.handleChange} format="YYYYMMDD" placeholder=" " />)}
          </Form.Item>);
      case 'Input':
        return (
          <Form.Item required={required} label={keyName} >
            {getFieldDecorator(subKey, {
            initialValue: moment(new Date()),
            rules: [{
              required, message: '请输入值',
            }],
          })(<Input onChange={this.handleChange} className="m-input" />)}
          </Form.Item>);
      case 'MultiModal':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
            initialValue: (tempData.length > 0 ? tempData[0].ibm : ''),
        rules: [{
          required, message: '请输入值',
        }],
      })(<Modal onChange={this.handleChange} data={tempData} style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      default:
        return null;
    }
  }
}
export default IndicatorItem;
