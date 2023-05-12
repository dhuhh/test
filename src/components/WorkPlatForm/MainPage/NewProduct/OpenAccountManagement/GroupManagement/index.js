/* eslint-disable array-callback-return */
import React from 'react';
import { connect } from 'dva';
import DataTable from './DataTable';
import SearchContent from './SearchContent';
import { message } from 'antd';
import { GetGroupInfoModel } from '$services/newProduct';

class GroupManagement extends React.Component {
  state = {
    groupValue: '',
    codeType: '',
    busType: '',
    channelValue: '',
    channelId: '',
    scene: '',
    bank: [],
    department: '',
    status: '',
    groupInfo: [],
    dateValue: [null, null],
    pageSize: 10,
    current: 1,
    total: 0,
    sorter: '',
    loading: false,
    searchValue: '',
  }
  componentDidMount() {
    this.searchInfo();
  }


  componentDidUpdate(preProps) {
    if (preProps.state !== this.props.state) {
      this.searchInfo();
    }
  }

  handlePagerSizeChange = (current, pageSize) => {
    this.setState({
      pageSize,
      current,
    }, () => {
      this.searchInfo();
    });
  }
  handlePagerChange = (current, pageSize) => {
    this.setState({
      pageSize,
      current,
    }, () => {
      this.searchInfo();
    });
  }
  sortChange = (sorter) => {
    this.setState({
      sorter,
    }, () => {
      this.searchInfo();
    });
  }
  searchByInfo = () => {
    this.setState({
      current: 1,
    }, () => {
      this.searchInfo();
    });
  }
  searchInfo = () => {
    const param = {
      sort: this.state.sorter,
      pageSize: this.state.pageSize,
      current: this.state.current,
      bgnDt: this.state.dateValue[0]?.format('YYYYMMDD'),
      endDt: this.state.dateValue[1]?.format('YYYYMMDD'),
      grpTp: this.state.codeType * 1,
      busTp: this.state.busType * 1,
      chnlId: this.state.channelValue * 1,
      applSc: this.state.scene,
      acctDept: this.state.department,
      depBank: this.state.bank.join(','),
      status: this.state.status * 1,
      grpName: this.state.groupValue,
    };
    this.setState({
      loading: true,
    });
    GetGroupInfoModel(param).then(res => {
      if (res.code === 1) {
        this.setState({
          groupInfo: res.records,
          total: res.total,
          loading: false,
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  groupChange = (value) => {
    this.setState({
      groupValue: value,
    });
  }
  codeChange = (value) => {
    this.setState({
      codeType: value,
    });
  }
  busChange = (value) => {
    this.setState({
      busType: value,
    });
  }
  channelChange = (value) => {
    this.setState({
      channelValue: value,
    });
  }
  sceneChange = (e) => {
    const value = e.target.value;
    if ((Number(value) >= 1 && Number(value) <= 99 && !`${value}`.includes('.')) || `${value}` === '') {
      this.setState({ scene: value });
    }
  }
  bankChange = (value) => {
    this.setState({
      bank: value,
    });
  }
  /* departmentChange = (value) => {
    console.log(value);
    this.setState({
      department: value,
    });
  } */
  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }
  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  }
  departmentChange = (value, label, extra) => {
    let { department } = this.state;
    if (value.length) {
      department = department ? department.split(',') : [];
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (department.indexOf(item) === -1) department.push(item);
        });
      } else {
        array.forEach(item => {
          if (department.indexOf(item) > -1) department.splice(department.indexOf(item), 1);
        });
      }
    } else {
      department = [];
    }
    this.setState({ searchValue: this.state.searchValue, department: department.join(',') });
  }
  statusChange = (value) => {
    this.setState({
      status: value,
    });
  }
  dateChange = (value) => {
    this.setState({
      dateValue: value,
    });
  }
  clearInputInfo = () => {
    this.setState({
      groupValue: '',
      codeType: '',
      busType: '',
      channelValue: '',
      bank: [],
      scene: '',
      status: '',
      department: '',
      searchValue: '',
      dateValue: [null, null],
    });
  }
  render() {
    const { department, status, dateValue, scene, bank, groupValue, codeType, busType, groupInfo, pageSize, current, total, channelValue, loading, searchValue } = this.state;
    const inputProps = {
      groupValue,
      codeType,
      busType,
      channelValue,
      bank,
      scene,
      dateValue,
      status,
      department,
      searchValue,
      handleYybSearch: this.handleYybSearch,
      channelChange: this.channelChange,
      busChange: this.busChange,
      sceneChange: this.sceneChange,
      bankChange: this.bankChange,
      statusChange: this.statusChange,
      departmentChange: this.departmentChange,
      codeChange: this.codeChange,
      dateChange: this.dateChange,
      groupChange: this.groupChange,
      searchInfo: this.searchInfo,
      searchByInfo: this.searchByInfo,
      clearInputInfo: this.clearInputInfo,
      dictionary: this.props.dictionary,
    };
    const tableProps = {
      loading,
      pageSize,
      current,
      total,
      groupInfo,
      authorities: this.props.authorities.groupManagement,
      sortChange: this.sortChange,
      searchInfo: this.searchInfo,
      handlePagerSizeChange: this.handlePagerSizeChange,
      handlePagerChange: this.handlePagerChange,
    };
    return (
      <React.Fragment>
        <div>
          <SearchContent {...inputProps} />
          <DataTable {...tableProps} key='groupTable' />
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(GroupManagement);