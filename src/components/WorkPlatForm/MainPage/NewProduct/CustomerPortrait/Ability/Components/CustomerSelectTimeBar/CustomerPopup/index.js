import React, { Component } from 'react';
import styles from './index.less';

class CustomerPopup extends Component {
  static defaultProps = {
    selectedTime: '近一年',
    hasExpanded: false,
  }

  // 可选时间范围
  timeRanges = [];

  initTimeRange = () => {
    // 获取这个瞬间的时间
    const curMoment = new Date();
    // 今年年份
    const curYear = curMoment.getFullYear();
    // 今天日期
    const curDate = this.formatDate(curMoment);
    // 去年同天日期
    const lastDate = `${(curYear - 1)}${curDate.slice(4)}`;
    // 前年同天日期
    const lastTwoDate = `${(curYear - 2)}${curDate.slice(4)}`;
    this.timeRanges = [];
    // 初始化列表
    this.timeRanges = [{
      context: `近两年 (${lastTwoDate}-${curDate})`,
      selectedTime: '近两年',
    }, {
      context: `近一年 (${lastDate}-${curDate})`,
      selectedTime: '近一年',
    }, {
      context: `${curYear} (${curYear}.01.01-${curDate})`,
      selectedTime: `${curYear}`,
    }, {
      context: `${curYear - 1} (${curYear - 1}.01.01-${curYear - 1}.12.31)`,
      selectedTime: `${curYear - 1}`,
    }];
    this.$forceUpdate();
  }

  formatDate = (time) => {
    const year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let date = time.getDate();
    date = date < 10 ? `0${date}` : date;
    return `${year}.${month}.${date}`;
  }

  showSelected = (timeRange) => {
    return this.selectedTime === timeRange.selectedTime;
  }

  changeSelectedTime = (selectedTime) => {
    this.$emit('update:selectedTime', selectedTime);
  }

  show = (hasExpanded, popupTop, coverTop) => {
    const cover = this.$refs.cover;
    const popup = this.$refs.customerPopup;
    if (hasExpanded) {
      this.initTimeRange();
    }
    this.$nextTick(() => {
      popup.style.top = `${popupTop}px`;
      cover.style.top = `${coverTop + popup.offsetHeight + 20}px`;
      cover.style.position = hasExpanded ? 'fixed' : 'static';
    });
  }

  cancelCover = () => {
    const cover = this.$refs.cover;
    cover.style.position = 'static';
    this.$emit('update:hasExpanded', false);
  }

  render() {
    return   (
      <div
        ref="customerPopup"
        className={`${styles.list} ${this.props.hasExpanded ? styles.expand : ''}`}
        // @touchmove.prevent
      >
        { this.timeRanges.map(timeRange => (
          <div
            className={styles.item}
            key={timeRange.selectedTime}
            onClick={() => this.changeSelectedTime(timeRange.selectedTime)}
          >
            <span className={styles.context}>
              { timeRange.context }
            </span>
            { this.showSelected(timeRange) ? (
              <img
                src={require("$assets/newProduct/customerPortrait/check-right.png")}
              />
            ) : ''
            }
          </div>
        )
        ) }
        <div
          ref="cover"
          className={styles.cover}
          // @touchmove.prevent
          // @click="cancelCover"
          onclick={this.cancelCover}
        />
      </div>
    );
  }
}

export default CustomerPopup;