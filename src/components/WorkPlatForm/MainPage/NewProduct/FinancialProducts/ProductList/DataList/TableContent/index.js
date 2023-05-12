import React from 'react';
import { Table, message, Popover } from 'antd';
import { Link } from 'dva/router';
import debounce from 'lodash.debounce';
import { EncryptBase64 } from '../../../../../../../Common/Encrypt';
import FilterDropdown from '../../../../../../../Biz/NewProduct/FilterDropdown';
import { FetchQueryProductList, FetchChooseMyProduct, FetchProductCommonSearch, FetchProductCountAggs } from '../../../../../../../../services/newProduct';
import styles from '../../index.less';
// import NewScrollTable from '../../../../../../../Common/NewScrollTable';

class TableContent extends React.Component {
  constructor(props) {
    super(props);
    this.fetchData = debounce(this.fetchData, 400);
    this.state = {
      dataSource: [],
      count: 0,
      columnExtraTitle: {}, // 红色小字
      loading: false,
      productFilterPayload: {},
      filterDicData: [], // 筛选下拉字典
    };
    const { getInstence } = this.props;
    if (getInstence) {
      getInstence(this);
    }
  }

  componentDidMount() {
    const { payload = {} } = this.props;
    this.fetchData(payload);
    // 查询筛选字典
    this.fetchFilterDicData(payload);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { payload: prePayload = {} } = this.props;
    const { payload: aftPayload = {} } = nextProps;
    const { productState: preProductState, fieldsCode: preFieldsCode } = prePayload;
    const { productState: aftProductState, fieldsCode: aftFieldsCode } = aftPayload;
    if (JSON.stringify({ ...prePayload, productState: '', fieldsCode: [] }) !== JSON.stringify({ ...aftPayload, productState: '', fieldsCode: [] })) {
      // if (aftProductState === '6' && preCustomerType !== aftCustomerType) { //选中'我的'，客户类型变化时
      //   this.fetchData({ customerType: aftCustomerType, pagerModel: { pageNo: 1, pageSize: 20 }, productState: aftProductState, queryType, fieldsCode });
      // }
      // else {
      this.fetchData(aftPayload);
      // }
    } if (JSON.stringify(preFieldsCode) !== JSON.stringify(aftFieldsCode) && preProductState === aftProductState) {
      this.fetchData(aftPayload);
    }
    // 判断是否查询筛选下拉字典
    if (this.toFetchFilterDic(prePayload, aftPayload)) {
      this.fetchFilterDicData(aftPayload);
    }
    if (aftPayload.attrConditionModels.length === 0) {
      this.setState({ columnExtraTitle: {} });
    }

  }

