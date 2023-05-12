import React from 'react';
import { Link, routerRedux } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Row, Col, Tabs, Input, Form, message, Select } from 'antd';
import get from 'lodash/get';
import Swiper from 'react-id-swiper';
import 'react-id-swiper/src/styles/css/swiper.css';
// import Swiper from 'swiper/dist/js/swiper.js'
// import 'swiper/dist/css/swiper.min.css'
import AuthRedirect from '../../../../../components/Common/Router/AuthRedirect';
import CusScenario from '../../../../../components/WorkPlatForm/MainPage/Customer/CusGroupManage/CusScenario';
import MyPlan from '../../../../../components/WorkPlatForm/MainPage/Customer/CusGroupManage/MyPlan';
import CusGroup from '../../../../../components/WorkPlatForm/MainPage/Customer/CusGroupManage/CusGroup';
import { fetchOperationLog } from '../../../../../services/basicservices/index';
import { FetchCusLifeCycleConditionConfig } from '../../../../../services/customerbase/index';
import { ptlx } from '../../../../../utils/config';
import styles from './index.less';
import { FetchUserScenarioLabelConfigList } from '../../../../../services/customerbase';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

const khfwMap = {
  myCustomerRole: { name: '我的客户', key: '1', color: 'blue' },
  teamCustomerRole: { name: '团队客户', key: '2', color: 'pink' },
  departmentCustomerRole: { name: '营业部客户', key: '3', color: 'orange' },
};

class CusGroupManage extends React.Component {
  constructor(props) {
    super(props);
    const { authorities, userBasicInfo = {} } = props;
    this.khfwDatas = [];
    if (Reflect.has(authorities, 'myCustomerRole')) {
      this.khfwDatas.push(khfwMap.myCustomerRole);
    }
    if (Reflect.has(authorities, 'teamCustomerRole')) {
      this.khfwDatas.push(khfwMap.teamCustomerRole);
    }
    if (Reflect.has(authorities, 'departmentCustomerRole')) {
      this.khfwDatas.push(khfwMap.departmentCustomerRole);
    }
    const isCheckSysRoleType = localStorage.getItem('homepageCheckSysRoleType') === '1';
    // 默认tab展示
    let defaultCusQueryType = '1';
    if (isCheckSysRoleType) { // 根据角色来
      const { jsxz = '' } = userBasicInfo;
      // 默认展示什么tab(5.6营业部   4团队   其他个人)
      if (jsxz === '5' || jsxz === '6') {
        defaultCusQueryType = '3';
      } else if (jsxz === '4') {
        defaultCusQueryType = '2';
      }
    } else {  // 根据权限点来
      defaultCusQueryType = (this.khfwDatas.length > 0 ? get(this.khfwDatas, '[0].key', '') : '');
    }
    this.state={
      searchkey: '', // 模糊搜索关键字
      conditionConfig: [], // 生命周期
      conditionValue: 1, // 默认生命周期
      // selectKey: '1', // 树选择框
      records: [], // 接口查询的数据
      selectedKeys: [],
      selectedTitles: [],
      listData: [], //
      tabkey: defaultCusQueryType || '1',
      scene: '', // 客群场景
    }
  }


  componentDidMount = () => {
    const { location: pathname } = this.props;;
    const arr = pathname.pathname.split('/');
    this.setState({
      scene: arr[3],
    });
    const { tabkey } = this.state;
    this.getCondition();
    this.handleChange();
    this.fetchData();
    this.handleOperationLog(arr[3]);
    // this.handleSelectChange();
    this.handlePathChange(tabkey);
  }

  // componentWillReceiveProps(nextprops) {
  //     const { location: pathname } = nextprops;
  //     const arr = pathname.pathname.split('/');
  //     this.setState({
  //       scene: arr[3],
  //     });
  //     this.handleOperationLog(arr[3]);
  //   }
  // 日志记录
  handleOperationLog = (value) => {
    this.setState({
      scene: value,
      searchkey: '',
    });
    let czdx = '';
    let name = '';
    if (value === 'ScenarioCustomer') {
      czdx = '5460';
      name = '服务场景';
    } else if (value === 'myPlan') {
      czdx = '5461';
      name = '我的方案';
    } else if (value === 'cusGroup') {
      czdx = '5462';
      name = '客户群';
    }
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    fetchOperationLog({
      czdx,
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: `查看：客户|客群管理|${name}`,
      ip,
      ptlx,
    });
  }

