import { getDictKey } from '../../../../utils/dictUtils';

// 配置指标的类型
const separator = '|';
const separatorBetween = '||';
export default {
  separatorBetween,
  separator,
  '-1': {
    name: '',
    upInput: {
      type: 'empty',
    },
    dw: '',
    format: `-1${separator}up`,
    strFormat: '空条件',
  },
  1: {
    name: '客户类型',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_khlx'),
      required: true,
    },
    dw: '',
    format: `1${separator}up`,
    strFormat: '客户类型=up',
  },
  2: {
    name: '开户日期',
    extra: [{
      type: 'KHRQ',
      required: true,
      // bkx: ['0'], // 不可选选项
      // zddm: getDictKey('gjsx_zhlx'),
      zdDatas: [{
        ibm: '1',
        note: '普通账户',
      }, {
        ibm: '2',
        note: '信用账户',
      }, {
        ibm: '3',
        note: '理财账户',
      }, {
        ibm: '4',
        note: '股票期权账户',
      }],
      name: '账户类型',
    }],
    // upInput: {
    //   type: 'Date',
    //   zddm: '',
    // },
    // downInput: {
    //   type: 'Date',
    //   zddm: '',
    // },
    dw: '',
    format: `2${separator}extra0`,
    strFormat: '开户日期extra0',
  },
  3: {
    name: '开通业务品种',
    extra: [{
      required: true,
      type: 'MultiModal',
      zddm: 'TJYQXCS',
    }],
    upInput: {
      type: 'Date',
    },
    downInput: {
      type: 'Date',
    },
    dw: '',
    format: `3${separator}up,down${separator}extra0`,
    strFormat: '开通业务品种[up-down]=extra0',
  },
  4: {
    name: '近期开户客户',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_lxzq'),
      name: '周期',
    },
    {
      type: 'Select',
      // zddm: getDictKey('gjsx_zhlx'),
      // bkx: ['0'],
      zdDatas: [{
        ibm: '1',
        note: '普通账户',
      }, {
        ibm: '2',
        note: '信用账户',
      }, {
        ibm: '3',
        note: '理财账户',
      }, {
        ibm: '4',
        note: '股票期权账户',
      }],
      name: '账户类型',
    }],
    upInput: {
      // type: 'MultiSelect',
      // zddm: getDictKey('khktywqx'),
      type: 'InputNum',
      required: true,
    },
    dw: '',
    format: `4${separator}extra0${separator}extra1${separator}up`,
    strFormat: '近期开户客户[周期=extra0;账户类型=extra1]=up',
  },
  5: {
    name: '开户方式',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_khfs'),
      required: true,
    },
    dw: '',
    format: `5${separator}up`,
    strFormat: '开户方式=up',
  },
  6: {
    name: '风险等级',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_fxcsnl'),
      required: true,
    },
    dw: '',
    format: `6${separator}up`,
    strFormat: '风险等级=up',
  },
  7: {
    name: '客户级别',
    upInput: {
      type: 'Select',
      zddm: 'TKHJBDY',
      required: true,
    },
    dw: '',
    format: `7${separator}up`,
    strFormat: '客户级别=up',
  },
  // 8: {
  //   name: '客户分类',
  //   upInput: {
  //     type: 'Select',
  //     zddm: '',
  //     required: true,
  //   },
  //   dw: '',
  //   format: `8${separator}up`,
  //   strFormat: '客户分类=up',
  // },
  // 9: {
  //   name: '客户群',
  //   upInput: {
  //     type: 'Select',
  //     zddm: '',
  //     required: true,
  //   },
  //   dw: '',
  //   format: `9${separator}up`,
  //   strFormat: '客户群=up',
  // },
  10: {
    name: '投资者类型',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_sdx_tzzf'),
      required: true,
    },
    dw: '',
    format: `10${separator}up`,
    strFormat: '投资者类型=up',
  },
  11: {
    name: '投资品种',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_tzcp'),
      required: true,
    },
    dw: '',
    format: `11${separator}up`,
    strFormat: '投资品种=up',
  },
  12: {
    name: '手机号',
    upInput: {
      type: 'Input',
      zddm: '',
    },
    dw: '',
    format: `12${separator}up`,
    strFormat: '手机号=up',
  },
  13: {
    name: 'T-1资产',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `13${separator}extra0${separator}up`,
    strFormat: 'T-1资产[资产类型=extra0][up]',
  },
  14: {
    name: '峰值资产',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
      bkx: ['3', '4'],
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      // zddm: getDictKey('gjsx_tjzq'),
      zdDatas: [{ // 有字典
        ibm: '5',
        note: '近一个月',
      }, {
        ibm: '6',
        note: '近三个月',
      }, {
        ibm: '10',
        note: '近半年',
      }, {
        ibm: '11',
        note: '近一年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `14${separator}extra0${separator}extra1${separator}up`,
    strFormat: '峰值资产[统计周期=extra0][up]',
  },
  15: {
    name: '日均资产',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      // bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '3',
        note: '本月',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `15${separator}extra0${separator}extra1${separator}up`,
    strFormat: '日均资产[账户类型=extra0；统计周期=extra1][up]',
  },
  16: {
    name: '净流入资产',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `16${separator}extra0${separator}extra1${separator}up`,
    strFormat: '净流入资产[账户类型=extra0；统计周期=extra1][up]',
  },
  17: {
    name: '净流出资产',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `17${separator}extra0${separator}extra1${separator}up`,
    strFormat: '净流出资产[账户类型=extra0；统计周期=extra1][up]',
  },
  18: {
    name: '账户盈亏率',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '%',
    dwz: 0.01,
    format: `18${separator}extra0${separator}extra1${separator}up`,
    strFormat: '账户盈亏率[账户类型=extra0；统计周期=extra1][up]',
  },
  19: {
    name: '持仓股票',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'SearchInput_zq',
      zddm: 'tpif_cpdm',
      name: '股票代码',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '股',
    format: `19${separator}extra0${separator}extra1${separator}up`,
    strFormat: '持仓股票[账户类型=extra0；股票代码=extra1][up]',
  },
  20: {
    name: '仓位',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '%',
    format: `20${separator}extra0${separator}up`,
    strFormat: '仓位[账户类型=extra0][up]',
  },
  21: {
    name: '持仓风险品种',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'MultiSelect',
      zddm: getDictKey('jsjb'),
      name: '持有品种',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '股',
    format: `21${separator}extra0${separator}extra1${separator}up`,
    strFormat: '持仓风险品种[账户类型=extra0；持有品种=extra1][up]',
  },
  23: {
    name: '个股交易量',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'SearchInput_zq',
      zddm: 'tpif_cpdm',
      name: '股票代码',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    {
      type: 'Select',
      zddm: getDictKey('gjsx_mmfx'),
      name: '交易类别',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `23${separator}extra0${separator}extra1${separator}extra2${separator}extra3${separator}up`,
    strFormat: '个股交易量[账户类型=extra0;股票代码=extra1;统计时段=extra2;交易类别=extra3;][up]',
  },
  24: {
    name: '账户交易量',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    {
      type: 'Select',
      zddm: getDictKey('gjsx_mmfx'),
      name: '交易类别',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `24${separator}extra0${separator}extra1${separator}extra2${separator}up`,
    strFormat: '账户交易量[账户类型=extra0;统计时段=extra1;交易类别=extra2][up]',
  },
  25: {
    name: '佣金贡献',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '元',
    format: `25${separator}extra0${separator}extra1${separator}up`,
    strFormat: '佣金贡献[账户类型=extra0;统计时段=extra1][up]',
  },
  26: {
    name: '周转率',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '%',
    dwz: 0.01,
    format: `26${separator}extra0${separator}extra1${separator}up`,
    strFormat: '周转率[账户类型=extra0;统计时段=extra1][up]',
  },
  27: {
    name: '交易频次',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      bkx: ['3', '4'],
      name: '账户类型',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{ // 有字典
        ibm: '1',
        note: '上周',
      }, {
        ibm: '2',
        note: '本周',
      }, {
        ibm: '4',
        note: '上月',
      }, {
        ibm: '3',
        note: '本月',
      }, {
        ibm: '11',
        note: '近一年',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: ' ',
    format: `27${separator}extra0${separator}extra1${separator}up`,
    strFormat: '交易频次[账户类型=extra0;统计时段=extra1][up]',
  },
  28: {
    name: '无交易客户',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
      bkx: ['3', '4'],
      required: true,
    },
    {
      type: 'Select',
      zddm: getDictKey('tjzq'),
      name: '统计时段',
      required: true,
    },
    ],
    dw: ' ',
    format: `28${separator}extra0${separator}extra1`,
    strFormat: '无交易客户[账户类型=extra0;统计时段=extra1]',
  },
  29: {
    name: '营销服务人员',
    // extra: [{
    //   type: 'Select',
    //   zddm: 'CIS_RYLB',
    //   name: '人员类别',
    //   required: true,
    // },
    // ],
    upInput: {
      type: 'SingleFetchModal',
      url: '/api/staffrelationship/v1/queryStaffType',
      limit: {
        type: 'Select',
        limitKey: 'ryfl',
        options: [
          {
            value: '1',
            note: '客户经理',
          },
          {
            value: '2',
            note: '理财经理',
          },
          {
            value: '3',
            note: '投资顾问',
          },
          {
            value: '4',
            note: '市场总监',
          },
          {
            value: '103',
            note: '证券经纪人',
          },
        ],
      },
      columns: [
        {
          title: '人员编号',
          dataIndex: 'rybh',
          key: 'rybh',
        },
        {
          title: '人员ID',
          dataIndex: 'ryid',
          key: 'ryid',
        },
        {
          title: '人员姓名',
          dataIndex: 'ryxm',
          key: 'ryxm',
        },
      ],
      nameKey: 'ryxm',
      valueKey: 'ryid',
      required: true,
    },
    dw: ' ',
    format: `29${separator}up`,
    strFormat: '营销服务人员编号=up',
  },
  30: {
    name: '客户生日',
    extra: [{
      type: 'Select',
      zddm: getDictKey('srtxlx'),
      name: '提醒类型',
      required: true,
    },
    {
      type: 'Select',
      zddm: getDictKey('lxzq'),
      name: '提醒周期',
      required: true,
    },
    ],
    upInput: {
      type: 'InputNum',
      zddm: '',
      required: true,
    },
    dw: ' ',
    format: `30${separator}extra0${separator}extra1${separator}up`,
    strFormat: '客户生日[提醒类型=extra0, 提醒周期=up(extra1)]',
  },
  31: {
    name: '联系方式是否有效',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsxsf'),
      name: '是否有效',
      required: true,
    },
    ],
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_yxlxfs'),
      required: true,
    },
    dw: ' ',
    format: `31${separator}extra0${separator}up`,
    strFormat: '联系方式是否有效[是否有效=extra0]up',
  },
  32: {
    name: '联系方式登记情况',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsxsf'),
      name: '是否登记',
      required: true,
    },
    ],
    upInput: {
      type: 'MultiSelect',
      zdDatas: [
        {
          ibm: '2',
          note: 'EMAIL',
        },
        {
          ibm: '8',
          note: '手机',
        },
        {
          ibm: '5',
          note: '固话',
        },
      ],
      required: true,
    },
    dw: ' ',
    format: `32${separator}extra0${separator}up`,
    strFormat: '联系方式是否登记[是否登记=extra0]up',
  },
  33: {
    name: '免打扰',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_mdrxx'),
      required: true,
    },
    dw: ' ',
    format: `33${separator}up`,
    strFormat: '免打扰=up',
  },
  34: {
    name: '偏好联系方式',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_phlxfs'),
      required: true,
    },
    dw: ' ',
    format: `34${separator}up`,
    strFormat: '偏好联系方式=up',
  },
  35: {
    name: '偏好联系时间',
    upInput: {
      type: 'Select',
      zddm: getDictKey('gjsx_phlxsj'),
      required: true,
    },
    dw: ' ',
    format: `35${separator}up`,
    strFormat: '偏好联系时间=up',
  },
  36: {
    name: '最近服务过客户',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_lxzq'),
      name: '周期',
      required: true,
    },
    ],
    upInput: {
      type: 'InputNum',
      zddm: '',
      required: true,
    },
    dw: ' ',
    format: `36${separator}extra0${separator}up`,
    strFormat: '最近服务过客户[周期=extra0]=up',
  },
  37: {
    name: '最近未服务客户',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_lxzq'),
      name: '周期',
      required: true,
    },
    ],
    upInput: {
      type: 'Input',
      zddm: '',
      required: true,
    },
    dw: ' ',
    format: `37${separator}extra0${separator}up`,
    strFormat: '最近未服务客户[周期=extra0]=up',
  },
  38: {
    name: '服务产品订制',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsxsf'),
      name: '是否有效',
      required: true,
    },
    ],
    upInput: {
      type: 'MultiModal',
      zddm: 'TFWCP',
      required: true,
    },
    dw: ' ',
    format: `38${separator}extra0${separator}up`,
    strFormat: '服务产品订制(up)[是否有效=extra0]',
  },
  39: {
    name: '当前持有产品',
    extra: [{
      type: 'SearchInput_cp',
      zddm: 'tpif_cpdm',
      name: '选择产品',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: ' ',
    dwz: 1,
    format: `39${separator}extra0${separator}up`,
    strFormat: '当前持有产品[产品代码=extra0]=[up]',
  },
  40: {
    name: '曾经交易的产品',
    extra: [{
      type: 'SearchInput_cp',
      zddm: 'tpif_cpdm',
      name: '选择产品',
      required: true,
    },
    {
      type: 'Select',
      // zddm: getDictKey('tjzq'),
      zdDatas: [{
        ibm: '3',
        note: '本月',
      },
      {
        ibm: '7',
        note: '本季',
      }, {
        ibm: '8',
        note: '上年',
      }, {
        ibm: '9',
        note: '本年',
      }],
      name: '统计时段',
      required: true,
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: ' ',
    format: `40${separator}extra0${separator}extra1${separator}up`,
    strFormat: '曾经交易的产品[产品代码=extra0, 统计时段=extra1]=[up]',
  },
  41: {
    name: '理财账户开通',
    extra: [],
    upInput: {
      type: 'Select',
      zddm: getDictKey('gjsx_sfkt'),
    },
    dw: ' ',
    format: `41${separator}up`,
    strFormat: '理财账户开通=up',
  },
  42: {
    name: '信用评分',
    extra: [],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '分',
    format: `42${separator}up`,
    strFormat: '信用评分[up]',
  },
  43: {
    name: '信用等级',
    extra: [],
    upInput: {
      type: 'Select',
      zddm: getDictKey('xydj'),
      required: false,
    },
    dw: ' ',
    format: `43${separator}up`,
    strFormat: '信用等级=up',
  },
  44: {
    name: '授信额度',
    extra: [
      {
        name: '授信额度类型',
        type: 'Select',
        zddm: getDictKey('gjsx_sxedlx'),
        required: true,
      },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `44${separator}extra0${separator}up`,
    strFormat: '授信额度(extra0)[up]',
  },
  45: {
    name: '关系类型',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gxlx'),
      required: true,
    },
    dw: ' ',
    format: `45${separator}up`,
    strFormat: '关系类型=up',
  },
  46: {
    name: '证件类别及有效期',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_zjlb'),
      name: '证件类别',
      required: true,
    },
    ],
    upInput: {
      type: 'Date',
    },
    downInput: {
      type: 'Date',
      zddm: '',
    },
    dw: ' ',
    format: `46${separator}extra0${separator}up,down`,
    strFormat: '证件类别=extra0（up,down）',
  },
  47: {
    name: '存管银行',
    upInput: {
      type: 'MultiModal',
      zddm: 'TJGDM',
      required: true,
      name: '存管银行ID',
    },
    dw: ' ',
    format: `47${separator}up`,
    strFormat: '存管银行=up',
  },
  48: {
    name: '反洗钱风险等级',
    upInput: {
      type: 'Select',
      zddm: getDictKey('gjsxfxqfxdj'),
      required: false,
      name: '存管银行ID',
    },
    dw: ' ',
    format: `48${separator}up`,
    strFormat: '反洗钱风险等级=up',
  },
  49: {
    name: '重点监控账户',
    upInput: {
      type: 'Select',
      zddm: getDictKey('gjsxsf'),
      required: false,
      name: '是否重点监控账户',
    },
    dw: ' ',
    format: `49${separator}up`,
    strFormat: '重点监控账户=up',
  },
  50: {
    name: '客户状态',
    upInput: {
      type: 'Select',
      zddm: getDictKey('gjsx_khzt'),
      required: false,
      name: '客户状态',
    },
    dw: ' ',
    format: `50${separator}up`,
    strFormat: '客户状态=up',
  },
  51: {
    name: 'T-1净资产',
    extra: [{
      type: 'Select',
      bkx: ['3', '4'], // 不可选选项
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
    }],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `51${separator}extra0${separator}up`,
    strFormat: 'T-1净资产(客户类型=extra0)=(up)',
  },
  52: {
    name: '峰值净资产',
    extra: [{
      type: 'Select',
      bkx: ['3', '4'], // 不可选选项
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
    },
    {
      type: 'Select',
      // bkx: ['1', '2', '3', '4', '7', '8', '9', '10'], // 不可选选项
      zdDatas: [{ // 有字典
        ibm: '5',
        note: '近一个月',
      }, {
        ibm: '6',
        note: '近三个月',
      }, {
        ibm: '10',
        note: '近半年',
      }, {
        ibm: '11',
        note: '近一年',
      }],
      name: '统计周期',
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `52${separator}extra0${separator}extra1${separator}up`,
    strFormat: '峰值净资产(账户类型=extra0)=(up)',
  },
  53: {
    name: '日均净资产',
    extra: [{
      type: 'Select',
      bkx: ['3', '4'], // 不可选选项
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
    },
    {
      type: 'Select',
      bkx: ['0', '1', '2', '4', '5', '6', '7', '8', '10', '11', '12'], // 不可选选项
      zddm: getDictKey('gjsx_tjzq'),
      name: '统计周期',
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `53${separator}extra0${separator}extra1${separator}up`,
    strFormat: '日均净资产(账户类型=extra0)=(up)',
  },
  54: {
    name: '日均场内净资产',
    extra: [{
      type: 'Select',
      bkx: ['3', '4'], // 不可选选项
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
    },
    {
      type: 'Select',
      // bkx: ['1', '2', '4', '5', '6', '7', '8', '10', '11'], // 不可选选项
      // zddm: getDictKey('gjsx_tjzq'),
      zdDatas: [{ // 有字典
        ibm: '13',
        note: '近五日',
      }, {
        ibm: '5',
        note: '近一月',
      }, {
        ibm: '11',
        note: '近一年',
      }],
      name: '统计周期',
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `54${separator}extra0${separator}extra1${separator}up`,
    strFormat: '日均场内净资产(账户类型=extra0)=(up)',
  },
  55: {
    name: '佣金率',
    extra: [{
      type: 'Select',
      bkx: ['0', '3', '4'], // 不可选选项
      zddm: getDictKey('gjsx_zhlx'),
      name: '账户类型',
    },
    {
      type: 'Select',
      bkx: ['5', '6', '7', '10', '12'], // 不可选选项
      zddm: getDictKey('gjsx_tjzq'),
      name: '统计周期',
    },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '‰',
    dwz: 1,
    format: `55${separator}extra0${separator}extra1${separator}up`,
    strFormat: '佣金率(账户类型=extra0)=(up)',
  },
  56: {
    name: '团队',
    // extra: [{
    //   type: 'Select',
    //   zddm: getDictKey('gjsx_tdlb'),
    //   name: '团队类型',
    // },
    // ],
    upInput: {
      type: 'MultiModal',
      zddm: 'TTDBM',
      required: true,
    },
    dw: ' ',
    format: `56${separator}up`,
    strFormat: '团队=up',
  },
  57: {
    name: '曾经持有产品分类',
    extra: [{
      type: 'Select',
      bkx: ['1', '2', '4', '5', '6', '10', '11'], // 不可选选项
      zddm: getDictKey('gjsx_tjzq'),
      name: '统计周期',
    },
    ],
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_cpfl'),
      name: '产品分类',
      required: true,
    },
    dw: ' ',
    format: `57${separator}up${separator}extra0`,
    strFormat: '曾经持有产品分类(extra0)=up',
  },
  58: {
    name: '当前持有产品分类',
    upInput: {
      type: 'MultiSelect',
      zddm: getDictKey('gjsx_cpfl'),
      name: '产品分类',
      required: true,
    },
    dw: ' ',
    format: `58${separator}up`,
    strFormat: '当前持有产品分类(extra0)=up',
  },
  59: {
    name: '营业部',
    upInput: {
      type: 'MultiModal',
      zddm: 'vYYB',
      required: true,
    },
    dw: ' ',
    format: `59${separator}up`,
    strFormat: '营业部=up',
  },
  60: {
    name: '投资者类型有效期',
    extra: [{
      type: 'Select',
      zddm: getDictKey('gjsx_sdx_tzzf'),
      name: '投资者分类',
    }],
    upInput: {
      type: 'Date',
    },
    downInput: {
      type: 'Date',
    },
    dw: ' ',
    format: `60${separator}extra0${separator}up,down`,
    strFormat: '投资者类型有效期(extra0)=up,down',
  },
  61: {
    name: '风险等级有效期',
    // extra: [{
    //   type: 'Select',
    //   zddm: getDictKey('gjsx_fxcsnl'),
    //   name: '承受能力',
    // }],
    upInput: {
      type: 'Date',
    },
    downInput: {
      type: 'Date',
    },
    dw: ' ',
    format: `61${separator}up,down`,
    strFormat: '风险等级有效期(up,down)',
  },
  62: {
    name: '两融余额',
    extra: [
      {
        name: '两融余额类型',
        type: 'Select',
        zddm: getDictKey('gjsx_lryelx'),
        required: true,
      },
    ],
    upInput: {
      type: 'BetweenInput',
      required: true,
    },
    dw: '万元',
    dwz: 10000,
    format: `62${separator}extra0${separator}up`,
    strFormat: '两融余额(extra0)(up)',
  },
  63: {
    name: '',
    hide: true, // 隐藏条件
    upInput: {
      type: 'Select',
      // zddm: getDictKey('gjsx_lryelx'),
    },
    strFormat: '',
    format: `63${separator}up`,
  },
  64: {
    name: '个人金融资产',
    upInput: {
      type: 'Select',
      zddm: getDictKey('jrlzc'),
    },
    strFormat: '个人金融资产=up',
    format: `64${separator}up`,
  },
  65: {
    name: '人负债情况',
    upInput: {
      type: 'Select',
      zddm: getDictKey('fzqk'),
    },
    strFormat: '人负债情况类型=up',
    format: `65${separator}up`,
  },
  66: {
    name: '个人年收入',
    upInput: {
      type: 'Select',
      zddm: getDictKey('grnsr'),
    },
    strFormat: '个人年收入=up',
    format: `66${separator}up`,
  },
  67: {
    name: '个人负债比率',
    upInput: {
      type: 'Select',
      zddm: getDictKey('grfzbl'),
    },
    strFormat: '个人负债比率=up',
    format: `67${separator}up`,
  },
  68: {
    name: '个人收入来源',
    upInput: {
      type: 'Select',
      zddm: getDictKey('srly'),
    },
    strFormat: '个人收入来源=up',
    format: `68${separator}up`,
  },
  69: {
    name: '最近三年交易过的投资品种',
    upInput: {
      type: 'Select',
      zddm: getDictKey('zjjypz'),
    },
    strFormat: '最近三年交易过的投资品种=up',
    format: `69${separator}up`,
  },
  70: {
    name: '选择产品的主要原因',
    upInput: {
      type: 'Select',
      zddm: getDictKey('xzcpyy'),
    },
    strFormat: '选择产品的主要原因=up',
    format: `70${separator}up`,
  },
  71: {
    name: '家庭年收入',
    upInput: {
      type: 'Select',
      zddm: getDictKey('jtnsr'),
    },
    strFormat: '家庭年收入=up',
    format: `71${separator}up`,
  },
  72: {
    name: '资产构成',
    upInput: {
      type: 'Select',
      zddm: getDictKey('JTZCZC'),
    },
    strFormat: '资产构成=up',
    format: `72${separator}up`,
  },
  73: {
    name: '房屋资产',
    upInput: {
      type: 'Select',
      zddm: getDictKey('fwzc'),
    },
    strFormat: '房屋资产=up',
    format: `73${separator}up`,
  },
  75: {
    name: '开户日期',
    extra: [{
      type: 'Select',
      required: true,
      // bkx: ['0'], // 不可选选项
      // zddm: getDictKey('gjsx_zhlx'),
      zdDatas: [{
        ibm: '1',
        note: '普通账户',
      }, {
        ibm: '2',
        note: '信用账户',
      }, {
        ibm: '3',
        note: '理财账户',
      }, {
        ibm: '4',
        note: '股票期权账户',
      }],
      name: '账户类型',
    }],
    upInput: {
      type: 'Date',
      zddm: '',
    },
    downInput: {
      type: 'Date',
      zddm: '',
    },
    dw: '',
    format: `2${separator}extra0${separator}up,down`,
    strFormat: '开户日期[up-down]',
  },
};

