import React from 'react';
import { Form, Select, Input, message } from 'antd';
import moment from 'moment';
import { FetchSysCommonTable } from '../../../../services/sysCommon';
import BasicModal from '../../../Common/BasicModal';
import { MotPubcases } from '../../../../services/motbase/motType';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class PubCaseModel extends React.Component {
  state = {
    xdfaList: [],
  }
  componentDidMount() {
    this._isMounted = true;
    // 获取下拉菜单options
    FetchSysCommonTable({
      objectName: 'TMOT_CLLX',
    }).then((ret = {}) => {
      const { records = [] } = ret;
      const temp = [];
      records.forEach((item) => {
        temp.push({
          value: item.ID,
          label: item.CLMC,
        });
      });
      if (this._isMounted) {
        this.setState({
          xdfaList: temp,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  filterOption = (inputValue, option) => {
    const { children = '' } = option.props;
    let flag = false;
    if (children.indexOf(inputValue) !== -1) {
      flag = true;
    }
    return flag;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        MotPubcases({
          ...values,
          czlx: 1,
          alid: null,
        }).then((ret = {}) => {
          const { code = 0 } = ret;
          if (code > 0) {
            message.success('操作成功');
            if (this.props.onCancel) {
              this.props.onCancel();
            }
            // 查询我发布的案例数据
            this.props.dispatch({
              type: 'motKnowledgeIndex/fetchMotMyPubCaseList',
              payload: {
                paging: 1,
                current: 1,
                pageSize: 5,
                total: -1,
                sort: '',
                shzt: null,
              },
            });
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      } else {
        const errKey = Object.keys(err);
        if (errKey && errKey.length > 0) {
          message.error(err[errKey[0]].errors[0].message);
        }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { xdfaList } = this.state;
    const createDate = new moment().format('YYYY年MM月DD日'); // eslint-disable-line
    const modalProps = {
      width: '70rem',
      title: '发布案例',
      footer: null,
      ...this.props,
    };
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <BasicModal {...modalProps}>
        <Form className="m-form" onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="行动方案">
            {getFieldDecorator('faid', {
              rules: [{
                required: true,
                message: '请选择行动方案',
              }],
            })( // eslint-disable-line
              <Select filterOption={this.filterOption} showSearch>
                {
                xdfaList.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                }
              </Select>)}
          </FormItem>
          <FormItem {...formItemLayout} label="案例主题">
            {getFieldDecorator('alzt', {
              rules: [{
                required: true,
                message: '请填写案例主题',
              }, {
                max: 50,
                message: '不能超过50个字符',
              }],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="案例内容">
            {getFieldDecorator('alnr', {
              rules: [{
                required: true,
                message: '请填写案例内容',
              }],
            })(<TextArea autosize={{ minRows: 4 }} maxLength={1000} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="创建日期" >
            <span className="ant-form-text">{createDate}</span>
          </FormItem>
          <div style={{ textAlign: 'right', width: '100%' }}>
            <button className="m-btn-radius m-btn-headColor ant-btn" type="submit" style={{ margin: '0 2rem 1.5rem 0' }}>发布</button>
          </div>
        </Form>
      </BasicModal>
    );
  }
}

export default Form.create()(PubCaseModel);
