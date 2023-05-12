import React from 'react';
import { Row, Col, Affix } from 'antd';
import ProductColumn from './ProductColumn';
import Export from './Export';
import { formatThousands } from '../../../ManageCusList/Common/Utils';

class OperateBar extends React.Component {
  formatValue = (m) => {
    let value = '';
    if (m.formatType === '4') {
      if (parseFloat(m.value) >= 1000000 && parseFloat(m.value) < 10000000000) {
        value = (parseFloat(m.value) / 10000).toFixed(2);
      } else if (parseFloat(m.value) >= 10000000000) {
        value = (parseFloat(m.value) / 100000000).toFixed(2);
      } else {
        value = m.value;
      }
    } else if (m.formatType === '3') {
      value = (parseFloat(m.value) / 100000000).toFixed(2);
    } else if (m.formatType === '2') {
      value = (parseFloat(m.value) / 10000).toFixed(2);
    }
    if (m.decimalDigits === 0) {
      return parseInt(value) + '';
    }
    return formatThousands(value);
  }
  render() {
    const { dictionary = {}, allProductDisplayColumns = [], payload = {}, handleFormChange, summary = [], count = 0, authorities = {} } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    return (
      <Affix
        target={() => document.getElementById('htmlContent')}
        offsetTop={46}
      >
        <Row>
          <Col sm={14} md={14} xxl={18} className="ax-tjsj">
            <span className="ax-tjsj-name">统计数据：</span>
            {
              summary.map((m, i) => (
                <span key={i} style={{ marginLeft: i !== 0 && '1rem' }}>
                  <span>{m.xsmc.replace(/\(.*\)/, "") || '--'}：</span>
                  <span style={{ color: '#FF6E2F' }}>
                    {this.formatValue(m)}
                  </span>
                  <span> {function () {
                    if (m.formatType === '2') {
                      return '万' + m.unit;
                    } else if (m.formatType === '3') {
                      return '亿' + m.unit;
                    } else if (m.formatType === '4') {
                      if (parseFloat(m.value) >= 1000000 && parseFloat(m.value) < 10000000000) {
                        return '万' + m.unit;
                      } else if (parseFloat(m.value) >= 10000000000) {
                        return '亿' + m.unit;
                      } else {
                        return m.unit;
                      }
                    } else {
                      return m.unit;
                    }
                  }()}</span>
                </span>
              ))
            }
          </Col>
          <Col sm={10} md={10} xxl={6} style={{ textAlign: 'right' }}>
            {/* 编辑指标 */}
            {
              productPanoramaAuth.includes('bjzb') && <ProductColumn dictionary={dictionary} allProductDisplayColumns={allProductDisplayColumns} payload={payload} handleFormChange={handleFormChange} />
            }
            {/* 导出 */}
            {
              productPanoramaAuth.includes('dc') && <Export allProductDisplayColumns={allProductDisplayColumns} payload={payload} count={count} />
            }
            {/* <Button style={{ marginLeft: '1rem', color: '#fff', background: '#244fff', border: '1px solid #EAECF2' }} className="m-btn-radius m-btn-headColor fs14">导出表格</Button> */}

          </Col>
        </Row>
      </Affix>
    );
  }
}

export default OperateBar;
