import React from 'react';
import { Row, Col, Card, Steps, Popover, message } from 'antd';
import { FetchIntrptCustOpenAcInfo, FetchIntrptStepInfo } from '../../../../../../services/incidentialServices';
import styles from './index.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
const { Step } = Steps;

class OpenacInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepValue: 0, // 最终开户步骤
      openAcData: {}, // 开户中断信息
      stepList: [], // 中断步骤列表
    };
  }

  componentDidMount() {
    this.getStepData(); // 查询中断客户开户信息
    this.getStepInfo(); // 查询中断步骤信息
  }

  // 查询中断客户开户信息
  getStepData = () => {
    const { custNo } = this.props;
    FetchIntrptCustOpenAcInfo({
      custNo,
    }).then((ret = {}) => {
      const { records = [], code = 0 } = ret || {};
      if (code > 0 && records.length > 0) {
        this.setState({
          openAcData: records[0],
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询中断步骤信息
  getStepInfo = () => {
    const { custNo } = this.props;
    FetchIntrptStepInfo({
      cusNo: custNo,
    }).then((ret = {}) => {
      const { records = [], code = 0 } = ret || {};
      if (code > 0 && records.length > 0) {
        const searchData = records.filter(item => item.stepStatus !== '-1');
        const stepList = [
          { code: '01', title: '选择营业部', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '02', title: '上传证件', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '03', title: '客户资料确认', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '04', title: '录制上传单向视频', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '05', title: '选择证券市场', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '06', title: '设置密码', subTitle: '(交易、资金、数字证书)', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '07', title: '风险评测', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '08', title: '三方存管', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '09', title: '回访问卷', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '10', title: '提交开户申请', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '11', title: '视频审批', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
          { code: '12', title: '开户处理', subTitle: '', stepTime: '', checkTime: '', zt: '', info: '' },
        ];
        stepList.forEach((item) => {
          const data = searchData.filter(Item => Item.stepCode === item.code);
          if (data.length > 0) {
            item.stepTime = data[0].stepTime;
            item.checkTime = data[0].checkTime;
            item.zt = data[0].stepStatus;
            item.info = data[0].checkReason;
          }
        });
        this.setState({ stepList, stepValue: searchData.length - 1 });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { openAcHisData } = this.props;
    const { openAcData, stepList = [], stepValue } = this.state;
    return (
      (openAcHisData.length !== 0 || JSON.stringify(openAcData) !== '{}') && (
        <Row>
          <Card title={<span className="ax-card-title">开户信息</span>} className="m-card default">
            {openAcHisData.length !== 0 && (
              <div><span className='m-black pl24'>已开通账户：</span>
                <div className={styles.mCardInfoB}>
                  {
                    openAcHisData.map((item, index) => {
                      return (
                        <Row className={styles.mCardInfo} style={{ borderBottom: openAcHisData.length === index + 1 ? 'none' : '' }}>
                          <Row>
                            <Col span={5}>
                              <span className='m-darkgray ml12'>开户日期</span>&nbsp;&nbsp;<span className='m-black fwb500'>{item.openAcDt}</span>
                            </Col>
                            <Col span={5}>
                              <span className='m-darkgray'>客户号</span>&nbsp;&nbsp;<span className='m-black fwb500'>{item.custNo}</span>
                            </Col>
                            <Col span={5}>
                              <span className='m-darkgray'>存管银行</span>&nbsp;&nbsp;<span className='m-black fwb500'>{item.dpstBank}</span>
                            </Col>
                          </Row>
                          <Row className='pt10'>
                            <Col span={5}>
                              <span className='m-darkgray'>开户营业部</span>&nbsp;&nbsp;<span className='m-black fwb500'>{item.openAcOrg}</span>
                            </Col>
                            <Col span={5}>
                              <span className='m-darkgray ml12'>渠道</span>&nbsp;&nbsp;<span className='m-black fwb500'>{item.openAcChnl}</span>
                            </Col>
                            <Col span={5}>
                              <span className='m-darkgray'>开户场景</span>&nbsp;&nbsp;<span className='m-black fwb500'>{item.openAcSc}</span>
                            </Col>
                          </Row>
                        </Row>
                      );
                    })
                  }
                </div></div>
            )}

            {JSON.stringify(openAcData) !== '{}' && (
              <div><span className='m-black pl24'>当前中断信息：</span>
                <div className={styles.mCardInfoB}>
                  <Row className={styles.mCardInfo}>
                    <Row>
                      <Col span={5}>
                        <span className='m-darkgray'>开户日期</span>&nbsp;&nbsp;<span className='m-black fwb500'>{openAcData.openAcDt}</span>
                      </Col>
                      <Col span={5}>
                        <span className='m-darkgray'>存管银行</span>&nbsp;&nbsp;<span className='m-black fwb500'>{openAcData.dpstBank}</span>
                      </Col>
                      <Col span={5}>
                        <span className='m-darkgray'>开户营业部</span>&nbsp;&nbsp;<span className='m-black fwb500'>{openAcData.openAcOrg}</span>
                      </Col>
                    </Row>
                    <Row className='pt10'>
                      <Col span={5}>
                        <span className='m-darkgray ml25'>渠道</span>&nbsp;&nbsp;<span className='m-black fwb500'>{openAcData.openAcChnl}</span>
                      </Col>
                      <Col span={5}>
                        <span className='m-darkgray'>开户场景</span>&nbsp;&nbsp;<span className='m-black fwb500'>{openAcData.openAcSc}</span>
                      </Col>
                    </Row>
                  </Row>
                  <Row className='pd20'>
                    <Row className='dis-fx pb6'>
                      {
                        stepList.map((item, index) => {
                          if (item.zt === '3') {
                            const steptime = item.stepTime === '' ? ['', ''] : item.stepTime.split(' ');
                            const checktime = item.checkTime === '' ? ['', ''] : item.checkTime.split(' ');
                            return (
                              <Col style={{ width: '8.33%' }}>
                                <div style={{ marginLeft: index >= 9 ? '62px' : '67px', color: item.zt === '2' || item.zt === '3' ? '#E81818' : '' }}>
                                  <Popover
                                    placement="top"
                                    content={
                                      <div className='tc lh18'>
                                        <p className='m-darkgray mb3'>审批退回：{item.info}</p>
                                        <p className='m-lightgray mb0'>{checktime[0] === '' ? '' : moment(checktime[0]).format('YYYY-MM-DD')}&nbsp;{checktime[1]}</p>
                                      </div>
                                    }
                                  >
                                    <span>{index + 1}</span>
                                  </Popover>
                                </div>
                              </Col>
                            );
                          } else {
                            return (
                              <Col style={{ width: '8.33%' }}>
                                <div style={{ marginLeft: index >= 9 ? '62px' : '67px', color: item.zt === '2' || item.zt === '3' ? '#E81818' : '' }}>
                                  {index + 1}
                                </div>
                              </Col>
                            );
                          }
                        })
                      }
                    </Row>
                    <Steps current={stepValue} progressDot={true} size='small'>
                      {
                        stepList.map((item) => {
                          let description = '';
                          if (item.zt === '3' || item.zt === '4') {
                            const steptime = item.stepTime === '' ? ['', ''] : item.stepTime.split(' ');
                            const checktime = item.checkTime === '' ? ['', ''] : item.checkTime.split(' ');
                            description = (
                              <Popover
                                placement="bottom"
                                content={
                                  <div className='tc lh18'>
                                    <p className='m-darkgray mb3'>审批退回：{item.info}</p>
                                    <p className='m-lightgray mb0'>{checktime[0] === '' ? '' : moment(checktime[0]).format('YYYY-MM-DD')}&nbsp;{checktime[1]}</p>
                                  </div>
                                }
                              // defaultVisible={true}
                              >
                                <div>
                                  <p style={{ color: '#E81818' }}>{item.title}</p>
                                  <p>{steptime[0] === '' ? '' : moment(steptime[0]).format('YYYY-MM-DD')}</p>
                                  <p>{steptime[1]}</p>
                                </div>
                              </Popover>
                            );
                          } else {
                            const steptime = item.stepTime === '' ? ['', ''] : item.stepTime.split(' ');
                            description = (
                              <div>
                                <p style={{ color: '#61698c' }}>{item.title}</p>
                                <p>{steptime[0] === '' ? '' : moment(steptime[0]).format('YYYY-MM-DD')}</p>
                                <p>{steptime[1]}</p>
                              </div>
                            );
                          }
                          return <Step className={item.zt === '4' ? 'm-bss-steps-item m-bss-steps-item-error' : 'm-bss-steps-item'} style={{ width: '8.33%' }} description={description} status={item.zt === '2' || item.zt === '3' || item.zt === '4' ? 'error' : ''} />;
                        })
                      }
                    </Steps>
                  </Row>
                </div></div>
            )}
          </Card>
        </Row>
      )
    );
  }
}
export default OpenacInfo;