  fetchData = (payload) => {
    const { handleSummaryChange, handleSetCount } = this.props;
    const { fieldsCode = [], queryType } = payload;
    // 修复 个人/团队/营业部 tab切换后，点击"产品状态"条件，不调用list接口问题
    if (!queryType || fieldsCode.length === 0) {
      // if (fieldsCode.length === 0) {
      return;
    }
    this.setState({ loading: true });
    FetchQueryProductList({
      ...payload,
    }).then((ret = {}) => {
      const { code = 0, data = [], summary = [], count = 0 } = ret;
      if (code > 0) {
        this.setState({
          dataSource: data.map((m, i) => ({ no: i + 1, ...m })),
          count,
          loading: false,
        });
        if (handleSummaryChange && handleSetCount) {
          handleSummaryChange(summary);
          handleSetCount(count);
        }
        // const { productState = '' } = payload;
        // if (productState === '6') {
        //   const { handleSearchFormTerms } = this.props;
        //   if (handleSearchFormTerms) {
        //     handleSearchFormTerms(count + '');
        //   }
        // }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchFilterDicData = (payload) => {
    FetchProductCountAggs({
      attrConditionModels: payload.attrConditionModels,
      customerType: payload.customerType,
      excludeFunds: payload.excludeFunds,
      productState: payload.productState,
      queryType: payload.queryType,
      fieldsCode: payload.fieldsCode,
    }).then((ret = {}) => {
      const { code = 0, data = [] } = ret;
      if (code > 0) {
        this.setState({ filterDicData: data });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  renderColumns = (text, ftFmtTp) => {
    if (text.includes('.')) { //如果是浮点数
      let textArr = text.split('.');
      let textOne = textArr[0];
      let textSecond = text.substring(text.indexOf('.') + 1, text.indexOf('.') + 3);
      // console.log('value', textOne + '.' + textSecond);
      if (ftFmtTp === '2') {
        return <Popover content={<span className={text.includes('-') > 0 ? 'green' : 'pink'}>{text}</span>}><span className={text.indexOf('-') > 0 ? 'green' : 'pink'}>{textOne + '.' + textSecond}</span></Popover>;
      } else {
        return <Popover content={<span>{text}</span>}><span>{textOne + '.' + textSecond}</span></Popover>;
      }
    } else {
      return <div className='m-darkgray'>{text}</div>;
    }

  }

  assembleColumns = () => {
    const { columnExtraTitle = {}, filterDicData = [] } = this.state;
    const { payload: { sort = [], attrConditionModels = [] } } = this.props;
    const [sortObj = {}] = sort;
    const customizedColumns = this.getCustomizedColumns();
    // 除掉产品id和name的列
    const excludeProductColumns = customizedColumns.filter(m => m.colCode !== 'product_id' && m.colCode !== 'product_name' && m.colCode !== 'product_code');
    const columns = [{
      title: '序号',
      dataIndex: 'no',
      key: 'no',
      fixed: excludeProductColumns.length > 0 ? 'left' : false,
      align: 'left',
      width: 80,
    }, {
      title: '产品名称',
      dataIndex: 'product_name',
      key: 'product_name',
      fixed: excludeProductColumns.length > 0 ? 'left' : false,
      align: 'left',
      width: 200,
      // filterDropdown: <FilterProduct payload={this.state.productFilterPayload} filterProductOnChange={this.filterProductOnChange} />,
      // filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
      // onFilterDropdownVisibleChange: this.filterProductVisbleChange,
      render: text => text || '--',
    }, {
      title: '产品代码',
      dataIndex: 'product_code',
      key: 'product_code',
      fixed: excludeProductColumns.length > 0 ? 'left' : false,
      align: 'left',
      width: 155,
      render: text => text || '--',
    }];
    // 自定义列
    customizedColumns.forEach((m) => {
      if (['product_code', 'product_name'].includes(m.colCode)) {
        return;
      }
      const col = {
        key: m.colCode,
        dataIndex: m.colCode,
        title: (
          <div style={{ position: 'relative', top: `${m.title || columnExtraTitle[m.colCode] ? '.483rem' : ''}` }}>
            <div>{m.dispCol}</div>
            <div style={{ color: '#ff6e30', fontSize: '12px', lineHeight: '1' }}>
              {
                m.title ? `(${m.title})` : ''
              }
            </div>
            {
              columnExtraTitle[m.colCode] && (
                <div
                  className={styles.textOverFlow}
                  style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                  title={columnExtraTitle[m.colCode]}
                >
                  ({columnExtraTitle[m.colCode]})
                </div>
              )
            }
          </div>
        ),
        // width: 200,
        align: 'left',
        sorter: m.fstClkOrdTp !== '' ? true : false,
        sortOrder: sortObj[m.colCode] && (sortObj[m.colCode] === 'asc' ? 'ascend' : 'descend'),
        filtered: attrConditionModels.map(m => m.esCode).includes(m.colCode),
        render: (text) => {
          if (text) {
            if (m.ftFmtTp === '2') {
              return this.renderColumns(text, m.ftFmtTp);
            }
            if (m.colCode === 'product_status_name') {
              return text.join('，');
            }
            return this.renderColumns(text, m.ftFmtTp);
          }
          return text || '--';
        },
      };
      if (m.valObjsivTp && m.valObjsivTp !== '0') {
        col.filterDropdown = ({ confirm }) => {
          return <FilterDropdown type={m.valObjsivTp} dictKey={m.valObj} colCode={m.colCode} filterDicData={filterDicData} onChange={(value) => { this.handleFilterChange(value, m); }} confirm={confirm} />;
        };
      };
      columns.push(col);
    });
    // 自定义列没有的时候，加入空列防止fix出现重复列和多个空列的问题
    if (excludeProductColumns.length === 0) {
      columns.push({
        title: '',
        key: 'columnToCheckFix',
        dataIndex: 'columnToCheckFix',
      });
    }
    columns.push({
      title: '查看',
      key: 'showDetail',
      dataIndex: 'showDetail',
      fixed: excludeProductColumns.length > 0 ? 'right' : false,
      align: 'left',
      width: 50,
      render: (text, record) => (
        <Link
          to={this.handlerSearch(record)}
          title={record.product_id}
        >
          <a style={{ color: '#244fff' }} target="_blank">查看</a>
        </Link>
      ),
    });
    columns.push({
      title: '自选',
      key: 'isChc',
      dataIndex: 'isChc',
      fixed: excludeProductColumns.length > 0 ? 'right' : false,
      align: 'center',
      width: 50,
      render: (text, record) => (
        <span onClick={() => { this.handleIsChoChange(record); }} style={{ cursor: 'pointer' }}>
          {
            text ? (
              <i className='iconfont icon-jianshao' style={{ fontSize: '15px' }}></i>
            ) : (
              <i className='iconfont icon-tj2' style={{ color: 'rgb(36, 79, 255)', fontSize: '15px' }}></i>
            // <Icon type="plus-circle" style={{ color: 'rgb(36, 79, 255)' }} />
            )
          }
        </span>
      ),
    });
    return columns;
  }

  handlerSearch = (record) => {
    const url = `/productSalesPanorama/index/${this.getParams(record)}`;
    return url;
  }

  //跳转到产品全景的参数
  getParams = (record) => {
    const { payload: { customerType = '', queryType = '' } } = this.props;
    const cusType = customerType;
    let queryParams = {};
    if (record) {
      queryParams = { cusType: cusType, queryType: queryType, cpId: record.product_id, productName: record.product_name, productCode: record.product_code };
      const paramsStr = JSON.stringify(queryParams);
      // 将参数base64加密
      // queryParams = this.URLencode(EncryptBase64(paramsStr));
      queryParams = encodeURIComponent(EncryptBase64(paramsStr));
    }
    return queryParams;
  }

  URLencode = (sStr) => {
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(/\'/g, '%27').replace(/\//g, '%2F');
  }

  // 获取自定义列
  getCustomizedColumns = () => {
    // 所有的可选指标
    const { allProductDisplayColumns = [], payload } = this.props;
    // 已选中指标
    const { fieldsCode } = payload;
    const tmplAllColumns = [];
    allProductDisplayColumns.forEach((m) => {
      // 把指标的子指标展开
      if (!m.statcCycl) {
        tmplAllColumns.push(m);
      } else {
        const tArr = m.statcCycl.split(';');
        tArr.forEach((n) => {
          const [tTitle, tCode] = n.split(':');
          tmplAllColumns.push({
            ...m,
            colCode: tCode,
            dispCol: `${m.dispCol}`,
            statcCycl: '',
            title: tTitle,
          });
        });
      }
    });
    const arr = [];
    fieldsCode.forEach((m) => {
      const tmpl = tmplAllColumns.find(n => n.colCode === m);
      if (tmpl) {
        // console.log(tmpl);
        arr.push(tmpl);
      }
    });
    return arr;
  }

  handleFilterChange = ({ value = [], title = '' }, colInfo) => {
    const { columnExtraTitle = {} } = this.state;
    const { payload: { attrConditionModels = [] }, handleFormChange } = this.props;
    const tacm = JSON.parse(JSON.stringify(attrConditionModels));
    // type：条件类型（0简单 1range），esCode：ES编码，esValue：值
    // 先判断是否已存在
    const tIndex = tacm.findIndex(m => m.esCode === colInfo.colCode);
    if (tIndex > -1) {
      tacm[tIndex].esValue = value.join(',');
    } else {
      tacm.push({
        type: colInfo.valObjsivTp === '2' ? '1' : '0',
        esCode: colInfo.colCode,
        esValue: value.join(','),
      });
    }
    if (handleFormChange) {
      handleFormChange({ attrConditionModels: tacm.filter(m => !!m.esValue) });
    }
    let re = /^[0-9]+.?[0-9]*$/;
    let titleStr = title.substring(title.indexOf('(') + 1, title.lastIndexOf(')'));
    if (re.test(titleStr)) {
      title = title.substring(0, title.indexOf('('));  //如果括号内是数字就截取
    }
    // 小字
    columnExtraTitle[colInfo.colCode] = title;
    this.setState({ columnExtraTitle });
  }

  handleChange = (pagination, filters, sorter, isResizeStop = false) => { // eslint-disable-line
    const { current, pageSize } = pagination;
    if (!pageSize) { // 页数为0的时候说明是筛选控件触发了
      return;
    }
    const { payload: { sort = [], pagerModel = {} }, handleFormChange } = this.props;
    const { pageNo: oldCurrent, pageSize: oldPageSize } = pagerModel;
    const { columnKey = '' } = sorter;
    const customizedColumns = this.getCustomizedColumns();
    // 当前列信息
    const colInfo = customizedColumns.find(m => m.colCode === columnKey);
    let tSort = [];
    if (colInfo && current === oldCurrent && pageSize === oldPageSize) {
      const [sortInfo = {}] = sort;
      const currentSort = sortInfo[colInfo.colCode];
      if (!currentSort) {
        tSort = [{ [colInfo.colCode]: colInfo.fstClkOrdTp }];
      } else {
        // 顺序数组
        let tArr = ['asc', 'desc', ''];
        if (colInfo.fstClkOrdTp === 'desc') {
          tArr = ['desc', 'asc', ''];
        }
        const aftSortIndex = (tArr.findIndex(m => m === currentSort) + 1) % tArr.length;
        if (tArr[aftSortIndex]) {
          tSort = [{ [colInfo.colCode]: tArr[aftSortIndex] }];
        }
      }
    }
    if (handleFormChange) {
      let temp = colInfo && current === oldCurrent && pageSize === oldPageSize ? { sort: tSort, pagerModel: { ...pagerModel, pageNo: current, pageSize } } : { pagerModel: { ...pagerModel, pageNo: current, pageSize } };
      handleFormChange(temp);
    }
  }

  // handlePagerChange = (current, pageSize) => {
  //   if (!pageSize) { // 页数为0的时候说明是筛选控件触发了
  //     return;
  //   }
  //   const { payload: { pagerModel = {} }, handleFormChange } = this.props;
  //   if (handleFormChange) {
  //     handleFormChange({
  //       pagerModel: {
  //         ...pagerModel,
  //         pageNo: current,
  //         pageSize,
  //       },
  //     });
  //   }
  // }

  // 点击自选
  handleIsChoChange = (record) => {
    const { payload = {} } = this.props;
    const { product_id = '' } = record;
    if (product_id) {
      FetchChooseMyProduct({
        pdId: product_id,
      }).then((ret = {}) => {
        const { code = 0, note = '' } = ret;
        if (code > 0) {
          message.success(note);
          this.fetchData(payload);
          // 更新查询条件
          this.updateSearchTerms();
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  updateSearchTerms = () => {
    const { payload = {}, searchFormRef } = this.props;
    let { queryType = '', excludeFunds = false } = payload;
    excludeFunds = excludeFunds ? 1 : 0;
    if (searchFormRef) {
      FetchProductCommonSearch({
        srchScene: queryType,
        isDelete: excludeFunds,
      }).then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          const serchTerms = records.sort((x, y) => x.dispOrd - y.dispOrd);
          searchFormRef.setState({ serchTerms });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  // 产品名称筛选框显隐
  filterProductVisbleChange = (visible) => {
    const { payload } = this.props;
    if (visible) {
      const productFilterPayload = {
        payload,
        productNameVisible: true,
      };
      this.setState({ productFilterPayload });
    } else {
      const productFilterPayload = {
        payload,
        productNameVisible: false,
      };
      this.setState({ productFilterPayload });
    }
  }

  // 筛选框里选中项变化
  filterProductOnChange = (checked, checkedStr) => {
    const { payload = {} } = this.props;
    const attrConditionModels = [{ esCode: 'product_name', esValue: checkedStr, type: checked ? 3 : 0 }];
    payload['attrConditionModels'] = attrConditionModels;
    this.fetchData(payload);
  }

  // 判断是否查询筛选下拉字典
  toFetchFilterDic = (pre, aft) => {
    if (pre.customerType !== aft.customerType ||
      pre.excludeFunds !== aft.excludeFunds ||
      pre.productState !== aft.productState ||
      pre.queryType !== aft.queryType
      // (JSON.stringify(pre.attrConditionModels) !== JSON.stringify(aft.attrConditionModels))
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { dataSource = [], count = 0, loading = false } = this.state;
    const maxCount = count > 10000 ? 10000 : count;
    const { payload: { fieldsCode = [], pagerModel = {} } } = this.props;
    const customizedColumns = this.getCustomizedColumns();
    // 除掉产品id和name的列
    const excludeProductColumns = customizedColumns.filter(m => m.colCode !== 'product_id' && m.colCode !== 'product_name' && m.colCode !== 'product_code');
    return (
      <div style={{ marginTop: '16px' }}>
        <Table
          rowKey="key"
          className={`${styles.pagination} m-table-customer`}
          bordered
          rowHeight={60}
          dataSource={dataSource}
          columns={this.assembleColumns()}
          scroll={excludeProductColumns.length > 0 ? { x: ((fieldsCode.length - 5) * 160) + 535, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 } : { y: window.screen.availHeight - 420 }}
          onChange={this.handleChange}
          loading={loading}
          pagination={{
            className: 'm-paging',
            current: pagerModel.pageNo,
            pageSize: pagerModel.pageSize,
            pageSizeOptions: ['20', '50', '100'],
            total: maxCount,
            showSizeChanger: true,
            showQuickJumper: false,
            showTotal: () => `共${count}条`,
            // onChange: this.handlePagerChange,
            // onShowSizeChange: this.handlePagerChange,
          }}
        />
      </div>
    );
  }
}

export default TableContent;
