import React from 'react';
import { Button, Modal, Form, Row, Col, Select, Input, Card, DatePicker, message } from 'antd';
import { OperateAxFullinServerRecord, OperateAxMessageSend, FetchStaffMessageQuotal, OperateAssignIntrptCust } from '../../../../../../services/incidentialServices';
import BasicModal from '../../../../../Common/BasicModal';
import UploadFiles from '../UploadFiles';
import TipModal from '../TipModal';
import { getDictKey } from '../../../../../../utils/dictUtils';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;

class Execute extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messageQuota: {},
      visible: false,
      fwfs: '1',
      fwjg: '1',
      fileMd5: '',
      visibleTip: false,
      content: '',
      loading: false,
    };
  }

  componentDidMount() {
    
  }

    fecthData = () => {
      FetchStaffMessageQuotal().then((ret = {}) => {
        const { records = [], code = 0 } = ret || {};
        if (code > 0) {
          this.setState({
            messageQuota: records[0],
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    showModal = () => {
      const { data: { note = '' }, selectedCount, selectAll, selectedRowKeys } = this.props;
      if (selectedCount <= 0) {
        Modal.info({ content: '请至少选择一个客户!' });
        return false;
      } else if (selectedCount === 1 && selectAll) {
        Modal.info({ content: '单客户操作请勿全选!' });
        return false;
      } else {
        const Params = {
          uuid: selectedRowKeys.join(','), // 所选客户对应的uid
          asgnTp: 4, // 1.分配；2.转办；3.撤回
          asgnMode: '', // 1.按员工；2.按部门；
          wthrAll: selectAll ? 1 : 0, // 0.非全选；1.全选
          qrySqlId: note,
          objNo: '', // 执行人；执行部门
          asgnNum: '', // 客户数
        };
        OperateAssignIntrptCust({ ...Params, asgnParm: '0' }).then((result) => {
          const { code: cxCode = 0 } = result;
          if (cxCode > 0) {
            this.setState({
              visible: true,
            }, this.fecthData());
          }
        }).catch((error) => {
          this.setState({
            visibleTip: true,
            content: !error.success ? error.message : error.note,
          });
        });
      }
    }

    handleCancel = () => {
      // 取消按钮的操作
      this.setState({
        visibleTip: false,
        visible: false,
        fwfs: '1',
        fwjg: '1',
        fileMd5: '',
        messageQuota: {},
        content: '',
        loading: false,
      });
    }

    onChangeFwfs = (value) => {
      this.setState({ fwfs: value });
    }

    onChangeFwjg = (value) => {
      this.setState({ fwjg: value });
    }

    disabledDate = (current) => {
      return current < moment().add(-1, 'day');
    }

    // 上传附件
    handleUpdatachange = (params) => { // 处理附件变化
      this.setState({
        fileMd5: params.fileMd5,
      });
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({ loading: true });
          const { fwfs, fileMd5 } = this.state;
          const { data: { note = '' }, selectAll, selectedRowKeys } = this.props;
          const xcfwsj = values.xcfwsj === '' ? '' : moment(values.xcfwsj).format('YYYYMMDD');
          if (fwfs !== '2') { // 填写服务记录
            const payload = {
              md5: fileMd5 !== '' ? fileMd5[0] : '',
              selectAll: selectAll ? '1' : '0', // 0.非全选；1.全选
              selectCode: selectedRowKeys.join(','), // 所选客户对应的uid
              uuid: note,
              severMode: fwfs, // 服务方式
              severResult: values.fwjg, // 服务结果
              severCntnt: values.fwnr, // 服务内容
              nextSeverTime: xcfwsj, //下次服务时间
            };
            this.handServerRecord(payload);
          } else { //  发送短信
            const payload = {
              cntnt: values.dxnr, // 短信内容
              selectAll: selectAll ? '1' : '0', // 0.非全选；1.全选
              selectCode: selectedRowKeys.join(','), // 所选客户对应的uid
              uuid: note,
            };
            this.handMessageSend(payload);
          }
        }
      });
    }

    handServerRecord = (payload) => {
      OperateAxFullinServerRecord(payload).then((result) => {
        const { code = 0 } = result;
        if (code > 0) {
          // message.success('填写服务记录成功');
          const { refresh } = this.props;
          // if (refresh) {
          //   refresh();
          // }
          // this.handleCancel();
          Modal.success({
            content: '填写服务记录成功！',
            onOk: () => {this.handleCancel(); if (refresh) { refresh(1, 10); } },
          });
        }
      }).catch((error) => {
        this.setState({
          visibleTip: true,
          content: !error.success ? error.message : error.note,
        });
      });
    }

    handMessageSend = (payload) => {
      OperateAxMessageSend(payload).then((result) => {
        const { code = 0, note = '' } = result;
        if (code > 0) {
          // message.success(note);
          // this.handleCancel();
          Modal.success({
            content: note,
            onOk: () => this.handleCancel(),
          });
        }
      }).catch((error) => {
        this.setState({
          visibleTip: true,
          content: !error.success ? error.message : error.note,
        });
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const { visible, fwfs, fwjg, messageQuota, visibleTip, content, loading } = this.state;
      const { dictionary = {} } = this.props;
      const { [getDictKey('qzkhfwfs')]: fwfsList = [], [getDictKey('qzkhfwjg')]: fwjgList = [] } = dictionary;
      return (
        <span>
          <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c fs14 ml14' style={{ border: 'none' }} onClick={this.showModal}>执行</Button>
          <TipModal visible={visibleTip} content={content} onCancel={this.handleCancel} />
          <BasicModal
            className='m-bss-nofooter-modal'
            width="650px"
            title='处理'
            destroyOnClose
            // closable={false}
            visible={visible}
            // onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Form onSubmit={(e) => !loading ? this.handleSubmit(e) : ''} className="m-form-default ant-advanced-search-form" style={{ paddingTop: '2rem' }}>
              <Row>
                <Col span={16}>
                  <Form.Item className="m-form-item m-bss-modal-form-item " label="服务方式" wrapperCol={{ span: 12 }}>
                    {
                      getFieldDecorator('fwfs', { initialValue: fwfs })(<Select
                        placeholder='请选择服务方式'
                        allowClear={true}
                        onSelect={this.onChangeFwfs}
                      >
                        {fwfsList.map(item => <Option key={item.note} value={item.ibm}>{item.note}</Option>)}
                      </Select>)
                    }
                  </Form.Item>
                </Col>
              </Row>
              {fwfs !== '2' && (
                <Row>
                  <Col span={16}>
                    <Form.Item className="m-form-item m-bss-modal-form-item " label="服务内容" wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('fwnr', { initialValue: '' })(<TextArea style={{ width: '100%' }}
                          // placeholder="可输入自定义备注信息"
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />)
                      }
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {fwfs !== '2' && (
                <Row>
                  <Col span={16}>
                    <Form.Item className="m-form-item m-bss-modal-form-item " label="服务结果" wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('fwjg', { initialValue: fwjg })(<Select
                          // placeholder='请选择服务方式'
                          allowClear={true}
                          onSelect={this.onChangeFwjg}
                        >
                          {fwjgList.map(item => <Option key={item.note} value={item.ibm}>{item.note}</Option>)}
                        </Select>)
                      }
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {fwfs !== '2' && fwjg !== '1' && (
                <Row>
                  <Col span={16}>
                    <Form.Item className="m-form-item m-bss-modal-form-item " label="下次服务时间" wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('xcfwsj', { initialValue: '' })(<DatePicker disabledDate={this.disabledDate} />)
                      }
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {fwfs !== '2' && (
                <Row>
                  <Col span={20}>
                    <Form.Item className="m-form-item m-bss-modal-form-item " label="附件" wrapperCol={{ span: 12 }}>
                      <div>
                        <UploadFiles onChange={this.handleUpdatachange} />
                        <Card className="m-card default fs12 m-darkgray" style={{ width: '340px', position: 'absolute', top: 0, left: '160px', lineHeight: '21px' }}>
                          {'单个附件带下限制50M，为便于移动签批，请上传word、excel、ppt、pdf、txt等常用格式文件，尽可能不上压缩包'}
                        </Card>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {fwfs === '2' && (
                <Row>
                  <Col span={16}>
                    <Form.Item className="m-form-item m-bss-modal-form-item " label="短信内容" wrapperCol={{ span: 12 }}>
                      {
                        getFieldDecorator('dxnr', { initialValue: '' })(<TextArea style={{ width: '100%' }}
                          // placeholder="可输入自定义备注信息"
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />)

                      }
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {fwfs === '2' && (
                <Row>
                  <Form.Item className="m-form-item m-bss-modal-form-item">
                    <Card className="m-card default fs14 m-lightgray" style={{ paddingLeft: '8.5rem' }}>
                      <p>{'提示'}</p>
                      <p>{`本月发送短信限制${messageQuota.bype}条， 还可发送${messageQuota.bycxsype}条`}</p>
                      <p>{`每次最多${messageQuota.mcsl}条， 最大允许字数：150字`}</p>
                      <p>{'如使用模板，模板中的$V{KHXM}会自动替换为客户姓名'}</p>
                    </Card>
                  </Form.Item>
                </Row>
              )}
              <Row className='tr pd16'>
                {fwfs !== '2' && <Button className='m-btn ant-btn mr20' style={{ height: '40px', borderRadius: '0px' }} onClick={this.handleCancel}>取消</Button>}
                <Button className='m-btn ant-btn m-btn-blue' style={{ height: '40px', borderRadius: '0px' }} htmlType="submit">{fwfs !== '2' ? '保存' : '发送'}</Button>
              </Row>
            </Form>
          </BasicModal>
        </span>
      );
    }
}

export default Form.create()(Execute);
