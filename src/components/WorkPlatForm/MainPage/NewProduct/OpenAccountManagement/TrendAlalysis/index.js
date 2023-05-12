import React, { Component } from "react";
import {
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Modal,
  Pagination,
  Progress,
  Row,
  Select,
  Table,
  Checkbox,
  TreeSelect,
  Spin
} from "antd";
import ReactDOMServer from "react-dom/server";
import { connect } from "dva";
import moment from "moment";
import MultipleSearchInput from "../Common/MultipleSearchInput";
import SingleSelect from "../Common/SingleSelect";
import {
  GetBankCodeList,
  QueryChannelAuthorityDepartment,
  GetChannelRecords
} from "$services/newProduct";
import config from "$utils/config";
import TreeUtils from "$utils/treeUtils";
import styles from "./index.less";
import ReactEcharts from "echarts-for-react";
let echarts = require("echarts/lib/echarts");

const activeIndexMap = {
  开户数: 1,
  交易量: 2,
  净资产流入: 3,
  总贡献: 4,
  股基净佣金: 5
};
const showIndexMap = {
  1: "accountNum",
  2: "tradingVolume",
  3: "netAssetInflow",
  4: "contribution",
  5: "commission"
};
const { api } = config;
const {
  newProduct: { getChannelRecordsExport }
} = api;
class TrendAlalysis extends Component {
  state = {
    allYyb: [], // 所有营业部数据
    tjDateActiveKey: 1, // 统计周期选择项
    tjDateRangePickerVisible: false,
    channelValue: [], // 渠道
    groupValue: [], // 二维码名称
    channelVisible: false, // 渠道选择框显隐
    groupVisible: false, // 小组选择框显隐
    department: undefined, // 营业部
    bank: [], // 存管银行
    applSc: "", // 场景
    tjDate: [moment().startOf("year"), moment()], // 统计时间周期
    statcDim: 0, // 展示方式 0|趋势图 1|表格
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    dataSource: [],
    dataSourceCount: {}, // 合计
    percent: 0,
    bankData: [],
    searchValue: "",
    activeIndex: ["开户数", "交易量", "总贡献"],
    showIndex: ["accountNum", "tradingVolume", "contribution"],
    accountNum: [],
    commission: [],
    contribution: [],
    netAssetInflow: [],
    tradingVolume: [],
    showWay: "chart",
    modalVisible: false,
    codeType: "" // 二维码类型
  };
  componentDidMount() {
    this.getBankCodeList();
    this.getDepartments();
    this.fetchData();
  }

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
  fetchData = () => {
    let type = this.state.activeIndex;
    type = type.map(item => activeIndexMap[item]).join(",");
    let monthOrDay = 0;
    if (
      this.state.tjDate[0]?.format("YYYYMM") <
      this.state.tjDate[1]?.format("YYYYMM")
    ) {
      monthOrDay = 1;
    } else {
      monthOrDay = 0;
    }
    let param = {
      channelCode: this.state.channelValue.join(","),
      channelGroup: this.state.groupValue.join(","),
      bank: this.state.bank.join(","),
      dept: this.state.department,
      scene: this.state.applSc,
      beginDate:
        monthOrDay === 1
          ? this.state.tjDate[0]?.format("YYYYMM")
          : this.state.tjDate[0]?.format("YYYYMMDD"),
      endDate:
        monthOrDay === 1
          ? this.state.tjDate[1]?.format("YYYYMM")
          : this.state.tjDate[1]?.format("YYYYMMDD"),
      trendOrtable: this.state.statcDim + "",
      monthOrDay,
      type,
      grpTp: this.state.codeType
    };
    if (this.state.statcDim === 1) {
      param = {
        ...param,
        current: this.state.current,
        pageSize: this.state.pageSize
      };
    }
    this.setState({
      loading: true
    });
    GetChannelRecords(param)
      .then(res => {
        /* res = { "note": "查询成功", "totalrecord": null, "code": 1, "records": [{ "contribution": "0", "myDate": "202109", "accountNum": "20", "tradingVolume": "0" }, { "contribution": "0", "myDate": "202108", "accountNum": "20088", "tradingVolume": "0" }], "Total": 0 }; */
        let accountNum = [],
          commission = [],
          contribution = [],
          netAssetInflow = [],
          tradingVolume = [];
        this.setState({
          showIndex: this.state.activeIndex.map(
            item => showIndexMap[activeIndexMap[item]]
          )
        });
        if (this.state.statcDim === 1) {
          this.setState({
            dataSourceCount: res.totalrecord,
            dataSource: res.records,
            total: res.Total,
            showWay: "table",
            loading: false
          });
        } else {
          res.records.forEach(item => {
            item.accountNum &&
              accountNum.push({ date: item.myDate, data: item.accountNum });
            item.commission &&
              commission.push({ date: item.myDate, data: item.commission });
            item.contribution &&
              contribution.push({ date: item.myDate, data: item.contribution });
            item.netAssetInflow &&
              netAssetInflow.push({
                date: item.myDate,
                data: item.netAssetInflow
              });
            item.tradingVolume &&
              tradingVolume.push({
                date: item.myDate,
                data: item.tradingVolume
              });
          });
          this.setState({
            accountNum,
            commission,
            contribution,
            netAssetInflow,
            tradingVolume,
            showWay: "chart",
            loading: false
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
  //选择指标
  showTjIndex = tjIndex => {
    let activeIndex = this.state.activeIndex;
    if (activeIndex.indexOf(tjIndex) > -1 && activeIndex.length > 1) {
      activeIndex = activeIndex.filter(item => item !== tjIndex);
    } else if (activeIndex.indexOf(tjIndex) === -1 && activeIndex.length < 4) {
      activeIndex.push(tjIndex);
    } else if (activeIndex.length === 4) {
      message.info("至多选择四个指标");
    } else {
      message.info("至少选择一个指标");
    }
    this.setState({
      activeIndex
    });
  };

  // 获取管辖营业部的数据
  getDepartments = () => {
    QueryChannelAuthorityDepartment()
      .then(result => {
        const { records = [] } = result;
        const datas = TreeUtils.toTreeData(
          records,
          {
            keyName: "yybid",
            pKeyName: "fid",
            titleName: "yybmc",
            normalizeTitleName: "title",
            normalizeKeyName: "value"
          },
          true
        );
        let departments = [];
        datas.forEach(item => {
          const { children } = item;
          departments.push(...children);
        });
        this.setState({ departments, allYyb: records });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  // 渠道选择
  channelChange = value => {
    this.setState({
      channelValue: value
    });
  };
  getBankCodeList = () => {
    GetBankCodeList().then(res => {
      this.setState({
        bankData: res.records
      });
    });
  };
  // 二维码名称选择
  groupChange = value => {
    this.setState({
      groupValue: value
    });
  };

  // 营业部选择
  departmentChange = value => {
    this.setState({
      department: value
    });
  };

  // 点击时间周期按钮
  handleClick = activeKey => {
    const map = {
      1: [moment().startOf("year"), moment()],
      2: [
        moment()
          .subtract(1, "years")
          .startOf("year"),
        moment()
          .subtract(1, "years")
          .endOf("year")
      ],
      3: [moment().startOf("month"), moment()],
      4: [moment().subtract(1, "years"), moment()]
    };
    this.setState({ tjDateActiveKey: activeKey, tjDate: map[activeKey] });
  };

  // 点击维度按钮
  handleStatcDimClick = activeKey => {
    this.setState({ statcDim: activeKey });
  };

  // 获取columns
  getColumns = () => {
    let columns = [
      {
        title: "日期",
        key: "日期",
        dataIndex: "myDate",
        render: text => {
          if (text !== "合计") {
            return text.length < 7
              ? moment(text).format("YYYY-MM")
              : moment(text).format("YYYY-MM-DD");
          } else {
            return text;
          }
        }
      },
      {
        title: "开户数",
        key: "开户数",
        dataIndex: "accountNum"
      },
      {
        title: "交易量(万)",
        key: "交易量",
        dataIndex: "tradingVolume"
      },
      {
        title: "净资产流入(万)",
        key: "净资产流入",
        dataIndex: "netAssetInflow"
      },
      {
        title: "总贡献(元)",
        key: "总贡献",
        dataIndex: "contribution"
      },
      {
        title: "股基净佣金(万)",
        key: "股基净佣金",
        dataIndex: "commission"
      }
    ];
    columns = columns.filter(
      item =>
        this.state.showIndex.includes(item.dataIndex) ||
        item.dataIndex === "myDate"
    );
    return columns;
  };

  handleInputChange = e => {
    const value = e.target.value;
    if (
      (Number(value) >= 1 &&
        Number(value) <= 99 &&
        !`${value}`.includes(".")) ||
      `${value}` === ""
    ) {
      this.setState({ applSc: value });
    }
  };

  // 生成uuid
  guid = () => {
    const S4 = () =>
      (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };
  export = () => {
    const exportPercentUtl = "/api/customerAggs/v2/exportPercent"; // 点击导出后系统处理进度信息
    const action = getChannelRecordsExport;
    const uuid = this.guid(); // 获取唯一识别码
    const _this = this;
    let total = this.state.total;
    Modal.confirm({
      title: "提示：",
      content: `是否导出数据（共${total}条）？`,
      okText: "确定",
      cancelText: "取消",
      onOk() {
        let columns = _this.getColumns();
        let tableHeaderCodes = columns.map(item => item.dataIndex).join(",");
        let headerInfo = columns
          .map(item => (typeof item.title === "string" ? item.title : item.key))
          .join(",");
        let type = _this.state.activeIndex;
        type = type.map(item => activeIndexMap[item]).join(",");
        let monthOrDay = 0;
        if (
          _this.state.tjDate[0]?.format("YYYYMM") <
          _this.state.tjDate[1]?.format("YYYYMM")
        ) {
          monthOrDay = 1;
        } else {
          monthOrDay = 0;
        }
        let request = {
          channelCode: _this.state.channelValue.join(","),
          channelGroup: _this.state.groupValue.join(","),
          bank: _this.state.bank.join(","),
          dept: _this.state.department,
          scene: _this.state.applSc,
          beginDate:
            monthOrDay === 1
              ? _this.state.tjDate[0]?.format("YYYYMM")
              : _this.state.tjDate[0]?.format("YYYYMMDD"),
          endDate:
            monthOrDay === 1
              ? _this.state.tjDate[1]?.format("YYYYMM")
              : _this.state.tjDate[0]?.format("YYYYMMDD"),
          trendOrtable: _this.state.statcDim + "",
          monthOrDay,
          type,
          current: 0,
          grpTp: _this.state.codeType
        };
        const exportPayload = JSON.stringify({
          tableHeaderCodes,
          headerInfo,
          request
        });
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

  maxTagPlaceholder = value => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };

  // 格式化treeSelectValue
  formatValue = department => {
    const { allYyb = [] } = this.props;
    department = department ? department.split(",") : [];
    return department.map(val => ({
      value: val,
      label: allYyb.find(item => item.yybid === val)?.yybmc
    }));
  };

  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYyb = [] } = this.props;
    const util = (fid, title) => {
      if (fid === "0") return false;
      for (let item of allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
  };

  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let { department } = this.state;
    if (value.length) {
      department = department ? department.split(",") : [];
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (department.indexOf(item) === -1) department.push(item);
        });
      } else {
        array.forEach(item => {
          if (department.indexOf(item) > -1)
            department.splice(department.indexOf(item), 1);
        });
      }
    } else {
      department = [];
    }
    this.setState({
      searchValue: this.state.searchValue,
      department: department.join(",")
    });
  };

  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  };

  // 搜索营业部变化
  handleYybSearch = value => {
    this.setState({
      searchValue: value
    });
  };
  initLineChart = param => {
    let subTitle = title => {
      switch (title) {
        case "开户数":
          return "单位:  个";
        case "交易量":
          return "单位:  万";
        case "净资产流入":
          return "单位:  万";
        case "总贡献":
          return "单位:  元";
        case "股基净佣金":
          return "单位:  万";
      }
    };
    let xData = [],
      yData = [];
    param.data
      .sort((a, b) => a.date - b.date)
      .forEach(item => {
        xData.push(item.date);
        yData.push(item.data);
      });
    let option = {
      grid: {
        top: 68,
        left: 0,
        right: 40,
        bottom: 0,
        containLabel: true //grid 区域是否包含坐标轴的刻度标签
      },
      //标题
      title: {
        text: param.title,
        left: "-1%",
        textStyle: {
          fontSize: 18,
          color: "#1A2243",
          fontWeight: 400
        },
        subtext: subTitle(param.title),
        subtextStyle: {
          color: "#61698C",
          fontSize: 12 // 副标题文字颜色
        }
      },
      xAxis: {
        data: xData,
        boundaryGap: true,
        splitNumber: 1,
        axisLine: {
          lineStyle: {
            color: "rgba(149, 156, 186, 1)"
          }
        },
        axisTick: {
          show: true,
          alignWithLabel: true
        },
        axisLabel: {
          // interval: xData.length <= 4 ? 'auto' : parseInt(xData.length / 3),
          // rotate: -45,
          formatter: (value, index) => {
            if (value.length < 7) {
              if (moment(value).format("M") === "12") {
                return moment(value).format("YYYY年M月");
              } else {
                return moment(value).format("M月");
              }
            } else {
              return moment(value).format("D日");
            }
          },
          rich: {
            yearStyle: {
              // color: 'red',
            }
          }
        }
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            color: "rgba(235, 236, 242, 1)" //y轴分割线颜色
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: "rgba(97, 105, 140, 1)"
          }
        }
      },
      series: [
        {
          name: `${param.title}`,
          type: "line",
          data: yData,
          lineStyle: {
            color: "#244FFF",
            width: 1
          },
          // symbol: yData.length <= 1 ? 'circle' : 'circle',
          symbol: "circle",
          showSymbol: yData.length <= 1 ? true : false,
          symbolSize: yData.length !== 1 ? 1 : 4,
          itemStyle: {
            color: "#244FFF"
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
              {
                offset: 0,
                color: "rgba(91, 156, 255, 0.07)"
              },
              {
                offset: 1,
                color: "rgba(91, 156, 255, 1)"
              }
            ])
          }
        }
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            color: "#959CBA"
          }
        },
        formatter: params => {
          const jsx = (
            <div style={{ padding: "0 3px", fontSize: "10px" }}>
              <div>
                日期:{" "}
                {moment(params[0].axisValue).format(
                  params[0].axisValue.length < 7
                    ? "YYYY年MM月"
                    : "YYYY年MM月DD日"
                )}
              </div>
              <div>
                {params[0].seriesName}: {params[0].data}
              </div>
            </div>
          );
          return ReactDOMServer.renderToString(jsx);
        }
      }
    };
    return option;
  };

  // 分页器
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };

  // 重置
  reset = () => {
    this.setState({
      tjDateActiveKey: 1, // 统计时间周期选择项
      channelValue: [], // 渠道
      groupValue: [], // 二维码名称
      department: undefined, // 营业部
      searchValue: "",
      bank: [], // 存管银行
      applSc: "", // 场景
      tjDate: [moment().startOf("year"), moment()], // 统计时间周期
      statcDim: 0, // 展示方式
      activeIndex: ["开户数", "交易量", "总贡献"],
      codeType: ""
    });
  };

  // 选中二维码类型
  codeChange = value => {
    this.setState({
      codeType: value
    });
  };
  render() {
    const {
      dataSource = [],
      current,
      pageSize,
      bank,
      bankData,
      activeIndex,
      loading,
      total,
      dataSourceCount,
      tradingVolume,
      netAssetInflow,
      contribution,
      commission,
      accountNum,
      channelVisible,
      groupVisible,
      showIndex,
      codeType
    } = this.state;
    const columns = this.getColumns() || [];
    let item = {};
    let keys = Object.keys(dataSourceCount);
    item["key"] = "total";
    item["myDate"] = "合计";
    keys.forEach(key => {
      item[key] = dataSourceCount[key];
    });
    if (dataSource.find(item => item.key === "total")) {
      dataSource.pop();
      dataSource.push(item);
    } else {
      dataSource.push(item);
    }
    const { trendAlalysis } = this.props.authorities;
    return (
      <div
        style={{
          fontSize: 14,
          color: "#1A2243",
          background: "#FFF",
          overflow: "auto"
        }}
        onClick={() =>
          this.setState({ channelVisible: false, groupVisible: false })
        }
      >
        <Row
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "12px 0 12px 16px"
          }}
        >
          <Row style={{ display: "flex", flexWrap: "wrap" }}>
            <Col
              style={{
                margin: "8px 35px 8px 0",
                display: "flex",
                alignItems: "center"
              }}
            >
              <span style={{ marginRight: 8 }}>统计周期</span>
              <Button
                onClick={() => {
                  this.handleClick(1);
                  this.setState({ tjDateRangePickerVisible: false });
                }}
                className={`${styles.button} ${
                  this.state.tjDateActiveKey === 1 ? styles.activeButton : ""
                }`}
                style={{ height: 30, padding: "0 6px", marginRight: 8 }}
              >
                本年
              </Button>
              <Button
                onClick={() => {
                  this.handleClick(2);
                  this.setState({ tjDateRangePickerVisible: false });
                }}
                className={`${styles.button} ${
                  this.state.tjDateActiveKey === 2 ? styles.activeButton : ""
                }`}
                style={{ height: 30, padding: "0 6px", marginRight: 8 }}
              >
                上年
              </Button>
              <Button
                onClick={() => {
                  this.handleClick(3);
                  this.setState({ tjDateRangePickerVisible: false });
                }}
                className={`${styles.button} ${
                  this.state.tjDateActiveKey === 3 ? styles.activeButton : ""
                }`}
                style={{ height: 30, padding: "0 6px", marginRight: 8 }}
              >
                本月
              </Button>
              <Button
                onClick={() => {
                  this.handleClick(4);
                  this.setState({ tjDateRangePickerVisible: true });
                }}
                className={`${styles.button} ${
                  this.state.tjDateActiveKey === 4 ? styles.activeButton : ""
                }`}
                style={{ height: 30, padding: "0 6px", marginRight: 8 }}
              >
                自定义
              </Button>
              {this.state.tjDateRangePickerVisible && (
                <DatePicker.RangePicker
                  allowClear={false}
                  value={this.state.tjDate}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  style={{ width: "264px" }}
                  placeholder={["开始日期", "结束日期"]}
                  format="YYYY-MM-DD"
                  separator="至"
                  disabledDate={current =>
                    current && current > moment().endOf("day")
                  }
                  onChange={tjDate =>
                    this.setState({ tjDate, tjDateActiveKey: 4 })
                  }
                />
              )}
            </Col>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                margin: "8px 35px 8px 0"
              }}
            >
              <span style={{ marginRight: 8 }}>二维码类型</span>
              <SingleSelect
                selectChange={this.codeChange}
                selectValue={codeType}
              />
            </Col>

            <Col
              style={{
                display: "flex",
                alignItems: "center",
                margin: "8px 35px 8px 0"
              }}
              onClick={e => {
                e.stopPropagation();
                this.setState({ channelVisible: true, groupVisible: false });
              }}
            >
              <span style={{ marginRight: 8 }}>渠道</span>
              <MultipleSearchInput
                channelValue={this.state.channelValue}
                channelChange={this.channelChange}
                source="query"
                visible={channelVisible}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                margin: "8px 35px 8px 0"
              }}
              onClick={e => {
                e.stopPropagation();
                this.setState({ groupVisible: true, channelVisible: false });
              }}
            >
              <span style={{ marginRight: 8, textAlign: "right" }}>
                二维码名称
              </span>
              <MultipleSearchInput
                channelValue={this.state.groupValue}
                channelChange={this.groupChange}
                api="GetGroupInfoModel"
                source="query"
                visible={groupVisible}
              />
            </Col>
            <Col
              style={{
                margin: "8px 35px 8px 0",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div style={{ paddingRight: "8px" }}>开户营业部</div>
              <TreeSelect
                showSearch
                className={styles.treeSelect}
                style={{ width: "200px" }}
                value={this.formatValue(this.state.department)}
                treeData={this.state.departments}
                // dropdownMatchSelectWidth={false}
                dropdownClassName="m-bss-treeSelect"
                dropdownStyle={{ maxHeight: 400, overflowY: "auto" }}
                filterTreeNode={this.filterTreeNode}
                placeholder="营业部"
                allowClear
                multiple
                // searchValue={this.state.searchValue}
                treeDefaultExpandAll
                maxTagCount={3}
                maxTagPlaceholder={value => this.maxTagPlaceholder(value)}
                maxTagTextLength={5}
                treeCheckable={true}
                onChange={this.handleYybChange}
                onSearch={this.handleYybSearch}
                treeCheckStrictly={true}
                // showCheckedStrategy={TreeSelect.SHOW_ALL}
              />
            </Col>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                margin: "8px 35px 8px 0"
              }}
            >
              <span style={{ marginRight: 8 }}>存管银行</span>
              <Select
                placeholder="请选择存管银行"
                className={styles.mulSelect}
                showArrow={bank.length === 0}
                allowClear={true}
                mode="multiple"
                defaultActiveFirstOption={false}
                maxTagCount={3}
                maxTagPlaceholder={value => this.maxTagPlaceholder(value)}
                maxTagTextLength={7}
                menuItemSelectedIcon={e => {
                  return (
                    bankData.length > 0 &&
                    e.value !== "NOT_FOUND" && (
                      <Checkbox
                        checked={
                          bank.filter(key => {
                            return key === e.value;
                          }).length > 0
                        }
                      ></Checkbox>
                    )
                  );
                }}
                onChange={bank => this.setState({ bank })}
                filterOption={(input, option) =>
                  option.props.children.indexOf(input) !== -1
                }
                value={bank}
                dropdownRender={menu => (
                  <div className="m-bss-select-checkbox">
                    <div className="m-bss-select-dropdown">{menu}</div>
                  </div>
                )}
              >
                {bankData.map(item => (
                  <Select.Option key={item.orgCode} value={item.orgCode}>
                    {item.orgName}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                margin: "8px 35px 8px 0"
              }}
            >
              <span style={{ marginRight: 8 }}>场景</span>
              <Input
                value={this.state.applSc}
                onChange={this.handleInputChange}
                type="number"
                min={1}
                max={99}
                style={{ width: 160, height: 30 }}
                placeholder="场景1-99"
              />
            </Col>
          </Row>
          <Row style={{ display: "flex", margin: "4px 0 4px 0" }}>
            <Col style={{ margin: "8px 35px 8px 0" }}>
              <span style={{ marginRight: 8 }}>统计指标</span>
              <span
                className={`${styles.tjIndex} ${
                  activeIndex.indexOf("开户数") > -1 ? styles.activeIndex : ""
                }`}
                onClick={() => this.showTjIndex("开户数")}
              >
                开户数
              </span>
              <span
                className={`${styles.tjIndex} ${
                  activeIndex.indexOf("交易量") > -1 ? styles.activeIndex : ""
                }`}
                onClick={() => this.showTjIndex("交易量")}
              >
                交易量
              </span>
              <span
                className={`${styles.tjIndex} ${
                  activeIndex.indexOf("净资产流入") > -1
                    ? styles.activeIndex
                    : ""
                }`}
                onClick={() => this.showTjIndex("净资产流入")}
              >
                净资产流入
              </span>
              <span
                className={`${styles.tjIndex} ${
                  activeIndex.indexOf("总贡献") > -1 ? styles.activeIndex : ""
                }`}
                onClick={() => this.showTjIndex("总贡献")}
              >
                总贡献
              </span>
              <span
                className={`${styles.tjIndex} ${
                  activeIndex.indexOf("股基净佣金") > -1
                    ? styles.activeIndex
                    : ""
                }`}
                onClick={() => this.showTjIndex("股基净佣金")}
              >
                股基净佣金
              </span>
            </Col>
            <Col style={{ margin: "8px 35px 8px 0" }}>
              <span style={{ marginRight: 8 }}>展示方式</span>
              <Button
                onClick={() => this.handleStatcDimClick(0)}
                className={`${styles.button} ${
                  this.state.statcDim === 0 ? styles.activeButton : ""
                }`}
                style={{ height: 30, padding: "0 6px", marginRight: 8 }}
              >
                趋势图
              </Button>
              <Button
                onClick={() => this.handleStatcDimClick(1)}
                className={`${styles.button} ${
                  this.state.statcDim === 1 ? styles.activeButton : ""
                }`}
                style={{ height: 30, padding: "0 6px", marginRight: 8 }}
              >
                表格
              </Button>
            </Col>
            <Col style={{ margin: "8px 35px 8px 0", display: "flex" }}>
              <Button
                style={{
                  minWidth: 60,
                  height: 30,
                  width: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                className="m-btn-radius ax-btn-small"
                type="button"
                onClick={this.reset}
              >
                重置
              </Button>
              <Button
                style={{
                  minWidth: 60,
                  height: 30,
                  width: 60,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                className="m-btn-radius ax-btn-small m-btn-blue"
                type="button"
                onClick={this.fetchData}
              >
                查询
              </Button>
            </Col>
          </Row>
        </Row>
        {this.state.showWay === "table" ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0 16px 8px 0"
              }}
            >
              <div></div>
              {trendAlalysis?.includes("trendAlalysisExport") && (
                <Button
                  style={{ width: 60, height: 30 }}
                  className="m-btn-radius ax-btn-small m-btn-blue"
                  type="button"
                  onClick={() => this.export()}
                >
                  导出
                </Button>
              )}
            </div>

            <div style={{ padding: "0 16px", overflow: "auto" }}>
              <Table
                rowKey="myDate"
                bordered
                loading={loading}
                className={styles.totalRow}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                total={total}
              />
              <div style={{ float: "right", margin: "16px 0 0 0" }}>
                <Pagination
                  size="small"
                  showLessItems
                  showQuickJumper
                  showSizeChanger
                  pageSizeOptions={["10", "20", "50", "100"]}
                  className={`${styles.pagination}  ${styles.smallPagination}`}
                  pageSize={pageSize}
                  current={current}
                  total={this.state.total}
                  onChange={this.handlePageChange}
                  onShowSizeChange={(current, pageSize) =>
                    this.handlePageChange(1, pageSize)
                  }
                />
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
          </>
        ) : (
          <Spin spinning={loading} wrapperClassName={styles.spinBox}>
            {showIndex.includes("accountNum") && (
              <ReactEcharts
                key={"accountNum"}
                option={this.initLineChart({
                  title: "开户数",
                  data:
                    accountNum.length < 1
                      ? [
                          {
                            date: this.state.tjDate[0]?.format("YYYYMM"),
                            data: "0"
                          }
                        ]
                      : accountNum
                })}
                style={{
                  height: "320px",
                  width: "528px",
                  marginBottom: "30px",
                  float: "left"
                }}
              />
            )}
            {showIndex.includes("tradingVolume") && (
              <ReactEcharts
                key={"tradingVolume"}
                option={this.initLineChart({
                  title: "交易量",
                  data:
                    tradingVolume.length < 1
                      ? [
                          {
                            date: this.state.tjDate[0]?.format("YYYYMM"),
                            data: "0"
                          }
                        ]
                      : tradingVolume
                })}
                style={{
                  height: "320px",
                  width: "528px",
                  marginBottom: "30px",
                  float: "left"
                }}
              />
            )}
            {showIndex.includes("netAssetInflow") && (
              <ReactEcharts
                key={"netAssetInflow"}
                option={this.initLineChart({
                  title: "净资产流入",
                  data:
                    netAssetInflow.length < 1
                      ? [
                          {
                            date: this.state.tjDate[0]?.format("YYYYMM"),
                            data: "0"
                          }
                        ]
                      : netAssetInflow
                })}
                style={{
                  height: "320px",
                  width: "528px",
                  marginBottom: "30px",
                  float: "left"
                }}
              />
            )}
            {showIndex.includes("contribution") && (
              <ReactEcharts
                key={"contribution"}
                option={this.initLineChart({
                  title: "总贡献",
                  data:
                    contribution.length < 1
                      ? [
                          {
                            date: this.state.tjDate[0]?.format("YYYYMM"),
                            data: "0"
                          }
                        ]
                      : contribution
                })}
                style={{
                  height: "320px",
                  width: "528px",
                  marginBottom: "30px",
                  float: "left"
                }}
              />
            )}
            {showIndex.includes("commission") && (
              <ReactEcharts
                key={"commission"}
                option={this.initLineChart({
                  title: "股基净佣金",
                  data:
                    commission.length < 1
                      ? [
                          {
                            date: this.state.tjDate[0]?.format("YYYYMM"),
                            data: "0"
                          }
                        ]
                      : commission
                })}
                style={{
                  height: "320px",
                  width: "528px",
                  marginBottom: "30px",
                  float: "left"
                }}
              />
            )}
            {/* {activeIndex.map(item => <ReactEcharts key={item} option={this.initLineChart({ title: item })} style={{ height: '320px', width: '528px', marginBottom: '30px', marginLeft: '20px', float: 'left' }} />)} */}
          </Spin>
        )}
      </div>
    );
  }
}

export default connect(({ global }) => ({
  sysParam: global.sysParam,
  authorities: global.authorities,
  dictionary: global.dictionary
}))(TrendAlalysis);
