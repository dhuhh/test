import { Hisstockslist, Hisfundslist, Hisstocksdetail, Hisfundsdetail } from '$services/newProduct/customerPortrait';

const filterDataSource = (dataSource = [], merge = false) => {
  let filterResult = [];
  if (merge) {
    dataSource.forEach(item => {
      if (item.opens) {
        let opens = [];
        item.opens.forEach(subItem => {
          if (subItem.is_hold !== 1) {
            opens.push(subItem);
          }
        });
        item.opens = opens;
        if (opens.length) {
          filterResult.push(item);
        }
      }
    });
  } else {
    dataSource.forEach(item => {
      if (item.is_hold !== 1) {
        filterResult.push(item);
      }
    });
  }
  return filterResult;
};

export async function HisstockslistService(payload) {
  return Hisstockslist(payload).then(res => {
    const { current = 1, pageSize = 10, paging = 1, filterCodes = [], activePositionType, queryType } = payload;
    const { records = {} } = res;
    // 清仓
    if (activePositionType === '3') {
      res.records.stocks = filterDataSource(res.records.stocks, queryType === '1' ? true : false);
    }
    // 多选筛选
    if (filterCodes.length && records.stocks) {
      let result = [];
      records.stocks.forEach(item => {
        if (filterCodes.includes(item.secu_code)) result.push(item);
      });
      res.records.stocks = result;
    }
    // 返回total
    if (records.stocks) {
      const total = res.records.stocks.length;
      res.total = total;
    }
    // 数据分页
    if (paging === 1) {
      if (records.stocks) {
        res.records.stocks = res.records.stocks.slice((current - 1) * pageSize, current * pageSize);
      }
    }
    // 添加key
    res.records.stocks = res.records.stocks.map((item, index) => ({ ...item, key: index }));
    return res;
  });
}

export async function HisfundslistService(payload) {
  return Hisfundslist(payload).then(res => {
    const { current = 1, pageSize = 10, paging = 1, filterCodes = [], activePositionType, queryType } = payload;
    const { records = {} } = res;
    // 清仓
    if (activePositionType === '3') {
      res.records.funds = filterDataSource(res.records.funds, queryType === '1' ? true : false);
    }
    // 多选筛选
    if (filterCodes.length && records.funds) {
      let result = [];
      records.funds.forEach(item => {
        if (filterCodes.includes(item.secu_code)) result.push(item);
      });
      res.records.funds = result;
    }
    // 返回total
    if (records.funds) {
      const total = res.records.funds.length;
      res.total = total;
    }
    // 数据分页
    if (paging === 1) {
      if (records.funds) {
        res.records.funds = res.records.funds.slice((current - 1) * pageSize, current * pageSize);
      }
    }
    // 添加key
    res.records.funds = res.records.funds.map((item, index) => ({ ...item, key: index }));
    return res;
  });
}

export async function HisstocksdetailService(payload) {
  return Hisstocksdetail(payload).then(res => {
    const { current = 1, pageSize = 10, paging = 1, isSell = '0' } = payload;
    const { records = {} } = res;
    // 只看卖出
    if (isSell === '1') {
      if (records.trades) {
        res.records.trades = res.records.trades.filter(item => item.is_buy === 0);
      }
    }
    // 返回total
    if (records.trades) {
      const total = res.records.trades.length;
      res.total = total;
    }
    // 数据分页
    if (paging === 1) {
      if (records.trades) {
        res.records.trades = res.records.trades.slice((current - 1) * pageSize, current * pageSize);
      }
    }
    return res;
  });
}

export async function HisfundsdetailService(payload) {
  return Hisfundsdetail(payload).then(res => {
    const { current = 1, pageSize = 10, paging = 1, isSell = '0' } = payload;
    const { records = {} } = res;
    // 只看卖出
    if (isSell === '1') {
      if (records.trades) {
        res.records.trades = res.records.trades.filter(item => item.is_buy === 0);
      }
    }
    // 返回total
    if (records.trades) {
      const total = res.records.trades.length;
      res.total = total;
    }
    // 数据分页
    if (paging === 1) {
      if (records.trades) {
        res.records.trades = res.records.trades.slice((current - 1) * pageSize, current * pageSize);
      }
    }
    return res;
  });
}
