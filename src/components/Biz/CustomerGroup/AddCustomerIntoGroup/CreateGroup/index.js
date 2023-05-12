import React from 'react';
import { Form, Input, Row, Col, Radio, InputNumber, DatePicker, Select } from 'antd';
import lodash from 'lodash';
import ShareInput from './share';
import moment from 'moment';
// import Select from '../../../../../../../../../../Common/Form/Select';
// import styles from '../AddCustomerIntoGroup/index.less';

const RadioGroup = Radio.Group;
const { Item: FormItem } = Form;
const { TextArea } = Input;

class CreateGroup extends React.Component {
  state = {
    group: '',
    inputTagPickerValue: { // 外面input框里的标签
      keys: [],
      titles: [],
    },
  }

  handleMemeber = (keys = '', titles = '') => {
    this.setState({
      inputTagPickerValue: {
        keys: keys !== '' ? keys.split(',') : [],
        titles: titles !== '' ? titles.split(',') : [],
      },
    });
  }

  groupTypeChange = (e) => {
    const { getGroupType } = this.props;
    if (getGroupType && typeof getGroupType === 'function') {
      getGroupType(e.target.value);
    }
    this.setState({
      group: e.target.value,
    });
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { customerQueryType = '' } = this.props;
    const groupType = [{ ibm: 1, note: '静态群' }, { ibm: 2, note: '动态群' }];
    // const revlolutionDatas = [{ value: 'days', label: '天' }, { value: 'weeks', label: '周' }, { value: 'months', label: '月' }, { value: 'quarters', label: '季' }];
    const { group = lodash.get(groupType, '[0].ibm', ''), inputTagPickerValue } = this.state; // eslint-disable-line

    return (
      <React.Fragment>
        <Form className="m-form" onSubmit={this.handleSubmit}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <FormItem help=" " labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="客群名称">
                {getFieldDecorator('khqmc', { initialValue: '',
                  rules: [{ required: true, message: '请输入客群名称' }],
                })(<Input
                  size="large"
                  placeholder="最多输入15个字"
                  maxLength={15}
                />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <FormItem help=" " labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label="客群描述">
                {getFieldDecorator('sm', {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入客群描述' }],
                })(<TextArea placeholder="最多输入100个字" autosize={{ minRows: 5 }} maxLength={100} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col xs={8} sm={8} md={8} lg={8}>
              <FormItem help=" " labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="客群类型">
                {
                  getFieldDecorator('khqlb', { initialValue: lodash.get(groupType, '[0].ibm', 1),
                    rules: [{ required: true, message: '请选择客群类型' }],
                  })(<RadioGroup className="m-radio-group-mcolor" onChange={e => this.groupTypeChange(e)}>
                    {
                      groupType.map(item => <Radio.Button value={item.ibm} key={item.ibm}>{item.note}</Radio.Button>)
                    }
                  </RadioGroup>) // eslint-disable-line
                }
              </FormItem>
            </Col>
          </Row>

          {
            group === 2 && (
              <React.Fragment>
                <Row>
                  <Col xs={8} sm={8} md={8} lg={6}>
                    <Form.Item label="计算周期" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                      {getFieldDecorator('date', {
                        rules: [{ required: true, message: `请填写计算周期!` }],
                      })(
                        <InputNumber min={0} />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Form.Item >
                      {getFieldDecorator('datezq', {
                        rules: [{ required: true, message: `请选择计算周期!` }],
                      })(
                        <Select style={{ marginLeft: '0.5rem' }} >
                          <Select.Option value={'days'} key={'days'} >天</Select.Option>
                          <Select.Option value={'weeks'} key={'weeks'} >周</Select.Option>
                          <Select.Option value={'months'} key={'months'} >月</Select.Option>
                          <Select.Option value={'quarters'} key={'quarters'} >季</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={16}><span style={{ color: '#dadada', marginLeft: '2rem', lineHeight: '3rem' }}>创建成功后触发第一次计算,以后每日凌晨定时计算</span></Col>
                </Row>

                <Row>
                  <Col xs={8} sm={8} md={8} lg={8}>
                    <Form.Item label="有效期限" labelCol={{ span: 9 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator('yxqx', {
                        initialValue: moment().add(6, 'months'),
                        rules: [{ required: true, message: '请选择有效期限!' }],
                      })(<DatePicker disabledDate={(current) => { return current.valueOf() <  moment().subtract(1, 'days').valueOf(); } } />)}
                    </Form.Item>
                  </Col>
                  <Col span={16} ><span style={{ color: '#dadada', marginLeft: '2rem', lineHeight: '3.5rem' }}>到期后动态群停止计算，可在到期前调整有效期限</span></Col>
                </Row>
              </React.Fragment>
            )
          }

          {
            customerQueryType === '3' && group === 2 && (
              <Row >
                <Col xs={24} sm={24} md={24} lg={24} style={{ paddingLeft: '0' }}>
                  <Form.Item label='共享人员' labelCol={{ span: 3 }} wrapperCol={{ span: 15 }}  >
                    {getFieldDecorator('gxdx', {
                    })( <ShareInput /> )}
                  </Form.Item>
                </Col>
              </Row>
            )
          }

          <Row>
            <Col xs={8} sm={8} md={8} lg={8}>
              <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 25 }} label="画像显示">
                {
                  getFieldDecorator('sfhxxs', {
                    initialValue: '1',
                    rules: [{ required: true, message: '请选择有效期限!' }],
                  })( // eslint-disable-line
                    <Radio.Group className="m-radio-group-mcolor">
                      <Radio.Button value="1" key={'1'}>是</Radio.Button>
                      <Radio.Button value="2" key={'2'}>否</Radio.Button>
                    </Radio.Group>
                  ) // eslint-disable-line
                }
              </FormItem>
            </Col>
            <Col span={16} ><span style={{ color: '#dadada', marginLeft: '2rem', lineHeight: '3.5rem' }}>设置客群是否展示在客户画像中</span></Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
export default Form.create()(CreateGroup);
