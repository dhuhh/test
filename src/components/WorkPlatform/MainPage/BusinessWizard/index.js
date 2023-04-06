import React from 'react';
import { Card, message, Row, Col, List, ConfigProvider, Spin } from 'antd';
import Bridge from 'livebos-bridge';
import { debounce } from 'lodash';
import { FetchQueryProductNode, FetchQueryProductFlowOfNode, FetchQueryProductCodeOrName } from '@/services/organManagement';
import nodata from '@/assets/no-data.svg';
import BasicModal from '@components/Common/BasicModal';
import SelectFilter from './SelectFilter';
import StepsList from './StepsList';


const { Fragment } = React;
const iframeRef = React.createRef();

const customizeRenderEmpty = () => (
  // 这里面就是我们自己定义的空状态
  <div className="tc no-data-card" style={{ height: '26rem', background: '#fff' }}>
    <div><img src={nodata} alt="" /></div>
    <div className="no-data-text">暂无内容</div>
  </div>
);

class BusinessWizard extends React.Component {
  state = {
    prodName: '', // 产品代码/名称
    tableData: [],
    stepsData: [],
    search: this.props.search,
    pagination: {
      paging: 1,
      current: 1,
      pageSize: 5,
      total: -1,
    },
    visible: false,
    targetUrl: '',
    prodSelectList: [],
  }

  componentDidMount() {
    this.fetchProductSelectList('');
  }

  componentWillReceiveProps(props) {
    const { search } = props;
    this.setState({
      search,
      tableData: [],
      stepsData: [],
      pagination: {
        current: 1,
        pageSize: 5,
      },
    });
  }

  // 获取产品下拉框列表
  fetchProductSelectList = async (value) => {
    await FetchQueryProductCodeOrName({
      message: value,
    }).then((response) => {
      const { records = [] } = response || {};
      this.setState({
        prodSelectList: records.slice(0, 200),
      });
    }).catch((error) => {
    });
  }

  // 调用端口获取列表(精准查询)
  fetchQueryProductNode = async () => {
    const { search } = this.state;
    const { pagination, prodName = '' } = this.state;
    const { userBasicInfo } = this.props;
    const { userid } = userBasicInfo || {};
    await FetchQueryProductNode({
      userid,
      prodName,
      prodType: search,
    }).then((response) => {
      const { records = [], total } = response || {};
      this.setState({
        tableData: records,
        pagination: {
          ...pagination,
          total,
        },
      });
      message.success(`查询产品代码或名称为【${prodName}】的信息成功`);
    }).catch((error) => {
      message.warn('请输入正确的产品名称或代码');
    });
  }

  // 获取产品流程节点
  fetchQueryProductFlowOfNode = async () => {
    const { search } = this.state;
    const { prodName = '' } = this.state;
    const { userBasicInfo } = this.props;
    const { userid } = userBasicInfo || {};
    await FetchQueryProductFlowOfNode({
      userid,
      prodName,
      prodType: search,
    }).then((response) => {
      const { records = [] } = response || {};
      this.setState({
        stepsData: records,
      });
      message.success(`查询产品代码或名称为【${prodName}】的信息成功`);
    }).catch((error) => {
      message.warn('请输入正确的产品名称或代码');
    });
  }

  // 根据输入表单改变查询培训资料数据接口参数
  handleSearch = (values) => {
    const { prodName = '' } = values;
    const prodCode = prodName ? prodName.split('_')[0] : prodName;
    this.setState({
      prodName: prodCode, // 产品代码/名称
    }, () => {
      if (prodCode) {
        this.fetchQueryProductNode();
        this.fetchQueryProductFlowOfNode();
      } else {
        message.warn('输入的产品代码或名称为空，请重新输入');
      }
    });
  }

  // 重置
  handleReset = () => {
    this.setState({
      prodName: '', // 产品代码/名称
      tableData: [],
      stepsData: [],
    });
  };

  // enter 事件
  KeyUpHandle = (e, values) => {
    // 监控 enter 事件
    if (e.keyCode !== 13) {
      return;
    }
    this.handleSearch(values);
  }

  handleSearchValue = debounce((data) => {
    this.fetchProductSelectList(data);
    this.setState({
      prodName: data,
    });
  }, 500)

  handleChangeValue = (data) => {
    this.setState({
      prodName: data,
    });
  }

  // 分页切换
  onPagerChange = (current, pageSize) => {
    const { pagination, tableData } = this.state;
    this.setState({
      tableData,
      pagination: {
        ...pagination,
        current,
        pageSize,
      },
    }, () => this.fetchQueryProductNode());
  }

