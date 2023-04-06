
import React from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { Row, Col, message, Switch, Spin, Button } from 'antd';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FetchConfigureBlocksUpdate, FetchConfigureBlockS } from '../../../../../../services/home/home';
import Liquidfill from './Liquidfill';
import MyUpcoming from './MyUpcoming';
import SchCalendar from './SchCalendar';
import SalesOverview from './SalesOverview';
import styles from '../index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS('layouts') || {};

class PanelSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staData: [],
      rightStaData: [],
      defaultChecked: 0,
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      dragData: [],
    };
  }

  componentDidMount() {
    this.fetchConfigureBlocks();
    this.fetchConfigureBlock();
  }

  resetLayout = () => {
    this.setState({ layouts: {} });
  }

  onLayoutChange = (layout, layouts) => {
    this.saveToLS('layouts', layouts);
    this.setState({ layouts });
  }

  saveToLS = (key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        'rgl-8',
        JSON.stringify({
          [key]: value,
        })
      );
      let dragDatas = [];
      dragDatas = value.xs || [];
      let dragData = '';
      if (dragDatas.length > 0) {
        dragDatas.forEach((item, index) => {
          if (item.i !== 'null') {
            dragData += `${JSON.stringify(item)}${index === item.length - 1 ? '' : ','}`;
          }
        });
      }
      this.setState({
        dragData,
      });
    }
  }

  // 调用端口获取可配置信息
  fetchConfigureBlocks = () => {
    FetchConfigureBlockS({
      type: '1',
    }).then((data) => {
      const { records = [] } = data || {};
      this.setState({
        staData: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 调用端口获取已经置信息
  fetchConfigureBlock = () => {
    FetchConfigureBlockS({
      type: '2',
    }).then((data) => {
      const { records = [] } = data || {};
      this.setState({
        rightStaData: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // Switch状态改变
  onChange = (checked, event) => {
    this.setState({
      defaultChecked: checked,
    });
    this.state.defaultChecked = checked;
  }

  // 操作时插入数据
  handleData = (value) => {
    const { defaultChecked } = this.state;
    if (defaultChecked) {
      this.state.rightStaData = this.state.rightStaData.concat([value]);
    } else {
      // eslint-disable-next-line array-callback-return
      this.state.rightStaData.map((item, i) => {
        if (item.name === value.name) {
          this.state.rightStaData.splice(i, 1);
        }
      });
    }
  }

  // 确定保存数据
  showConfirm = async () => {
    const { fetchConfigure, onCancel } = this.props;
    const { dragData } = this.state;
    await FetchConfigureBlocksUpdate({
      displayParam: dragData,
    }).then((response) => {
      const { note = '' } = response;
      message.success(note);
      if (onCancel || fetchConfigure) {
        onCancel();
        fetchConfigure();
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { staData = [], rightStaData } = this.state;
    return (
      <div>
        <div >
          <Row className={`${styles.selfRow}`}>
            <Col xs={24} sm={24} lg={8} xl={7} >
              <ul className="m-home-set-list">
                {staData.length > 0 ? staData.map((item, index) => (
                  <li key={index} ><i className={`${item.icon} iconfont`} /><span>{item.name}</span>
                    <Switch onClick={() => this.handleData(item)} defaultChecked={item.isShow === '1'} onChange={this.onChange} />
                  </li>
                )) : <div style={{ textAlign: 'center', lineHeight: '24rem' }}><Spin /></div>}

              </ul>
            </Col>
            <Col xs={24} sm={24} lg={16} xl={17} style={{ height: '48rem', overflowY: 'auto', position: 'relative' }}>
              <Row className="" style={{ padding: '0 1.25rem 1.25rem 2rem' }}>
                <ResponsiveReactGridLayout
                  className="layout"
                  rowHeight={124}
                  layouts={this.state.layouts}
                  isDraggable
                  isResizable
                  autoResize
                  resizeHandles={['se']}
                  style={{ width: '1200px' }}
                  ref={(c) => { this.layout = c; }}
                  {...this.props}
                  onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
                >
                  {
                    rightStaData.map((item, index) => {
                      if (item.name === '消息概况') {
                        let datas = [];
                        if (JSON.parse(item.displayParam)) {
                          const data = JSON.parse(item.displayParam);
                          datas = data;
                        }
                        return (
                          <Col
                            key={datas.i}
                            data-grid={{
                              i: datas.i,
                              w: datas.w,
                              h: datas.h,
                              x: datas.x,
                              y: datas.y,
                            }}
                            static
                          >
                            <Liquidfill data={item} />
                          </Col>
                        );
                      } else if (item.name === '销售概览') {
                        let datas = [];
                        if (JSON.parse(item.displayParam)) {
                          const data = JSON.parse(item.displayParam);
                          datas = data;
                        }
                        return (
                          <Col
                            key={datas.i}
                            data-grid={{
                              i: datas.i,
                              w: datas.w,
                              h: datas.h,
                              x: datas.x,
                              y: datas.y,
                            }}
                          >
                            <SalesOverview />
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
                            key={datas.i}
                            data-grid={{
                              i: datas.i,
                              w: datas.w,
                              h: datas.h,
                              x: datas.x,
                              y: datas.y,
                            }}
                          >
                            <MyUpcoming />
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
                            key={datas.i}
                            data-grid={{
                              i: datas.i,
                              w: datas.w,
                              h: datas.h,
                              x: datas.x,
                              y: datas.y,
                            }}
                          >
                            <SchCalendar />
                          </Col>
                        );
                      }
                      return (<div key={index} />);
                    })
                  }
                </ResponsiveReactGridLayout>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="steps-action tr" style={{ padding: '0.833rem 1rem' }}>
          <Button type="primary" className="m-btn-radius m-btn-theme" onClick={() => this.showConfirm()}>
            确定
          </Button>
          <Button className="m-btn-radius" onClick={() => this.props.onCancel()}>
            关闭
          </Button>
        </div>
      </div>
    );
  }
}

export default PanelSettings;

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8')) || {};
    } catch (e) {
      /* Ignore */
    }
  }
  return ls[key];
}
