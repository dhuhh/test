/* eslint-disable */
// K线图
export default {
  /**
       * 系列列表
       * @param {Object}  option
       * @param {Object}  listData
       * @returns {Object}
       */
  graphicalSeries(option, listData, MarkLineData, MarkPointData) {
    // 拼接
    const dataCombinationSplicing = [];
    // 循环数据
    for (let i = 0; i < option.length; i++) {
      // 组装
      const dataCombination = [];
      // 合并
      dataCombination.push(option[i][0], option[i][1]);
      // 组装
      dataCombinationSplicing.push(dataCombination);
    }
    // 系列配置
    const seriesConfigure = {
      z: 0,
      barWidth: 10.5,
      // barGap: '15%',
      // barCategoryGap: '5%',
      // 类型
      type: 'candlestick',
      // 数据
      // data: listData.seriesData,
      data: listData,
      // 显示图形颜色
      itemStyle: {
        normal: {
          color: 'rgba(255,152,0,0)', // 0% 处的颜色
          color0: '#029a01',
          borderColor: '#ef5a3c',
          borderColor0: null
        }
      },
      splitNumber: 1,
      markArea: {
        data:
          dataCombinationSplicing
      },
      markPoint: {
        data: MarkPointData
      }
    };

    return seriesConfigure;
  },
  /**
      * Y轴配置
     * @returns {Object}
      */
  graphicalyAxis() {
    const yAxisConfigure = {
      // Y 轴相对于默认位置的偏移
      offset: 15,
      boundaryGap: ['10%', '10%'],
      // 坐标轴刻度标签的相关设置 Y文字。
      axisLabel: {
        // padding: [0, 0, 22, 0],
        // margin: 10,
        // interval: 4,
        showMinLabel: true,
        showMaxLabel: true,
        align: 'left',
        textStyle: {
          color: '#959CBA',
          fontWeight: 500,
          fontSize: 14,
        }
      },
      // splitNumber: 1,
      // 坐标轴轴线相关设置。
      axisLine: {
        show: false,
      },
      // 坐标轴刻度相关设置
      axisTick: {
        show: false
      },
      // 只在数值轴中（type: 'value'）有效
      scale: true,

      // 坐标轴在 grid 区域中的分隔线。
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ccc'],
          // width: 2,
          width: 1,
          type: 'dashed'
        }
      }
    };
    return yAxisConfigure;
  },
  /**
       * X轴配置
       * @param {Array} xAxisData
       * @returns {Object}
       */
  graphicalxAxis(xAxisData) {
    // X轴配置
    const xAxisConfigure = {
      show: true,
      // 坐标轴类型
      type: 'category',
      // offset: -(0.1),
      // 数据
      data: xAxisData,
      boundaryGap: true,
      // min: 'dataMin',
      // max: 'dataMax',
      // 坐标轴轴线相关设置。
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#ccc',
          type: 'solid',
          // width: (0.02666)
          width: 1
        },
        show: true
      },
      splitNumber: 0,
      // 坐标轴刻度标签的相关设置 X文字。
      axisLabel: {
        // interval: 15,
        padding: [16, 74, 0, 48],
        // margin: 4,
        interval: 100,
        showMinLabel: true,
        showMaxLabel: true,
        textStyle: {
          color: '#999',
          fontWeight: 500,
          fontSize: 14
        }
      },
      // 坐标轴刻度的显示间隔，在类目轴中有效。
      axisTick: { show: false },

      // 坐标轴在 grid 区域中的分隔线。
      splitLine: {
        show: false,
        lineStyle: {
          color: ['#f3f3f3'],
          width: 1,
          type: 'dashed'
        }
      }
    };
    return xAxisConfigure;
  },
  /**
       * 提示框组件
       * @module graphicalTooltip
       * @param {Boolean} showTF
       * @param {Number}  DataLength
       * @returns {Object}
       */
  graphicalTooltip(showTF, DataLength, tenAvgRatioColor, hisProfit, heavenThunder, MagicIsTheSame, SignalList) {
    let CutTheTop = 0;
    // 配置
    const configure = {
      // 是否显示提示框 默认不显示
      show: showTF,
      // 内边距，单位px
      padding: [(0.1), (0.09), (0.1), (0.1)],
      // 提示框浮层的文本样式
      textStyle: {
        // 文字字体的粗细
        fontWeight: 500,
        color: '#fff',
        // 文字的字体大小
        fontSize: 14
      },
      // 提示框浮层的背景颜色
      backgroundColor: '#ff9800',
      // 触发类型。
      trigger: 'axis',
      // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
      formatter: param => {
        const params = param[0];
        let Renritian;
        let Nintenri;
        const heavenThundertv = this.CalculatingHead(hisProfit, MagicIsTheSame, params.name, SignalList);

        for (let i = 0; i < heavenThundertv[0].length; i++) {
          for (let h = 0; h < heavenThundertv[0][i].length; h++) {
            if (heavenThundertv[0][i][h] === heavenThundertv[2]) {
              CutTheTop = 1;
              Renritian = heavenThundertv[1][i];
              Nintenri = heavenThundertv[0][i];
              break;
            }
          }
        }
        if (CutTheTop === 1) {
          // const operation = {
          //   judgement: 0,
          //   perationId: 5
          // };
          // burialPoint.burialPointOperation(operation);
          return [
            this.SplicingData(Renritian, params.name, Nintenri)
          ];
        }
        return '';
      },
      // 提示框浮层的位置，默认不设置时位置会跟随鼠标的位置
      position(pos, params, el, elRect, size) {
        // let locationJudgment = DataLength / 3 < params[0].dataIndex
        const locationJudgment = size.viewSize[0] / 3.2 < pos[0];
        localStorage.setItem('lastname', params[0].dataIndex);
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        const obj = locationJudgment ? { top: `-${(1.76)}`, right: size.viewSize[0] - pos[0] - 20 } : { top: `-${(1.76)}`, left: pos[0] - 20 };
        return obj;
      },
      // 坐标轴指示器配置项
      axisPointer: {
        // 坐标轴指示器是否自动吸附到点上
        snap: true,
        type: 'cross',
        // lineStyle设置指示器（详见lineStyle）
        // crossStyle设置指示器（详见lineStyle）
        // shadowStyle设置指示器（详见areaStyle）
        crossStyle: {
          type: 'solid',
          color: '#ff9800'
        },
        // 样式调整
        lineStyle: {
          type: 'solid',
          opacity: 0.5,
          width: 2,
          color: '#ff9800'
        }
      }
    };
    return configure;
  },
  tiaoshidangz(showTF) {
    // 配置
    const configure = {
      showDelay: 0, // 显示延时，添加显示延时可以避免频繁切换
      hideDelay: 50, // 隐藏延时
      transitionDuration: 0, // 动画变换时长
      // 是否显示提示框 默认不显示
      show: showTF,
      // 内边距，单位px
      padding: [(0.1), (0.09), (0.1), (0.1)],
      // 提示框浮层的文本样式
      textStyle: {
        // 文字字体的粗细
        fontWeight: 500,
        color: 'rgba(255,152,0,0)',
        // 文字的字体大小
        fontSize: 14
      },
      // 提示框浮层的背景颜色
      backgroundColor: 'rgba(255,152,0,0)',
      // 触发类型。
      trigger: 'axis',
      //   // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
      //   formatter: param => {

      //   },
      // 提示框浮层的位置，默认不设置时位置会跟随鼠标的位置
      position(pos, params, el, elRect, size) {
        // let locationJudgment = DataLength / 3 < params[0].dataIndex
        const locationJudgment = size.viewSize[0] / 3.2 < pos[0];
        localStorage.setItem('lastname', params[0].dataIndex);
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        const obj = locationJudgment ? { top: `-${(1.76)}`, right: size.viewSize[0] - pos[0] } : { top: `-${(1.76)}`, left: pos[0] };
        return obj;
      },
      // 坐标轴指示器配置项
      axisPointer: {
        // 坐标轴指示器是否自动吸附到点上
        snap: true,
        // 样式调整
        lineStyle: {
          opacity: 0.5,
          width: 2,
          color: 'rgba(255,152,0,0)'
        }
      }
    };
    return configure;
  },
  SnowflakesInTheWinter(MagicIsTheSame, CalculatingArr) {
    const AllNightPeople = [];
    for (let i = MagicIsTheSame.length - 10; i < MagicIsTheSame.length; i++) {
      if (MagicIsTheSame[i][0] >= CalculatingArr) {
        AllNightPeople.push(MagicIsTheSame[i][4]);
      }
    }
    AllNightPeople.sort((a, b) => a - b);
    // const min = AllNightPeople[0],

    const max = AllNightPeople[AllNightPeople.length - 1];
    return max;
  },
  CalculatingHead(hisProfit, MagicIsTheSame, Datename, SignalList) {
    const SignalListData = [];
    for (let x = 0; x < SignalList.length; x++) {
      if (SignalList[x].weakDate === SignalList[x].strongEndDate) {
        SignalListData.push(SignalList[x].strongStartDate);
      }
    }
    const happyTime = Number(Datename.replace(/\//g, ''));

    const HeadArr = [];
    let leili = 0;
    for (let t = 0; t < hisProfit.length; t++) {
      const CalculatingArr = [];

      if (hisProfit[t].isFinish) {
        if (hisProfit[t].dayNumSignalWeak === 0) {
          leili = 0;
        } else {
          leili = Number(10 - hisProfit[t].dayNumSignalWeak);
        }
        CalculatingArr.push(hisProfit[t].signalDate, leili,
          hisProfit[t].signalStrength,
          hisProfit[t].tenDaysFinalRatio,
          hisProfit[t].tenDaysMaxRatio);
        HeadArr.push(CalculatingArr);
      } else {
        if (hisProfit[t].dayNumSignalWeak === 0) {
          leili = 0;
        } else {
          leili = hisProfit[t].dayNumSignalWeak;
        }

        CalculatingArr.push(hisProfit[t].signalDate, leili, hisProfit[t].signalStrength, '--', this.SnowflakesInTheWinter(MagicIsTheSame, hisProfit[t].signalDate), 1, 2);
        HeadArr.push(CalculatingArr);
      }
    }

    const tbdagtbdn = [];
    for (let i = 0; i < HeadArr.length; i++) {
      for (let vb = 0; vb < MagicIsTheSame.length; vb++) {
        if (MagicIsTheSame[vb][0] === HeadArr[i][0]) {
          const leistbd = [];
          const tiaos = (vb + 11) < MagicIsTheSame.length ? (vb + 11) : MagicIsTheSame.length;

          for (let tbd = vb; tbd < tiaos; tbd++) {
            leistbd.push(MagicIsTheSame[tbd][0]);
          }
          tbdagtbdn.push(leistbd);
        }
      }
    }

    for (let f = 0; f < SignalListData.length; f++) {
      for (let h = 0; h < HeadArr.length; h++) {
        if (HeadArr[h][0] === SignalListData[f]) {
          HeadArr[h][1] = 1;
        }
      }
    }

    return [tbdagtbdn, HeadArr, happyTime];
  },
  SplicingData(Renritian, t, s) {
    // const ParamDate = '--',
    //   CurrentSignal = '',
    //   TenDayIncrease = Renritian[3],
    //   PeriodIncrease = Renritian[4];

    const GeneMutation = Number(Renritian[3]).toFixed(2);
    const GeneMutationTow = Number(Renritian[4]).toFixed(2);

    const Thousands = `${Renritian[0]}`;
    //  `${Thousands.substring(4, 6)}月${Thousands.substring(6, 8)}日`;

    let signalDate = `${t.replace(/\//g, '')}`;
    signalDate = `${signalDate.substring(0, 4)}/${signalDate.substring(4, 6)}/${signalDate.substring(6, 8)}`;

    this.ParamDate = signalDate;
    this.CurrentSignal = '强';

    this.TenDayIncrease = Renritian[3] === '--' ? '--' : `${GeneMutation}%`;
    this.PeriodIncrease = Renritian[4] === '--' ? '--' : `${GeneMutationTow}%`;

    if (Renritian[2] > 0) {
      if (Renritian[5] >= 1) {
        for (let i = Number(Renritian[1]); i < s.length; i++) {
          if (Number(t.replace(/\//g, '')) === s[i]) {
            this.CurrentSignal = '转弱';
          }
        }
      } else {
        for (let i = Number(11 - Renritian[1]); i < s.length; i++) {
          if (Number(t.replace(/\//g, '')) === s[i]) {
            this.CurrentSignal = '转弱';
          }
        }
      }
    }

    if (Renritian[6] >= 2) {
      let signalDates = `${Renritian[0]}`;
      signalDates = `${signalDates.substring(0, 4)}/${signalDates.substring(4, 6)}/${signalDates.substring(6, 8)}`;

      const localStorageSignalDate = localStorage.getItem('signalDate').split(',');

      for (let i = 0; i < localStorageSignalDate.length; i++) {
        if (Number(localStorageSignalDate[i]) === Renritian[0]) {
          // (实时价-入选日收盘价)/入选日收盘价
          this.PeriodIncrease = `${Number(
            (GeneMutationTow - (Number(localStorageSignalDate[i + 1]))) / (Number(localStorageSignalDate[i + 1]))
            * 100
          ).toFixed(2)}%`;
          break;
        }
      }

      if (signalDates === t) {
        this.TenDayIncrease = '--';
        this.PeriodIncrease = '--';
      }
    }
    const Splicing = `${Number(Thousands.substring(4, 6))}月${Number(Thousands.substring(6, 8))}号入选<br/>当前信号：${this.CurrentSignal}<br/>十日最终涨幅：${this.TenDayIncrease}<br/>期间最高涨幅：${this.PeriodIncrease}<br/>`;
    return Splicing;
  }
};
