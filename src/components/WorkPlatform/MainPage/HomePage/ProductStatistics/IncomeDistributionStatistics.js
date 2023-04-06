/* 本年产品收入分布统计 */
import React, { useState, useEffect } from 'react';
import { message, Card } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { FetchProdSalesDistributeStat } from '@/services/home/home';
import { loadingOption } from '@/utils/loadingOption';
import styles from './index.less';
import { bylAnalysis2 } from './config';


function SalesDistributionStatistics(props) {
  const [allDatas, setAllDatas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProdSalesDistributeStat();
  }, []);

  // 基金业绩走势查询
  const fetchProdSalesDistributeStat = () => {
    setLoading(true);
    FetchProdSalesDistributeStat({
      timeInterval: '1',
      type: '2', // 1:销量， 2：收入
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
        <span>本年产品收入分布统计(万元)</span>
      </div>
    </React.Fragment>
  );

  return (
    <Card
      className={`${styles.selfCard} m-card m-card-shadow`}
      title={handleTitle()}
      style={{ height: '22.833rem' }}
    >
      <ReactEchartsCore
        echarts={echarts}
        option={bylAnalysis2(allDatas)}
        notMerge
        lazyUpdate
        style={{ height: '18rem', width: '100%' }}
        theme="本年产品收入分布统计(万元)"
        loadingOption={loadingOption}
        showLoading={loading}
      />
    </Card>
  );
}

export default SalesDistributionStatistics;
