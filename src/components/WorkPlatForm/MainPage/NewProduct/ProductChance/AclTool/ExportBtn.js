import React, { Component } from 'react';
import styles from './index.less';
import { Modal, Progress, Row,Col } from 'antd';
import { connect } from 'dva';

class ExportBtn extends Component {
  state = {
    data: [],
    modalVisible: false,
    percent: 0,
  };
  componentDidMount() {}
  // 生成uuid
  guid = () => {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };
  export = flag => {
    const {
      total,
      exportPercentUtl = "/api/customerAggs/v2/exportPercent", // 点击导出后系统处理进度信息
    } = this.props;

    if (total > 40000) {
      Modal.info({ content: "导出数据不能超过4万条!" });
      return;
    } else if (total <= 0) {
      Modal.info({ content: "暂无数据可导出!" });
      return;
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
        const { action, exportPayload, total } = _props;
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

        if (total >= 10000000 && typeof EventSource !== "undefined") {
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
    let { titles = {} } = this.props;
    return (
      <div className={styles.boxs}>
        <div className={styles.title}>
          <div className={styles.label}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className={styles.one}></span>
              <span className={styles.two}>
                {this.props.text || "查询结果"}
              </span>
            </div>
            {titles.stockName !== undefined ? (
              <div className={styles.ti}>
                <div>
                  <span className={styles.name}>信号日期:</span>
                  <span className={styles.con}>{titles?.tradeDate}</span>
                </div>
                <div className={styles.tiname}>
                  <span className={styles.name}>股票名称:</span>
                  <span className={styles.con}>{titles?.stockName}</span>
                </div>
                <div className={styles.tiname}>
                  <span className={styles.name}>工具名称:</span>
                  <span className={styles.con}>{titles?.productName}</span>
                </div>
                <div className={styles.tiname}>
                  <span className={styles.name}>信号类型:</span>
                  <span className={styles.con}>{titles?.signal}</span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className={styles.btn}>
            <div onClick={this.export}>导出</div>
          </div>
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
          visible={this.state.modalVisible}
          footer={null}
        >
          <Row>
            <Col span={2}>进度:</Col>
            <Col span={22}>
              <Progress
                percent={parseInt(this.state.percent, 10)}
                status={this.state.percent === "100" ? "success" : "active"}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(ExportBtn);