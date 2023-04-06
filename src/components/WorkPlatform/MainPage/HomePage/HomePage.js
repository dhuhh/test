/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import { FetchDisplayBlocks } from '@/services/home/home';
import SchCalendar from './SchCalendar';
import MyUpcoming from './MyUpcoming';
import Liquidfill from './Liquidfill';
import SetHome from './SetHome';
import ProductStatistics from './ProductStatistics';

const { Fragment } = React;

function HomePage(props) {
  const [configureData, setConfigureData] = useState([]);

  // 首页展示模块查询
  const fetchConfigure = () => {
    // setConfigureData([{
    //   icon: 'icon-xiaoxizhongxin',
    //   id: '1',
    //   name: '消息概况',
    //   order: '0.0',
    // }, {
    //   icon: 'icon-deal',
    //   id: '2',
    //   name: '我的待办',
    //   order: '20.0',
    // }, {
    //   icon: 'icon-calendarLine',
    //   id: '3',
    //   name: '产品日历',
    //   order: '40.0',
    // }]);
    FetchDisplayBlocks({}).then((response) => {
      const { records = [] } = response || {};
      setConfigureData(records.slice(0, 7));
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  useEffect(() => {
    fetchConfigure();
  }, []);


  // 宽度变化
  const handleStyle = (index) => {
    let width;
    switch (index) {
      case 1:
        width = 10;
        break;
      case 2:
        width = 12;
        break;
      case 3:
        width = 14;
        break;
      case 4:
        width = 24;
        break;
      default:
        break;
    }
    return width;
  };

  const { parentUrl, userBasicInfo } = props;
  return (
    <Fragment>
      {/* 先把右上角的setHome小图标暂时隐藏 */}
      {/* <SetHome fetchConfigure={fetchConfigure} /> */}
      <Row className="m-row">
        {
          configureData.map((item, index) => {
            if (item.name === '消息概况') {
              let datas = [];
              if (JSON.parse(item.displayParam)) {
                const data = JSON.parse(item.displayParam);
                datas = data;
              }
                return (
                  <Col
                    key={index}
                    xs={24}
                    sm={24}
                    lg={24}
                    // xl={handleStyle(4)}
                    xl={handleStyle(datas.w)}
                  >
                    <div>
                      <Liquidfill />
                    </div>
                  </Col>
                );
            } else if (item.name === '我的待办') {
              let datas = [];
              if (JSON.parse(item.displayParam)) {
                const data = JSON.parse(item.displayParam);
                datas = data;
              }
              return (
                <Col
                  key={index}
                  xs={24}
                  sm={24}
                  lg={24}
                  xl={handleStyle(datas.w)}
                  // xl={handleStyle(2)}
                >
                  <MyUpcoming {...props} parentUrl={parentUrl} />
                </Col>
              );
            } else if (item.name === '产品日历') {
              let datas = [];
              if (JSON.parse(item.displayParam)) {
                const data = JSON.parse(item.displayParam);
                datas = data;
              }
              return (
                <Col
                  key={index}
                  xs={24}
                  sm={24}
                  lg={24}
                  // xl={handleStyle(2)}
                  xl={handleStyle(datas.w)}
                >
                  <SchCalendar {...props} userBasicInfo={userBasicInfo} />
                </Col>
              );
            }
            // return index + 2;
          })
        }
      </Row>
    </Fragment>
  );
}

export default HomePage;

