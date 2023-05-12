import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Input, Form } from 'antd';
import SearchInput from './SearchInput';
import DatePicker from './DatePicker';
import InputNum from './InputNum';
import Modal from './Modal';
import FetchModal from './FetchModal';
import RangeInput from './RangeInput';
import RangeDate from './RangeDate';
import KHRQ from './KHRQ';
import SelectItem from './SelectItem';

class FormItem extends React.Component {
  render() {
    const { type, getFieldDecorator, bkx = [], initialValue, subKey, data = [], required = false, style = {} } = this.props;
    const tempData = data.filter((item) => {
      return !bkx.includes(item.ibm);
    });
    switch (type) {
      case 'Select':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {
              getFieldDecorator(subKey, {
                initialValue,
                rules: [{
                  required, message: '请输入值',
                }],
              })(<SelectItem {...this.props} />) //eslint-disable-line
            }
          </Form.Item>);
      case 'MultiSelect':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {
              getFieldDecorator(subKey, {
                initialValue: Array.isArray(initialValue) ? initialValue : (initialValue && initialValue.split(',')) || [],
                rules: [{
                  required, message: '请输入值',
                }],
              })(<SelectItem {...this.props} />) //eslint-disable-line
            }
          </Form.Item>);
      case 'Date':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue: initialValue ? moment(initialValue) : null,
              rules: [{
                required, message: '请输入值',
              }],
            })(<DatePicker format="YYYYMMDD" placeholder="" />)}
          </Form.Item>);
      case 'Input':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<Input className="m-input" style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      case 'InputNum':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<InputNum className="m-input" style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      case 'RangeInput':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<RangeInput className="m-input" style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      case 'RangeDate':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<RangeDate className="m-input" style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      case 'SearchInput_cp': // 模糊搜索产品代码
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required: true, message: '请输入值',
              }],
            })(<SearchInput lb="2" data={tempData} style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      case 'SearchInput_zq': // 模糊搜索证券代码
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required: true, message: '请输入值',
              }],
            })(<SearchInput lb="1" data={tempData} style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      case 'SearchInput_ry': // 模糊人员
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required: true, message: '请输入值',
              }],
            })(<SearchInput lb="3" data={tempData} style={{ width: '100%', ...style }} />)}
          </Form.Item>);
      case 'MultiModal':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<Modal data={tempData} style={{ width: '100%', ...style }} {...this.props} />)}
          </Form.Item>);
      case 'SingleFetchModal':
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<Modal type="Single" data={tempData} style={{ width: '100%', ...style }} {...this.props} />)}
          </Form.Item>);
      case 'SingleFetchModal_ry': // 营销服务人员组件
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<FetchModal
              limit="ryfl"
              type="Single"
              valueKey="ryid"
              nameKey="ryxm"
              columns={[
                {
                  title: '人员编号',
                  dataIndex: 'rybh',
                  key: 'rybh',
                },
                {
                  title: '人员ID',
                  dataIndex: 'ryid',
                  key: 'ryid',
                },
                {
                  title: '人员姓名',
                  dataIndex: 'ryxm',
                  key: 'ryxm',
                },
              ]}
              url="/api/staffrelationship/v1/queryStaffType"
              style={{ width: '100%', ...style }}
            />)}
          </Form.Item>);
      case 'KHRQ': // 高级筛选-开户日期组件
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey, {
              initialValue,
              rules: [{
                required, message: '请输入值',
              }],
            })(<KHRQ tempData={tempData} />)}
          </Form.Item>);
      default:
        return (
          <Form.Item style={{ marginBottom: '0rem', padding: '0.5rem 0' }}>
            {getFieldDecorator(subKey)(<Input style={{ display: 'none' }} className="m-input" />)}
          </Form.Item>);
    }
  }
}
export default FormItem;
