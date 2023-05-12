/* eslint-disable array-callback-return */
import React from 'react';
import { connect } from 'dva';
import DataTable from './DataTable';
import moment from 'moment';
import SearchContent from './SearchContent';
import { GetChannelInfoModel, QueryUserRoleInfo } from '$services/newProduct';
import { message } from 'antd';

class ChannelManagement extends React.Component {
  state = {
    channelInfo: [],
    channelValue: '',
    typeValue: '',
    dateValue: [null, null],
    pageSize: 10,
    current: 1,
    total: 0,
    sorter: '',
    filter: 0,
    loading: false,
    auth: false,
  }
  componentDidMount() {
    this.searchInfo();
    QueryUserRoleInfo().then(res => {
      this.setState({
        auth: res.records[0].rolelist.find(item => item.roleCode === 'QDFZR' || item.roleCode === 'QDZXFZR') ? true : false,
      });
    });
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
  searchByInfo = () => {
    this.setState({
      current: 1,
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
  filterIsActive = (filter) => {
    this.setState({
      filter,
    }, () => {
      this.searchInfo();
    });
  }
  searchInfo = () => {
    const param = {
      status: this.state.filter * 1,
      sort: this.state.sorter,
      pageSize: this.state.pageSize,
      current: this.state.current,
      chnlTp: this.state.typeValue * 1,
      bgnDt: this.state.dateValue[0]?.format('YYYYMMDD'),
      endDt: this.state.dateValue[1]?.format('YYYYMMDD'),
      chnlId: this.state.channelValue,
      chnlCode: "",
      chnlInf: "",
    };
    this.setState({
      loading: true,
    });
    GetChannelInfoModel(param).then(res => {
      if (res.code === 1) {
        this.setState({
          channelInfo: res.records,
          total: res.total,
          loading: false,
        });
      }
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  typeChange = (value) => {
    this.setState({
      typeValue: value,
    });
  }
  dateChange = (value) => {
    this.setState({
      dateValue: value,
    });
  }
  channelChange = (value) => {
    this.setState({
      channelValue: value,
    });
  }
  clearInputInfo = () => {
    this.setState({
      channelValue: '',
      typeValue: '',
      dateValue: [null, null],
    });
  }
  render() {
    const { channelValue, typeValue, dateValue, channelInfo, pageSize, current, total, loading, auth, sorter, filter } = this.state;
    const { authorities } = this.props;
    // console.log(this.props.authorities);
    const inputProps = {
      channelValue,
      typeValue,
      dateValue,
      typeChange: this.typeChange,
      dateChange: this.dateChange,
      channelChange: this.channelChange,
      searchInfo: this.searchInfo,
      searchByInfo: this.searchByInfo,
      clearInputInfo: this.clearInputInfo,
      dictionary: this.props.dictionary,
    };
    const tableProps = {
      pageSize,
      current,
      total,
      channelInfo,
      channelValue,
      typeValue,
      dateValue,
      loading,
      authorities,
      auth,
      sorter,
      filter,
      filterIsActive: this.filterIsActive,
      sortChange: this.sortChange,
      searchInfo: this.searchInfo,
      handlePagerSizeChange: this.handlePagerSizeChange,
      handlePagerChange: this.handlePagerChange,
    };

    return (
      <React.Fragment>
        <div>
          <SearchContent {...inputProps} />
          <DataTable {...tableProps} key='channelTable' />

        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  authorities: global.authorities,
}))(ChannelManagement);