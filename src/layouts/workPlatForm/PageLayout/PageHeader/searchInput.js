import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import classnames from 'classnames';
import { Input, AutoComplete, Icon, message, Dropdown, Menu, Tooltip  } from 'antd';
import { Link } from 'dva/router';
import debounce from 'lodash.debounce';
import _ from 'lodash';
import { FetchCustomerTips } from '$services/customersenior/simpleCustomerList';
import { FetchQueryProductTips } from '$services/financialproducts';
// import { FetchQueryStaffTips } from '../../../../../services/staffrelationship';
import { FetchQueryRecentSearchProduct, FetchQueryHotSearchProduct, FetchClearSearchRecord, FetchSaveSearchRecord, FetchQueryCustomerHomepage } from '$services/searchInput';
import { HighLightKeyword } from '../../../../components/Common/TextHandler/HtmlToText';
import { EncryptBase64 } from '../../../../components/Common/Encrypt';
import styles from './searchInput.less';
import dele from '$assets/pageLayout/delete.svg';
import hot from '$assets/pageLayout/hot.svg';
import jsonp from 'jsonp';

const Option = AutoComplete.Option; // eslint-disable-line
const OptGroup = AutoComplete.OptGroup; // eslint-disable-line

class SearchInput extends React.Component {
  constructor() {
    super();
    this.fetchDatas = debounce(this.fetchDatas, 200);// 强制一个函数在某个连续时间段内只执行一次
  }
  state={
    menuList: [], // 当前方案的菜单数据
    menuCount: 0,
    customerList: [],
    customerCount: 0,
    productList: [],
    productCount: 0,
    cusFillValue: '', // 客户输入值
    proFillValue: '', // 产品输入值
    isFirstSearch: true,
    selectIndex: "1", // 记录选择类型， 1 客户 2 产品
    cardVisible: false, // 控制历史记录和热门搜索内容是否显示
    recentList: [], // 产品最近搜索
    hotList: [], // 产品热门搜索
    page: 1, // 记录产品列表页数
    proIsFinished: false, // 产品列表数据是否加载完了
  }

  componentDidMount () {
     // 监听点击事件，如果点击的是输入框或者最近搜索，历史搜索卡片区域，则显示该卡片，否则不显示 
     document.onclick = (e) => {
      const condition = ['card', 'input', '[object HTMLCollection]', '[object HTMLDivElement]'];
      if(e && condition.includes(e.target.id)){
          this.setState({
            cardVisible: true,
          }); 
        } else {
          this.setState({
            cardVisible: false,
          }); 
        };
    };

    // 监听下拉列表滚动
    window.addEventListener('scroll', this.handleScrollToc, true);
    
    this.getSearchProduct(); // 最近搜索
    this.getHotProduct(); // 热门搜索
  }

  componentWillUnmount() {
    if(this.timer){
      clearTimeout(this.timer);
    }
    window.removeEventListener('scroll', this.handleScrollToc, true);
  }

  //下拉列表滚动监听事件
  handleScrollToc = () => {
    if(document.getElementsByClassName('ant-select-dropdown-menu')[0]){
      // less中将ant-select-dropdown-menu的滚动条取消了，所以监听的是它的父节点的滚动
      const opt = document.getElementsByClassName('ant-select-dropdown-menu')[0].parentNode;
      // 可视区域⾼度
      let clientHeight = opt.clientHeight;
      // 滚动内容⾼度
      let scrollHeight = opt.scrollHeight;
      // 滚动条已滚动的⾼度
      const scrollTop = opt.scrollTop;
      if(scrollHeight - clientHeight < scrollTop + 1) {
        if(this.state.productCount <= (this.state.page) * 10) { // 产品列表数据加载完了
          // this.setState({ proIsFinished: true });
          return;
        } else {
          const curPage = this.state.page + 1;
          this.setState({ page: curPage }, this.handleSearchProductList(this.state.proFillValue, curPage ));
        }
      }
    }
  }

