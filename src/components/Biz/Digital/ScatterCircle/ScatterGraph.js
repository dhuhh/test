import React from 'react';
import { message, Row, Col, Spin } from 'antd';
import lodash from 'lodash';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/brush';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { FetchScatterCircle, FetchScatterCircleList } from '../../../../services/cusgroupbase';
import BasicDataTable from '../../../Common/BasicDataTable';
import SetGroup from '../../../WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/SetGroup';

let echartsInstance = null;
class ScatterGraph extends React.Component {
  state = {
    scatterData: [],
    isCusIdTrue: false,
    fieldsCode: ['customer_id', 'customer_name', 'customer_no', 'fund_account', 'phone', 'sex_name', 'net_assets.merge', 'department_name'],
    selectedDatas: {
      selectedCount: 0,
      selectAll: false,
      selectedRowKeys: [],
    },
    showTable: false,
    loading: true,
    echartsLoading: false,
    dataSource: [],
    tableDatas: {
      columns: [
        { title: '客户姓名', dataIndex: 'customer_name', key: 'customer_name', render: text => text || '--' },
        { title: '客户号', dataIndex: 'customer_no', key: 'customer_no', render: text => text || '--' },
        { title: '营业部', dataIndex: 'department_name', key: 'department_name', render: text => text || '--' },
        { title: '资金账号', dataIndex: 'fund_account', key: 'fund_account', render: text => text || '--' },
        { title: '客户性别', dataIndex: 'sex_name', key: 'sex_name', render: text => text || '--' },
        { title: '柜台手机', dataIndex: 'phone', key: 'phone', render: text => text || '--' },
        { title: '合并户净资产(元)', dataIndex: 'net_assets.merge', key: 'net_assets.merge', render: text => text || '--' },
      ],
      pagination: {
        paging: 1,
        current: 1,
        total: 0,
      },
      xData: this.props.xData || '',
      yData: this.props.yData || '',
      legendName: this.props.legendName || [],
    },
    circleModel: {}, // 散点圈人列表查询参数
    symbolUuid: '', // 散点圈人列表查询参数保存的uuid
  };

