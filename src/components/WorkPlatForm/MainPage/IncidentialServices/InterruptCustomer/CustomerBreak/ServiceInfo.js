import React from 'react';
import { Table, message, Button, Popover, Icon, Modal as AntdModal ,Row,Card } from 'antd';
import { connect } from 'dva';
import { FetchIntrptCustSrvcInfo, FetchIntrptCustBasicInfo, VirtualMakeCall, CallResultCallbackLocal } from '../../../../../../services/incidentialServices';
import styles from './index.less';
import Execute from '../../Common/Execute';
import Modal from './Modal';
import BasicModal from '$common/BasicModal';
import tishi from '$assets/incidentialServices/tishi.png';
import tishi_black from '$assets/incidentialServices/tishi_black.png';
import tishi_origin from '$assets/incidentialServices/tishi_origin.png';

class ServiceInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servInfoData: [], // 服务信息 
      loading: false, // 列表加载状态显示
      pageState: { // 分页查询条件
        paging: 1,
        current: 1,
        pageSize: 100,
        sort: '',
        total: -1,
      },
      totals: 0,
      modalVisible: false,
      phone: '',
      staffPhone: '',
      tipVisible: false,
      callVisible: false,
    };
  }

  componentDidMount() {
    this.getData();
    this.getStaffPhone();
  }

  // 获取员工手机号
  getStaffPhone = () => {
    const { custNo } = this.props;
    FetchIntrptCustBasicInfo({
      intId: custNo,
    }).then((ret = {}) => {
      const { records = [], code = 0 } = ret || {};
      if (code > 0 && records.length > 0) {
        this.setState({
          staffPhone: records[0].excPhn,
          phone: records[0].custPhn,
          tipVisible: true,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

    // 获取服务信息列表
    getData = () => {
      const { custNo } = this.props;
      const { pageState } = this.state;
      FetchIntrptCustSrvcInfo({
        ...pageState,
        custNo,
        srvcTm: '',
        srvcStf: '',
      }).then((ret = {}) => {
        const { records = [], code = 0, total = 0 } = ret || {};
        if (code > 0) {
          this.setState({
            servInfoData: records,
            totals: total,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    loadChangePage = (custNo = '', pageState) => {
      this.setState({ loading: true });
      FetchIntrptCustSrvcInfo({
        ...pageState,
        custNo,
        srvcTm: '',
        srvcStf: '',
      }).then((ret = {}) => {
        const { records = [], code = 0, total = 0 } = ret || {};
        if (code > 0) {
          this.setState({
            servInfoData: records,
            totals: total,
            loading: false,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 分页改变
    handlePagerChange = (current, pageSize) => {
      const { custNo } = this.props;
      const { pageState } = this.state;
      const newPageState = {
        ...pageState, 
        current,
        pageSize,
      };
      this.setState({
        pageState: newPageState,
      });
      this.loadChangePage(custNo, newPageState);
    }

    // 每页显示条数改变
    handlePagerSizeChange = (current, pageSize) => {
      this.handlePagerChange(1, pageSize);
    }

    limitLength = (target) => {
      let targetLength;
      if (target.length >= 15) {
        targetLength = `${target.substr(0, 15)}...`;
        return targetLength;
      }
      return target;
    }

    handleModel = (id) => {
      const form1 = document.createElement('form');
      form1.id = 'form1';
      form1.name = 'form1';
      // 添加到 body 中
      document.getElementById('m_iframe').appendChild(form1);
      // 创建一个输入
      const input = document.createElement('input');
      // 设置相应参数
      input.type = 'text';
      input.name = 'id';
      input.value = encodeURIComponent(id);

      // 将该输入框插入到 form 中
      form1.appendChild(input);

      // form 的提交方式
      form1.method = 'GET';
      // form 提交路径
      form1.action = `/api/axaccompany/v1/getRecordVio`;

      // 对该 form 执行提交
      form1.submit();
      // 删除该 form
      document.getElementById('m_iframe').removeChild(form1);
    }

    refresh = () => {
      this.loadChangePage(this.props.custNo, this.state.pageState);
    }

    showTip = () => {
      this.setState({ tipVisible: true });
    }

    handleCancel = () => {
      this.setState({ callVisible: false });
    }

    // 外呼
    handleOk = () => {
      const { custNo } = this.props;
      const params = {
        agentPhone: `${this.state.staffPhone}`,
        calledNo: `${this.state.phone}`,
        custNo,
      };
      VirtualMakeCall(params).then((res) => {
        const { uniqueId = '', note = '呼叫成功' } = res;
        message.success(note);
        CallResultCallbackLocal({
          custNo,
          uniqueId,
          whlx: '2',
        }).catch(err => message.error(err.note || err.message));
      }).catch(err => message.error(err.note || err.message)).finally(() => this.setState({ callVisible: false }));
    }

    render() {
      const { servInfoData = [], loading = false } = this.state;
      const { authorities, sysParam = [] } = this.props;
      const serverName = sysParam.filter(item => item?.csmc === 'system.c4ym.url')[0]?.csz;
      const { valueSearch } = authorities;
      // const livebosPrefix = localStorage.getItem('livebos');
      const columns = [
        {
          title: '服务时间',
          dataIndex: 'actvTm',
          align: 'center',
          key: 'actvTm',
          width: '20%',
        },
        {
          title: '服务人员',
          dataIndex: 'stfNm',
          align: 'center',
          key: 'stfNm',
          width: '20%',
        },
        {
          title: '服务方式',
          dataIndex: 'srvcMode',
          align: 'center',
          key: 'srvcMode',
          width: '20%',
        },
        {
          title: '服务内容',
          dataIndex: 'srvcCntnt',
          align: 'center',
          key: 'srvcCntnt',
          width: '20%',
        },
        {
          title: '附件',
          dataIndex: 'attNm',
          key: 'attNm',
          align: 'center',
          width: '20%',
          render: (text, record) => {
            let fj = '';
            if (record.isAudio === '0') {
              fj = <a href={`${serverName}${record.attUrl}`} download target="blank"><span style={{ color: '#54a9df' }}>{this.limitLength(text)}</span></a>;
            } else if (record.isAudio === '1') {
              fj = <a onClick={() => this.handleModel(record.id)} >录音</a>;
            }
            return fj;
          },
        },
      ];
      const tableProps = {
        loading,
        rowKey: 'rgstTm',
        dataSource: servInfoData,
        columns,
        bordered: true,
        className: 'm-Card-Table pt16',
        pagination: false,
      };
      const { dictionary = {}, custNo } = this.props;
      return (
        <React.Fragment>
          {servInfoData.length > 0 && (
            <Row>
              <Card title={<span className="ax-card-title">服务信息</span>} className="m-card default">
                <div className={`${styles.mCardTableMg} tr`}>
                  {/* {
                  valueSearch && valueSearch.includes('isCall') && (
                    <Popover visible={this.state.tipVisible} placement='topRight' content={<div style={{ padding: '12px 8px', fontSize: 16, color: '#1A2243', width: 422 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={tishi} alt='' />
                          <div style={{ paddingLeft: 10, fontWeight: 'bold' }}>财富管家提醒您</div>
                        </div>
                        <div className={styles.closeHover} onClick={() => this.setState({ tipVisible: false })}><Icon type="close" style={{ color: 'rgba(5, 14, 28, 0.4)' }} /></div>
                      </div>
                      <div style={{ lineHeight: '26px', marginTop: 6, paddingLeft: 32 }}>将接通您的手机号码{this.state.staffPhone || '--'}，客户来电显示为95517</div>
                    </div>} getPopupContainer={triggerNode => triggerNode.parentElement}>
                      <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c fs14 ml14' style={{ border: 'none' }} onMouseEnter={this.showTip} onClick={() => this.setState({ callVisible: true, tipVisible: false })}>呼叫客户</Button>
                    </Popover>
                  )}
                <Modal modalVisible={this.state.modalVisible} hideModal={() => { this.setState({ modalVisible: false }); }} />
                { valueSearch && valueSearch.includes('excute') && <Execute data={{ note: '' }} selectedCount={1} selectAll={false} selectedRowKeys={[custNo]} dictionary={dictionary} refresh={this.refresh} /> }
                <div><img src={tishi_black} alt='' /><span style={{ fontSize: 12, color: '#959CBA', marginLeft: 4 }}>工单状态说明：使用“呼叫客户”功能与客户联系，并填写服务记录为“已联系”，工单状态才更新为“已执行”</span></div> */}
                  <Table {...tableProps} />
                  <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
                  <BasicModal
                    width='500px'
                    visible={this.state.callVisible}
                    onCancel={this.handleCancel}
                    title={<div><img src={tishi_origin} alt='' /><span style={{ marginLeft: 10, fontSize: 16, color: '#1A2243', fontWeight: 'bold' }}>操作提示</span></div>}
                    footer={<div>
                      <Button className="m-btn-radius m-btn-white" style={{ width: 60, height: 30 }} onClick={this.handleCancel}>取消</Button>
                      <Button type="primary" className="m-btn-radius m-btn-headColor" style={{ width: 60, height: 30 }} onClick={this.handleOk}>确定</Button>
                    </div>}
                  >
                    <div style={{ padding: '24px 48px', color: '#61698C' }}>
                将接通您的手机号码{this.state.staffPhone || '--'}，同步接通该客户（客户来电显示为95517），请确认是否呼叫？
                    </div>
                  </BasicModal>
                </div>
              </Card>
            </Row>
          )}
        </React.Fragment>
      );
    }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
  sysParam: global.sysParam,
}))(ServiceInfo);
