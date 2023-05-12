/* eslint-disable array-callback-return */
import React from 'react';
import { message } from 'antd';
import { FetchIntrptCustLst } from '../../../../../../services/incidentialServices';
import SearchContent from './SearchContent';
import DataTable from './DataTable';

class ValueSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false, // 表格是否显示, 初进页面时为false
      pageState: { // 分页查询条件
        paging: 1,
        current: 1,
        pageSize: 10,
        sort: '',
        total: -1,
      },
      payload: { // 查询条件
        intrptType: '', // 中断类型
        intrptStep: '', // 中断步骤
        status: '', // 状态
        chnlSrc: '', // 渠道来源
        openAcOrg: '', // 开户营业部
        phnLoc: '',// 手机属地
        isRcmdr: '', // 是否有推荐人
        intrptTm: '', // 中断时间
        intrptDrtn: '', // 中断时长
        vigourVal: '', // 活力值
        execDept: '', // 执行部门
        execStf: '', // 执行人员
        custInfo: '', // 客户信息
      },
      data: {
        records: [],
        total: 0,
        note: '',
        uuid: '',
      },
      loading: false,
      newPayload: {},
    };
  }

  componentDidMount() {
    window.name = 'valueSearch';
    window.addEventListener('message',(e)=>{
      const { page, action, success } = e.data;
      if(action === "updateFlag"){
        this.fetchData({ ...this.state.payload,...this.state.pageState });
      }
    });
  }

  // 表单提交
  handleSubmit = (values) => {
    const payload = {
      ...values,
      ...this.state.pageState,
      current: 1,
    };
    this.setState({
      payload: {
        ...this.state.payload,
        ...values,
      },
      loading: true,
      show: true,
      pageState: {
        ...this.state.pageState,
        current: 1,
      },
    }, this.fetchData(payload));
  }

  fetchData = (payload) => {
    FetchIntrptCustLst(payload).then((ret = {}) => {
      const { records = [], code = 0, total = 0, note = '',uuid = '' } = ret || {};
      if (code > 0) {
        this.setState({
          data: {
            records: [
              ...records,
            ],
            total: total,
            note,
            uuid,
          },
          loading: false,
          newPayload: payload,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  loadChangePage = (pageState) => {
    this.setState({ loading: true });
    const { payload } = this.state;
    FetchIntrptCustLst({
      ...pageState,
      ...payload,
    }).then((ret = {}) => {
      const { records = [], code = 0, total = 0, note = '' ,uuid = '' } = ret || {};
      if (code > 0) {
        this.setState({
          data: {
            records: [
              ...records,
            ],
            total: total,
            note,
            uuid,
          },
          loading: false,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  setData = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    const { show, pageState, data, loading, payload ,newPayload } = this.state;
    const { dictionary = {}, authorities = {} } = this.props;
    return (
      <React.Fragment>
        <div style={{ backgroundColor: '#ffffff' }}>
          <SearchContent handleSubmit={this.handleSubmit} dictionary={dictionary} zdlx={this.props.zdlx}/>
          {show && <DataTable loadChangePage={this.loadChangePage} setData={this.setData} pageState={pageState} payload={payload} data={data} loading={loading} dictionary={dictionary} authorities={authorities} newPayload={newPayload}/>}
        </div>
      </React.Fragment>
    );
  }
}
export default ValueSearch;