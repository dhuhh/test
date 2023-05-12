import React from 'react';
import { connect } from 'dva';
import { List, Avatar, Tag, Button, Row, Col, message, Input, Pagination, Spin, AutoComplete } from 'antd';
import { FetchTokenAuth } from '../../../../../services/token';
import { AES } from '../../../../../utils/aes_utils';
import { APP_SECRET, CLIENTID } from '../../../../../utils/config';
import lodash from 'lodash';
import { HighLightKeyword } from '$components/Common/TextHandler/HtmlToText';
import BasicDataTable from '$common/BasicDataTable';
import avatorPng from '$assets/user.jpg';
import empty from '$assets/pageLayout/empty.png';
import styles from './index.less';
import userImage from '$assets/pageLayout/userImage.png';
import DataTable from '../../../../../components/WorkPlatForm/MainPage/NewProduct/Work/DataList/DataTable';

const Option = AutoComplete.Option; // eslint-disable-line
const OptGroup = AutoComplete.OptGroup; // eslint-disable-line

class OtherUser extends React.Component {
  constructor(props) {
    super(props);
    this.inputAutoSearch = lodash.debounce(this.inputAutoSearch, 200);
    const { userBasicInfo = {} } = props;
    const { loginName = '' } = userBasicInfo;
    this.state = {
      loginName,
      pagination: {
        current: 1,
        pageSize: 5,
      },
      total: 0,
      dataColumns: [],
      inputValue: '', // 搜索框输入关键字的值
      page: 1, // 记录列表页数
      isFirstSearch: true,
      userList: [], // 下拉列表数据
    };
  }