  componentDidMount() {
    echartsInstance = this.echarts_react.getEchartsInstance();
    const { xData, yData, legendName, error } = this.props;
    this.fetchData(xData, yData, legendName, error);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.xData !== nextProps.xData || this.props.yData !== nextProps.yData || this.props.legendName !== nextProps.legendName) {
      this.fetchData(nextProps.xData, nextProps.yData, nextProps.legendName, nextProps.error);
      this.setState({
        xData: nextProps.xData,
        yData: nextProps.yData,
        legendName: nextProps.legendName,
      });
    }
  }

  // 页面切换
  onChangePag = (page) => {
    const { tableDatas: { columns } } = this.state;
    this.setState({
      tableDatas: {
        columns,
        pagination: {
          current: page,
        },
      },
    });
    this.fetchCircleData(page, false);
  }

  fetchData = (xData, yData, legendName, ParmsError) => { // eslint-disable-line
    const { params = {} } = this.props;
    if (ParmsError) {
      return;
    }
    FetchScatterCircle({
      xData,
      yData,
      legendData: legendName,
      ...params,
    }).then((ret = {}) => {
      const { code = 0, records = [], isCusId = '1', xAvg = '', yAvg = '' } = ret;
      if (code > 0) {
        const tmpl = records.map(m => m || {});
        this.setState({
          scatterData: tmpl,
          isCusIdTrue: isCusId,
          xAvg,
          yAvg,
          xData,
          yData,
          legendName,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // 圈人后的数据
  fetchCircleData = (page, resetPage = false) => {
    const { params = {} } = this.props;
    const { circleDotData = {}, fieldsCode, legendName, tableDatas: { columns } } = this.state;
    this.setState({ loading: true });
    FetchScatterCircleList({
      fieldsCode,
      ...circleDotData,
      legendName,
      pageNo: page,
      ...params,
      pageSize: 10,
    }).then((ret = {}) => {
      const { code = 0, data = [], count, pageNo, symbolUuid = '' } = ret;
      if (code > 0) {
        this.setState({
          circleModel: {
            ...circleDotData,
            legendName,
          },
          loading: false,
          dataSource: data,
          tableDatas: {
            columns,
            pagination: {
              total: count,
              current: pageNo,
            },
          },
          symbolUuid,
        }, () => {
          if (resetPage) {
            this.handleSelectChange([], [], false);
          }
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  onChartReady = (e) => {
    if (e) {
      e.on('brushSelected', (t) => {
        const { scatterData, isCusIdTrue = false, xAvg = '', yAvg = '', xData = '', yData = '' } = this.state;
        const selected = lodash.get(t, 'batch[0].selected', []);
        let isSelected = false;
        selected.forEach((element) => {
          const { dataIndex = [] } = element;
          if (dataIndex.length > 0) {
            isSelected = true;
          }
        });
        console.info('selected:', selected);
        if (!isSelected) {
          const areas = lodash.get(t, 'batch[0].areas', []);
          if (areas.length > 0) {
            message.info('未选中点!');
            if (echartsInstance) {
              echartsInstance.dispatchAction({
                type: 'restore',
              });
            }
          }
          return false;
        }
        const cusIds = [];
        const yCondition = [];
        const legendCondition = [];
        let type = 0;
        let hasOrigin = false;
        selected.forEach((item) => {
          const { seriesName = '', dataIndex = [] } = item;
          if (!legendCondition.includes(seriesName)) {
            legendCondition.push(seriesName);
          }
          dataIndex.forEach((m) => {
            const scatterLegendData = scatterData.filter(v => v.legendValue === seriesName);

            if (scatterLegendData[m].xValue === '0' && scatterLegendData[m].yValue === '0') {
              hasOrigin = true;
            }
            if (isCusIdTrue === '1') { // 直接返回的customer_id x轴y轴都没聚合
              type = isCusIdTrue;
              const cusId = lodash.get(scatterLegendData, `[${m}].id`, '');
              if (cusId) {
                const cusIdArr = cusId.split(',');
                cusIdArr.forEach((id) => {
                  cusIds.push(id);
                });
              }
            } else {
              type = isCusIdTrue;
              const xv = scatterLegendData[m].xValue;
              const yv = scatterLegendData[m].yValue;
              const param = {
                xvalue: xv,
                yvalue: yv,
              };
              yCondition.push(param);
            }
          });
        });
        // 去除X 和 Y 都一样的点
        // const obj = {};
        // const dotDataList = yCondition.reduce((item, next) => {
        //   obj[next.xvalue] ? '' : obj[next.xvalue] = true && obj[next.yvalue] ? '' : obj[next.yvalue] = true && item.push(next);
        //   return item;
        // }, []);
        const dotDataList = [];
        const obj = [];
        let str;
        for (let i = 0; i < yCondition.length; i++) {
          str = JSON.stringify(yCondition[i]);
          if (obj.indexOf(str) === -1) {
            dotDataList.push(yCondition[i]);
            obj.push(str);
          }
        }
        this.setState({
          showTable: true,
          circleDotData: {
            dotDataList,
            legendData: legendCondition,
            xname: xData,
            yname: yData,
            xAvgVal: xAvg,
            yAvgVal: yAvg,
            type,
            selCustomerNo: cusIds,
            hasOrigin: hasOrigin ? 1 : 0,
          },
        });
        this.fetchCircleData(1, true);
      });
    }
  };

  assembleOption = () => {
    const { scatterData = [] } = this.state;
    const legendName = [];
    const itemStyle = {
      opacity: 0.8,
      shadowBlur: 10,
      shadowColor: 'rgba(120, 36, 50, 0.5)',
      shadowOffsetY: 5,
    };
    // 构建option数据
    scatterData.forEach((item = {}) => {
      const { legendValue } = item;
      if (!legendName.includes(legendValue)) {
        legendName.push(legendValue);
      }
    });

    const data = [];
    legendName.forEach((item, index) => {
      data[index] = [];
    });
    scatterData.forEach((item = {}) => {
      const { legendValue, xValue = 0, yValue = 0, count = 0, showNum = 1, id } = item;
      legendName.forEach((v, index) => {
        if (legendValue === v) {
          const oneData = [];
          oneData.push(xValue);
          oneData.push(yValue);
          oneData.push(count);
          oneData.push(showNum);
          oneData.push(id);
          data[index].push(oneData);
        }
      });
    });
    // 构建series数据
    const seriesData = [];
    legendName.forEach((name, index) => {
      seriesData.push({
        name,
        type: 'scatter',
        symbolSize(val) {
          return val[3] * 10;
        },
        data: data[index],
        itemStyle,
      });
    });
    // 构建option
    const option = {
      color: ['#d1625f', '#fbc850', '#54a9df', '#9caff6', '#4a7ce3', ' #9cc5b0', '#e88e6c', ' #6e7074', ' #76a4ab', ' #7d92c1', ' #eacbb7', '#7aa986', '  #c4a0e9', ' #c5cbd2', '   #f0aeaf'],
      grid: {
        left: '3%',
        right: '7%',
        bottom: '3%',
        containLabel: true,
      },
      backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 1.8, [{
        offset: 0,
        color: '#fff',
      }, {
        offset: 1,
        color: '#cdd0d5',
      }]),
      tooltip: {
        padding: 10,
        borderWidth: 1,
        formatter(obj) {
          const value = lodash.get(obj, 'value', []);
          return `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">
          ${lodash.get(obj, 'seriesName', '--')} : ${lodash.get(value, '[2]', '0')}</div>
          ${lodash.get(value, '[0]', '0')} : ${lodash.get(value, '[1]', '0')}<br>`;
        },
      },
      toolbox: {
        show: true,
        top: 10,
        right: 20,
        feature: {
          dataZoom: {},
          brush: {
            type: ['rect', 'polygon', 'clear'],
          },
        },
      },
      brush: {
        throttleType: 'debounce',
        throttleDelay: 1000,
      },
      legend: {
        data: legendName || [],
        left: 'center',
      },
      xAxis: [
        {
          type: 'value',
          scale: true,
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
      ],
      series: seriesData || [],
    };
    console.info('seriesData:', seriesData);
    return option;
  };

  handleSelectChange = (selectedRows, currentSelectedRowKeys, selectAll) => {
    const { tableDatas: { pagination: { total = 0 } } } = this.state;
    let selectedCount = 0;
    if (selectAll) {
      selectedCount = total - selectedRows.length;
    } else {
      selectedCount = selectedRows.length;
    }
    this.setState({
      selectedDatas: {
        selectedRowKeys: selectedRows,
        selectAll,
        selectedCount,
      },
    });
  };

  getTargetName=(data = [], id)=>{
    let name = '';
    if(Array.isArray(data) && id){
      data.forEach(i => {
        if(i.ES_CODE === id)
          name = i.INDEX_NAME;
      });
    }
    return name;
  }

  render() {
    const { userBasicInfo, customerQueryType, params, parsedQueryParameter, xyTargetData, legendData, refreshPlanCard } = this.props;
    const { showTable, loading, dataSource, tableDatas: { columns = [], pagination: { total, current } }, selectedDatas = {}, echartsLoading, symbolUuid } = this.state;
    const { selectAll = false, selectedRowKeys = [] } = selectedDatas;
    const { xData, yData, legendName } = this.state;
    const maxPagers = total > 10 * 100 ? 10 * 100 : total;
    const tableProps = {
      rowKey: 'customer_id',
      loading, // 是否显示加载中
      className: 'm-table-customer m-table-bortop',
      columns,
      dataSource,
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: total !== 0, // checkbox开启跨页全选
        selectAll, // 是否全选
        selectedRowKeys, // 选中(未全选)/取消选中(全选)的rowkey值
        onChange: this.handleSelectChange, // 选择状态改变时的操作
      },
      pagination: {
        className: 'm-paging m-paging-szyx',
        showTotal: () => `共${total}条`,
        showLessItems: true,
        showSizeChanger: false,
        showQuickJumper: true,
        total: maxPagers,
        current,
        pageSize: 10,
        onChange: this.onChangePag,
      },
    };
    // 创建客群-查询规则
    const cxgz = [];
    cxgz.push(
      {
        title: '散点圈人',
        bh: `X轴指标：${this.getTargetName(xyTargetData, xData)};Y轴指标：${this.getTargetName(xyTargetData, yData)};维度：${this.getTargetName(legendData, legendName)}`,
      });

    return (
      <React.Fragment>
        <Spin spinning={echartsLoading} tip="数据加载中...">
          <ReactEchartsCore
            ref={(e) => { this.echarts_react = e; }}
            echarts={echarts}
            option={this.assembleOption()}
            onChartReady={this.onChartReady}
            notMerge
            lazyUpdate
            style={{ height: '30rem', width: '100%' }}
            theme=""
          />
        </Spin>
        { showTable && (
          <Row style={{ margin: '1rem 0' }}>
            <Col span={2}>
              <SetGroup
                {...params}
                {...selectedDatas}
                uuid={symbolUuid}
                scene='22' // 22表示使用uuid建群
                userBasicInfo={userBasicInfo}
                customerQueryType={customerQueryType}
                queryParameter={parsedQueryParameter}
                cxgz={cxgz}
                refreshPlanCard={refreshPlanCard}
                // eslint-disable-next-line eqeqeq
                showAddGroupAndCreateActivityBtn={customerQueryType == '1'}
              />
            </Col>
            <div style={{ float: 'right', fontSize: '1.3rem' }}>覆盖: <span style={{ color: '#f7b432' }}>{total}</span>个客户</div>
          </Row>
        )}
        { showTable && (
          <BasicDataTable
            {...tableProps}
          />
        )
        }
      </React.Fragment>
    );
  }
}

export default ScatterGraph;
