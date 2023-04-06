import React from 'react';
import lodash from 'lodash';
import LBFrame from 'livebos-frame';
import { Row, Col, message, Input, Card, Spin } from 'antd';
import { withRouter, routerRedux } from 'dva/router';
import { FetchQueryProcessNavigation } from '../../../../services/commonbase/index';
import BasicModal from '../../../Common/BasicModal';
import nodata from '../../../../assets/no-data.svg';

const { Search } = Input;

class ProcessNavigation extends React.Component {
  state = {
    keyWord: '',
    tableData: [],
    loading: false,
    visible: false,
  }

  componentDidMount() {
    this.fetchTable();
  }

  // 调用端口获取客户列表
  fetchTable = async () => {
    this.setState({ loading: true });
    const { keyWord = '' } = this.state;
    await FetchQueryProcessNavigation({
      keyWord,
    }).then((response) => {
      const { records = [] } = response || {};
      // listDatas去重后的标题
      const listDatas = [...new Set(records.map(item => item.groupName))];
      const currentDateProdData = [];
      if (listDatas.length > 0) {
        listDatas.forEach((listDatasItem, index) => {
          const obj = {};
          let currentDateProdArr = [];
          currentDateProdArr = records.filter(item => item.groupName === listDatasItem);
          obj.id = index + 1;
          obj.name = listDatasItem;
          obj.arr = currentDateProdArr;
          currentDateProdData.push(obj);
        });
      }
      this.setState({
        loading: false,
        tableData: currentDateProdData,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // onSearch
  onSearch = (e) => {
    this.setState({
      keyWord: e,
    }, () => this.fetchTable());
  }

  // onSearchvalue
  onSearchvalue = (e) => {
    this.setState({ keyWord: e.target.value });
  }

  handleOpen = (key) => {
    if (key.accessRights === '0') {
      return false;
    }
    if (key.openType === '2') {
      this.buttonShowModal(key.flowObjectUlr, key.flowName);
    } else {
      this.props.dispatch(routerRedux.push(`/UIProcessor?Table=${key.flowObjectUlr}`));
    }
  }

  onMessage = (messageObj) => { // iframe的回调事件
    if (!messageObj) { // 取消事件，对应 LiveBOS `operateCancel`
      this.handleCancel();
    } else { // 操作完成事件，对应 LiveBOS `operateCallback`
      this.handleCancel();
      this.props.refreshList();
    }
  }

  buttonShowModal = (url, modalTitle) => {
    const target = `${localStorage.getItem('livebos') || ''}/UIProcessor?Table=${url}`;
    this.setState({
      visible: true,
      target,
      modalTitle,
    });
  }

  // 取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }


  render() {
    const { keyWord, tableData = [], loading, visible } = this.state;
    const modalProps = {
      title: this.state.modalTitle,
      width: '90rem',
      height: '50rem',
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };

    return (
      <React.Fragment>
        <Row className="" style={{ marginBottom: '0.833rem' }}>
          <Col sm={24} md={24} lg={24} xl={24}>
            <div className=" m-organ-bg m-organ-lcdh">
              <div className="tc" style={{ top: '50%' }}>
                <div className="m-top-search-box dis-fx alc" style={{ width: '48rem' }}>
                  <div className="m-global-search-wrap global-search-wrapper flex" >
                    <Search
                      placeholder="请输入关键字搜索"
                      enterButton="搜索"
                      onSearch={this.onSearch}
                      onChange={this.onSearchvalue}
                      defaultValue={keyWord}
                      value={keyWord}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="m-row" >
          <Col sm={24} md={24} lg={24} xl={24}>
            <Card
              className="m-card default m-card-padding"
              style={{ paddingBottom: '1.333rem' }}
            >
              {
                !loading ? tableData && tableData.map((item, index) => {
                  const listData = lodash.get(item, 'arr', []);
                  return (
                    <Row className="m-row m-list-title" key={index}>
                      <h2 key={item.id}><span />{item.name}</h2>
                      {
                        listData && listData.map((keys, i) => {
                          return (
                            <Col sm={12} md={8} lg={6} xl={6} style={{ marginBottom: '0' }} key={i}>
                              <div className="m-list-title-item" onClick={() => this.handleOpen(keys)}><span />
                                <a
                                  style={{ color: keys.accessRights === '0' ? '#ddd' : '', cursor: keys.accessRights === '0' ? 'auto' : 'pointer' }}
                                >{keys.flowName}
                                </a>
                              </div>
                            </Col>
                          );
                        })
                      }

                    </Row>
                  );
                }) : (
                  <div style={{ lineHeight: '20rem', textAlign: 'center' }}><Spin /></div>
                )
              }
              {
                !loading && tableData.length === 0 && (
                  <div className="tc no-data-card" style={{ height: '20rem', background: '#fff' }}>
                    <div><img src={nodata} alt="" /></div>
                    <div className="no-data-text">暂无内容</div>
                  </div>
                )
              }
            </Card>
          </Col>
        </Row>
        <BasicModal {...modalProps}>
          <LBFrame
            src={this.state.target}
            id="myId"
            className=""
            display="initial"
            allowFullScreen
            frameBorder="no"
            border="0"
            onMessage={this.onMessage}
            style={{ background: 'white', position: 'absolute', width: '90rem', height: '48rem' }}
          />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default withRouter(ProcessNavigation);
