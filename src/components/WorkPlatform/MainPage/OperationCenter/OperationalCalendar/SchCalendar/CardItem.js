/* eslint-disable react/no-children-prop */
/* eslint-disable */
import React from 'react';
import { Card, Progress, Col } from 'antd';
import Links from '@/components/Common/Links';
import classnames from 'classnames';
import styles from './index.less';

function CardItem(props) {
  const handleStyle = (index) => {
    let listStyle;
    if (index === '高风险') {
      listStyle = 'left m-risk-tag m-btn-tag-red';
    } else if (index === '中高风险') {
      listStyle = 'left m-risk-tag m-btn-tag-orange';
    } else if (index === '中风险') {
      listStyle = 'left m-risk-tag  m-btn-tag-yellow';
    } else if (index === '中低风险') {
      listStyle = 'left m-risk-tag  m-btn-tag-blue';
    } else if (index === '低风险') {
      listStyle = 'left m-risk-tag m-btn-tag-violet';
    } else {
      listStyle = 'left m-risk-tag';
    }
    return listStyle;
  };

  const { data = {} } = props;
  const {
    expectedYieldRate = '',
    prodName = '',
    prodCode = '',
    prodStatus = '',
    prodTerm = '',
    prodRiskLevel = '',
    prodId = '',
    establishDate = '',
  } = data;

  return (
    <Col xs={24} sm={12} md={8} xl={6} key={prodId}>
      <Card className={classnames('m-card m-cfcp-shadow m-cfcp-card')} key={prodId}>
        <div className="m-product-card-cont m-card-top" style={{ paddingTop: '0rem' }}>
          <div className="clearfix">
            <span className={handleStyle(prodRiskLevel)} >{prodRiskLevel || '--'}</span>
          </div>
          <div className="tc m-product-card-info" style={{ paddingBottom: '0rem' }}>
            <Links
              className="font-color"
              id={prodId}
              name={prodName}
              children={
                <>
                  <div className={classnames(styles.overflow, 'm-name fwb')} title={`${prodName || '--'}`}>{prodName || '--'}</div>
                  <div>{prodCode || '--'}</div>
                </>
              }
            />
            <div className="header" style={{ paddingTop: '0.5rem' }}><span className={styles.line} /><span >&nbsp;{prodStatus || ''}&nbsp;</span><span className={styles.line} /></div>
            <div className="m-profit" style={{ paddingTop: '1rem' }}>
              <Progress
                type="dashboard"
                width={180}
                strokeColor="#ffb301"
                percent={Number(expectedYieldRate)}
                gapDegree={140}
                strokeWidth={2}
                format={
                  () => (
                    <div sytle={{ textAlign: 'center' }}>
                      <span className="m-profit" style={{ fontSize: '3rem' }}>{expectedYieldRate || '--'}</span>
                      <span style={{ display: 'block', fontSize: '1rem' }}>预期年化收益率</span>
                    </div>
                  )
                }
              />
            </div>
            <div className="list-info" style={{ marginTop: '-3rem', fontSize: '1.166rem', paddingBottom: '1.333rem' }}><span style={{ marginRight: '2rem' }}>{`${establishDate}成立`}</span><span>{`${prodTerm}天到期`}</span></div>
          </div>
        </div>
      </Card>
    </Col>
  );
}

export default CardItem;
