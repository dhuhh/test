import React from 'react';
import { Button, Modal, Row, Col, Progress } from 'antd';
import config from '../../../../../../utils/config';

const { api } = config;
const {
  incidentialServices: {
    intrptCustLstExport,
    depPerfermReportExport,
    staffPerfermReportExport,
    intrptCustAnalysisExport,
    depPerfermReportBeginExport,
  } } = api;

class Export extends React.Component {
    state = {
      modalVisible: false,
      percent: 0,
    }
    componentWillUnmount() {
      // 清空定时器,避免内存泄漏
      if (this.timers && this.timers.length > 0) {
        this.timers.forEach((timer) => {
          clearTimeout(timer);
        });
        this.timers = null;
      }
      // 关闭EventSource,避免内存泄漏
      if (this.eventSources && this.eventSources.length > 0) {
        this.eventSources.forEach((eventSource) => {
          if (eventSource && eventSource.close) {
            eventSource.close();
          }
        });
        this.eventSources = null;
      }
    }
    // 生成uuid
    guid = () => {
        const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
      return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
    }
    showModal = () => {
      const { selectedCount } = this.props;
      if (selectedCount <= 0) {
        Modal.info({ title: '请至少选择一个客户!' });
        return false;
      }
    }
    handleOk = () => {
    }
    showConfirm = () => {
      const {
        selectedCount,
        exportPercentUtl = '/api/customerAggs/v2/exportPercent', // 点击导出后系统处理进度信息
      } = this.props;
      const _props = this.props;
      if (selectedCount <= 0) {
        Modal.info({ title: '请至少选择一个客户!' });
        return false;
      }
      // const uuid = this.guid(); // 获取唯一识别码
      const uuid = this.guid(); // 获取唯一识别码
      const _this = this;
      Modal.confirm({
        title: '提示：',
        content: `是否导出用户数据（共${selectedCount}条）？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const { queryParameter = {}, selectAll = false, selectedRowKeys, displayColumns, exportsType = '' } = _props;
          const tableHeaderCodes = [];
          const headerInfo = [];
          displayColumns.forEach((element) => {
            const { dataIndex, key, title } = element;
            if (dataIndex && dataIndex !== 'cz' && dataIndex !== 'phone' && dataIndex !== 'custPhn') {
              tableHeaderCodes.push(dataIndex);
              headerInfo.push(typeof title === 'string' ? title : key);
            }
          });
          let action = '';
          let paramsInfo = {};
          const params = {
            selectAll: selectAll ? 1 : 0,
            selectCode: Array.isArray(selectedRowKeys) ? selectedRowKeys.join(',') : selectedRowKeys,
            tableHeaderCodes: Array.isArray(tableHeaderCodes) ? tableHeaderCodes.join(',') : tableHeaderCodes,
            headerInfo: Array.isArray(headerInfo) ? headerInfo.join(',') : headerInfo,
          };
          if (exportsType === 'intrptCustLst') {
            action = intrptCustLstExport;
            paramsInfo = {
              ...params,
              intrptCustLstModel: {
                ...queryParameter,
              },
            };
          } else if (exportsType === 'depPerfermReport') {
            action = depPerfermReportExport;
            paramsInfo = {
              ...params,
              depPerfermReportModel: {
                ...queryParameter,
              },
            };
          } else if (exportsType === 'staffPerfermReport') {
            action = staffPerfermReportExport;
            paramsInfo = {
              ...params,
              staffPerfermReportModel: {
                ...queryParameter,
              },
            };
          } else if (exportsType === 'intrptCustAnalysis') {
            action = intrptCustAnalysisExport;
            paramsInfo = {
              ...params,
              intrptCustAnalysisModel: {
                ...queryParameter,
              },
            };
          } else if (exportsType === 'depPerfermReportBegin') {
            action = depPerfermReportBeginExport;
            paramsInfo = {
              ...params,
              DeptAndStaffModel: {
                ...queryParameter,
              },
            };
          }
          const exportPayload = JSON.stringify(paramsInfo);
          const form1 = document.createElement('form');
          form1.id = 'form1';
          form1.name = 'form1';
          // 添加到 body 中
          document.getElementById('m_iframe').appendChild(form1);
          // 创建一个输入
          const input = document.createElement('input');
          // 设置相应参数
          input.type = 'text';
          input.name = 'exportPayload';
          input.value = exportPayload;

          // 将该输入框插入到 form 中
          form1.appendChild(input);

          // form 的提交方式
          form1.method = 'POST';
          // form 提交路径
          form1.action = action;

          // 对该 form 执行提交
          form1.submit();
          // 删除该 form
          document.getElementById('m_iframe').removeChild(form1);

          if (selectedCount >= 10000000 && typeof EventSource !== 'undefined') {
            // if (typeof EventSource !== 'undefined') {
            if (!_this.timers) {
              _this.timers = [];
            }
            // 浏览器支持 Server-Sent
            const timer1 = setTimeout(() => {
              _this.setState({ modalVisible: true, percent: 0 });
              const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
              let eventSourcesIndex = 0;
              // 成功与服务器发生连接时触发
              source.onopen = () => {
                if (!_this.eventSources) {
                  _this.eventSources = [];
                }
                eventSourcesIndex = _this.eventSources.legnth;
                _this.eventSources.push(source);
              };
              source.onmessage = (event) => {
                const { data: percent = 0 } = event;
                if (percent === '100') {
                  source.close();
                  if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
                  const timer2 = setTimeout(() => {
                    _this.setState({ modalVisible: false, percent: 0 });
                    if (_this.timers && _this.timers.length > 0) {
                      const index = _this.timers.findIndex(timer => timer === timer2);
                      if (index >= 0) {
                        _this.timers.splice(index, 1);
                      }
                    }
                  }, 1000);
                  _this.timers.push(timer2);
                }
                // handle message
                _this.setState({ percent });
              };
              source.onerror = () => {
                source.close();
                if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
                const timer3 = setTimeout(() => {
                  _this.setState({ modalVisible: false, percent: 0 });
                  if (_this.timers && _this.timers.length > 0) {
                    const index = _this.timers.findIndex(timer => timer === timer3);
                    if (index >= 0) {
                      _this.timers.splice(index, 1);
                    }
                  }
                }, 1000);
                _this.timers.push(timer3);
              };
            }, 500);
            _this.timers.push(timer1);
          } else {
            // 浏览器不支持 Server-Sent..
          }
        },
      });
    };

    render() {
      const { modalVisible, percent } = this.state;
      return (
        <React.Fragment>
          <Button className="fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c ml14" style={{ border: 'none', color: '#fff', background: '#244FFF' }} onClick={this.showConfirm}>导出表格</Button>
          <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
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

export default Export;

