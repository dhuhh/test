import React, { useState, useEffect } from 'react';
import { Link } from 'dva/router';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts-liquidfill/src/liquidFill.js';
import { Row, Col, Card, message } from 'antd';
import { FetchMyStatistics } from '@/services/home/home';
import styles from './index.less';

function Liquidfill(props) {
  const [staData, setStaData] = useState([]);
  const [typeToShowLiquidFillDesc, setTypeToShowLiquidFillDesc] = useState('');

  useEffect(() => {
    fetchMyStatisticsList();
  }, []);

  // 调用端口获取我的统计基本信息
  const fetchMyStatisticsList = async () => {
    await FetchMyStatistics({
    }).then((data) => {
      const { records = [] } = data || {};
      setStaData(records);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    // setStaData([{
    //   alreadyDealNum: '',
    //   tips: '',
    //   totalRecordNum: '0',
    //   type: '1',
    //   typeDesc: '运营任务',
    //   url: '/OPERATIONALTASKS/?QUERY_TYPE=2',
    // }, {
    //   alreadyDealNum: '348',
    //   tips: '1',
    //   totalRecordNum: '2512',
    //   type: '2',
    //   typeDesc: '流程提醒',
    //   url: '/UIProcessor?Table=WORKFLOW_TOTASKS',
    // }, {
    //   alreadyDealNum: '',
    //   tips: '回家撒旦圣诞节和实践活动我',
    //   totalRecordNum: '0',
    //   type: '3',
    //   typeDesc: '站内消息',
    //   url: '/UIProcessor?Table=WORKFLOW_TOTASKS',
    // }, {
    //   alreadyDealNum: '',
    //   tips: '',
    //   totalRecordNum: '0',
    //   type: '4',
    //   typeDesc: '风控事件',
    //   url: '/UIProcessor?Table=WORKFLOW_TOTASKS',
    // }]);
  };

  const getCharts = (datas, key) => {
    const { totalRecordNum, type, url, tips, typeDesc, alreadyDealNum } = datas;
    // tooltip提示语
    let tooltipText;
    // 链接url
    let linkUrl;
    switch (type) {
      case '1': tooltipText = tips; linkUrl = url;
        break;
      case '2': tooltipText = tips; linkUrl = url;
        break;
      case '3': tooltipText = tips; linkUrl = url;
        break;
      case '4': tooltipText = tips; linkUrl = url;
        break;
      default: tooltipText = ''; linkUrl = '';
        break;
    }
    const colors = {
      1: 'rgb(139, 155, 225)',
      2: 'rgb(198, 49, 54)',
      3: 'rgb(129, 184, 245)',
      4: 'rgb(248, 197, 92)',
    };
    const colorsBack = {
      1: 'rgba(139, 155, 225, 0.5)',
      2: 'rgba(198, 49, 54, 0.5)',
      3: 'rgba(129, 184, 245, 0.5)',
      4: 'rgba(248, 197, 92, 0.5)',
    };
    // 构造echarts水球图
    const option = {
      series: [{
        type: 'liquidFill',
        backgroundStyle: {
          color: '#eeeeee',
          shadowColor: 'rgba(0, 0, 0, 0)',
          shadowBlur: 0,
        },
        data: [{
          value: Number.parseFloat(alreadyDealNum / totalRecordNum),
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0,
          },
        }, {
          value: Number.parseFloat(alreadyDealNum / totalRecordNum),
          direction: 'left',
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0,
            color: colorsBack[type],
          },
        }],
        radius: '80%',
        color: [colors[type]],
        outline: {
          show: false,
        },
        label: {
          show: false,
        },
      },
      {
        type: 'pie',
        radius: ['90%', '100%'],
        avoidLabelOverlap: false,
        clockwise: false,
        hoverOffset: 0,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          {
            value: (alreadyDealNum / totalRecordNum) * 100,
            name: '未完成',
            itemStyle: {
              color: colors[type],
            },
          },
          {
            value: 100 - ((alreadyDealNum / totalRecordNum) * 100),
            name: '已完成',
            itemStyle: {
              color: '#e5e8eb',
            },
          },
        ],
      },
      ],
    };
    const progressBarOption = {
      color: [[colors[type]], '#e5e8eb'],
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: false,
        width: '100%',
        height: '100%',
      },
      xAxis: {
        type: 'value',
        show: false,
      },
      yAxis: {
        show: false,
        type: 'category',
        data: ['百分比'],
      },
      series: [{
        name: '当日完成',
        type: 'bar',
        stack: '总量',
        data: [Number.parseFloat((alreadyDealNum / totalRecordNum) * 100)],
        legendHoverLink: false,
        itemStyle: {
          shadowBlur: 0,
          shadowColor: 'rgba(0,0,0,0)',
        },
      },
      {
        name: '当日总数',
        type: 'bar',
        legendHoverLink: false,
        stack: '总量',
        data: [100 - Number.parseFloat((alreadyDealNum / totalRecordNum) * 100)],
        emphasis: {
          itemStyle: {
            color: '#e5e8eb',
          },
        },
        itemStyle: {
          shadowBlur: 0,
          shadowColor: 'rgba(0,0,0,0)',
        },
      }],
    };

    return (
      <Col xs={24} sm={24} lg={12} xl={12} xxl={handleNumber()} key={key}>
        <Link to={linkUrl}>
          <Card className={`${styles.selfCard} m-card`}>
            <div
              className="m-chartCard"
              style={{ marginRight: '0.166rem', cursor: 'default' }}
              tabIndex="-1"
              typetoshow={type}
              onMouseEnter={handleLiquidFillDivMouseEnter}
              onMouseLeave={handleLiquidFillDivMouseLeave}
            >
              <div className="m-chartLeft">
                <ReactEchartsCore
                  echarts={echarts}
                  style={{ height: '4rem', width: '4rem' }}
                  option={option}
                  notMerge
                  lazyUpdate
                  theme="theme_name"
                />
              </div>

              <div className="m-chartCenter">
                <span>{typeDesc}</span>
                <div className="m-contentFixed">
                  <ReactEchartsCore
                    echarts={echarts}
                    style={{ height: '0.333rem', width: '100%' }}
                    option={progressBarOption}
                    notMerge
                    lazyUpdate
                    theme="theme_name"
                  />
                </div>
              </div>
              <div className="m-chartRight">
                <span>{totalRecordNum}</span>
              </div>
              <div className="m-chartCard-rose" style={{ display: typeToShowLiquidFillDesc === type ? 'block' : 'none', marginLeft: '-3rem' }}>
                <div className="m-chartCard-roseMain">
                  <span>{tooltipText}</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </Col>
    );
  };
  const handleLiquidFillDivMouseEnter = (e) => {
    const typeToShow = e.currentTarget.getAttribute('typetoshow');
    setTypeToShowLiquidFillDesc(typeToShow);
  };
  const handleLiquidFillDivMouseLeave = () => {
    setTypeToShowLiquidFillDesc('');
  };

  const handleNumber = () => {
    const len = staData.length;
    let number;
    if (len === 4) {
      number = 6;
    } else if (len === 3) {
      number = 8;
    } else if (len === 2) {
      number = 12;
    } else if (len === 1) {
      number = 24;
    }
    return number;
  };

  return (
    <Card className={`${styles.selfCard} m-card m-card-shadow`}>
      <Row className="">
        {staData.map(item => getCharts(item, item.type))}
      </Row>
    </Card>
  );
}

export default Liquidfill;
