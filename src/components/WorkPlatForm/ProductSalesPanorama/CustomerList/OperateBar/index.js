import React from 'react';
import { Row, Col, Affix } from 'antd';
import Export from './Export';
import lodash from 'lodash';

class OperateBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 格式化数据/单位
  formatValue = (value) => {
    let dw = '元';
    if (parseFloat(value) >= 10000000000) {
      value = (parseFloat(value) / 100000000).toFixed(2);
      dw = '亿';
    } else if (parseFloat(value) < 10000000000 && parseFloat(value) >= 1000000) {
      value = (parseFloat(value) / 10000).toFixed(2);
      dw = '万';
    }
    return { value, dw };
  }

  formatThousands = (val) => {
    if (!val) return;
    let str = val + '';
    let dw = str.replace(/[0-9.]/ig, '');
    return str.replace(/[^0-9.]/ig, '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + dw;
  }

  //屏蔽指标单位
  formatName = (idxNum) => {
    const { customerType = '' } = this.props;
    let idxNm = idxNum;
    if (idxNum.indexOf('(') > -1) {
      idxNm = idxNum.substring(0, idxNum.indexOf('('));
    }
    if (customerType === '12' && idxNm === "交易金额") {
      idxNm = '销售金额';
    }
    return idxNm;
  }

  getStatisticData = () => {
    const { statcData = [] } = this.props;
    return (
      <React.Fragment>
        <span className="ax-tjsj-name">统计数据:</span>
        {
          statcData.length !== 0 && statcData.map((item) => {
            let { idxVal = '', idxNum = '' } = item;
            idxVal = this.formatValue(idxVal);
            idxNum = this.formatName(idxNum);
            return (
              <span>
                <span style={{ padding: '0 1rem', color: '#74767d' }}>{idxNum}:</span>
                <span style={{ color: '#f68c61' }}>{this.formatThousands(lodash.get(idxVal, 'value', '--'))}</span>
                <span style={{ color: '#74767d' }}>{lodash.get(idxVal, 'dw', '元')}</span>
              </span>
            );
          })
        }
      </React.Fragment>
    );
  }
  render() {
    const { productCusListModel, selectedCount = 0, headerInfo = [], tableHeaderCodes = [] } = this.props;
    return (
      <Affix
        target={() => document.getElementById('htmlContent')}
        offsetTop={46}
      >
        <Row>
          <Col span={12} className="ax-tjsj">
            {
              this.getStatisticData()
            }
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            {/* <Button style={{ marginLeft: '1.5rem', color: '#fff', background: '#244fff', border: '1px solid #EAECF2' }} className="m-btn-radius m-btn-headColor fs14">导出表格</Button> */}
            <Export headerInfo={headerInfo} tableHeaderCodes={tableHeaderCodes} selectedCount={selectedCount} productCusListModel={productCusListModel} />
          </Col>
        </Row>
      </Affix>
    );
  }
}

export default OperateBar;
