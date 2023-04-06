/* 产品销量趋势分析 */
import React, { useState, useEffect } from 'react';
import { message, Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { FetchProdSalesTrendStat } from '@/services/home/home';
import { loadingOption } from '@/utils/loadingOption';
import styles from './index.less';
import { bylAnalysis4 } from './config';


function SalesTrendAnalysis(props) {
  const [allDatas, setAllDatas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProdSalesTrendStat();
  }, []);

  // 基金业绩走势查询
  const fetchProdSalesTrendStat = () => {
    setLoading(true);
    FetchProdSalesTrendStat({
      timeInterval: '1',
    }).then((respones) => {
      const { records = [] } = respones || {};
      setAllDatas(records);
      setLoading(false);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  const handleTitle = () => (
    <React.Fragment>
      <div className="card-title-name">
        <span>产品销量趋势分析(万元)</span>
      </div>
    </React.Fragment>
  );

  return (
    <Card
      className={`${styles.selfCard} m-card m-card-shadow`}
      title={handleTitle()}
      style={{ height: '22.833rem', paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}
    >
      <ReactEchartsCore
        echarts={echarts}
        option={bylAnalysis4(allDatas)}
        notMerge
        lazyUpdate
        style={{ height: '18rem', width: '100%' }}
        theme="产品销量趋势分析(万元)"
        loadingOption={loadingOption}
        showLoading={loading}
      />
    </Card>
  );
}

export default SalesTrendAnalysis;