  getCondition = () => {
    FetchCusLifeCycleConditionConfig({}).then((response) => {
      const { records = [], code = 0 } = response || {};
      if (code > 0) {
        this.setState({
          conditionConfig: records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleOpenList = (e) => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, nlListClear } = this.props;
    if (nlListClear) {
      nlListClear();
    }
    const { tabkey } = this.state;
    const jumpUrl = tabkey ? `/myCustomer/nList?cusType=${tabkey}` : '/myCustomer/nList';
    dispatch(routerRedux.push(jumpUrl));
  }

  handlePathChange = (value) => {
    this.setState({
      tabkey: value,
    });
    const { location: { pathname = '' } } = this.props;
    if (pathname.includes('ScenarioCustomer')) {
      this.handleSelectChange(value);
    } else if (pathname.includes('myPlan')) {
      this.handlePlanChange(value);
    }
  }

  handleSelectChange = (key) => {
    this.setState({ tabkey: key });
    let czdx = '';
    let name = '';
    if (key === '1') {
      czdx = '5641';
      name = '我的客户';
    } else if (key === '2') {
      czdx = '5642';
      name = '团队客户';
    } else if (key === '3') {
      czdx = '5643';
      name = '营业部客户';
    }
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    fetchOperationLog({
      czdx,
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: `进入：客户|客群管理|服务场景|${name}`,
      ip,
      ptlx,
    });
  }

  handlePlanChange = (key) => {
    this.setState({ tabkey: key });
    let czdx = '';
    let name = '';
    if (key === '1') {
      czdx = '5641';
      name = '我的客户';
    } else if (key === '2') {
      czdx = '5642';
      name = '团队客户';
    } else if (key === '3') {
      czdx = '5643';
      name = '营业部客户';
    }
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    fetchOperationLog({
      czdx,
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: `进入：客户|客群管理|我的方案|${name}`,
      ip,
      ptlx,
    });
  }

  fetchData = () => {
    FetchUserScenarioLabelConfigList({ cxlx: '1' }).then((result) => {
      const { records = [] } = result || {};
      const selectedKeys = [];
      const selectedTitles = [];
      records.forEach((item) => {
        const { bqid = '', bqmc = '' } = item;
        selectedKeys.push(bqid);
        selectedTitles.push(bqmc);
      });
      this.setState({
        records,
        selectedKeys,
        selectedTitles,
        listData: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 滑动swiper
  touchMove = () => {
    this.setState({
      conditionValue: '',
      listData: this.state.records,
    })
  }
  handleChange = (value) => {
    if (this.state.conditionValue === value) {
      this.setState({
        conditionValue: '',
        listData: this.state.records,
      })
      // this.handlesmzqChange();
    } else {
      this.setState({
        conditionValue: value,
      })
      this.handlesmzqChange(value);
    }
  }
  handlesmzqChange = (conditionValue) => {
    const{ records } = this.state;
    const datas = [];
    // eslint-disable-next-line array-callback-return
    records.map((item) => {
      const { smzq = '' } = item;
      // eslint-disable-next-line eqeqeq
      if (smzq === conditionValue) {
        datas.push(item);
      }
      this.setState({
        listData: datas,
      })
    });
  }

  // 搜索
  handleSearchCus=(value)=>{
    this.setState({
      searchkey: value,
    });
    this.fetchSearch(value);
  }

  // 模糊搜索
  fetchSearch = (searchkey) => {
    const { records } = this.state;
    const datas = [];
    records.forEach((item) => {
      const { bqmc = '' } = item;
      if (bqmc.includes(searchkey)) {
        datas.push(item);
      }
    });
    this.setState({
      listData: datas,
    });
  }
  render() {
    const { searchkey, conditionConfig = [], conditionValue, selectKey, records = [], listData = [], tabkey = '1', scene = '', selectedKeys = [], selectedTitles = [] } = this.state;
    const {
      match: { url },
      location: { pathname },
      authorities,
      dispatch,
      handleSearch,
      nlListClear,
    } = this.props;
    const params = {
      spaceBetween: 10, // 幻灯片的距离
      slidesPerView: 1,
      // loop: true, // 循环
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      on:{
        reachBeginning: () =>{
          this.touchMove();
        },
      },
    };
    const lastBackslashesIndex = pathname.lastIndexOf('/');
    const activeKey = pathname.substring(lastBackslashesIndex + 1);
    const { cusGroupManage = [], myCustomer = [], customerGroup = [] } = authorities;
    if (myCustomer.includes('PlansAndHistory')) {
      cusGroupManage.push('myPlan');
    }
    if (customerGroup.includes('CusGroupUpdate')) {
      cusGroupManage.push('cusGroup');
    }
    const prefix = `${url}/cusGroupManage`;
    const routePathes = [`${prefix}/ScenarioCustomer`, `${prefix}/myPlan`, `${prefix}/cusGroup`];
    const path = pathname.split('/');
    return (
      <React.Fragment>
        <Row className="m-row-nomg" style={{ position: 'relative' }} >
          <Col className={styles.swiperSlider}>
            <div className={`m-top-bg m-bg-customer ${styles.tabBottom}`}>
              {
                path.includes('ScenarioCustomer') && conditionConfig.length > 0
                ?
                <Swiper {...params} >
                  <div className="tc" key="1">
                    <div className=" m-top-title">场景<span className=" m-mid-text">+多维度指标智能搜索</span></div>
                    <div className="dib m-top-search-box">
                      <div className="dib m-global-search-wrap" style={{ width: '48rem' }}>
                        <Search
                          placeholder="搜索场景/客户群/方案"
                          enterButton="搜索"
                          onSearch={this.handleSearchCus}
                        />
                      </div><a href="#" onClick={this.handleOpenList} className="m-top-link-mcolor">客户列表</a>
                    </div>
                  </div>
                  <div key="2">
                    <Row type="flex" justify="center">
                      {/* <Form.Item  className="m-form-item">
                        <div className={styles.myCarousel}>
                          <Radio.Group className={`${styles.m_carousel} ${styles.buttonStyle}`} onChange={(e) => { this.handleChange(e.target.value); }} buttonStyle="solid" style={{ width: '100%', textAlign: 'center' }}>
                            {
                              conditionConfig.map((item) => {
                                return (
                                  <Radio.Button value={item.optionValue} style={{ width: '8rem', margin: '0 5rem 0 5rem', height: '8rem', lineHeight: '8rem', borderRadius: '50%' }}>
                                    <Row>
                                      <Col><i className={item.optionIcon} style={{ fontSize: '4rem', color: 'white' }} /></Col>
                                      <Col style={{ margin: '0', lineHeight: '4rem', fontSize: '1.4rem', color: 'white' }}>{item.optionName}</Col>
                                    </Row>
                                  </Radio.Button>
                                )
                              })
                            }
                          </Radio.Group>
                        </div>
                      </Form.Item> */}
                      {
                        conditionConfig.map(item => {
                          // const {optionValue, optionIcon, optionName} = item;
                          return(
                            <div className={styles.m_btn} onClick={() => this.handleChange(item.optionValue)}>
                              <Row className={`${conditionValue === item.optionValue ? styles.checkedBtn : ''}`}>
                                <Col><i className={item.optionIcon} style={{ fontSize: '4rem', color: 'white', lineHeight: '8rem' }} /></Col>
                                {/* <Col style={{ margin: '0', lineHeight: '4rem', fontSize: '1.4rem', color: 'white' }}>{item.optionName}</Col> */}
                              </Row>
                              <Row style={{ margin: '0', lineHeight: '4rem', fontSize: '1.4rem', color: 'white' }}>{item.optionName}</Row>
                            </div>
                          )
                        })
                      }
                    </Row>
                  </div>
                </Swiper>
                :
                <div className=" tc" >
                  <div className=" m-top-title">场景<span className=" m-mid-text">+多维度指标智能搜索</span></div>
                  <div className="dib m-top-search-box">
                    <div className="dib m-global-search-wrap" style={{ width: '48rem' }}>
                      <Search
                        placeholder="搜索场景/客户群/方案"
                        enterButton="搜索"
                        onSearch={this.handleSearchCus}
                      />
                    </div><a href="#" onClick={this.handleOpenList} className="m-top-link-mcolor">客户列表</a>
                  </div>
                </div>
                }
              <Tabs
                className={`${styles.topTabStyle} ${styles.tabBottom}`}
                activeKey={activeKey}
                onChange={this.handleOperationLog}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: 'rgba(0, 0, 0, 0.4)' }}
                tabBarExtraContent={
                  <div style={{ paddingRight: '3rem' }}>
                    {
                      scene === 'ScenarioCustomer' || scene === 'myPlan'
                      ?
                      (
                        <Select className={styles.selectStyles} value={tabkey} onChange={this.handlePathChange}>
                        {
                          this.khfwDatas.map(item => {
                            return <Option value={item.key}>{item.name}</Option>;
                          })
                        }
                        </Select>
                      )
                      : null
                    }
                  </div>
                }
              >
                {
                  cusGroupManage.includes('ScenarioCustomer') && (
                  <TabPane
                    key="ScenarioCustomer"
                    className={styles.tabBottom}
                    tab={<Link to={`${prefix}/ScenarioCustomer`} replace={pathname === `${prefix}/ScenarioCustomer`} style={{ display: 'block', color: '#fff' }}>服务场景</Link>}
                  />)
                }
                {
                  cusGroupManage.includes('myPlan') && (
                  <TabPane
                    key="myPlan"
                    className={styles.tabBottom}
                    tab={<Link to={`${prefix}/myPlan`} replace={pathname === `${prefix}/myPlan`} style={{ display: 'block', color: '#fff' }}>我的方案</Link>}
                  />)
                }
                {
                  cusGroupManage.includes('cusGroup') && (
                  <TabPane
                    key="cusGroup"
                    className={styles.tabBottom}
                    tab={<Link to={`${prefix}/cusGroup`} replace={pathname === `${prefix}/cusGroup`} style={{ display: 'block', color: '#fff' }}>客户群</Link>}
                  />)
                }
              </Tabs>
            </div>
          </Col>
        </Row>
        <CacheSwitch>
          {
            cusGroupManage.includes('ScenarioCustomer') && (
            <CacheRoute
              path={`${prefix}/ScenarioCustomer`}
              exact
              render={props => (
                <CusScenario {...props} nlListClear={nlListClear} fetchData={this.fetchData} handleSearch={handleSearch} selectedKeys={selectedKeys} selectedTitles={selectedTitles} records={records} searchkey={searchkey} listData={listData} selectKey={selectKey} tabkey={tabkey}  conditionValue={conditionValue} dispatch={dispatch} />
                )}
            />)
          }
          {
            cusGroupManage.includes('myPlan') && (
            <CacheRoute
              path={`${prefix}/myPlan`}
              exact
              render={props => (
                <MyPlan {...props} nlListClear={nlListClear} searchkey={searchkey} selectKey={selectKey} handleSearch={handleSearch} handleSelectChange={this.handleSelectChange} tabkey={tabkey} dispatch={dispatch} />
                )}
            />)
          }
          {
            cusGroupManage.includes('cusGroup') && (
            <CacheRoute
              path={`${prefix}/cusGroup`}
              exact
              render={props => (
                <CusGroup {...props} searchkey={searchkey} selectKey={selectKey} handleSearch={handleSearch} tabkey={tabkey} dispatch={dispatch} />
                )}
            />)
          }
          {
            cusGroupManage.length > 0 && <AuthRedirect routePathes={routePathes} authorityArr={cusGroupManage} />
          }
        </CacheSwitch>
      </React.Fragment>
    );
  }
}
export default Form.create()(CusGroupManage);
