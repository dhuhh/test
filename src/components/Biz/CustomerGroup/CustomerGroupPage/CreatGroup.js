import React from 'react';
import { Button, Modal, Input, message, Select, Form, Radio } from 'antd';
import { funcManagingCusGroup } from '../../../../services/customerbase/managingCusGroup';
import { getDictKey } from '../../../../utils/dictUtils';

export default class CreatGroup extends React.Component {
  handleChange = (e) => {
    const { value } = e.target;
    this.title = value;
  }
  hanleTypeChange = (value) => {
    this.type = value;
  }
  handleMSChange = (e) => {
    this.ms = e.target.value;
  }
  changeKHLX = (e) => {
    this.khlx = e.target.value;
  }
  // 新建一个空的客户群
  handleCreatGroup = () => {
    const _this = this;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const { userBasicInfo, khfwDatas, dictionary } = this.props;
    const khlx = dictionary[getDictKey('KH_KHLX')] || [];
    const { orgname = '--' } = userBasicInfo || {};
    const modal = Modal.confirm({
      title: '新建客户群:',
      className: 'm-confirm',
      content:
  <Form layout={formItemLayout}>
    <Form.Item label="客户群类型" {...formItemLayout}>
      <Select defaultValue="1" onChange={_this.hanleTypeChange} style={{ width: '100%' }}>
        <Select.Option value="1">我的客户群</Select.Option>
        { khfwDatas.findIndex((item) => { return item.name.indexOf('营业部') >= 0; }) >= 0 ? <Select.Option value="3">{orgname}</Select.Option> : null }
      </Select>
    </Form.Item>
    <Form.Item label="客户类型" {...formItemLayout} style={{ display: 'none' }}>
      <Radio.Group onChange={this.changeKHLX}>
        {
          khlx.map(item => <Radio value={item.ibm}>{item.note}</Radio>)
        }
      </Radio.Group>
    </Form.Item>
    <Form.Item label="客户群名称" {...formItemLayout}>
      <Input onChange={_this.handleChange} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item label="客户群说明" {...formItemLayout}>
      <Input.TextArea onChange={_this.handleMSChange} style={{ width: '100%' }} maxLength={40} />
      <div className="">
        <div className="ant-form-item-control-wrapper">
          <div className="ant-form-item-control">
            <span className="ant-form-item-children">
              <span className="ant-form-text m-form-text-info">
                <i className="iconfont icon-about1" />
                  不能超过<span style={{ color: 'red' }}>40</span>个字
              </span>
            </span>
          </div>
        </div>
      </div>
    </Form.Item>
  </Form>,
      onOk() {
        const khqmc = _this.title ? _this.title.trim() : '';
        const ms = _this.ms ? _this.ms : '';
        const _khlx = _this.khlx ? _this.khlx : ''; // eslint-disable-line
        if (!khqmc) {
          message.error('客户群名称为必填');
          return new Promise(() => {
            throw new Error('客户群名称为必填');
          });
        } else if (khqmc.length > 15) {
          message.error('客户群名称为15字以内');
          return new Promise(() => {
            throw new Error('客户群名称为15字以内');
          });
        }
        if (!ms) {
          message.error('客户群描述必填');
          return new Promise(() => {
            throw new Error('客户群描述为必填');
          });
        }
        // if (!_khlx) {
        //   message.error('客户类型必选');
        //   return new Promise(() => {
        //     throw new Error('客户类型必选');
        //   });
        // }
        _this.title = '';
        _this.khlx = '';
        _this.ms = '';
        return new Promise((resolve) => {
          funcManagingCusGroup({
            czlx: 1,
            khqlx: _this.type || 1,
            khqmc,
            khqid: '',
            // khlx: _khlx, // 客户类型
            khlx: 1, // 客户类型
            sm: ms, // 客群说明
            cjgz: '', // 创建规则
          }).then((result) => {
            const { code = -1 } = result;
            if (code > 0) {
              message.success('操作成功');
            }
            const { refreshCusGroupData } = _this.props;
            if (refreshCusGroupData) {
              refreshCusGroupData();
            }
            _this.type = 1;
            resolve(true);
          }).catch((error) => {
            modal.update({
              visible: false, // 修改按钮状态
            });
            message.error(!error.success ? error.message : error.note);
          });
        });
      },
      onCancel() {},
    });
  }
  render() {
    return <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.handleCreatGroup}>新建群</Button>;
  }
}
