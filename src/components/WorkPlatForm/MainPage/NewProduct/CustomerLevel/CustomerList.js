import React, { Component } from 'react';
import { Divider, Checkbox, message, Pagination, Modal, Table, Tag } from 'antd';
import moment from 'moment';
import { history, Link } from 'umi';
import Scrollbars from 'react-custom-scrollbars';
import questionMark from '$assets/newProduct/customerPortrait/question-mark.png';
import BasicDataTable from '$common/BasicDataTable';
import { clickSensors, viewSensors } from './util';
import FilterDropdown from './FilterDropdown';
import SearchDropdown from './SearchDropdown';
import { QueryLockBenefit, QueryBenefitUserList, QueryCustMessage, QueryBenefitName, QueryCustBenefit } from '$services/newProduct';
import styles from './index.less';

export default class CustomerList extends Component {
  state = {
    dataSource: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    modalDataSource: [],
    modalCurrent: 1,
    modalPageSize: 10,
    modalTotal: 0,
    modalLoding: false,
    btnValue: true,
    showTips: false,
    visible: false,
    modalType: 0,
    custCode: undefined,
    userName: undefined,
    potential: undefined,
    potentialRange: undefined,
    receiveBenefit: undefined,
    noReceiveBenefit: undefined,
    custNmData: [],
    custCodeData: [],
    equityData: [],
    receiveData: [],
    noReceiveData: [],
  }
  filterRef = React.createRef()
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  componentDidMount() {
    viewSensors('客户列表（客户权益）')
    this.fetchData();
    this.getOptionData();
    let that = this;
    document.onclick = function (param) {
      if (!param.target) {
        return;
      }
      if (!['blueBubble', 'iconTips'].includes(param.target.className)) {
        that.setState({
          showTips: false,
        });
      }
    };
  }
  getOptionData = () => {
    // QueryCustMessage({
    //   mark: '1',
    //   levelId: this.props.location?.query.state || 0,
    // }).then(res => {
    //   this.setState({
    //     custNmData: res.records,
    //   });
    // }).catch(err => message.error(err.note || err.message));
    // QueryCustMessage({
    //   mark: '0',
    //   levelId: this.props.location?.query.state || 0,
    // }).then(res => {
    //   this.setState({
    //     custCodeData: res.records,
    //   });
    // }).catch(err => message.error(err.note || err.message));
    QueryBenefitName({
      levelId: this.props.location?.query.state || 0,
      mainPush: this.state.btnValue ? 1 : 0,
    }).then(res => {
      this.setState({
        equityData: res.records,
      });
    }).catch(err => message.error(err.note || err.message));
  }
  fetchData = () => {
    this.setState({
      loading: true,
    });
    const { custCode, userName, potential, potentialRange, receiveBenefit, noReceiveBenefit, pageSize, current } = this.state;
    QueryBenefitUserList({
      levelId: this.props.location?.query.state || 0,
      mainPush: this.state.btnValue ? 1 : 0,
      pageNum: current,
      pageSize: pageSize,
      potential: potential === '2' ? undefined : potential,
      custCode,
      userName,
      potentialRange,
      receiveBenefit,
      noReceiveBenefit,
    }).then(res => {
      this.setState({
        dataSource: res.records.levelUserList,
        total: res.records.total,
        loading: false,
      });
    }).catch(err => message.error(err.note || err.message));
  }
  handleFilterDropdownVisibleChange = (visible, type) => {
    if (visible) {
      if (type === 1) {
        clickSensors('客户列表（客户权益）', '是否高潜力客户')
      } else if (type === 2) {
        clickSensors('客户列表（客户权益）', '资产潜力区间')
      } else if (type === 3) {
        clickSensors('客户列表（客户权益）', '已解锁已领取权益')
      } else if (type === 4) {
        clickSensors('客户列表（客户权益）', '已解锁未领取权益')
      }
    }
  }
  setCurrent = () => {
    this.setState({
      current: 1,
    });
  }
  setPotential = (value) => {
    this.setState({
      potential: value,
    });
  }
  setCustNm = (value) => {
    this.setState({
      userName: value,
    });
  }
  setCustCode = (value) => {
    this.setState({
      custCode: value,
    });
  }
  setReceiveBenefit = (value) => {
    this.setState({
      receiveBenefit: value,
    });
  }
  setNoReceiveBenefit = (value) => {
    this.setState({
      noReceiveBenefit: value,
    });
  }
  setPotentialRange = (value) => {
    const map = {
      '20万以下': '20万以下',
      '20-30万': '20万以上',
      '30-50万': '30万以上',
      '50-100万': '50万以上',
      '100-200万': '100万以上',
      '200-600万': '200万以上',
      '600万以上': '600万以上',
    };
    this.setState({
      potentialRange: value?.map(item => map[item]),
    });
  }
  showModal = (modalType, value) => {
    this.setState({
      visible: true,
      modalType,
    });
    if (modalType === 0) {
      this.setState({
        modalLoding: true,
      });
      clickSensors('客户列表（客户权益）', '该等级客户未解锁权益')
      const { modalCurrent, modalPageSize } = this.state;
      QueryLockBenefit({
        levelId: this.props.location?.query.state || 0,
        mainPush: this.state.btnValue ? 1 : 0,
      }).then(res => {
        let data = res.records;
        let levelData = data.map(item =>
          item.beneditDetail.map(item1 => {
            return { level: item.levelId, ...item1 };
          })
        ).flat().sort((a, b) => b.level - a.level).map((item, index) => {
          return { key: index, ...item };
        });
        this.setState({
          modalLoding: false,
          modalDataSource: levelData,
          modalTotal: levelData.length,
        });
      }).catch(err => message.error(err.note || err.message));
    } else if (modalType === 1) {
      this.setState({
        modalDataSource: value,
      });
    } else if (modalType === 2) {
      this.setState({
        receiveData: value?.split('|'),
      });
    } else if (modalType === 3) {
      QueryCustBenefit({
        custCode: value,//value
        mainPush: this.state.btnValue ? 1 : 0,
      }).then(res => {
        let noReceiveData = res.records?.filter(item => item.mark === '1').map(item =>
          item.beneditDetail.map((item1) => {
            return { levelId: item.levelId, ...item1 };
          })
        ).flat()?.map((item, index) => { return { key: index, ...item }; });
        this.setState({
          noReceiveData,
        });
      }).catch(err => message.error(err.note || err.message));
    }
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  modalTitle = () => {
    const { modalType } = this.state;
    // eslint-disable-next-line default-case
    switch (modalType) {
      case 0: return `V${this.props.location?.query.state || 0}等级客户未解锁权益`;
      case 1: return '价值特征详细';
      case 2: return '已解锁已领取权益';
      case 3: return '已解锁未领取权益';
    }
  }
  modalContent = () => {
    const { modalType, modalLoding, modalDataSource, receiveData, noReceiveData } = this.state;
    // eslint-disable-next-line default-case
    switch (modalType) {
      case 0: return (
        <Scrollbars autoHide style={{ width: '100%', height: 400 }}>
          <Table style={{ margin: '16px 24px' }} bordered columns={this.getModalCol()} pagination={false} dataSource={modalDataSource} loading={modalLoding} rowKey='key' />
        </Scrollbars>
      );
      case 1: return (
        <Scrollbars autoHide style={{ width: '100%', height: 357 }}>
          <Table style={{ margin: '16px 24px' }} bordered columns={this.getModalCol()} pagination={false} dataSource={modalDataSource} rowKey='key' />
        </Scrollbars>
      );
      case 2: return (
        <Scrollbars autoHide style={{ width: '100%', height: 200 }}>
          <div style={{ padding: '16px 24px' }}>
            {
              receiveData.map((item, index) => <Tag key={index}>{item}</Tag>
              )
            }
          </div>
        </Scrollbars>
      );
      case 3: return (
        <Scrollbars autoHide style={{ width: '100%', height: 365 }}>
          <Table style={{ margin: '16px 24px' }} bordered columns={this.getModalCol()} pagination={false} dataSource={noReceiveData} rowKey='key' />
        </Scrollbars>
      );
    }
  }
  getModalCol = () => {
    const { modalType, modalDataSource } = this.state;
    const conditionMap = {
      0: '注册',
      1: '开户',
      2: '当月日均资产≥1000元或近12个月贡献≥60元',
      3: '当月日均资产≥5万元或近12个月贡献≥300元',
      4: '当月日均资产≥15万元或近12个月贡献≥1200元',
      5: '当月日均资产≥30万元或近12个月贡献≥4000元',
      6: '当月日均资产≥100万元或近12个月贡献≥1万元',
      7: '当月日均资产≥500万元或近12个月贡献≥3万元',
    };
    // eslint-disable-next-line default-case
    switch (modalType) {
      case 0: return [
        {
          title: '权益名称',
          key: '权益名称',
          dataIndex: 'name',
        },
        {
          title: '价值',
          key: '价值',
          dataIndex: 'price',
        },
        {
          title: '等级',
          key: '等级',
          width: 65,
          dataIndex: 'level',
          render: (value, row, index) => {
            const obj = {
              children: 'V' + value,
              props: {},
            };
            let keys = [];
            modalDataSource.forEach((item, index1) => {
              if (item.level === value) {
                keys.push(index1);
              }
            });
            if (index === keys[0]) {
              obj.props.rowSpan = keys.length;
              keys.shift();
            }
            if (keys.includes(index)) {
              obj.props.rowSpan = 0;
            }
            return obj;
          },
        },
        {
          title: '达标条件',
          key: '达标条件',
          dataIndex: 'condition',
          width: 190,
          render: (value, row, index) => {
            const obj = {
              children: conditionMap[row.level],
              props: {},
            };
            let keys = [];
            modalDataSource.forEach((item, index1) => {
              if (item.level === row.level) {
                keys.push(index1);
              }
            });
            if (index === keys[0]) {
              obj.props.rowSpan = keys.length;
              keys.shift();
            }
            if (keys.includes(index)) {
              obj.props.rowSpan = 0;
            }
            return obj;
          },
        },
      ];
      case 1: return [
        {
          title: '特征名称',
          key: '特征名称',
          width: 140,
          dataIndex: 'name',
        },
        {
          title: '详细说明',
          key: '详细说明',
          ellipsis: true,
          dataIndex: 'detail',
        },
      ];
      case 2: return '';
      case 3: return [
        {
          title: '权益名称',
          key: '权益名称',
          dataIndex: 'name',
        },
        {
          title: '价值',
          key: '价值',
          ellipsis: true,
          dataIndex: 'price',
        },
      ];
    }
  }
  getColumns = () => {
    const valueFeatureMap = {
      locationValue: '区位价值',
      otherApp: '其他券商活跃',
      spendPower: '消费能力',
      financeValue: '金融营销能力',
      personalAttribute: '个人财富属性',
    };
    const { custCode, userName, potential, potentialRange, receiveBenefit, noReceiveBenefit } = this.state;
    let columns = [
      {
        title: '客户号',
        key: '客户号',
        dataIndex: 'custCode',
        filterDropdown: ({ confirm }) => (
          <SearchDropdown
            ref={this.filterRef}
            confirm={confirm}
            fetchData={this.fetchData}
            setCurrent={this.setCurrent}
            setCustCode={this.setCustCode}

          />
        ),
        onFilterDropdownVisibleChange: this.handleFilterDropdownVisibleChange,
        filtered: custCode?.length,
        render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${text}`} target='_blank'><div className={styles.custStyle}>{text}</div></Link>,
      },
      {
        title: '客户名称',
        key: '客户名称',
        dataIndex: 'userName',
        filterDropdown: ({ confirm }) => (
          <SearchDropdown
            ref={this.filterRef}
            confirm={confirm}
            fetchData={this.fetchData}
            setCurrent={this.setCurrent}
            setCustNm={this.setCustNm}

          />
        ),
        onFilterDropdownVisibleChange: this.handleFilterDropdownVisibleChange,
        filtered: userName?.length,
        render: (text, record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.custCode}`} target='_blank'><div className={styles.custStyle}>{text}</div></Link>,
      },
      {
        title: (
          <span>
            <span style={{ paddingRight: 5 }}>是否高潜力客户</span>
            <span style={{ position: 'relative' }}>
              <img onClick={() => { this.setState({ showTips: !this.state.showTips }); }} style={{ width: 14, marginTop: -1 }} className='iconTips' src={questionMark} alt='' />
              {this.state.showTips && (
                <span className={`${styles.blueBubble} blueBubble`} onClick={(e) => e.stopPropagation()}>
                  <span style={{ color: '#1A2243', fontWeight: 'bold' }}>潜力及价值特征：</span>
                  <span> 我们利用海量自有数据&设备数据<br />搭建机器学习算法模型，为场景化的营销机会提供补<br />充。未覆盖客户仅代表客户未被模型识别，不具任何<br />资产潜力意义。</span>
                </span>
              )}
            </span>

          </span>
        ),
        key: '是否高潜力客户',
        dataIndex: 'potential',
        width: 200,
        filterDropdown: ({ confirm }) => (
          <FilterDropdown
            ref={this.filterRef}
            confirm={confirm}
            symbolDataSource={['是', '否']}
            fetchData={this.fetchData}
            setCurrent={this.setCurrent}
            setPotential={this.setPotential}
            noInput={true}
          />
        ),
        onFilterDropdownVisibleChange: (visible) => this.handleFilterDropdownVisibleChange(visible, 1),
        filtered: potential?.length,
        render: (text) => text ? '是' : '',
      },
      {
        title: '资产潜力区间',
        key: '资产潜力区间',
        dataIndex: 'potentialRange',
        filterDropdown: ({ confirm }) => (
          <FilterDropdown
            ref={this.filterRef}
            confirm={confirm}
            symbolDataSource={['20万以下', '20-30万', '30-50万', '50-100万', '100-200万', '200-600万', '600万以上']}
            fetchData={this.fetchData}
            setCurrent={this.setCurrent}
            setPotentialRange={this.setPotentialRange}
          />
        ),
        onFilterDropdownVisibleChange: (visible) => this.handleFilterDropdownVisibleChange(visible, 2),
        filtered: potentialRange?.length,
        render: (text) => {
          const map = {
            '20万以下': '20万以下',
            '20万以上': '20-30万',
            '30万以上': '30-50万',
            '50万以上': '50-100万',
            '100万以上': '100-200万',
            '200万以上': '200-600万',
            '600万以上': '600万以上',
          };
          return map[text];
        },
      },
      {
        title: '价值特征',
        key: '价值特征',
        dataIndex: 'valueFeature',
        render: (text) => {
          let keys = Object.keys(text || {}).map(item => valueFeatureMap[item]);
          let values = Object.values(text || {}).map((item, index) => { return { key: index, name: keys[index], detail: item }; });
          return <div className={styles.hover} onClick={() => this.showModal(1, values)} >{keys.join('、')}</div >;
        },
      },
      {
        title: '已解锁已领取权益',
        key: '已解锁已领取权益',
        dataIndex: 'receiveBenefit',
        filterDropdown: ({ confirm }) => (
          <FilterDropdown
            ref={this.filterRef}
            confirm={confirm}
            symbolDataSource={this.state.equityData}
            fetchData={this.fetchData}
            setCurrent={this.setCurrent}
            setCustNm={this.setReceiveBenefit}

          />
        ),
        onFilterDropdownVisibleChange: (visible) => this.handleFilterDropdownVisibleChange(visible, 3),
        filtered: receiveBenefit?.length,
        render: (text, record) => {
          let arr = text?.split('|');
          return (
            <div style={{ color: '#244FFF', cursor: 'pointer', wordBreak: 'break-all', whiteSpace: 'normal' }} onClick={() => this.showModal(2, text)}>{
              arr?.map((item, index) => {
                if (index < 2) {
                  if (index === 1) {
                    return <div key={index}>{item}{arr.length > 2 ? `等${arr.length}项` : ''}</div>;
                  }
                  return <div key={index}>{item}</div>;
                }
              })
            }</div>
          );
        },
      },
      {
        title: '已解锁未领取权益',
        key: '已解锁未领取权益',
        dataIndex: 'noReceiveBenefit',
        filterDropdown: ({ confirm }) => (
          <FilterDropdown
            ref={this.filterRef}
            confirm={confirm}
            symbolDataSource={this.state.equityData}
            fetchData={this.fetchData}
            setCurrent={this.setCurrent}
            setCustNm={this.setNoReceiveBenefit}

          />
        ),
        onFilterDropdownVisibleChange: (visible) => this.handleFilterDropdownVisibleChange(visible, 4),
        filtered: noReceiveBenefit?.length,
        render: (text, record) => {
          let arr = text?.split('|');
          return (
            <div style={{ color: '#244FFF', cursor: 'pointer', wordBreak: 'break-all', whiteSpace: 'normal' }} onClick={() => this.showModal(3, record.custCode)}>{
              arr?.map((item, index) => {
                if (index < 2) {
                  if (index === 1) {
                    return <div key={index}>{item}{arr.length > 2 ? `等${arr.length}项` : ''}</div>;
                  }
                  return <div key={index}>{item}</div>;
                }
              })
            }</div>
          );
        },
      },
    ];
    return columns;
  }
  handlePagerSizeChange = (current, pageSize) => this.handlePageChange(1, pageSize)
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };
  render() {
    const { btnValue, dataSource = [], loading, pageSize, current, total, modalType } = this.state;
    const columns = this.getColumns() || [];
    const tableProps = {
      rowKey: 'key',
      dataSource: dataSource?.map((item, index) => { return { key: index, ...item }; }),
      columns,
      pagination: false,
      loading: loading,
      onChange: this.handleTableChange,
    };
    const paginationProps = {
      size: 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      pageSize: pageSize,
      current: current,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handlePagerSizeChange,
      total: total,
    };
    return (
      <div style={{ background: '#FFF', padding: '25px 16px' }}>
        <div className={styles.title}>
          V{this.props.location?.query.state || 0}等级客户列表
          <Divider style={{ margin: '8px 0 20px 0' }} />
        </div>
        <div className={styles.selectBtn}>
          <span onClick={() => this.setState({ btnValue: !btnValue, current: 1 }, () => { this.fetchData(); this.getOptionData(); clickSensors('客户列表（客户权益）', '只看主推权益（客户权益）') })}>
            <span>只看主推权益</span>
            <Checkbox checked={btnValue}></Checkbox>
          </span>
          <Divider type='vertical' style={{ height: 28, margin: '0 11px 0 8px' }} />
          <span onClick={() => this.showModal(0)}>V{this.props.location?.query.state || 0}等级客户未解锁权益</span>
        </div>
        <BasicDataTable {...tableProps} style={{ marginBottom: '10px' }} className={`${styles.table}`} />
        <Pagination {...paginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />
        <Modal
          title={this.modalTitle()}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.modal}
          footer={null}
          width={modalType === 3 ? '459px' : modalType === 0 ? '852px' : '590px'}
          destroyOnClose
        >
          {this.modalContent()}
        </Modal>
        {/* {this.state.showTips && !dataSource?.length > 0 && (
          <div style={{ left: '416px', top: '162px' }} className={`${styles.blueBubble} blueBubble`} onClick={(e) => e.stopPropagation()}>
            <span style={{ color: '#1A2243', fontWeight: 'bold' }}>潜力及价值特征：</span>
                我们利用海量自有数据&设备数据搭建机器学习算法模型，为场景化的营销机会提供补充。未覆盖客户仅代表客户未被模型识别，不具任何资产潜力意义。
          </div>
        )} */}
      </div>
    );
  }
}
