import React, { Component } from 'react';
import * as echarts from 'echarts';
import styles from './index.less';

class CustomerInvestChart extends Component {
  static defaultProps = {
    title: '',
    options: {},
    minDate: '',
    maxDate: '',
  };

  $refs = {};

  initChart = (options) => {
    const chart = echarts.init(this.$refs.chart, undefined, { renderer: 'svg' });
    // chart.on('click', (param: any) => {
    //   console.log('点击echarts', param);
    // });
    chart.setOption(options);
  }

  render() {
    return (
      <div className={styles.layout}>
        <div className={styles.title}>
          {this.props.title}
        </div>
        <div className={styles.underLine} />
        { this.props.children && this.props.children.length ? this.props.children.filter(item => item.props.name === 'legend') : (this.props.children.props.name === 'legend' ? this.props.children : '')}
        <div
          ref={el => this.$refs.chart = el}
          className={styles.chart}
        />
        <div className={styles.bottomDate}>
          <div className={styles.date}>
            {this.props.minDate}
          </div>
          <div className={styles.date} style={{ marginRight: this.props.title === '账户仓位及上证指数走势图' ? '-1px' : '' }}>
            {this.props.maxDate}
          </div>
        </div>
        { this.props.children && this.props.children.length ? this.props.children.filter(item => item.props.name === 'external') : (this.props.children.props.name === 'external' ? this.props.children : '')}
      </div>
    );
  }
}

export default CustomerInvestChart;
