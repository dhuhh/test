// paginationsConfig
const paginationsConfig = {
  className: 'm-paging m-paging-no',
  total: -1,
  current: 1,
  hideOnSinglePage: false,
  showQuickJumper: true,
  showSizeChanger: true,
  defaultCurrent: 1,
  defaultPageSize: 10,
};

// paginationState
const paginationState = {
  paging: 1,
  current: 1,
  pageSize: 10,
  total: -1,
  sort: '',
};

// rowSelection
const rowSelection = {
  type: 'Checkbox',
  crossPageSelect: false, // checkbox开启跨页全选
  showSelectedCount: true, // 计算选中个数
};

export { paginationsConfig, paginationState, rowSelection };
