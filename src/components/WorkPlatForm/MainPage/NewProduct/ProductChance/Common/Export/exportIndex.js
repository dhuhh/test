import React, { Component } from "react";
import { Modal, Divider, message, Progress, Row, Col } from "antd";
import { connect } from "dva";
import config from "$utils/config";
import "./export.css";
const { ftq } = config;
const {
  newProduct: { queryDepartIndexValueExport, getAIGridStockPoolExport }
} = ftq;

class TableBtn extends Component {
  state = {
    // visible: false,
    data: [],
    modalVisible: false,
    percent: 0,
    c4Visible: false,
    c4Type: undefined
  };

  exportApi = type => {
    switch (type) {
      case 1:
        return queryDepartIndexValueExport;
      default:
        return getAIGridStockPoolExport;
    }
  };
  // 生成uuid
  guid = () => {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };
  export = flag => {
    console.log("开始导出");
    const exportPercentUtl = "/api/customerAggs/v2/exportPercent"; // 点击导出后系统处理进度信息
    const action = this.exportApi(this.props.type); //根据传入的props来判断上传方法
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this; //拷贝this指向
    let total = this.props.total || 0; //获取传递过来的数据条数
    if (total > 40000) {
      //对数据条数进行判断
      Modal.info({ content: "导出数据不能超过4万条!" });
      return;
    } else if (total <= 0) {
      Modal.info({ content: "暂无数据可导出!" });
      return;
    }
    //如果通过判断就进入弹窗确认，准备导出
    Modal.confirm({
      title: "提示：",
      content: `是否导出数据（共${total}条）？`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        //console.log(_this.props);
        //点击确认之后的操作
        let columns = _this.props.getColumns(); //获取表格结构
        console.log(_this.props.getColumns());
        //将表格数组中的dataIndex取出来放进数组中，并且不要等于phone的
        let tableHeaderCodes = columns.map(item =>
          item.dataIndex === "profitAnnual"
            ? "profitAnnualPercent"
            : item.dataIndex
        );
        //将表格中的title标题取出来放到数组中
        let headerInfo = columns.map(item => {
          return item.title;
        });
        headerInfo = headerInfo.join(","); //数组转换字符串
        tableHeaderCodes = tableHeaderCodes.join(","); //数组转换为字符串
        console.log(tableHeaderCodes);
        let param = _this.props.param(); //获取查询参数
        //console.log(columns, "columns");
        const exportPayload = JSON.stringify({
          headerCodeList: tableHeaderCodes,
          headerList: headerInfo,
          pageNo: 1,
          pageSize: 99999,
          sortField: "",
          sortType: ""
        }); //将上面的数据放在一起转换成为json格式
        console.log(exportPayload, "exportPayload");
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
      }
    });
  };
  render() {
    // const { data } = this.state;
    return (
      <>
        <div onClick={this.export} className="exportIn">
          <span>导出数据</span>
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
      </>
    );
  }
}
export default connect(({ global }) => ({
  sysParam: global.sysParam
}))(TableBtn);
