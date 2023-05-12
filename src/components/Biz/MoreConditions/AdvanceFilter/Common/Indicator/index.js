import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Divider,Tooltip, Icon } from 'antd';
import FormItem from '../Indicator/FormItem';
import styles from './index.less';

class Indicator extends React.Component {
  componentDidMount() {
    if (this.indicatorInput) {
      this.indicatorInput.focus();
    }
  }

    /**
   * 根据选择的key获取caliber
   * @param {string} key
   */
  getCaliber = (key) => {
    const { allChildIndex = [] } = this.props;
    const { caliber = '' } = allChildIndex.find(m => m.indexCode === key) || {};
    return caliber;
  }

  onBlur = (fkey, subKey) => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(fkey, subKey);
    }
  }
  render() {
    const { isthisTab, subKey, onDelet, fkey, form = {}, dictionary, values = {}, objectDictionary, steps = [], advanceFilterJson = [] } = this.props;
    const indicatorKey = subKey.substring(subKey.lastIndexOf('&&') + 2).split('=').join('.'); // 当前指标的key
    const caliber = this.getCaliber(indicatorKey);
    const data = advanceFilterJson[advanceFilterJson.findIndex((item) => { return item.code === indicatorKey; })] || { more: {} };
    const { name = '', extra = [], more: { unit }, enable = true } = data;
    if (steps.length > 0 && (name || !enable)) { // 区分隐藏条件 和 空条件
      const { getFieldDecorator } = form;
      return (
        <React.Fragment>
          <div style={{ display: (!enable && steps.length === 1) ? '' : 'none' }} className={`${styles.m_animation_border} m_animation_border m-row-table-tbody ant-row-flex ant-row-flex-space-around ant-row-flex-middle`}><input onBlur={() => { this.onBlur(fkey, subKey); }} ref={(c) => { this.indicatorInput = c; }} readOnly value="请从左侧菜单选择指标" /></div>
          <div style={{ display: !enable ? 'none' : '' }} className="m-row-table-tbody ant-row-flex ant-row-flex-space-around ant-row-flex-middle m-gjsx-menu">
            <Col span={3}>
              <span>{name}</span>
              {
                caliber && (
                  <React.Fragment>
                    <Tooltip placement="bottomLeft" title={<div dangerouslySetInnerHTML={{ __html: caliber.replace(/(\r\n|\n|\r)/gm, "<br />") }} />}>
                      <Icon style={{ marginRight: '1.5rem', marginLeft: '0.333rem' }} type="question-circle" />
                    </Tooltip>
                  </React.Fragment>
                )
              }
            </Col>
            <Col span={extra[0] && extra[0].type === 'KHRQ' ? 15 : 6}> {/* 开户日期特殊处理} */}
              {extra.map((item, index) => {
                const { type, name: extraName, encode: extraCode = '', tableName, data: zdDatas = '', bkx = [], url = '', required = false } = item;
                let tempdatas = zdDatas || [];
                if (tempdatas.length === 0) {
                  tempdatas = objectDictionary[tableName] || [];
                }
                if (tempdatas.length === 0) {
                  tempdatas = dictionary[tableName] || [];
                }
                const initialValue = values[extraCode] || '';
                if (type !== 'RangeInput' && type !== 'RangeDate' && type !== 'InputNum') {
                  const tempextraCode = extraCode.split('.').join('='); // .点点会对取值造成影响
                  return (
                    <Row key={extraCode}>
                      <Col span={6}>
                        <div key={extraCode} style={{ padding: '1rem 0' }}>{extraName}</div>
                      </Col>
                      <Col span={18}>
                        <FormItem {...item} url={url} className={styles.m_item} bkx={bkx} initialValue={initialValue} key={extraCode} data={tempdatas} required={required} getFieldDecorator={getFieldDecorator} subKey={`查询条件${subKey}&&${tempextraCode}`} type={type} />
                      </Col>
                    </Row>
                  );
                }
                return null;
              })}
            </Col>
            <Col span={9}>
              {extra.map((item) => {
                const { type, encode: extraCode } = item;
                if (type === 'RangeInput' || type === 'RangeDate' || type === 'InputNum') {
                  return (
                    <FormItem initialValue={values[extraCode] || ''} required={type === 'InputNum'} /* 特殊处理，input不输入内容接口会报错，故加上必填 20191212 */ getFieldDecorator={getFieldDecorator} subKey={`查询条件${subKey}&&${extraCode}`} type={type} />
                    );
                }
                return null;
              })}
            </Col>
            <Col span={1}>
              <span>{unit}</span>
            </Col>
            <Col span={2}>
              {/* <Icon onClick={() => { onDelet(fkey, subKey); }} style={{ cursor: 'pointer', marginLeft: '0.6rem', color: 'red' }} type="close" /> */}
              {isthisTab && <Button onClick={() => onDelet(fkey, subKey) }  ghost size='small' type="primary" style={{ width: '26.5px', marginRight: '1px' }} className="m-border-color m-color">-</Button>}
              {
                isthisTab && this.props.indiIndex === '1' && <Button onClick={() => { this.props.onIndicatorsClick && this.props.onIndicatorsClick(fkey); }} ghost size='small' type="primary" style={{ width: '26.5px' }} className="m-border-color m-color">+</Button>
              }
            </Col>
            {this.props.indiIndex === '0' && <Col style={{ padding: '0 1rem' }} span={24}>
              <Divider style={{ margin: '5px 0' }} className="m-color" orientation="left" >或</Divider>
              </Col>}
          </div>
        </React.Fragment>
      );
    }
    return <div className={`${styles.m_animation_border} m_animation_border m-row-table-tbody ant-row-flex ant-row-flex-space-around ant-row-flex-middle`}><input onBlur={() => { this.onBlur(fkey, subKey); }} ref={(c) => { this.indicatorInput = c; }} readOnly value="请从左侧菜单选择指标" /></div>;
  }
}
export default connect(({ myCustomer }) => ({
  advanceFilterJson: myCustomer.advanceFilterJson,
}))(Indicator);
