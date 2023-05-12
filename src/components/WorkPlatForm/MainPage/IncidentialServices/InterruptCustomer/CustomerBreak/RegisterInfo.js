import React from 'react';
import { Row, Card, Button, Table, message } from 'antd';
import BasicModal from '$common/BasicModal';
import styles from './index.less';
import { FetchIntrptCustRgstInfo, FetchRgstCustLgnInfo } from '../../../../../../services/incidentialServices';

class RegisterInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerInfo: [], // 注册信息
      historicalLogin: [], // 历史登录信息
      loading: false,  // 列表加载状态显示
      pageState: {  // 分页查询条件
        paging: 1,
        current: 1,
        pageSize: 5,
        sort: '',
        total: -1,
      },
      totals: 0,
    };
  }

  componentDidMount() {
    this.getRegisterData(); // 获取注册信息
    this.getHistoricalNotes();
  }

    // 获取注册信息
    getRegisterData = () => {
      const { custNo } = this.props;
      FetchIntrptCustRgstInfo({
        custNo,
        rgstTm: '',
      }).then((ret = {}) => {
        const { records = [], code = 0 } = ret || {};
        if (code > 0) {
          this.setState({
            registerInfo: records,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 获取历史登录信息
    getHistoricalNotes = () => {
      const { custNo } = this.props;
      const { pageState } = this.state;
      FetchRgstCustLgnInfo({
        ...pageState,
        lgnCustID: custNo,
        lgnTp: '',
      }).then((ret = {}) => {
        const { records = [], code = 0, total = 0 } = ret || {};
        if (code > 0) {
          this.setState({
            historicalLogin: records,
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

    loadChangePage = (custNo = '', pageState) => {
      this.setState({ loading: true });
      FetchRgstCustLgnInfo({ lgnCustID: custNo, lgnTp: '', ...pageState }).then((res) => {
        const { records = [], total } = res;
        this.setState({
          historicalLogin: records,
          totals: total,
          loading: false,
        });
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

    render() {
      const { totals, modalVisible = false, registerInfo = [], historicalLogin = [], pageState = {}, loading } = this.state;
      const { current, pageSize } = pageState;
      const modalProps = {
        width: '60rem',
        title: '历史登录信息',
        style: { top: '18rem' },
        visible: modalVisible,
        onCancel: this.closeModal,
        footer: null,

      };
      const columns = [
        {
          title: '注册时间',
          dataIndex: 'rgstTm',
          align: 'center',
          key: 'rgstTm',
          width: '25%',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '最近一次登陆时间',
          dataIndex: 'lastLgnTm',
          align: 'center',
          key: 'lastLgnTm',
          width: '25%',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '近一月登录次数',
          dataIndex: 'moLgnTms',
          align: 'center',
          key: 'moLgnTms',
          width: '25%',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '近一年登录次数',
          dataIndex: 'yrLgnTms',
          key: 'yrLgnTms',
          align: 'center',
          width: '25%',
          className: 'm-black',
          render: (text, record) => Number(text) === 0 ? <div className='m-darkgray'>{text || '0'}</div> : <div className='m-darkgray' style={{ cursor: 'pointer' }} onClick={this.handleModel}>{text}</div>,
        },
      ];
      const tableProps = {
        rowKey: 'rgstTm',
        dataSource: registerInfo,
        columns,
        bordered: true,
        pagination: false,
        className: 'm-Card-Table',
      };
      const columnsMx = [
        {
          title: '登录时间',
          dataIndex: 'lgnTm',
          align: 'center',
          key: 'lgnTm',
          width: '50%',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '登录IP',
          dataIndex: 'lgnIP',
          align: 'center',
          key: 'lgnIP',
          width: '50%',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
      ];
      const tablePropsMx = {
        loading,
        rowKey: 'lgnTm',
        dataSource: historicalLogin,
        columns: columnsMx,
        bordered: true,
        className: 'm-Card-Table',
        pagination: {
          className: 'm-bss-paging',
          showTotal: total => `共 ${totals} 条`,
          showLessItems: true,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          total: totals,
          current: current,
          pageSize: pageSize,
          onChange: this.handlePagerChange,
          onShowSizeChange: this.handlePagerSizeChange,
        },
      };
      return (
        registerInfo.length !== 0 && (
          <Row>
            <Card title={<span className="ax-card-title">注册信息</span>} className="m-card default">
              <div className={styles.mCardTableMg}>
                <Table {...tableProps} />
              </div>
            </Card>
            <BasicModal
              {...modalProps}
              className={styles.mBasicModal}
            >
              <Row style={{ padding: '1.333rem 2rem' }}>
                <Table {...tablePropsMx} />
                <div className='tr pt24'>
                  <Button className='m-btn ant-btn m-btn-blue' style={{ height: '40px', borderRadius: '0px' }} onClick={this.closeModal}>确认</Button>
                </div>
              </Row>
            </BasicModal>
          </Row>
        )
      );
    }

}

export default RegisterInfo;