  getSearchProduct = () => {
    // 查询最近搜索
    FetchQueryRecentSearchProduct({type: null}).then((response) => {
      const { records = [] } = response || {};
      this.setState({
        recentList: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  getHotProduct = () => {
    // 查询热门搜索
    FetchQueryHotSearchProduct({type: null}).then((response) => {
      const { records = [] } = response || {};
      this.setState({
        hotList: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  clearSearchRecord = () => {
    // 清空最近搜索
    FetchClearSearchRecord({type: null}).then((response) => {
      this.getSearchProduct();
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 跳转到产品全景
  handlerSearch = (record) => {
    const url = `/productSalesPanorama/index/${this.getParams(record)}`;
    return url;
  }

  // 跳转到客户360
  getCustomerUrl = (cusNo) => {
    return `/customerPanorama/customerInfo?customerCode=${cusNo}`;
  }

  //跳转时记录搜索的产品
  saveSearchRecord = (dm) => {
    FetchSaveSearchRecord({proCode: dm}).then(() => {
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  //跳转到产品全景的参数
  getParams = (record) => {
    let queryParams = {};
    if (record) {
      queryParams = { cpId: record.key || record.id, productName: record.title || record.name, productCode: record.dm || record.proCode };
      const paramsStr = JSON.stringify(queryParams);
      // 将参数base64加密
      // queryParams = this.URLencode(EncryptBase64(paramsStr));
      queryParams = encodeURIComponent(EncryptBase64(paramsStr));
    }
    return queryParams;
  }



  handleAutoCompleteOnClick = (value, isFirstSearch) => {
    if (!value || isFirstSearch) {
      this.handleSearch('');
    }
  }
  handleSearch = (value) => {
    const valueFormat = value.replace(/'/g, '');
    if (this.state.isFirstSearch && value !== '') {
      this.setState({
        isFirstSearch: false,
      });
    }
    this.setState({
      menuList: [],
      customerList: [],
      productList: [],
    });
    this.fetchDatas(valueFormat);
  }

  fetchDatas = (value) => {
    if (value !== '') {
      const { selectIndex } = this.state;
      const { searchAuth } = this.props; // 权限点 (搜索菜单:searchMenu|搜索客户:searchCustomer|搜索产品:searchProduct)
      // if (searchAuth.includes('searchMenu')) {
      //   this.handleSearchMenuList(value);
      // }
      if (searchAuth.includes('searchCustomer') && selectIndex === "1") {
        this.handleSearchCustomerList(value);
      }
      if (searchAuth.includes('searchProduct') && selectIndex === "2") {
        this.handleSearchProductList(value, 1);
      }
    }
  }

  cusHandleHighlightKeyword = (text) => {
    const { cusFillValue = '' } = this.state;
    return HighLightKeyword(text, cusFillValue, true);
  }

  proHandleHighlightKeyword = (text) => {
    const { proFillValue = '' } = this.state;
    return HighLightKeyword(text, proFillValue, true);
  }

  // 处理菜单数据
  // handleSearchMenuList = (value) => {
  //   const getMenuDataList = (list = [], menuTree) => {
  //     menuTree.forEach((m) => {
  //       list.push(m);
  //       const children = lodash.get(m, 'menu.item', []);
  //       if (children.length) {
  //         return getMenuDataList(list, children);
  //       }
  //     });
  //     return list;
  //   };
  //   const { menuTree = [] } = this.props;
  //   let tmpl = getMenuDataList([], menuTree);
  //   // 筛选出菜单名称包含关键字的
  //   tmpl = tmpl.filter(m => m.url && lodash.get(m, 'title[0].text', '').indexOf(value) > -1);
  //   // 名称和url对象
  //   const tmplMenus = tmpl.map((m, i) => ({
  //     key: i,
  //     title: lodash.get(m, 'title[0].text', ''),
  //     dm: m.url,
  //     highLightKey: this.handleHighlightKeyword(lodash.get(m, 'title[0].text', '')),
  //   }));
  //   this.setState({
  //     menuList: tmplMenus,
  //     menuCount: tmplMenus.length,
  //   });
  // }

  // 模糊搜索客户
  handleSearchCustomerList = (value) => {
    const khfwDatas = [];
    const { authorities } = this.props;
    // 查询客户范围
    if (Reflect.has(authorities, 'myCustomerRole')) {
      khfwDatas.push(1);
    }
    if (Reflect.has(authorities, 'teamCustomerRole')) {
      khfwDatas.push(2);
    }
    if (Reflect.has(authorities, 'departmentCustomerRole')) {
      khfwDatas.push(3);
    }
    if (khfwDatas.length === 0) {
      khfwDatas.push(1);
    }
    FetchQueryCustomerHomepage({
      keyword: value,
    }).then((response) => {
      const { records = [], total = 0 } = response;
      const dataSource = [];
      records.forEach((element) => {
        const tempObject = {};
        if (element instanceof Object) {
          // const keys = Object.keys(element);
          // keys.forEach((key) => {
          //   if (element[key] instanceof Object) {
          //     const secondKeys = Object.keys(element[key]);
          //     secondKeys.forEach((secondKey) => {
          //       tempObject[`${key}.${secondKey}`] = element[key][secondKey];
          //     });
          //   } else {
          //     tempObject[key] = element[key];
          //   }
          // });
          dataSource.push({
            key: element.id,
            // value: tempObject.customer_id,
            title: element.cusName,
            dm: element.pyCode,
            account: element.account,
            // org: tempObject.department_name,
            // counts: count,
            cusNo: element.cusNo,
            highLightKey: this.cusHandleHighlightKeyword(element.cusNo),
          });
        }
      });
      this.setState({
        customerList: dataSource,
        customerCount: total,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 模糊搜索产品
  handleSearchProductList = (value, curPage) => {
    FetchQueryProductTips({
      paging: 1,
      current: curPage,
      pageSize: 10,
      // total: -1,
      sort: '',
      keyword: value,
    }).then((response) => {
      const { records = [], total = 0 } = response;
      const dataSource = [];
      records.forEach((item) => {
        dataSource.push({
          key: item.cpid,
          dm: item.cpdm,
          title: item.cpmc,
          type: item.pdTypeNm,
          highLightKey: this.proHandleHighlightKeyword(item.cpdm),
        });
      });
      this.setState({
        productList: [...this.state.productList, ...dataSource],
        productCount: total,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  renderTitle = (group) => {
    const { selectIndex } = this.state;
    return (
      // <span>
      //   {title.name}
      //   <span className="blue" style={{ float: 'right' }}>共{title.count}条</span>
      // </span>
      group.key === '#' ? (<span>未找到符合条件的结果</span>) : (
      group.key === 2 ? (
        <span style={{ fontSize: '14px', color: '#1A2243' }}>
          <span style={{ marginLeft: '10px' }}>类型</span><span style={{ marginLeft: '50px' }}>代码</span><span style={{ marginLeft: '50px' }}>名称</span>
        </span>
      ) : <span />)
    );
  }
  renderChlidren= (list) => {
    const result = [];
    list.forEach((item) => {
      result.push({
        title: item.title,
        dm: item.dm,
        key: item.key,
        type: item.type,
        highLightKey: item.highLightKey,
        org: item.org || '',
        account: item.account,
        cusNo: item.cusNo,
      });
    });
    return result;
  }
  renderListResult = (menuCount, customerCount, productCount, menuList, customerList, productList) => {
    // 需要展示的数据数组
    let showCountArr = [
      // { key: 0, count: menuCount, list: menuList },
      { key: 1, count: customerCount, list: customerList },
      { key: 2, count: productCount, list: productList },
    ];
    // 每种展示多少条
    // let countPerList = 0;
    // showCountArr = showCountArr.filter(m => m.count !== 0);
    // if (showCountArr.length === 0) {
    //   countPerList = 0;
    // } else if (showCountArr.length === 1) {
    //   countPerList = 9;
    // } else if (showCountArr.length === 2) {
    //   countPerList = 4;
    // } else if (showCountArr.length === 3) {
    //   countPerList = 3;
    // }
    const result = {};
    // if (countPerList) {
    //   showCountArr.forEach((m) => {
    //     result[`result${m.key}`] = this.renderChlidren((m.list || []).slice(0, countPerList));
    //   });
    // }
    showCountArr.forEach((m) => {
        result[`result${m.key}`] = this.renderChlidren((showCountArr[this.state.selectIndex === '1' ? 0 : 1].list || []));
      });
    return result;
  }

  cusHanleChange = (value) => {
    this.setState({
      cusFillValue: value,
    });
  }

  proHanleChange = (value) => {
    // 关键字变化时，重置变量
    this.setState({
      proFillValue: value,
      proIsFinished: false,
      productCount: 0,
      productList: [],
       page: 1
    });
  }

  // 选则类型变化
  selectChange = (data) => {
    this.setState({
      selectIndex: data.key,
    });
  }

  // 搜索框下拉菜单
  menu = (
    <Menu onClick={this.selectChange}>
      <Menu.Item key="1">客户</Menu.Item>
      <Menu.Item key="2">产品</Menu.Item>
    </Menu>
  );

  render() {
    const { searchAuth } = this.props; // 权限点 (搜索菜单:searchMenu|搜索客户:searchCustomer|搜索产品:searchProduct)
    const { menuCount = 0, customerCount = 0, productCount = 0, menuList = [], customerList = [], productList = [], recentList = [], hotList = [], isFirstSearch = true, cusFillValue = '', proFillValue = '',selectIndex = "1" } = this.state;
    const { result0, result1, result2 } = this.renderListResult(menuCount, customerCount, productCount, menuList, customerList, productList);
    // 组建数据源 四种情况
    const dataSource = [];
    // if (menuCount) {
    //   dataSource.push({
    //     key: 0,
    //     title: {
    //       name: '菜单',
    //       count: menuCount,
    //     },
    //     children: result0,
    //   });
    // }
    if (customerCount && selectIndex === '1') {
      dataSource.push({
        key: 1,
        title: {
          name: '客户',
          count: customerCount,
        },
        children: result1,
      });
    }
    if (productCount && selectIndex === '2') {
      dataSource.push({
        key: 2,
        title: {
          name: '产品',
          count: productCount,
        },
        children: result2,
      });
    }
    if (selectIndex === '1' && !customerCount || selectIndex === '2' && !productCount) {
      dataSource.push({
        key: '#',
        title: {
          name: '无结果',
          count: 0,
        },
        children: [{
          title: '',
          key: ' ',
          dm: '',
          noData: '换个关键词试试!',
        }],
      });
    }
    
    const options = dataSource.map((normalGroup, index) => {
      // 当客户列表的某个客户存在多个acount时，需要转化成多个对像
      let group = normalGroup;
      if(normalGroup.key === 1){ // 为客户列表时
        const tmpGroupChildren = _.cloneDeep(normalGroup.children); // 客户列表对象数组
        let tmpIndex = 0; // 记录数组下标最新位置
        normalGroup.children.forEach((item, index)=>{
          if(item.account.split(',').length > 1) { // 接口的多个account形式为account ： ‘account1, account2, ...’
            item.account.split(',').forEach((singleAccount)=>{
              const tmpItem = {...item};
              tmpItem['account'] = singleAccount;
              tmpGroupChildren.splice(tmpIndex, 0, tmpItem); // 将每一个account提出来组成一个新的对象,插入到对象数组中
            })
            tmpGroupChildren.splice(tmpIndex + item.account.split(',').length, 1); // 由于每个account都被提出来组成一个新的对象，所以初始对象时多余的
            tmpIndex = tmpIndex + item.account.split(',').length;
          }else{
            tmpIndex++;
          }
        });
        group['children'] = tmpGroupChildren;
      }
      return(
        <OptGroup
          key={index}
          label={this.renderTitle(group)}
        >
          {group.children.map((opt, index) => {
            let linkUrl = '';
            if (group.key === 0) {
              linkUrl = `${opt.dm}`;
              if (linkUrl.startsWith('{') && linkUrl.endsWith('}')) {
                const urlObj = JSON.parse(linkUrl);
                const { type, url } = urlObj;
                if (type === 'ifm') {
                  linkUrl = `/iframe${url}`;
                } else {
                  linkUrl = url;
                }
              }
            } else if (group.key === 1) {
              linkUrl = `/customerPanorama/index/${EncryptBase64(opt.key)}`;
            } else if (group.key === 2) {
              linkUrl = `/productPanorama/index/${EncryptBase64(opt.key)}`;
            }
            return (
              group.key === 0 ? (
                <Option key={`${group.key}-${opt.key}-${opt.title}`} value={opt.title}>
                  <Link to={linkUrl} style={{ color: '#2daae4', width: '100%', display: 'block' }}>
                    <span dangerouslySetInnerHTML={{ __html: opt.highLightKey }} />
                  </Link>
                </Option>
              ) : linkUrl ? ( group.key === 2 ? ( // 产品列表
                    <Option title={group.key === 1 ? `${opt.org}` : ''} key={`${group.key}-${opt.key}-${opt.title}`} value={`${opt.dm}  ${opt.title}`.trim()} style={{ boxSizing: 'border-box', padding: '0' }}>
                      <Link
                        to={this.handlerSearch(opt)}
                        title={opt.title}
                      >
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px 20px' }} onClick={()=>{this.saveSearchRecord(opt.dm);}}>
                          <span style={{display: 'inline-block', width: '78px'}}>{opt.type}</span>
                          <span dangerouslySetInnerHTML={{ __html: opt.highLightKey }} style={{display: 'inline-block', width: '78px'}} />
                          <span style={{display: 'inline-block', width: '175px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{opt.title}</span>
                        </div>
                      </Link>
                      {/* { this.state.proIsFinished && index === group.children.length - 1 && (<div style={{ marginTop: '10px' }}>没有更多了</div>) } */}
                    </Option>
              ) : ( // 客户列表
                <Option title={group.key === 1 ? `${opt.org}` : ''} key={`${group.key}-${opt.key}-${opt.title}-${opt.account}`} value={`${opt.dm}  ${opt.title} ${opt.account}`.trim()} style={{ boxSizing: 'border-box', padding: '0' }}>
                  <Link
                    to={this.getCustomerUrl(opt.cusNo)}
                    title={opt.cusNo}
                    target='_blank'
                  >
                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '5px 10px' }} >
                      <span dangerouslySetInnerHTML={{ __html: opt.highLightKey }} style={{display: 'inline-block', width: '85px'}} />
                      <span style={{display: 'inline-block', width: '78px'}}>{opt.title}</span>
                      <span style={{display: 'inline-block', marginLeft: 'auto'}}>{opt.account}</span>
                    </div>
                  </Link>
                  {/* { this.state.proIsFinished && index === group.children.length - 1 && (<div style={{ marginTop: '10px' }}>没有更多了</div>) } */}
                </Option>
              )
              ) : null
            );
          })}
        </OptGroup>
      );
    });
    let placeholderStr = '';
    // if (searchAuth.includes('searchMenu')) {
    //   placeholderStr += placeholderStr.length === 3 ? '菜单' : '/菜单';
    // }
    if (selectIndex === '1') {
      placeholderStr = '请输入客户号/姓名';
    }
    if (selectIndex === '2') {
      placeholderStr = '请输入产品名称/代码';
    }

    return (
      <div id="SearchInput_pageheader" className={ selectIndex === '1' && this.state.customerCount !== 0 ? styles.cusHeaderBox : styles.headerBox} >
        <Dropdown overlay={this.menu} trigger={['click']}>
          <a className={styles.selectType}>
            <span> {selectIndex === '1' ? '客户' : '产品'}</span>
            <i className='iconfont icon-down-line-arrow'/>
            <div></div>
          </a>
        </Dropdown>
        <AutoComplete
          key={selectIndex}
          // allowClear
          className={classnames('certain-category-search', styles.searchInput)}
          dropdownClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: '17rem', zIndex: 999, top: '36px', position: 'fixed' }}
          style={{ width: '206px', height: '32px', verticalAlign: 'middle', color: '#6E6E6E' }}
          dataSource={options}
          //open={true} // 固定下拉菜单
          placeholder={placeholderStr}
          optionLabelProp="value"
          onChange={selectIndex === '1' ? this.cusHanleChange : this.proHanleChange }
          value={selectIndex === '1' ? cusFillValue : proFillValue}
          onSearch={(value) => { this.handleSearch(value); }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode} // 菜单渲染父节点
        >
          <Input
            id='input'
            autoComplete="off" // 清除input自带的历史记录
            onClick={() => this.handleAutoCompleteOnClick(selectIndex === '1' ? cusFillValue : proFillValue, isFirstSearch)}
            suffix={ (selectIndex === '1' && cusFillValue) || (selectIndex === '2' && proFillValue) ? <span /> : <i className="iconfont icon-search" style={{ fontSize: '16px', color: '#1A2243' }} />}
          />
        </AutoComplete>
        {
          selectIndex === '2' && this.state.cardVisible && !proFillValue && (
            <div id="card" onClick={(e)=>{e.stopPropagation();}} style={{position: 'absolute', width: '390px', minHeight: '144px', marginTop: '-2px', backgroundColor: '#ffffff', borderRadius: '1px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', padding: '14px', fontSize: '14px' }}>
              <div style={{ display: 'flex', height: '30px', padding: '5px 0', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>最近搜索</span>
                  <Tooltip placement="bottomLeft" title={'清空最近搜索'} overlayClassName={styles.tooltip}>
                    <img src={dele} style={{ cursor: 'pointer' }} onClick={this.clearSearchRecord}/>
                  </Tooltip>
              </div>
              {
                  recentList && recentList.length > 0 ? (
                    <div style={{ display: 'flex', flexFlow: 'row wrap', margin: '5px 0' }}>
                      {
                        recentList.map((item, index) => {
                          return(
                              <Link to={this.handlerSearch(item)} key={index} style={{ margin: index % 2 === 0 ? '4px 10px 4px 0' : '4px 0 4px 0' }} >
                                <div style={{ height: '32px', width: '174px', lineHeight: '32px', padding: '0 10px', backgroundColor: '#f0f1f5', borderRadius: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className={styles.linkContent}>
                                  <span style={{ fontSize: '14px', color: '#61698c', verticalAlign: 'middle' }}>{item.proCode}&nbsp;{item.name}</span>
                                </div>
                              </Link>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <div style={{ height: '30px', display: 'flex', padding: '5px 0', flexFlow: 'row wrap', lineHeight: '20px' }}>
                      <span style={{ color: '#8c8c8c' }}>对不起，暂无符合条件的产品</span>
                    </div>
                  )
                }
              <div style={{ display: 'flex', height: '30px', padding: '5px 0', alignItems: 'center' }}>
                <span>热门搜索</span>
                <img src={hot} style={{ marginLeft: '4px' }} />
              </div>
              {
                  hotList && hotList.length > 0 ? (
                    <div style={{ display: 'flex', flexFlow: 'row wrap', margin: '5px 0' }}>
                      {
                        hotList.map((item, index) => {
                          return(
                              <Link to={this.handlerSearch(item)} key={index} style={{ margin: index % 2 === 0 ? '4px 10px 4px 0' : '4px 0 4px 0' }} >
                                <div style={{ height: '32px', width: '174px', lineHeight: '32px', padding: '0 10px', backgroundColor: '#f0f1f5', borderRadius: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className={styles.linkContent}>
                                  <span style={{ fontSize: '14px', color: '#61698c', verticalAlign: 'middle' }}>{item.proCode}&nbsp;{item.name}</span>
                                </div>
                              </Link>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <div style={{ height: '30px', display: 'flex', padding: '5px 0', flexFlow: 'row wrap', lineHeight: '20px' }}>
                      <span style={{ color: '#8c8c8c' }}>对不起，暂无符合条件的产品</span>
                    </div>
                  )
                }
          </div>
          )
        }
      </div>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(SearchInput);
