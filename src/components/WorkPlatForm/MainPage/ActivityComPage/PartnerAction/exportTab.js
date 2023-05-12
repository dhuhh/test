import React, { Component } from "react";
import { Button, Col, Row, Modal, Progress, DatePicker } from "antd";
import { GetMarketDay, QueryExportAuthQ2 } from "$services/activityComPage";
import { connect } from "dva";
import moment from "moment";
import RuleModal from "./ruleModal";
import InModal from "./inModal";
import styles from "./index.less";

class ExportTab extends Component {
  state = {
    modalVisible: false,
    percent: 0,
    noPercent: false, //  默认不使用导出进度条
    typeList: true,
    adminShowExport: false, //  新增跟管理员具有导出权限的员工权限点
    showInModal: false,
    type: "",
    title: "",
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
  componentDidMount() {
    if (
      this.props.keys.keys === "emSecurities" 
    ) {
      this.setState({ typeList: true });
    } else {
      this.setState({ typeList: false });
    }
    this.getAdminShowExport();
  }

  getAdminShowExport = () => {
    QueryExportAuthQ2().then(res => {
      const { data } = res;
      let param = data == "1" ? true : false;
      this.setState({ adminShowExport: param });
    });
  };

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
  // 日期改变
  dateChange = e => {
    if (e) {
      this.props.setQueryDate(moment(e));
    } else {
      let num = 1;
      if (
        this.props.keys.keys === "emProductsales" ||
        this.props.keys.keys === "paProductsales"
      ) {
        num = 2;
      } else {
        num = 1;
      }
      GetMarketDay({ dayBeforeCount: num }).then(res => {
        const { data } = res;
        if (data > "20230630") {
          this.props.setQueryDate(moment("20230630"));
        } else {
          this.props.setQueryDate(moment(data));
        }

      });
    }
  };
  showInModal = types => {
    switch (this.props.keys.keys) {
      case "emNewaccount":
        this.setState({ type: "1" });
        break;
      case "emCustomers":
        this.setState({ type: "2" });
        break;
      case "emProductsales":
        this.setState({ type: "3" });
        break;
      default:
        this.setState({ type: "" });
        break;
    }
    this.setState({ showInModal: true, title: types });
  };
  closeInModal = () => {
    this.setState({ showInModal: false });
  };
  render() {
    const {
      modalVisible,
      percent,
      typeList,
      adminShowExport,
      showInModal,
      type,
      title,
    } = this.state;
    const { authorities = {} } = this.props;
    const { partnerAction = [] } = authorities;
    console.log("二季度权限", partnerAction);
    const showModalPagetTwo = ["emNewaccount", "emCustomers"];
    return (
      <Row type="flex" align="middle" style={{ padding: "0px 0px 16px 0px" }}>
        <Col span={24}>
          <div className={styles.listTab}>榜单列表</div>
          <RuleModal keys={this.props.keys} />
          <InModal
            keys={this.props.keys}
            showInModal={showInModal}
            closeInModal={this.closeInModal}
            type={type}
            title={title}
          />
          {(partnerAction.includes("partnerAction_ToExcel") ||
            adminShowExport) && (
            <Button
              onClick={this.showConfirm}
              style={{ background: "#D9171B", color: "#fff" }}
              className={styles.exportTab}
            >
              导出表格
            </Button>
          )}
          {showModalPagetTwo.includes(this.props.keys.keys) &&
            (partnerAction.includes("partnerAction_Acount_IB") ||
              partnerAction.includes("partnerAction_Cus_IB")) && (
            <Button
              style={{
                background: "rgba(217,23,27,0.06)",
                color: "#D9171B",
                border: "1px solid #D9171B"
              }}
              className={styles.exportTab}
              onClick={() => this.showInModal("IB端")}
            >
              IB端
            </Button>
          )}
          {this.props.keys.keys === "emProductsales" &&
            partnerAction.includes("partnerAction__Psale_SysOut") && (
            <Button
              style={{
                background: "rgba(217,23,27,0.06)",
                color: "#D9171B",
                border: "1px solid #D9171B"
              }}
              className={styles.exportTab}
              onClick={() => this.showInModal("系统外定制折算量")}
            >
              理财系统外
            </Button>
          )}
          {/* {this.props.keys.keys === "emSigning" &&
            partnerAction.includes("redGoodStart_InAcinonyxData") && (
              <Button
                style={{
                  background: "rgba(217,23,27,0.06)",
                  color: "#D9171B",
                  border: "1px solid #D9171B"
                }}
                className={styles.exportTab}
                onClick={() => this.showInModal("猎豹签约")}
              >
                猎豹签约
              </Button>
            )} */}
          <div
            className={styles.rangePicker}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end"
            }}
          >
            <DatePicker
              className={`${styles.rangePicker} ${styles.rangePickera}`}
              dropdownClassName={styles.rangePicker}
              value={typeList ? moment("20230101") : moment("20230410")}
              disabled
            />
            <div style={{ padding: "0px 5px" }}>至</div>
            <DatePicker
              className={`${styles.rangePicker} ${styles.rangePickera}`}
              dropdownClassName={styles.rangePicker}
              disabledDate={current =>
                typeList
                  ? current < moment("20230409").endOf("day") ||
                    current > moment("20230731").endOf("day")
                  : current < moment("20230409").endOf("day") ||
                    current > moment("20230630").endOf("day")
              }
              value={this.props.queryDate}
              onChange={tjDate => {
                this.dateChange(tjDate);
              }}
            />
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
}))(ExportTab);
