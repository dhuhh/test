import React from 'react';
import { Divider, Col, Row, Button, Card } from 'antd';
import Indicator from '../Common/Indicator';
import jsonDatas from '../../JSON/json';
import { fetcSeniorMenu } from '../../../../../services/customersenior';
import styles from './searchIndicator.less';

class SearchIndicator extends React.Component {
  state = {
    allChildIndex: [],
  }
  componentDidMount() { // 获取菜单口径说明
    // 因为直接选择方案时候,口径说明无法传递进来,因此选择再调用一次指标体系菜单接口来获取口径说明
    const { seniorMenuService } = this.props;
    if (!seniorMenuService) {
      fetcSeniorMenu({ enableSide: 0, entityType: '1' }).then((response) => {
        const { records: seniorMenuInfoRecord = [] } = response;
        if (Array.isArray(seniorMenuInfoRecord)) {
          let allChildIndex = [];
          try { // 避免数据异常导致递归错误页面崩溃
            allChildIndex = this.getAllChildIndex(seniorMenuInfoRecord, []);
          } catch (error) {
            allChildIndex = [];
          }
          this.setState({
            allChildIndex,
          });
        }
      });
    }
  }
  getAllChildIndex = (menuJson, arr) => {
    for (let i = 0; i < menuJson.length; i++) {
      const { childIndex = [] } = menuJson[i];
      if (childIndex.length === 0) {
          arr.push(menuJson[i]);
      } else {
          this.getAllChildIndex(childIndex, arr);
      }
    }
    return arr;
  }
  render() {
    const { allChildIndex = [] } = this.state; // 所有的子指标 目的是为了获取口径说明
    const { isthisTab, steps, onBlur, addIndicatorVisible, onDelet, form, onIndicatorsClick, currentStep, handleClick, dictionary, objectDictionary } = this.props;
    let fisadd = false;
    return (
      <div className={`${styles.fontSet}`} id="advance_modal" >
        <Card style={{ borderBottom: '0', borderRadius: '0', background: '#f5f5f5' }}>
            <div style={{ padding: '1rem', background: '#f5f5f5' }}>
              <div className="ant-row-flex ant-row-flex-space-around ant-row-flex-middle">
                <Col span={2}>
                  <div style={{ fontSize: '14px' }}>序号</div>
                </Col>
                <Col span={4}>
                  <div style={{ fontSize: '14px' }}>指标</div>
                </Col>
                <Col span={5}>
                  <div style={{ fontSize: '14px' }}>附加参数</div>
                </Col>
                <Col span={4}>
                  <div style={{ fontSize: '14px' }}>阀值(&gt;=)</div>
                </Col>
                <Col span={3}>
                  <div style={{ fontSize: '14px' }}>阀值(&lt;=)</div>
                </Col>
                <Col span={3}>
                  <div style={{ fontSize: '14px' }}>单位</div>
                </Col>
              </div>
            </div>
        </Card>
        {steps.map((step, index) => {
          const { key, indicators } = step;
          const { key: tempindicatorKey = '' } = indicators[0] || {};
          const tempIndicatorKey = tempindicatorKey.substring(tempindicatorKey.lastIndexOf(':') + 1); // 当前指标的key
          const data = jsonDatas[jsonDatas.findIndex((item) => { return item.code === tempIndicatorKey; })] || {}; // 获取指标配置详情
          const { hide = false } = data;
          const arr = indicators.filter((it) => {
            return it.key === '-1';
          });
          const isadd = arr.length === 1;
          if (isadd) {
            fisadd = true;
          }
          const fislast = index === (steps.length - 1);
          return (
            <div style={{ display: hide ? 'none' : '' }} key={key} className="m_advance_segment" >
              <Row onClick={() => handleClick(key)} className={`${isthisTab && ((fislast && !fisadd ) || isadd) ? 'm-border-color' : ''} m-row-table-body ant-row-flex ant-row-flex-space-around ant-row-flex-middle`} style={{ border: '1px solid #e8e8e8' }}>
                <Col span={2}>
                  <div className="m-row-table-body-first" style={{ padding: '2rem 0 2rem 1.5rem' }}>
                    <Button size='small' type="primary" shape="circle" className='m-border-color bg-mcolor'>
                      {key}
                    </Button>
                  </div>
                </Col>
                <Col span={22}>
                  {
                    indicators.length > 0 ?
                    (indicators.map((indicator, indiIndex) => {
                      const { key: indicatorKey, values = {} } = indicator;
                      const extaIndicatorKey = indicatorKey.split('.').join('=');
                      return <Indicator allChildIndex={allChildIndex} isthisTab={isthisTab} steps={steps} indiIndex={indiIndex === indicators.length - 1 ? '1' : '0'}  onIndicatorsClick={onIndicatorsClick} onBlur={onBlur} objectDictionary={objectDictionary} values={values} dictionary={dictionary} form={form} fkey={key} onDelet={onDelet} key={indicatorKey} subKey={`${key}&&${extaIndicatorKey}`} />;
                    })) : (
                      <Col style={{ display: addIndicatorVisible && isthisTab ? '' : 'none', marginBottom: '0.5rem' }} span={24}>
                        <Button type="dashed" block onClick={() => onIndicatorsClick(key)}>点击添加条件</Button>
                      </Col>
                    )
                }
                </Col>
                {/* <div className="m-row-table-position">
                  <div>添加并集条件
                    <Popover
                      overlayClassName="m-ant-popover"
                      placement="bottom"
                      content={
                        <div>
                          <p style={{ marginTop: '1rem' }}>步骤之间是“且”的关系，同一步骤不同指标间是“或”的关系</p>
                        </div>
                      }
                      trigger="hover"
                    >
                      <i className="iconfont icon-about" id="gjsx" />
                    </Popover>
                  </div>
                </div> */}
                {/* <Col style={{ display: addIndicatorVisible && this.props.currentKey === '0' ? '' : 'none', marginBottom: '0.5rem' }} span={24}>
                  <Button type="dashed" block onClick={() => onIndicatorsClick(key)}>点击添加条件</Button>
                </Col> */}
                {/* </div> */}
              </Row>
              { !fislast && <div style={{ borderLeft: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', padding: '0 1.5rem' }}>
                <Row>
                  <Col offset={2} span={22}>
                    <Divider style={{ margin: '5px 0' }} className={`${styles.m_Divider} m-color`} orientation="left" >且</Divider>
                  </Col>
                </Row>
                </div>
              }
            </div>
          );
        })}
      </div>
    );
  }
}

export default SearchIndicator;

