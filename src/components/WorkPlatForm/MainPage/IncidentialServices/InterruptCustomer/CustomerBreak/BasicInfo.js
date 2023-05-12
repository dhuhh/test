/* eslint-disable no-extend-native */
import React from 'react';
import { Row, Col, Card, Input, Button, Table, message } from 'antd';
import lodash from 'lodash';
// import photoNo from '../../../../../../assets/incidentialServices/默认头像.svg';
// import photo from '../../../../../../assets/incidentialServices/默认头像-女.svg';
// import photoMale from '../../../../../../assets/incidentialServices/默认头像-男.svg';
import photoNo from '../../../../../../assets/incidentialServices/defaultAvatar.svg';
import photo from '../../../../../../assets/incidentialServices/defaultAvatar-woman.svg';
import photoMale from '../../../../../../assets/incidentialServices/defaultAvatar-man.svg';
import BasicModal from '$common/BasicModal';
import { RightOutlined, PlusCircleFilled } from '@ant-design/icons';
import { FetchIntrptCustBasicInfo, FetchIntrptCustRmkHis, FetchIntrptCustOpenAcInfoHis, OperateRemarkIntrptCust, FetchQryExecutionStrategy } from '../../../../../../services/incidentialServices';
import styles from './index.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ExecutiveStrategy from './ExecutiveStrategy';
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
const { TextArea } = Input;
class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: {}, // 客户信息
      modalVisible: false, // 历史备注显示状态
      historicalNotes: [], // 历史备注信息
      loading: false, // 列表加载状态显示
      pageState: { // 分页查询条件
        paging: 1,
        current: 1,
        pageSize: 5,
        sort: '',
        total: -1,
      },
      totals: 0,
      modalAddVisible: false, // 添加备注
      remark: '',
      disabled: true,
      zxRemark: '',
      isShow: false,
    };
  }

  componentDidMount() {
    this.getCustomerData(); // 获取客户信息
    this.getHistoricalNotes(); // 获取历史备注信息
    FetchQryExecutionStrategy({
      intrptStep: '',
      keyWord: '',
      intrptTp: '',
    }).then((res) => {
      const { records = [] } = res;
      if (lodash.get(records, '[0].stgyId', '0') !== '0') {
        this.setState({ isShow: true });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取客户信息
  getCustomerData = () => {
    // const customerInfo = {
    //   name: '李云龙',
    //   phone: '18800022222',
    //   phnLoc: '广东-深圳',
    //   age: '30',
    //   sex: '男',
    //   crdtNo: '442234322343243243',
    //   address: '广东省深圳市南山区长城大厦',
    //   vigourVal: '200',
    //   photo: '',
    //   remark: '参与开门红活动联系客户，客户正在换身份证，下月再联系客户'
    // };
    // this.setState({ customerInfo });
    const { custNo } = this.props;
    FetchIntrptCustBasicInfo({
      intId: custNo,
    }).then((ret = {}) => {
      const { records = [], code = 0 } = ret || {};
      if (code > 0 && records.length > 0) {
        this.setState({
          customerInfo: records[0],
          zxRemark: records[0].remark,
        });
        this.getOpenAcInfoHisData(records[0].custPhn);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 查询中断客户历史开户信息
  getOpenAcInfoHisData = (phone) => {
    const { custNo } = this.props;
    FetchIntrptCustOpenAcInfoHis({
      custNo,
    }).then((ret = {}) => {
      const { records = [], code = 0 } = ret || {};
      if (code > 0) {
        const { setData } = this.props;
        if (setData) {
          setData('openAcHisData', records);
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取历史备注信息
  getHistoricalNotes = () => {
    const { custNo } = this.props;
    // const { pageState } = this.state;
    FetchIntrptCustRmkHis({
      // ...pageState,
      // paging: 0,
      custNo,
    }).then((ret = {}) => {
      const { records = [], code = 0, total = 0 } = ret || {};
      if (code > 0) {
        this.setState({
          historicalNotes: [
            ...records,
          ],
          totals: total,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleModel = () => {
    this.setState({
      modalVisible: true,
    });
  }

  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  // loadChangePage = (custNo = '', pageState) => {
  //   this.setState({ loading: true });
  //   FetchIntrptCustRmkHis({
  //     ...pageState,
  //     custNo,
  //   }).then((ret = {}) => {
  //     const { records = [], code = 0, total = 0 } = ret || {};
  //     if (code > 0) {
  //       this.setState({
  //         historicalNotes: records,
  //         totals: total,
  //         loading: false,
  //       })
  //     }
  //   }).catch((error) => {
  //     message.error(!error.success ? error.message : error.note);
  //   });
  // }

  // // 分页改变
  // handlePagerChange = (current, pageSize) => {
  //   const { custNo } = this.props;
  //   const { pageState } = this.state;
  //   const newPageState = {
  //     ...pageState,
  //     current,
  //     pageSize,
  //   };
  //   this.setState({
  //     pageState: newPageState,
  //   });
  //   this.loadChangePage(custNo, newPageState);
  // }

  // 每页显示条数改变
  // handlePagerSizeChange = (current, pageSize) => {
  //   this.handlePagerChange(1, pageSize);
  // }

  handleAddModel = () => {
    this.setState({
      modalAddVisible: true,
    });
  }

  closeAddModal = () => {
    this.setState({
      modalAddVisible: false,
      remark: '',
      disabled: true,
    });
  }

  handleInputChange = (e) => {
    this.setState({ remark: e.target.value });
  }

  onOk = () => {

    const { remark } = this.state;
    const { custNo } = this.props;
    if (remark === '') {
      message.error('请输入备注信息！');
      return;
    } else {
      this.setState({ disabled: false });
      OperateRemarkIntrptCust({
        uuid: custNo,
        cntnt: remark,
      }).then((ret = {}) => {
        const { code = 0, note = '' } = ret || {};
        if (code > 0) {
          message.success(note);
          this.getHistoricalNotes();
          this.setState({
            modalAddVisible: false,
            zxRemark: remark,
            disabled: true,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  render() {

    const { /*totals,*/ modalVisible = false, customerInfo = {}, historicalNotes = [], /*pageState = {},*/ loading, modalAddVisible = false, zxRemark = '', disabled } = this.state;
    // const { current, pageSize } = pageState;
    const { custNo = '' } = this.props;
    const modalProps = {
      width: '1200px',
      title: '历史备注',
      // isAllWindow: 1, // isAllWindow 是否支持最大化 1:支持|0:不支持
      style: { top: '115px' },
      visible: modalVisible,
      onCancel: this.closeModal,
      footer: null,
    };
    const modalAddProps = {
      width: '620px',
      title: '添加备注',
      style: { top: '18rem' },
      visible: modalAddVisible,
      onCancel: this.closeAddModal,
      footer: null,
    };
    // 头像
    const showPic = customerInfo.sex === '男' ? photoMale : customerInfo.sex === '女' ? photo : photoNo ;
    const columns = [
      {
        title: '操作人员',
        dataIndex: 'oprUser',
        align: 'center',
        key: 'oprUser',
        // width: '373px',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{text}</div>,
      },
      {
        title: '时间',
        dataIndex: 'rmkTm',
        align: 'center',
        key: 'rmkTm',
        // width: '373px',
        className: 'm-black',
        render: text => <div className='m-darkgray'>{moment(text).format('YYYY-MM-DD')}</div>,
      },
      {
        title: '备注',
        dataIndex: 'rmkCntnt',
        align: 'center',
        key: 'rmkCntnt',
        // width: '65%',
        className: 'm-black',
        render: text => <div className='m-darkgray' style={{ maxWidth: '372px', cursor: 'pointer', whiteSpace: 'normal', wordBreak: 'break-all' }} title={text}>{text}</div>,
      },
    ];
    const tableProps = {
      loading,
      rowKey: 'rmkTm',
      dataSource: historicalNotes,
      columns,
      bordered: true,
      className: 'm-Card-Table',
      scroll: { y: historicalNotes.length > 8 ? 480 : '' },
      pagination: false,
      // pagination: totals <= 0 ? false : {
      //   className: 'm-bss-paging',
      //   showTotal: total => `共 ${totals} 条`,
      //   showLessItems: true,
      //   showSizeChanger: true,
      //   showQuickJumper: false,
      //   pageSizeOptions: ['5', '10', '20', '50'],
      //   total: totals,
      //   current: current,
      //   pageSize: pageSize,
      //   onChange: this.handlePagerChange,
      //   onShowSizeChange: this.handlePagerSizeChange,
      // }
    };
    return (
      <Row>
        <Card bordered={false} className="m-card default" style={{ paddingBottom: '1rem' }}>
          <div className={`${styles.mCardCInfo} dis-fx`}>
            <div className='tc'>
              <div className={styles.mBreakImg}>
                <img id="userInfoAvatorImg" src={showPic} alt="" />
                <p className='m-black fwb500 fs18 pt10'>{customerInfo.custNm}</p>
                <p className='m-darkgray pt4'>年龄：{customerInfo.age}</p>
              </div>
            </div>
            <div className={`${styles.mCardInfoCenter} width45 pl30 pr30`}>
              <Row>
                <Col className='m-info-item' span={5}>
                  <Col span={8} className='m-darkgray m-info-item-lable1'>性别</Col><Col span={16} className='m-black fwb500'>{customerInfo.sex}</Col>
                </Col>
                <Col className='m-info-item' span={8}>
                  {/* <Col span={8} className='m-darkgray m-info-item-lable2'>手机号码</Col><Col span={16} className='m-black fwb500'>{`${customerInfo.phone}`.replace(/(\d{3})\d*(\d{4})/, '$1****$2')}</Col> */}
                  <Col span={8} className='m-darkgray m-info-item-lable2'>手机号码</Col><Col span={16} className='m-black fwb500'>{`${customerInfo.custPhn}`}</Col>
                </Col>
                <Col className='m-info-item' span={11}>
                  <Col span={8} className='m-darkgray m-info-item-lable2'>证件编号</Col><Col span={16} className='m-black fwb500'>{customerInfo.idcard}</Col>
                </Col>
              </Row>
              <Row className='pt10'>
                <Col className='m-info-item' span={5}>
                  <Col span={8} className='m-darkgray m-info-item-lable1'>活力值</Col><Col span={16} className='m-oragen fwb500'>{customerInfo.vigourVal}</Col>
                </Col>
                <Col className='m-info-item' span={8}>
                  <Col span={8} className='m-darkgray m-info-item-lable2'>手机归属地</Col><Col span={16} className='m-black fwb500'>{customerInfo.phnLoc}</Col>
                </Col>
                <Col className='m-info-item' span={11}>
                  <Col span={8} className='m-darkgray m-info-item-lable2'>地址</Col><Col span={16} className='m-black fwb500'>{customerInfo.addr}</Col>
                </Col>
              </Row>
            </div>
            <div className='width40 pt36'>
              <Row>
                <Col className='m-info-item' span={16}>
                  <Col span={8} className='m-darkgray m-info-item-lable2'>最新备注</Col>
                  <Col span={16} className='m-black fwb500'>
                    <span style={{ 'wordBreak': 'break-all' }}>{zxRemark}</span>&nbsp;
                    <span style={{ color: '#244FFF', cursor: 'pointer' }} onClick={this.handleAddModel}>添加备注<PlusCircleFilled className='pl4 pt4' /></span>
                  </Col>
                </Col>
                {historicalNotes.length > 0 ? (
                  <Col className='m-info-item' span={8}>
                    <Col className='m-black fs14'><span style={{ cursor: 'pointer' }} onClick={this.handleModel} >查看历史备注</span><span><RightOutlined className='fs12' /></span></Col>
                  </Col>
                ) : ''}
              </Row>
            </div>
            {
              this.state.isShow && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ExecutiveStrategy custNo={custNo} />
                </div>
              )}
          </div>
        </Card>
        <BasicModal
          {...modalProps}
          className={styles.mBasicModal}
        >
          <div style={{ overflowY: 'auto', overflowX: 'hidden', marginBottom: '20px' }}>
            <Row className='pt30'>
              <Col className='m-info-item' span={8}>
                <Col span={8} className='m-darkgray m-info-item-lable3'>客户姓名</Col><Col span={16} className='m-black fwb500'>{customerInfo.custNm}</Col>
              </Col>
              <Col className='m-info-item' span={8}>
                <Col span={8} className='m-darkgray m-info-item-lable3'>手机号</Col><Col span={16} className='m-black fwb500'>{customerInfo.custPhn}</Col>
              </Col>
            </Row>
            <Row style={{ padding: '16px 24px' }}>
              <Table {...tableProps} />
              <div style={{ textAlign: 'right', paddingTop: '20px' }}>
                <Button className='m-btn ant-btn m-btn-blue' style={{ height: '40px', borderRadius: '0px' }} onClick={this.closeModal}>确定</Button>
              </div>
            </Row>
          </div>
        </BasicModal>
        <BasicModal
          {...modalAddProps}
          className={styles.mBasicModal}
        >
          <Row className='pt16 pb20'>
            <Row className='m-info-item'>
              <Col span={8} className='m-darkgray m-info-item-lable2'>
                备注信息
              </Col>
              <Col span={16} className='m-darkgray m-info-item-control-wrapper'>
                <TextArea style={{ width: '320px' }}
                  placeholder="请录入备注信息，长度不超过100"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  onChange={this.handleInputChange}
                  maxLength={100}
                  // value={remark}
                />
              </Col>
            </Row>
            <div style={{ textAlign: 'right', paddingTop: '30px' }}>
              <Button className='m-btn ant-btn mr20' style={{ borderRadius: '0px' }} type="button" onClick={this.closeAddModal}>取消</Button>
              <Button className='m-btn ant-btn m-btn-blue mr24' style={{ borderRadius: '0px' }} onClick={() => {disabled ? this.onOk() : '';}}>确定</Button>
            </div>
          </Row>
        </BasicModal>
      </Row>
    );

  }

}

export default BasicInfo;
