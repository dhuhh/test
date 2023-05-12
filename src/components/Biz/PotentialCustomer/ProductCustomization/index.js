import React from 'react';
import { Card, Collapse, Button } from 'antd';
import InvestmentProductsRecommended from './InvestmentProductsRecommended';
import PackageServiceProducts from './PackageServiceProducts';
import styles from './index.less';

class ProductCustomization extends React.Component {
  render() {
    return (
      <Card title={<span className={styles.infoheader}>产品定制</span>}>
        <Collapse className="m-collapse m-collapse-tree" defaultActiveKey={['investmentProductsRecommended', 'packageServiceProducts']} style={{ marginTop: '-2rem' }}>
          <Collapse.Panel header="投顾产品推荐" key="investmentProductsRecommended">
            <InvestmentProductsRecommended />
          </Collapse.Panel>
          <Collapse.Panel header="套餐服务产品" key="packageServiceProducts">
            <PackageServiceProducts />
          </Collapse.Panel>
        </Collapse>
        <div style={{ textAlign: 'right', paddingRight: '2rem', paddingBottom: '3rem' }}><Button className="m-btn-radius m-btn-headColor">保存</Button></div>
      </Card>
    );
  }
}

export default ProductCustomization;
