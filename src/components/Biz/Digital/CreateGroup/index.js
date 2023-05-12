/**
 * ----------属性------------
 *  type(number): 建群方式: 1 标签圈人/交并差组合 2模版导入 3种群扩散
 *  payload(object): 外部人群筛选条件model
 * ----------方法------------
 *  refresh()： 刷新客群||用户群列表
 */

import React, { Component } from 'react';
import moment from 'moment';
import { Button, Form, message, Row, Col, Input, Select, Radio, DatePicker, InputNumber, Modal } from 'antd';
import BasicModal from '$common/BasicModal';
import ShareInput from './share';
import { FetchLableCirclePeopleCreateGroups } from '$services/customersenior';

class CreatGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      qlb: '', // 群类别（动态、静态），用于控制是否显示计算周期和有效期限
      qjb: '', // 群级别（私有群、定向分享群、部门公开群）， 用于控制是否显示定向群选择控件
    };
  }

  showModal = () => {
    const { type = 1, payload = {} } = this.props;
    if (type === 3) {
      const { populationSpreadModel = {} } = payload;
      const { cacheKey = '' } = populationSpreadModel;
      if (!cacheKey) {
        message.info('请先进行种群扩散!');
        return false;
      }
    }
    this.setState({
      visible: true,
    });
  }

  jugdeCusNum = () => {
    const cusGroupNum = localStorage.getItem('cusGroupNum') || 100000;
    const { userNum = 0 } = this.props;
    if (Number(userNum) > Number(cusGroupNum)) {
      Modal.confirm({
        title: '提示：',
        content: '当前人群数量较大,新建人群时间可能较长,是否确认新建人群?',
        cancelText: '确定',
        okText: '取消',
        okButtonProps: { type: 'default' },
        cancelButtonProps: { type: 'primary' },
        onCancel: () => {
          this.fetchCreatGroup();
        },
      });
    } else {
      this.fetchCreatGroup();
    }
  }

  // 确定按钮调用创建群接口
  fetchCreatGroup = () => {
    const { cjgz = '', userNum = 0 } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const cusGroupNum = localStorage.getItem('cusGroupNum') || 100000;
        if (Number(userNum) > Number(cusGroupNum)) {
          message.info('当前操作需要时间较长，请您耐心等待~');
        }
        this.setState({ loading: true });
        const { qmc = '', qms = '', qjb = '', qlb = '', jszqUnit = '', jszqNumber = '', yxqx = '', gxdx = {} } = values;
        // 参数处理
        const jszq = jszqNumber.toString() + jszqUnit;
        const userGroupOperModel = {
          cjgz,
          // sfhxxs: '',
          // sfgx: '',
          czlx: 1, // 操作类型 创建时不传 2修改; 3删除
          gxdx: gxdx.keys || '', // 共享对象
          yxqx: yxqx ? yxqx.format('YYYYMMDD') : '', // 有效期限
          yhqfl: this.props.qlx || '', // 用户群分类 1-用户群 2-客户群
          yhqjb: qjb, // 用户群级别
          yhqlb: qlb, // 用户群类别
          yhqmc: qmc, // 用户群名称
          yhqms: qms, // 用户群描述
          jszq, // 计算周期
          gxlx: 1, // 共享类型
        };

        FetchLableCirclePeopleCreateGroups({
          ...this.props.payload,
          userGroupOperModel,
        }).then((response) => {
          const { code = 0, note = '' } = response;
          if (code === 1) {
            message.success(note);
            // 操作成功刷新列表关闭弹窗
            const { refresh } = this.props;
            if (refresh || typeof (refresh) === 'function') {
              refresh();
            }
            this.setState({ visible: false, loading: false });
          } else if (code > 1) {
            message.info(note);
            this.setState({ loading: false });
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
          this.setState({ loading: false });
        });
      }
    });
  }

  handleCancel = () => {
    const { loading = false } = this.state;
    if (loading) {
      message.warn('正在建群中,强制关闭窗口可能导致数据异常,请您耐心等待建群完成~');
      return false;
    }
    this.setState({ visible: false });
  }


  renderFooter() {
    const { loading = false  } = this.state; // eslint-disable-line
    return (
      <div>
        <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={this.jugdeCusNum} loading={loading}>确 定</Button>
      </div>
    );
  }

  render() {
    const { form: { getFieldDecorator }, render } = this.props;
    const modalProps = {
      title: '新建人群',
      visible: this.state.visible,
      width: '80rem',
      footer: this.renderFooter(),
      onCancel: this.handleCancel,
      // onOk: () => { this.jugdeCusNum(); },
    };

    const labelFromater = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
    };

    return (
      <span>
        {
          render ? <div onClick={this.showModal}>{render}</div> : <Button className="fcbtn m-btn-border m-btn-border-headColor ant-btn btn-1c" onClick={this.showModal}>新建人群</Button>
        }
        <BasicModal {...modalProps}>
          <div style={{ padding: '2rem' }}>
            <Form>
              <Row>
                <Form.Item label="人群名称" {...labelFromater}>
                  {getFieldDecorator('qmc', {
                    rules: [{ required: true, message: '请输入人群名称!' }, { max: 20, message: '人群名称最长20字' }],
                  })(<Input maxLength={15} placeholder={'人群名称最长15字'} />)}
                </Form.Item>
              </Row>

              <Row>
                <Form.Item label="人群描述" {...labelFromater}>
                  {getFieldDecorator('qms', {
                    rules: [{ required: true, message: '请输入人群描述!' }, { max: 100, message: '人群描述最长100字' }],
                  })(<Input.TextArea maxLength={100} placeholder={'人群描述最长100字'} />)}
                </Form.Item>
              </Row>

              <Row>
                <Form.Item label="人群级别" {...labelFromater}>
                  <Col>
                    {getFieldDecorator('qjb', {
                      rules: [{ required: true, message: '请选择人群级别!' }],
                    })(
                      <Radio.Group className="m-radio-group-mcolor" onChange={(e) => { this.setState({ qjb: e.target.value }); }}>
                        <Radio.Button value="1" key="1">我的私有群</Radio.Button>
                        <Radio.Button value="2" key="2">定向分享群</Radio.Button>
                        <Radio.Button value="3" key="3">部门公开群</Radio.Button>
                      </Radio.Group>
                    )}
                  </Col>
                </Form.Item>
              </Row>

              { /** 共享客群组件传递出两个值，一个gxlx(共享类型通过onchange回调传递出来, 1-人员,2-营业部, 东莞无营业部共享, 所以没有回调)，一个具体选择项，具体选择项通过form取值 */
                this.state.qjb === '2' && (
                  <Row className="m-row-form">
                    <Col xs={24} sm={24} md={24} lg={24} style={{ paddingLeft: '0' }}>
                      <Form.Item label="共享人员" {...labelFromater}>
                        {getFieldDecorator('gxdx', {
                          rules: [{ required: true, message: '请选择共人群' }],
                        })(<ShareInput onChangeGXLX={(value) => {}} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                )
              }

              <Row>
                <Form.Item label="人群类型" {...labelFromater}>
                  {getFieldDecorator('qlb', {
                    rules: [{ required: true, message: '请选择人群级别!' }],
                  })(
                    <Radio.Group className="m-radio-group-mcolor" onChange={(e) => { this.setState({ qlb: e.target.value }); }}>
                      <Radio.Button value="1" key="1">静态群</Radio.Button>
                      <Radio.Button value="2" key="2">动态群</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Row>

              {this.state.qlb === '2' && (
                <React.Fragment>

                  <Row>
                    <Col span={5} style={{ marginLeft: '9.5rem' }}>
                      <Form.Item label="计算周期" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                        {getFieldDecorator('jszqNumber', {
                          rules: [{ required: true, message: '请填写计算周期!' }],
                        })(
                          <InputNumber min={0} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        {getFieldDecorator('jszqUnit', {
                          rules: [{ required: true, message: '请选择计算周期!' }],
                        })(
                          <Select>
                            <Select.Option value="days" key="days">天</Select.Option>
                            <Select.Option value="weeks" key="weeks">周</Select.Option>
                            <Select.Option value="months" key="months">月</Select.Option>
                            <Select.Option value="quarters" key="quarters">季</Select.Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={10} offset={1}><span style={{ color: '#dadada', lineHeight: '3rem' }}>创建成功后触发第一次计算,以后每日凌晨定时计算</span></Col>
                  </Row>

                  <Row>
                    <Col span={10} style={{ marginLeft: '3rem' }}>
                      <Form.Item label="有效期限" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                        {getFieldDecorator('yxqx', {
                          rules: [{ required: true, message: '请选择有效期限!' }],
                          initialValue: moment().add(6, 'months'),
                        })(<DatePicker disabledDate={(current) => { return current.valueOf() < moment().subtract(1, 'days').valueOf(); }} />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}><span style={{ color: '#dadada', lineHeight: '3rem' }}>到期后动态群停止计算，可在到期前调整有效期限</span></Col>
                  </Row>

                </React.Fragment>
              )}
            </Form>
          </div>
        </BasicModal>
      </span>
    );
  }
}

export default Form.create()(CreatGroup);