  componentDidMount() {
    const { getOtherUsers, UserData } = this.props;
    if (getOtherUsers) {
      getOtherUsers({ userInfo: this.state.inputValue });
    }
    this.setState({
      userList: UserData,
    });
    // 监听回车键搜索
    document.body.addEventListener('keydown', lodash.throttle((e)=>{
      let code = e.code || e.key;
      if(code === 'Enter' && this.props.roleVisible) {
        this.onSearchInfo();
      }
    }, 1000))

    // 监听下拉列表滚动
    window.addEventListener('scroll', this.handleScrollToc, true);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.UserData !== this.props.UserData){
      this.setState({userList: this.props.UserData});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScrollToc, true);
  }

  handleAutoCompleteOnClick = (value, isFirstSearch) => {
    if (!value || isFirstSearch) {
      const { getUserName } = this.props;
      if(getUserName){
        getUserName('', 1 );
      }
    }
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
        if(this.props.userTotal <= (this.state.page) * 10) { // 产品列表数据加载完了
          return;
        } else {
          const curPage = this.state.page + 1;
          this.setState({ page: curPage }, this.props.getUserName(this.state.inputValue, curPage ));
        }
      }
    }
  }

  dataColumns = [
      {
        dataIndex: 'info',
        title: '账号信息',
        align: 'left',
        render: (text, record) => {
            return(
              <div style={{ display: 'flex', flexDirection: 'row' }} key={record.loginName}>
                <img className="m-avatar" src={userImage} title="头像" alt="avator" style={{ width: '47px', height: '47px', marginLeft: '10px', marginRight: '8px' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px' }}>{record.userName || '--'}/{record.loginName || '--'}</span>
                  <div style={{ display: 'flex',  flexFlow: 'row wrap', marginTop: '6px' }}>
                    {
                      JSON.parse(record.roleName) && JSON.parse(record.roleName).length > 0 ? (
                          JSON.parse(record.roleName).map((item) => {
                            return(
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2px 4px', height: '21px', marginRight: '6px', marginBottom: '4px', borderRadius: '2px', border: '1px solid #0E8AFF' }}>
                                <span style={{ fontSize: '12px', color: '#0E8AFF' }}>{item}</span>
                              </div>
                            );
                          })
                      ) : null
                    }
                  </div>
                </div>
              </div>
            );
          },
      },
      {
        dataIndex: 'orgName',
        title: <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ width: '1px', height: '22px', backgroundColor: '#E0E2E8', marginRight: '9px' }}></div><span>营业部</span></div>,
        align: 'left',
        width: 168,
        render: (text) => {return (<span style={{ marginLeft: '9px' }}>{text}</span>);},
      },
			{
        dataIndex: 'operate',
        title: <div style={{ display: 'flex', flexDirection: 'row' }}><div style={{ width: '1px', height: '22px', backgroundColor: '#E0E2E8', marginRight: '9px' }}></div><span>操作</span></div>,
				fixed: 'right',
        align: 'left',
				width: 136,
        render: (text, record) => {return (
        <div onClick={() => { this.onClickOk(record.loginName) }} style={{ width: '88px', height: '32px', marginLeft: '9px', padding: '6px 16px', borderRadius: '2px', border: '1px solid #D1D5E6', cursor: 'pointer' }} > 
          <span style={{ fontSize: '14px' }}>切换用户</span>
        </div>);} ,
      },
    ];

  onClickListItem = (it) => {
    const { loginName = '' } = this.state;
    if (it.loginName !== loginName) {
      this.setState({ loginName: it.loginName });
    }
  }
  onClickOk = (curLoginName) => {
    // const { loginName = '' } = this.state;
    const { userBasicInfo = {}, closeRoleModal } = this.props;
    const { loginName: defaultLoginName = '' } = userBasicInfo;
    if (curLoginName !== defaultLoginName) {
      const obj = { timestamp: new Date().getTime(), target: curLoginName };
      let objJson = '{}';
      try {
        objJson = JSON.stringify(obj);
      } catch (e) {
        // do not
      }
      AES.setSecret(APP_SECRET);
      const config = {
        headers: { 'X-Auth-Token': AES.encryptBase64(objJson) },
      };
      // console.log('用户切换config', config);
      // 该字段为true, 表明进行了用户切换
      sessionStorage.setItem('isUserChange', 'true');
      FetchTokenAuth({
        CLIENTID,
      }, config).then((result) => {
        const { code = -1 } = result;
        if (code) {
          closeRoleModal();
          window.location.href = '';
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    } else {
      closeRoleModal();
    }
  }

  // 查询其他用户信息
  onSearchInfo = () => {
    setTimeout(()=>{
      const { getOtherUsers } = this.props;
      if (getOtherUsers) {
        getOtherUsers({ userInfo: this.state.inputValue });
      }
    },100);
  }

  // 点击搜索按钮
  onClickSearchButton = (e) => {
    const { getOtherUsers } = this.props;
    e.stopPropagation();
    if (getOtherUsers) {
      getOtherUsers({ userInfo: this.state.inputValue });
    }
  }

  // 输入框下拉列表搜索回调
  inputAutoSearch = (value) => {
    if (this.state.isFirstSearch && value !== '') {
      this.setState({
        isFirstSearch: false,
      });
    }
    const { getUserName, clearUserData } = this.props;
    if(clearUserData){
      clearUserData();
    }
    if (getUserName) {
      getUserName(value, 1);
    }
  }

  // 翻页回调
  paginationOnchage = (page) => {
    const { getOtherUsers } = this.props;
    this.current = page;
    if (getOtherUsers) {
      getOtherUsers({ userInfo: this.state.inputValue });
    }
  }

  // 每页条数变化回调
  handlePageSizeChange = (page, pageSize) => {
    const newPage = {
      current: page,
      pageSize,
    };
    this.setState({ pagination: { ...newPage } });
  }

  // 页面改变时回调
  handleChange = (page, pageSize) => {
    const newPage = {
      current: page,
      pageSize,
    };
    this.setState({ pagination: { ...newPage } });
  }

  //input关键字变化
  inputOnChange = (value) => {
    const { clearUserData } = this.props;
    if(clearUserData){
      clearUserData();
    }
    // 关键字变化时，重置变量
    this.setState({
      inputValue: value,
      proIsFinished: false,
      page: 1,
    });
  }

  cusHandleHighlightKeyword = (text) => {
    const { inputValue = '' } = this.state;
    return HighLightKeyword(text, inputValue, false, '#244FFF');
  }

  render() {
    const { otherusers = [], userBasicInfo = {}, closeRoleModal, total = 0, getOtherUserloading = false, TableData } = this.props;
    const { loginName: defaultLoginName = '' } = userBasicInfo;
    const { loginName = '', inputValue = '', isFirstSearch = true, userList } = this.state;
    const { current, pageSize } = this.state.pagination;
    const options = [{}].map((item, index)=>{
      return(
        <OptGroup
          key={index}
          label={userList.length > 0 ? <div style={{ height: '0' }} /> : <span>未找到符合条件的结果</span>}
        >
          {userList.length > 0 ? (userList.map((opt, index) => {
            return  (
              <Option key={`${opt.id}-${opt.userName}`} value={`${opt.userName}`.trim()} style={{ boxSizing: 'border-box', padding: '0' }} >
                <div onClick={this.onSearchInfo} style={{ display: 'flex', alignItems: 'center', height: '40px', paddingLeft: '10px' }}>
                  <span dangerouslySetInnerHTML={{ __html: this.cusHandleHighlightKeyword(opt.userName) }} style={{ fontSize: '14px' }} />
                </div>
              </Option>
            ) 
          })) : null
          }
        </OptGroup>
      );
    });
    return (
      <div style={{ padding: '20px' }} className={styles.headerBox}>
        <Row style={{ height: '34px', marginBottom: '20px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <AutoComplete
              dropdownClassName="certain-category-search-dropdown"
              dataSource={options}
              onSearch={ (value) => {this.inputAutoSearch(value)}}
              className={styles.input}
              onChange={this.inputOnChange}
              value={inputValue}
              optionLabelProp="value"
              getPopupContainer={(triggerNode) => triggerNode.parentNode} // 渲染父节点
            >
              <Input 
                placeholder="请输入帐号/姓名" 
                autoComplete="off" // 清除input自带的历史记录
                // onClick={() => this.handleAutoCompleteOnClick(inputValue, isFirstSearch)}
                suffix={ <i className="iconfont icon-search" onClick={this.onClickSearchButton} style={{ fontSize: '16px', color: '#1A2243' }} />} 
              />
            </AutoComplete>
          </Col>
        </Row>
        <Spin spinning={getOtherUserloading}>
          <BasicDataTable
            rowKey='loginName'
            key='id'
            style={{ marginBottom: '10px' }}
            className={styles.table}
            dataSource={TableData}
            columns={this.dataColumns}
            locale={{ 
              emptyText: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '93px', marginBottom: '73px' }}>
                  <img src={empty} style={{ width: '275px', height: '147px', marginBottom: '20px' }} />
                  <span style={{ fontSize: '16px', color: '#61698C' }}>抱歉，没有账户信息</span>
                </div> 
              }}
            pagination={{
              size: "small",
              // className: 'm-paging',
              // hideOnSinglePage: true,
              showQuickJumper: true,
              showSizeChanger: true,
              defaultCurrent: 1,
              defaultPageSize: 5,
              total: TableData.length,
              onShowSizeChange: this.handlePageSizeChange,
              onChange: this.handleChange,
              current,
              pageSize,
              pageSizeOptions: ['5', '10', '15', '20'],
              showTitle: true,
            }}
          />
          {/* <Row>
            <Col>
              <List
                itemLayout="horizontal"
                style={{ padding: '1rem 0.833rem', height: '25rem', overflow: 'auto' }}
                dataSource={otherusers}
                renderItem={item => (
                  <List.Item
                    style={{ borderBottom: 'none', backgroundColor: `${item.loginName === loginName ? '#e6f7ff' : ''}` }}
                    // eslint-disable-next-line no-nested-ternary
                    actions={item.loginName === defaultLoginName ? [<Tag color="blue">当前用户</Tag>] : item.loginName === loginName ? [] : []}
                    onClick={() => {
                      return this.onClickListItem(item);
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar style={{ marginLeft: '1rem', backgroundColor: `${item.loginName === loginName ? '#1890ff' : ''}` }} size={60} >{item.userName.substr(0, 1)}</Avatar>}
                      title={<Row>
                        <Col span={8}>{`${item.loginName}/${item.userName}`}</Col>
                        <Col span={16}>{item.orgName || '--'}</Col>
                      </Row>}
                      description={
                        item.roleName.map((it, index) => {
                          return <Tag style={{ marginBottom: '0.2rem' }} color={`${item.loginName === loginName ? '#1890ff' : ''}`} key={index}>{it}</Tag>;
                        })
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row> */}
        </Spin>
        {/* <Row>
          <Col span={24} style={{ marginBottom: 10, textAlign: 'right' }}>
            <Pagination simple defaultCurrent={1} total={total} onChange={this.paginationOnchage} style={{ marginRight: '1rem' }} />
          </Col>
        </Row> */}
        {/* <Row>
          <Col span={24} style={{ marginBottom: 10, textAlign: 'center' }}>
            <Button style={{ marginRight: 8 }} className="m-btn-radius m-btn-headColor" onClick={this.onClickOk} > {`${loginName !== defaultLoginName ? '确定切换' : '确定'}`} </Button>
            <Button style={{ marginLeft: 8 }} className="m-btn-radius" onClick={closeRoleModal}> 关闭 </Button>
          </Col>
        </Row> */}
      </div>
    );
  }
}

export default OtherUser;
