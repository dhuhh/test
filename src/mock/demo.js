const { config } = require('./common');

const { apiPrefix } = config;
const option = {
  code: 1,
  data: [{
    type: 'MOT',
    name: 'MOT待办事件',
    zs: 21,
    wcs: 18,
  },
  {
    type: 'qzyw',
    name: '待办流程',
    zs: 100,
    wcs: 66,
    data: [
      { name: '潜在开发业务1', key: 'qzyw1', data: 25 },
      { name: '潜在开发业务2', key: 'qzyw2', data: 25 },
      { name: '潜在开发业务3', key: 'qzyw3', data: 25 },
      { name: '潜在开发业务4', key: 'qzyw4', data: 25 },
    ],
  },
  {
    type: 'zdzx',
    name: '重点在销产品',
    zs: 18,
    wcs: 9,
    data: [
      { name: '重点在销产品1', key: 'zdzx1', data: 25 },
      { name: '重点在销产品2', key: 'zdzx1', data: 25 },
      { name: '重点在销产品3', key: 'zdzx1', data: 25 },
      { name: '重点在销产品4', key: 'zdzx1', data: 25 },
    ],
  },
  {
    type: 'wfwkh',
    name: '未服务客户',
    zs: 33,
    wcs: 16,
  },
  ],
};


module.exports = {
  [`GET ${apiPrefix}/liquidfill`](req, res) {
    res.status(200).json(option);
  },
};

