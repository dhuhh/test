export default [
  {
    code: '-1',
    enable: false,
    extra: [],
    range: {},
    more: {
      unit: '',
      unit_value: 0,
      strFormat: '空条件',
    },
    name: '',
    processor: {},
  },
  {
    code: 'account_open_date',
    enable: true,
    extra: [{
      data: [{
        note: '普通账户',
        value: '1',
      }, {
        note: '信用账户',
        value: '2',
      }, {
        note: '理财账户',
        value: '3',
      }, {
        note: '股票期权账户',
        value: '4',
      }],
      encode: 'account_type',
      name: '账户类型',
      required: true,
      tableName: '',
      type: 'Select',
      roules: '',
      value: '',
    }],
    range: {
      data: [],
      encode: 'range',
      name: '上限',
      required: true,
      tableName: '',
      type: 'BetweenInput',
      roules: '',
      value: '',
    },
    id: 1,
    more: {
      unit: '',
      unit_value: 1,
      strFormat: '开户日期[账户类型=account_type]range',
    },
    name: '开户日期',
    processor: {},
  },
  {
    code: 'account_open_date',
    enable: true,
    extra: [{
      data: [{
        note: '普通账户',
        value: '1',
      }, {
        note: '信用账户',
        value: '2',
      }, {
        note: '理财账户',
        value: '3',
      }, {
        note: '股票期权账户',
        value: '4',
      }],
      encode: 'account_type',
      name: '账户类型',
      required: true,
      tableName: '',
      type: 'Select',
      roules: '',
      value: '',
    }],
    range: {
      data: [],
      encode: 'range',
      name: '上限',
      required: true,
      tableName: '',
      type: 'BetweenInput',
      roules: '',
      value: '',
    },
    id: 1,
    more: {
      unit: '',
      unit_value: 1,
      hide: true, // 是否隐藏
      strFormat: '开户日期[账户类型=extra0]range',
    },
    name: '开户日期',
    processor: {},
  },
];
