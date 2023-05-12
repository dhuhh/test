import React, { Component } from 'react';
import { Button, Col, Row, Modal, Progress } from "antd";
import { connect } from "dva";
import styles from "./index.less";


class ExportTab extends Component {
  state = {
    modalVisible: false,
    percent: 0,
    noPercent: false ,//  默认不使用导出进度条
  };

  componentWillUnmount() {
    // 清空定时器,避免内存泄漏
    if (this.timers && this.timers.length > 0) {
      this.timers.forEach(timer => {
        clearTimeout(timer);
      });
      this.timers = null;
    }
    // 关闭EventSource,避免内存泄漏
    if (this.eventSources && this.eventSources.length > 0) {
      this.eventSources.forEach(eventSource => {
        if (eventSource && eventSource.close) {
          eventSource.close();
        }
      });
      this.eventSources = null;
    }
  }

  guid = () => {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };


  showConfirm = () => {
    const {
      total,
      exportPercentUtl = "/api/customerAggs/v2/exportPercent", // 点击导出后系统处理进度信息
    } = this.props;
    const { noPercent = false } = this.state;
    if (total <= 0) {
      Modal.info({ content: "无数据可导出!" });
      return false;
    }
    if (total > 50000) {
      Modal.info({ content: "导出数据大于50000条,无法导出!" });
      return false;
    }
    const _props = this.props;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    Modal.confirm({
      title: "提示：",
      content: `是否导出数据（共${total}条）？`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        const { action, exportPayload } = _props;
        const form1 = document.createElement("form");
        form1.id = "form1";
        form1.name = "form1";
        // 添加到 body 中
        document.getElementById("m_iframe").appendChild(form1);
        // 创建一个输入
        const input = document.createElement("input");
        // 设置相应参数
        input.type = "text";
        input.name = "exportPayload";
        input.value = exportPayload;

        // 将该输入框插入到 form 中
        form1.appendChild(input);

        // form 的提交方式
        form1.method = "POST";
        // form 提交路径
        form1.action = action;

        // 对该 form 执行提交
        form1.submit();
        // 删除该 form
        document.getElementById("m_iframe").removeChild(form1);
        if (noPercent && total >= 10000 && typeof EventSource !== "undefined") {
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
            source.onmessage = event => {
              const { data: percent = 0 } = event;
              if (percent === "100") {
                source.close();
                if (_this.eventSources && _this.eventSources.length > 0)
                  _this.eventSources.splice(eventSourcesIndex, 1);
                const timer2 = setTimeout(() => {
                  _this.setState({ modalVisible: false, percent: 0 });
                  if (_this.timers && _this.timers.length > 0) {
                    const index = _this.timers.findIndex(
                      timer => timer === timer2
                    );
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
              if (_this.eventSources && _this.eventSources.length > 0)
                _this.eventSources.splice(eventSourcesIndex, 1);
              const timer3 = setTimeout(() => {
                _this.setState({ modalVisible: false, percent: 0 });
                if (_this.timers && _this.timers.length > 0) {
                  const index = _this.timers.findIndex(
                    timer => timer === timer3
                  );
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

  showConfirm1 = (type) =>{
    const {
      pageParams = {},
      exportPerson,
      exportCustomer,
      exParams,
    } = this.props;
    const {
      total,
      exportPercentUtl = "/api/customerAggs/v2/exportPercent", // 点击导出后系统处理进度信息
    } = this.props;
    const { noPercent = false } = this.state;
    
    let tableHeaderCodes = [];
    let tableHeaderNames = [];
    let queryModel = exParams;
    const partCustomer = [
      {
        title: "营业部",
        dataIndex: "name",
        key: "营业部",
      },
      {
        title: "OA账号",
        dataIndex: "rybh",
        key: "OA账号",
      },
      {
        title: "员工姓名",
        dataIndex: "ryxm",
        key: "员工姓名",
      },
    ];
    const perCustomer = [
      {
        title: "OA账号",
        dataIndex: "rybh",
        key: "OA账号",
      },
      {
        title: "员工姓名",
        dataIndex: "ryxm",
        key: "员工姓名",
      },
    ];

    if (pageParams.tableType.includes("_partment")) {
      if (type === "person") {
        console.log("营业部导出员工明细");
        const newGetColums = exportPerson.filter(t => t.dataIndex !== "xhno");
        tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
        tableHeaderNames = newGetColums.map(item => item.key).join(",");
        queryModel.sort = "";
        queryModel.summaryType = "20";
      }else{
        console.log("营业部导出客户明细");
        const newGetColums = exportCustomer.filter(t => t.dataIndex !== "xhno");
        newGetColums.unshift(...partCustomer);
        tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
        tableHeaderNames = newGetColums.map(item => item.key).join(",");
        queryModel.sort = "";
        queryModel.summaryType = "21";

      }
    }else{
      console.log('员工层导出客户明细');
      const newGetColums = exportCustomer.filter(t => t.dataIndex !== "xhno");
      newGetColums.unshift(...perCustomer);
      tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
      tableHeaderNames = newGetColums.map(item => item.key).join(",");
      queryModel.sort = "";
      queryModel.summaryType = "22";
    }
    
    const exportPayload = JSON.stringify({
      queryModel,
      tableHeaderNames,
      tableHeaderCodes,
    });

    const _props = this.props;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    Modal.confirm({
      title: "提示：",
      content: `是否导出数据？`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        const { action } = _props;
        const form1 = document.createElement("form");
        form1.id = "form1";
        form1.name = "form1";
        // 添加到 body 中
        document.getElementById("m_iframe").appendChild(form1);
        // 创建一个输入
        const input = document.createElement("input");
        // 设置相应参数
        input.type = "text";
        input.name = "exportPayload";
        input.value = exportPayload;

        // 将该输入框插入到 form 中
        form1.appendChild(input);

        // form 的提交方式
        form1.method = "POST";
        // form 提交路径
        form1.action = action;

        // 对该 form 执行提交
        form1.submit();
        // 删除该 form
        document.getElementById("m_iframe").removeChild(form1);
        if (noPercent && total >= 10000 && typeof EventSource !== "undefined") {
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
            source.onmessage = event => {
              const { data: percent = 0 } = event;
              if (percent === "100") {
                source.close();
                if (_this.eventSources && _this.eventSources.length > 0)
                  _this.eventSources.splice(eventSourcesIndex, 1);
                const timer2 = setTimeout(() => {
                  _this.setState({ modalVisible: false, percent: 0 });
                  if (_this.timers && _this.timers.length > 0) {
                    const index = _this.timers.findIndex(
                      timer => timer === timer2
                    );
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
              if (_this.eventSources && _this.eventSources.length > 0)
                _this.eventSources.splice(eventSourcesIndex, 1);
              const timer3 = setTimeout(() => {
                _this.setState({ modalVisible: false, percent: 0 });
                if (_this.timers && _this.timers.length > 0) {
                  const index = _this.timers.findIndex(
                    timer => timer === timer3
                  );
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
    // showExport : 营业部明细  员工明细  客户明细是否展示导出按钮
    // authShowExport : 下钻客户明细导出权限点
    // adminShowExport : 新增跟管理员具有导出权限的员工权限点
    const { modalVisible, percent } = this.state;
    const {
      pageTitle,
      total,
      authorities = {},
      authShowExport = false,
      adminShowExport = false,
      pageParams = {},
    } = this.props;
    const { partnerAction = [] } = authorities;
    const tableArr_partment = [
      "emNewaccount_partment",
      "emCustomers_partment",
      "emProductsales_partment",
      // "emHeadband_partment",
      // "emSigning_partment"
    ];
    const tableArr_person = [
      "emNewaccount_partment",
      "emNewaccount_person",
      "emCustomers_partment",
      "emCustomers_person",
      "emProductsales_partment",
      "emProductsales_person",
      // "emHeadband_partment",
      // "emHeadband_person",
      // "emSigning_partment",
      // "emSigning_person"
    ];
    return (
      <Row type="flex" align="middle">
        <Col
          span={24}
          style={{
            background: "#fff",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 59,
          }}
        >
          <div className={styles.listTabs}>{pageTitle}</div>
          <div>
            {(partnerAction.includes("partnerAction_ToExcel") ||
              authShowExport ||
              adminShowExport) &&
              total > 0 &&
              tableArr_partment.includes(pageParams.tableType) && (
              <Button
                onClick={() => this.showConfirm1("person")}
                style={{ background: "#D9171B", color: "#fff" }}
                className={styles.exportTabs}
              >
                员工明细
              </Button>
            )}
            {(partnerAction.includes("partnerAction_ToExcel") ||
              authShowExport ||
              adminShowExport) &&
              total > 0 &&
              tableArr_person.includes(pageParams.tableType) && (
              <Button
                onClick={() => this.showConfirm1("customer")}
                style={{ background: "#D9171B", color: "#fff" }}
                className={styles.exportTabs}
              >
                客户明细
              </Button>
            )}
            {(partnerAction.includes("partnerAction_ToExcel") ||
              authShowExport ||
              adminShowExport) && (
              <Button
                onClick={this.showConfirm}
                style={{ background: "#D9171B", color: "#fff" }}
                className={styles.exportTabs}
              >
                导出表格
              </Button>
            )}
          </div>

          <iframe
            title="下载"
            id="m_iframe"
            ref={c => {
              this.ifile = c;
            }}
            style={{ display: "none" }}
          />
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
              <Col span={22}>
                <Progress
                  percent={parseInt(percent, 10)}
                  status={percent === "100" ? "success" : "active"}
                />
              </Col>
            </Row>
          </Modal>
        </Col>
      </Row>
    );
  }
}

export default connect(({ global }) => ({
  authorities: global.authorities,
})) (ExportTab);