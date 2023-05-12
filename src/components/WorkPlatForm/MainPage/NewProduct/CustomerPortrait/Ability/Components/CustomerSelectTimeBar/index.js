import React, { Component } from 'react';
import CustomerPopup from './CustomerPopup';
import styles from './index.less';

class CustomerSelectTimeBar extends Component {
  $refs = {};

  selectedTime = '近一年';

  // 是否展开了时间范围弹出层
  hasExpanded = false;

  // 可选时间范围
  timeRanges = [];

  yearArr = [];

  initYearArr = (arr) => {
    this.yearArr = arr;
  }

  // 打开弹出层，显示时间选择范围
  expandTimeRange = () => {
    this.hasExpanded = !this.hasExpanded;
    const popupTop = this.$refs.customerSelectTimeBar.offsetHeight;
    const customerSelectTimeBar = this.$refs.customerSelectTimeBar;
    // 获取被滚动隐藏的区域的高度，以下做兼容处理
    const scrollTop = (document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset);
    // 时间段选择器的父节点减去被滚动隐藏的区域的高度，即可获得遮罩层的纵坐标起始点位置（父节点的节点需为body)
    const coverTop = customerSelectTimeBar.parentNode.offsetTop - scrollTop;
    this.show(this.hasExpanded, popupTop, coverTop);
    // (this.$refs.customerPopup as any).show(this.hasExpanded, popupTop, coverTop);
  }

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
    }];
    this.yearArr.forEach((year) => {
      if (year === curYear.toString()) {
        this.timeRanges.push({
          context: `${year} (${year}.01.01-${curDate})`,
          selectedTime: year,
        });
      } else {
        this.timeRanges.push({
          context: `${year} (${year}.01.01-${year}.12.31)`,
          selectedTime: `${year}`,
        });
      }
    });
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

  changeSelectedTime = (timeRange) => {
    const { selectedTime } = timeRange;
    this.selectedTime = selectedTime;
    // this.$emit('getInfo', timeRange);
    this.props.getInfo(timeRange);
    this.hasExpanded = !this.hasExpanded;
  }

  show = (hasExpanded, popupTop, coverTop) => {
    const cover = this.$refs.cover;
    const popup = this.$refs.customerPopup;
    if (hasExpanded) {
      this.initTimeRange();
    }
    this.$nextTick(() => {
      popup.style.top = `${popupTop}px`;
      popup.style.display = hasExpanded ? 'inline' : 'none';
      cover.style.top = `${coverTop + popup.offsetHeight + 110}px`;
      cover.style.display = hasExpanded ? 'inline' : 'none';
      cover.style.position = hasExpanded ? 'fixed' : 'static';
    });
  }

  cancelCover = () => {
    const cover = this.$refs.cover;
    cover.style.position = 'static';
    this.expandTimeRange();
    // this.$emit('update:hasExpanded', false);
  }

  render() {
    return   (
      <div
        className={styles.timeBar}
        ref={el => this.customerSelectTimeBar = el}
      >
        <div
          ref={el => this.titleBar = el}
          className={styles.titleBar}
        >
          { this.props.children || (
            <div className={styles.titleContext}>
              { this.props.title }
            </div>
          ) }
          <div
            className={styles.timeRange}
            onClick={this.expandTimeRange}
          >
            { this.selectedTime }
            <img
              src={require("$assets/newProduct/customerPortrait/down-triangle.png")}
              className={this.hasExpanded ? styles.hide : styles.expand}
              alt=''
            />
          </div>
        </div>
        { this.hasExpanded ? (
          <div
            ref={el => this.customerPopup = el}
            className={`${styles.customerPopup} ${styles.list} ${this.hasExpanded ? styles.expandPopup : ''}`}
            // @touchmove.prevent
          >
            { this.timeRanges.map(item =>  (
              <div
                className={styles.item}
                key={item.selectedTime}
                onClick={() => this.changeSelectedTime(item)}
              >
                <span className={styles.context}>
                  { item.context }
                </span>
                { this.showSelected(item) ? (
                  <img
                    src={require("$assets/newProduct/customerPortrait/check-right.png")}
                    alt=''
                  />
                ) : ''
                }
              </div>
            )) }
            <div
              ref={el => this.cover = el}
              className={styles.cover}
              // @touchmove.prevent
              onClick={this.cancelCover}
            />
          </div>
        ) : ''
        }
      </div>
    );
  }
}

export default CustomerSelectTimeBar;