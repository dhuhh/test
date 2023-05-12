import React from 'react';
import { Button, Card, Row, Col, message, Modal, Progress, Upload, Icon, Input, Radio } from 'antd';
import BasicModal from '../../../../Common/BasicModal';
import config from '../../../../../utils/config';
import Table from './Table';
import { getImportGroupCusInfo, getImportGroupCus } from '../../../../../services/customerbase/cusGroupCusList';
import styles from './index.less';
// 标准版屏蔽
// import ImportCrowdList from './List/index';
// import ImportCrowdAnalysis from '../../../../WorkPlatForm/MainPage/DigitalMarketing/cusGroup/Group360/Analysis/index';

const { api } = config;
const { customerbase: { cusGroupImport } } = api;

class AddCustomer extends React.Component {
    state = {
      visible: false,
      modalVisible: false,
      complete: false,
      loading: false,
      percent: 0,
      fileList: [],
      inputValue: '',
      tableDataSource: [],
      tableShow: false,
      khhList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        paging: 1,
        sort: '',
        total: -1,
      },
      dataType: '',
      uuid: '',
      // readyUploadCustomer: '',
    }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  };

  // 上传进度实现方法，上传过程中会频繁调用该方法
  progressFunction = (uuid) => {
    const exportPercentUtl = '/api/customerAggs/v2/exportPercent';
    if (typeof EventSource !== 'undefined') {
      // 浏览器支持 Server-Sent
      setTimeout(() => {
        this.setState({ modalVisible: true, percent: 0 });
        const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
        source.onmessage = (event) => {
          const { data: percent = 0 } = event;
          if (percent === '100') {
            source.close();
            setTimeout(() => {
              this.setState({ modalVisible: false, percent: 0 });
            }, 1000);
          }
          // handle message

          this.setState({ percent });
        };
        let errorTimes = 0;
        source.onerror = () => {
          errorTimes++;
          if (errorTimes >= 3) {
            source.close();
            this.uploadFailed();
          }
        };
      }, 500);
    } else {
      // 浏览器不支持 Server-Sent..
    }
  }
  // 上传失败
  uploadFailed = () => {
    this.setState({ modalVisible: false, loading: false });
    // message.error('上传失败');
  }
  // 取消上传
  cancleUploadFile = () => {
    this.xhr.abort();
  }
  // 上传结束
  uploadComplete = (evt) => {
    const { target = {} } = evt;
    const { status, readyState } = target;
    if (status === 200 && readyState === 4) {
      const { response = '' } = target;
      const result = JSON.parse(response) || {};
      const { code = '-1', note = '', uuid = '' } = result;
      if (code > 0) {
        this.setState({ complete: true, uuid, loading: false }, () => { this.handelFetchTableData(); });
      } else {
        message.error(note);
        this.setState({ modalVisible: false, loading: false });
      }
    }
  }
  handleUpload = () => {
    const { inputValue, fileList, dataType } = this.state;
    const otherCusNo = this.handleInputValueFormat(inputValue);
    if (fileList.length === 0 && otherCusNo === '') {
      message.error('请选择导入文件或填入客户号');
      return;
    }
    const otherCusNoArr = otherCusNo.split(';');
    const newOtherCuseNo = otherCusNoArr.join(',');
    this.setState({
      loading: true,
    });
    const { customerGroupType = 'mine', selectedKey = '' } = this.props;
    const groupType = customerGroupType === 'mine' ? 'WDKHQ' : 'YYBKHQ';
    const uuid = this.guid();
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
    let url = newOtherCuseNo === '' ? `${cusGroupImport}?cusGroupCode=${selectedKey}&cusGroupType=${groupType}&uuid=${uuid}` :
      `${cusGroupImport}?otherCusNo=${newOtherCuseNo}&cusGroupCode=${selectedKey}&cusGroupType=${groupType}&uuid=${uuid}`;
    if (dataType !== '') {
      url = `${url}?dataType=${dataType} `;
    }
    this.xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
    this.xhr.open('post', url, true); // post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
    this.xhr.onload = evt => this.uploadComplete(evt); // 请求完成
    this.xhr.onloadstart = () => this.progressFunction(uuid);
    this.xhr.upload.onprogress = () => this.progressFunction(uuid);
    this.xhr.onerror = this.uploadFailed; // 请求失败
    this.xhr.send(formData); // 开始上传，发送form数据
  }
  closeModal = () => {
    const { fetchTableDatas, selectedKey = '' } = this.props;
    if (fetchTableDatas) {
      fetchTableDatas({ pager: { current: 1, pageSize: 10 }, selectedKey });
    }
    this.setState({
      visible: false,
      modalVisible: false,
      complete: false,
      loading: false,
      percent: 0,
      fileList: [],
      inputValue: '',
      tableDataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        paging: 1,
        sort: '',
        total: -1,
      },
    });
  }
  // 关闭弹出层并添加客户进客户群
  handleOk = () => {
    const { uuid = '' } = this.state;
    const { selectedKey = '', customerGroupType = 'mine' } = this.props;
    const groupType = customerGroupType === 'mine' ? 'WDKHQ' : 'YYBKHQ';
    // const { customerGroupType = 'mine', selectedKey = '', queryParameter, selectedName } = this.props;
    // const { customerQueryType } = queryParameter;
    const { complete = false } = this.state;
    if (complete) {
      getImportGroupCus({
        custype: '1',
        khqid: selectedKey,
        khqbs: groupType,
        uuid,
      }).then((response) => {
        const { code = -1, records = [], note = '' } = response;
        if (code > 0) {
          message.info(note);
          this.setState({
            complete: false,
            tableShow: true,
            khhList: records.length > 0 ? records[0] : [],
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else {
      message.error('请先预览文件！');
    }
    this.handelFetchTableData(1, this.state.pagination.pageSize);
    // this.closeModal();
  }
  // 查table数据
  handelFetchTableData = (
    current = this.state.pagination.current,
    pageSize = this.state.pagination.pageSize,
  ) => {
    const { uuid = '' } = this.state;
    this.setState({ loading: true });
    const { customerGroupType = 'mine', selectedKey = '' } = this.props;
    const groupType = customerGroupType === 'mine' ? 'WDKHQ' : 'YYBKHQ';
    const { pagination } = this.state;
    getImportGroupCusInfo({
      custype: '1',
      current,
      khqbs: groupType,
      khqid: selectedKey,
      pageSize,
      paging: 1,
      sort: '',
      total: -1,
      uuid,
      datatype: '1',
    }).then((res) => {
      const { code = -1, records = [], total } = res;
      if (code > 0 && Array.isArray(records)) {
        this.setState({ tableDataSource: records, loading: false, pagination: { ...pagination, current, pageSize, total } });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handlePageChange = (page = 1, pageSize = 10) => {
    const current = page;
    this.handelFetchTableData(current, pageSize);
  }
  checkInputValue = (e) => {
    let { value } = e.target;
    value = value.replace(/[^\d^(;|；)]+/g, '');
    value = value.replace(/；/g, ';');
    this.setState({ inputValue: value });
  }
  handleInputValueFormat = (value = '') => {
    const khhs = value.split(';');
    return khhs.map((item) => {
      return item === '' ? null : item.trim();
    }).join(';');
  }
  // upState = (value) => {
  // this.setState({ readyUploadCustomer: value });
  // }

  onChange = (e) => {
    this.setState({
      dataType: e.target.value,
    });
  }

  render() {
    // 是否是客群360跳过来的
    const { idCusGroup360, selectedName, khlx } = this.props;
    const { modalVisible, percent, tableDataSource, pagination, queryParameter, loading = false, complete, tableShow, khhList } = this.state; // eslint-disable-line
    // if (percent === '100' && complete && fetchTable) {
    //   this.handelFetchTableData();
    // }
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState({
          fileList: [file],
        });
        return false;
      },
      fileList: this.state.fileList,
      accept: '.xls,.xlsx',
    };
    return (
      <React.Fragment>
        <iframe title="上传" ref={(node) => { this.uploadIframe = node; }} style={{ display: 'none' }} />
        {idCusGroup360 === 1 ? <Button type="link" icon="download" onClick={this.showModal}>导入</Button> :
        <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.showModal}>导入客户</Button>}
        <BasicModal
          visible={this.state.visible}
          onCancel={this.closeModal}
          style={{ top: '2rem' }}
          width="100rem"
          title="导入客户"
          // onOk={this.handleOk}
        >
          <Card>
            <div className="ant-collapse-content-box">
              <Row>
                {idCusGroup360 === 1 ?
                (
                  <Row style={{ marginBottom: '1rem' }}>
                    <Col span={24}>
                      <span>客群名称: {selectedName || ''}</span>
                    </Col>
                    <Col span={6}>
                      <span>客户类型: {khlx || ''}</span>
                    </Col>
                    <Col span={2}>
                      <span>数据类型: </span>
                    </Col>
                    <Col span={6} style={{ marginLeft: '-2rem' }}>
                      <Radio.Group onChange={this.onChange} defaultValue={1}>
                        <Radio value={1}>客户号</Radio>
                        <Radio value={2}>资金账户</Radio>
                      </Radio.Group>
                    </Col>
                  </Row>
                ) : null}
                <Col span={18}>
                  <Upload {...props} className={styles.m_Upload}>
                    <Button>
                      <Icon type="upload" />点击上传文件
                    </Button>
                  </Upload>
                </Col>
                <Col span={6}>
                  <Button className="fcbtn m-btn-border m-btn-border-headColor ant-btn btn-1c" style={{ marginRight: '1rem' }} onClick={this.handleUpload}>预览</Button>
                  <Button disabled={!complete} className="fcbtn m-btn-border m-btn-border-headColor ant-btn btn-1c" onClick={this.handleOk}>导入</Button>
                  <Modal
                    title="系统处理中,请稍候..."
                    centered
                    destroyOnClose
                    closable={false}
                    maskClosable={false}
                    visible={modalVisible}
                    footer={null}
                  >
                    <Row>
                      <Col span={2}>进度:</Col>
                      <Col span={22}><Progress percent={parseInt(percent, 10)} status={percent === '100' ? 'success' : 'active'} /></Col>
                    </Row>
                  </Modal>
                  <a style={{ color: '#2daae4', marginLeft: '1rem' }} href={`${localStorage.getItem('livebos') || ''}/OperateProcessor?Column=MBFJ&Table=TTYMBWH&&operate=Download&&Type=Attachment&ID=2`}>模板下载</a>
                </Col>
              </Row>
              <Row style={{ marginTop: '2rem' }}>
                <Col span={2} style={{ height: '3rem', lineHeight: '3rem' }}>
                      其他客户：
                </Col>
                <Col span={22} style={{ height: '3rem', lineHeight: '3rem' }}>
                  <Input placeholder="请输入客户号，并用 ; 分隔" onChange={e => this.checkInputValue(e)} value={this.state.inputValue} />
                </Col>
              </Row>
            </div>
            <Table loading={loading} queryParameter={queryParameter} tableDataSource={tableDataSource} pagination={pagination} handlePageChange={this.handlePageChange} />
            {/* 中原屏蔽 */}
            {/* {
              tableShow && (
              <Card className="m-card">
                <Tabs className="m-tabs-underline m-tabs-underline-small" type="line" tabPosition="top" defaultActiveKey="list">
                  <Tabs.TabPane tab="客户列表" key="list"><ImportCrowdList khhList={khhList} /></Tabs.TabPane>
                  <Tabs.TabPane tab="客群分析" key="analysis"><ImportCrowdAnalysis /></Tabs.TabPane>
                </Tabs>
              </Card>)
            } */}
          </Card>
        </BasicModal>
        <Modal
          title="系统处理中,请稍候..."
          centered
          destroyOnClose
          closable={false}
          maskClosable={false}
          visible={modalVisible}
          footer={null}
        >
          <Row>
            <Col span={2}>进度:</Col>
            <Col span={22}><Progress percent={parseInt(percent, 10)} status={percent === '100' ? 'success' : 'active'} /></Col>
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddCustomer;