  // 跳转到相应流程的页面
  handleProStartUrl = (itemValue) => {
    const { stepsData = [] } = this.state;
    let datas = [];
    if (stepsData[0]?.SUBSCRIBE_ORIGIN?.length > 0) {
      const data = JSON.parse(stepsData[0].SUBSCRIBE_ORIGIN);
      datas = data;
    }
    if (datas.length > 0) {
      datas.forEach((item) => {
        if (itemValue.C_LCID === item.ID) {
          if (item.PROCESS_START_URL === '1') {
            message.warn('该流程暂不支持发起');
          } else {
            this.setState({
              targetUrl: item.PROCESS_START_URL,
              visible: true,
            });
          }
        }
      });
    }
  }

  connect = () => {
    const bridge = new Bridge(iframeRef.current.contentWindow);
    bridge.onReady(() => {
      bridge.on('operateCallback', (data) => {
        if (data !== null) {
          const {
            callback: {
              closeFlag,
              cancelFlag,
            } = {},
          } = data;
          if (cancelFlag || closeFlag) { // 取消事件，对应 LiveBOS `operateCancel`
            this.handleCancel();
          } else { // 操作完成事件，对应 LiveBOS `operateCallback`
            message.success(data?.message || '操作成功');
            this.props.onRefresh();
            this.handleCancel();
          }
        }
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { dispatch, search } = this.props;
    const { tableData = [], stepsData = [], pagination, pagination: { current = 1, total }, visible, targetUrl, prodSelectList } = this.state;
    const modalProps = {
      title: '流程发起',
      width: '100rem',
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };
    return (
      <Fragment>
        <Card
          className="m-card default"
          style={{ marginBottom: '0.833rem', marginLeft: '0.833rem' }}
          title={
            <Row style={{ width: '100%' }}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ float: 'left' }}>进度跟踪</div>
              </Col>
            </Row>
          }
        >
          <div style={{ padding: '0 1.666rem 1.666rem 1.666rem' }}>
            <SelectFilter
              handleReset={this.handleReset}
              handleSearch={this.handleSearch}
              KeyUpHandle={this.KeyUpHandle}
              handleSearchValue={this.handleSearchValue}
              handleChangeValue={this.handleChangeValue}
              prodSelectList={prodSelectList}
              fetchProductSelectList={this.fetchProductSelectList}
            />
            <ConfigProvider renderEmpty={customizeRenderEmpty}>
              {
                tableData.length >= 0 ?
                  (
                    <List
                      itemLayout="horizontal"
                      dataSource={tableData}
                      pagination={total > 1 ? {
                        onChange: this.onPagerChange,
                        className: 'm-paging',
                        total,
                        current,
                        showTotal: () => `共${total}条`,
                        ...pagination,
                      } : false}
                      renderItem={item => (
                        <List.Item style={{ borderRadius: '0.5rem', margin: '0 1.666rem 2.5rem 1.666rem', boxShadow: '0 0 1.5rem #BFB6B6', padding: '0' }}>
                          <Row type="flex" justify="start" align="middle" style={{ width: '100%', height: '8rem' }} >
                            <Col xs={4} sm={4} lg={4} xl={4} style={{ background: '#FDF1F1', height: '8rem', lineHeight: '8rem', borderTopLeftRadius: '0.5rem', borderBottomLeftRadius: '0.5rem' }}>
                              <div style={{ marginRight: '1.333rem', cursor: 'pointer' }} onClick={() => this.handleProStartUrl(item)}>
                                <div className="tc overflow">
                                  <span className="dis-bk fs12" style={{ fontSize: '1.5rem', color: '#676464' }}>
                                    {item.C_LCMC || '--'}
                                  </span>
                                </div>
                              </div>
                            </Col>
                            <Col xs={20} sm={20} lg={20} xl={20}>
                              {item.C_JDMC && stepsData.length > 0 ? <StepsList dispatch={dispatch} item={item} search={search} stepsData={stepsData} /> : ''}
                            </Col>
                          </Row>
                        </List.Item>
                      )}
                    />
                  )
                  :
                  (
                    <div style={{ textAlign: 'center', padding: '5rem' }}><Spin /></div>
                  )
              }
            </ConfigProvider>
            <BasicModal {...modalProps}>
              <iframe
                title="流程发起"
                ref={iframeRef}
                src={`${localStorage.getItem('livebos') || ''}${targetUrl}`}
                style={{ background: 'white', width: '100%', height: '55rem', border: '0' }}
                onLoad={this.connect}
              />
            </BasicModal>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default BusinessWizard;
