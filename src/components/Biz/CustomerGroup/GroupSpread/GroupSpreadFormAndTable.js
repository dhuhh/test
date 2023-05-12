import React from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { message, Row, Col, Form, Checkbox, Select, Card, Button } from 'antd';
import BasicDataTable from '../../../Common/BasicDataTable';
// import { FetchCustomerList } from '../../../../../../../../../../../services/customersenior/simpleCustomerList';
import SetGroup from '../../../WorkPlatForm/MainPage/Customer/MyCustomer/Buttons/SetGroup';
import Exports from './Exports';
import CustomizedColumn from './TreeSelectTransfer';
import { FetchCusListDisplayColumn } from '../../../../services/customerbase/customerListHandle';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { fetchOperationLog } from '../../../../services/basicservices/index';
import { FetchQueryGroupSpreadList } from '../../../../services/cusgroupbase';
import { ptlx } from '../../../../utils/config';
import styles from './index.less';

const FormItem = Form.Item;

class GroupSpread extends React.Component {
  state = {
    cusListDisplayColumnDatas: [], // 所有可展示列
    formData: this.props.formData || [],
    formDataBackup: this.props.formData || [],
    zbCheckedData: [], // 指标勾选数据
    // showTable: false, // 展示根据共性标签表单查询得到的表格
    tableData: [], // 根据共性标签表单查询得到的表格
    fieldsCode: ['customer_no', 'customer_name', 'customer_id', 'department_name', 'fund_account', 'sex_name', 'phone', 'net_assets.merge'],
    total: 0,
    loading: false,
    selectedCount: 0,
    selectAll: false,
    selectedRowKeys: [],
    pagination: {
      paging: 1,
      current: 1,
      pageSize: 8,
      sort: '',
      total: -1,
    },
    groupSpreadCondition: {}, // 种群扩散查询条件
    cxgz: [], // 查询规则-创建客群规则
    columns: [
      { title: '客户姓名',
        dataIndex: 'customer_name',
        key: 'customer_name',
        render: (_, record) => (
          <React.Fragment>
            <Link to={`/customerPanorama/index/${EncryptBase64(record.customer_no)}`} onClick={this.handleOperationLog} style={{ display: 'block' }} target="_blank">
              {record.customer_name}
            </Link>
          </React.Fragment>
        ),
      },
      { title: '客户号', dataIndex: 'customer_no', key: 'customer_no', render: text => text || '--' },
      { title: '营业部', dataIndex: 'department_name', key: 'department_name', render: text => text || '--' },
      { title: '资金账号', dataIndex: 'fund_account', key: 'fund_account', render: text => text || '--' },
      { title: '客户性别', dataIndex: 'sex_name', key: 'sex_name', render: text => text || '--' },
      { title: '柜台手机', dataIndex: 'phone', key: 'phone', render: text => text || '--' },
      { title: '合并户净资产(元)', dataIndex: 'net_assets.merge', key: 'net_assets.merge', render: text => text || '--' },
      // { title: '相似度', dataIndex: 'similarPercent', key: 'similarPercent', render: text => text || '--' },
    ],
    cachekey: '', // 查询种群扩散后返回的key
  }
  componentDidMount() {
    // 调用接口获取所有可展示列
    FetchCusListDisplayColumn({
      ywlx: 0, // 业务类型 TODO..
      xtjs: this.props.userBusinessRole,
      paging: -1,
      current: 1,
    }).then((response) => {
      const { records = [] } = response;
      this.setState({
        cusListDisplayColumnDatas: records,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  onCheckBoxChange = (key, e) => {
    const { formData = [] } = this.state;
    let { zbCheckedData = [] } = this.state;
    if (zbCheckedData.length >= 10 && e.target.checked) {
      message.info('最多只允许选择10个标签!');
    } else {
      e.target.checked ? zbCheckedData.push(key) : zbCheckedData = zbCheckedData.filter(item => item !== key);
      const tempArr = [];
      formData.forEach((element) => {
        const index = element.systagscode.indexOf('-');
        if (zbCheckedData.includes(element.systagscode.substring(0, index))) {
          tempArr.push(Object.assign({}, element, { checked: 0 }));
        } else {
          tempArr.push(Object.assign({}, element, { checked: 1 }));
        }
      });
      tempArr.sort((a, b) => { return a.checked - b.checked; });
      this.setState({
        zbCheckedData,
        formData: tempArr,
      });
    }
  }
  handleClickAll = () => {
    const { formData = [] } = this.state;
    const bqidTempArr = formData.map(item => (item.systagscode || '').split('-')[0] || '');
    this.setState({
      zbCheckedData: bqidTempArr,
    });
  }
  handleReset = () => {
    const { form: { resetFields } } = this.props;
    const { formDataBackup = [] } = this.state;
    resetFields();
    this.setState({
      zbCheckedData: [],
      formData: formDataBackup,
    });
  }
  handleCxgz =(data = [], values = []) =>{
    try {
      const cxgz = [];
      if(data.length > 0 && values.length > 0){
        data.forEach(item => {
          values.forEach(e => {
            if(item.systagscode.split('-')[0] === e.split('-')[0]){
              const zbq = item.tagCode.filter(i => i.bqzid === e.split('-')[1])[0];
              cxgz.push(`${item.bqmc}:${zbq.bqzmc}`);
            }
          });
        });
      }
      this.setState({ cxgz });
    } catch (error) {
      console.log(error);
      this.setState({ cxgz: [] });
    }
  }
  handleSubmit = () => {
    const { zbCheckedData = [], pagination: { current = 1 }, fieldsCode, containSeedPeople, formData } = this.state;
    const { queryParameter = {} } = this.props;
    const { customerListBasicModel = {}, customerListSeniorAndQuickModel = {}, operateButtonSelModel = {}, cxfy = '' } = queryParameter;
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    const tempArr = Object.entries(values).filter(item => zbCheckedData.includes(item[0])).map(item => `${item[0]}-${item[1]}`);
    if (tempArr.length === 0) {
      message.warn('请至少选择一个指标');
      return false;
    }
    this.setState({
      loading: true,
      groupSpreadCondition: {
        ...customerListBasicModel,
        customerTags: tempArr.join(),
      },
    });
    this.setState({
      customerListQueryMainParams: {
        customerListBasicModel: {
          ...customerListBasicModel,
          customerTags: tempArr.join(),
        },
        customerListSeniorAndQuickModel,
        sort: [{ sysTagsPercent: '' }],
      },
      queryParameter: {
        ...customerListBasicModel,
        customerTags: tempArr.join(),
        ...customerListSeniorAndQuickModel,
        sort: [{ sysTagsPercent: '' }],
        cxfy,
      },
    });
    FetchQueryGroupSpreadList({
      customerListBasicModel: {
        ...customerListBasicModel,
      },
      customerListSeniorAndQuickModel: {
        ...customerListSeniorAndQuickModel,
      },
      customerListSaveLogModel: {},
      operateButtonSelModel,
      fieldsCode,
      customerListPagerModel: {
        pageNo: current,
        pageSize: 8,
      },
      sort: [{ sysTagsPercent: '' }],
      containSeedPeople: containSeedPeople ? '1' : '0',
      tagList: tempArr,
      queryScope: '1',
    }).then((result) => {
      const { code = -1, count = 0, result: records = '', cachekey = '' } = result;
      const data = JSON.parse(records);
      if (code > 0) {
        this.setState({
          tableData: data,
          // showTable: true,
          total: count,
          loading: false,
          cachekey,
        });
        this.handleCxgz(formData, tempArr);
      }
    }).catch((error) => {
      this.setState({ loading: false });
      message.error(!error.success ? error.message : error.note);
    });
    // FetchCustomerList({
    //   customerListBasicModel: {
    //     ...customerListBasicModel,
    //     customerTags: tempArr.join(),
    //   },
    //   customerListSeniorAndQuickModel,
    //   customerListSaveLogModel: {
    //   },
    //   fieldsCode,
    //   customerListPagerModel: {
    //     pageNo: current,
    //     pageSize: 9,
    //   },
    //   sort: [{ sysTagsPercent: '' }],
    // }).then((ret = {}) => {
    //   const { code = 0, data = [], count } = ret;
    //   if (code > 0 && Array.isArray(data)) {
    //     this.setState({
    //       tableData: data,
    //       // showTable: true,
    //       total: count,
    //       loading: false,
    //     });
    //   }
    // }).catch((error) => {
    //   message.error(!error.success ? error.message : error.note);
    //   this.setState({
    //     loading: false,
    //   });
    // });
  }
  // 换页
  handleOnChange = (page) => {
    const { pagination = {} } = this.state;
    this.setState({
      pagination: {
        ...pagination,
        current: page,
      },
    }, () => {
      this.handleSubmit();
    });
  }

  // 跳转到客户营销全景的参数
  getParams = (record) => {
    let queryParams = {};
    if (record) {
      queryParams = { khid: record.customer_no, khmc: record.customer_name };
      const paramsStr = JSON.stringify(queryParams);
      // 将参数base64加密
      queryParams = EncryptBase64(paramsStr);
    }
    return queryParams;
  }

  handleSelectChange = (currentSelectedRowKeys, selectedRows, selectAll) => {
    const { total = 0 } = this.state;
    let selectedCount = 0;
    if (selectAll) {
      selectedCount = total - currentSelectedRowKeys.length;
    } else {
      selectedCount = currentSelectedRowKeys.length;
    }
    this.setState({
      selectedCount,
      selectAll,
      selectedRowKeys: currentSelectedRowKeys,
    });
    const { groupSpreadCondition } = this.state;
    const { getGroupSpreadCondition } = this.props;
    if (getGroupSpreadCondition && typeof getGroupSpreadCondition === 'function') {
      getGroupSpreadCondition(selectAll, currentSelectedRowKeys, selectedCount, groupSpreadCondition);
    }
  }

  // 改变自定义列后查询列表
  handleColumnsDatas = (fieldsCode, columns) => {
    this.setState({
      fieldsCode,
      columns,
    }, this.handleSubmit);
  }

  // 埋点记录日志
  handleOperationLog = () => {
    fetchOperationLog({
      czdx: '种群扩散-客户画像',
      czff: '',
      czjl: 0,
      czkm: '9003',
      czsm: '种群扩散点击链接进入: 客户画像',
      ip: '',
      ptlx,
    });
  }

  handleIscontainSeedPeople = (e) => {
    this.setState({
      containSeedPeople: e.target.checked,
    },()=>{
      this.handleSubmit()
    });
  }

  formatTitle = (text, max = 12) => {
    return (
      <span>
        {text && text.length > max && (
          <span title={text}>{text.substr(0, max)}...</span>
        )}
        {text && text.length <= max && (
          text
        )}
        {!text && (
          '--'
        )}
      </span>
    );
  }

  render() {
    const { userBasicInfo, customerQueryType, isAllWindow = false, authorities } = this.props;
    const { customerList = [] } = authorities;

    const { formData = [], zbCheckedData = [], tableData = [], total,
      pagination: { current = 1 }, loading = false, selectedCount = 0, selectAll, selectedRowKeys = [],
      queryParameter, customerListQueryMainParams, cusListDisplayColumnDatas, columns, containSeedPeople = false, cxgz: rule = [], cachekey = '' } = this.state;
    const selectDatas = { selectedCount, selectAll, selectedRowKeys, cachekey };
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 12 },
      wrapperCol: { span: 10 },
    };
    const tempColumns = [];
    if (Array.isArray(columns)) {
      columns.forEach((item) => {
        tempColumns.push(item);
      });
      tempColumns.push({
        title: (
          <CustomizedColumn
            handleDatas={this.handleColumnsDatas} // 获取列表数据
            cusListDisplayColumnDatas={cusListDisplayColumnDatas} // 所有可展示列
            userBusinessRole={this.props.userBusinessRole}
          />),
        dataIndex: 'xxxx',
        width: '2rem',
      });
    }
    const maxPagers = total > 10 * 100 ? 10 * 100 : total;
    const tableProps = {
      rowKey: 'customer_id',
      className: 'm-table-customer m-table-bortop',
      columns: tempColumns,
      loading,
      dataSource: tableData,
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: total !== 0, // checkbox开启跨页全选
        selectAll, // 是否全选
        selectedRowKeys, // 选中(未全选)/取消选中(全选)的rowkey值
        onChange: this.handleSelectChange, // 选择状态改变时的操作
      },
      pagination: {
        className: 'm-paging m-paging-szyx',
        showTotal: () => `共${total}条`,
        showSizeChanger: false,
        showQuickJumper: false,
        hideOnSinglePage: true,
        total: maxPagers,
        current,
        pageSize: 8,
        onChange: this.handleOnChange,
      },
    };
    const cxgz = [];
    cxgz.push({
      title: '种群扩散',
      bh: rule.join(';'),
    });
    return (
      <React.Fragment>
        <Card className="m-card">
          <div style={{ padding: '1.333rem 1.666rem 0' }}>
            <div className="m-explain-box orange-box m-gzt-explain" style={{ marginBottom: '1.333rem', width: '100%' }}>
              <div>说明：结合lookalike算法，计算出种子人群之间的强关联标签，选择标签进行种群扩散。</div>
            </div>
            <Col span={8}>
              <Row>
                <div className="operation" style={{ marginBottom: '1rem' }}>
                  {/* <Button className="m-btn-radius m-btn-headColor" type="primary" onClick={this.handleClickAll}>全选</Button> */}
                  <Button className="m-btn-radius m-btn-headColor" type="primary" onClick={this.handleReset}>重置</Button>
                  <Button className="m-btn-radius m-btn-headColor" type="primary" onClick={this.handleSubmit}>查询</Button>
                </div>
              </Row>
              <div style={{ maxHeight: isAllWindow ? `${window.innerHeight - 210}px` : '40rem', overflow: 'auto', overflowX: 'hidden' }}>
                <Form className={`m-form-gzt ${styles.formMargin}`} layout="horizontal" style={{ margin: '2rem 0' }}>
                  <Row className={`m-row-verform ${styles.myFormItemLabel}`}>
                    {
                      formData.map((item, index) => {
                        const bqid = (item.systagscode || '').split('-')[0] || '';
                        const initialTemp = (item.systagscode || '').split('-')[1] || '';
                        return (
                          <Col span={24} key={bqid}>
                            <FormItem
                              className="m-form-item"
                              label={<Checkbox checked={zbCheckedData.includes(bqid)} onChange={(e) => { this.onCheckBoxChange(bqid, e); }}>{index + 1}.{this.formatTitle(item.bqmc, 8)}</Checkbox>}
                              {...formItemLayout}
                            >
                              {getFieldDecorator(bqid, {
                                initialValue: initialTemp,
                          })( // eslint-disable-line
                                <Select
                                  placeholder="请选择"
                                >
                                  {item.tagCode.map(inner => <Select.Option value={inner.bqzid} key={inner.bqzid}>{inner.bqzmc || '--'}</Select.Option>)}
                                </Select>)}
                            </FormItem>
                          </Col>
                        );
                      })
                    }
                  </Row>
                </Form>
              </div>
            </Col>
            <div className="btn-list-header" style={{ whiteSpace: 'normal', float: 'left', background: '#fff', minHeight: '3rem', margin: '1rem' }}>
             { customerList.includes('JoinGroup') && (
              <SetGroup
                {...selectDatas}
                userBasicInfo={userBasicInfo}
                cxgz={cxgz}
                customerQueryType={customerQueryType}
                {...customerListQueryMainParams}
                queryParameter={queryParameter}
                uuid={cachekey}
                scene="22" // 扩散后建群 场景为22
                // eslint-disable-next-line eqeqeq
                showAddGroupAndCreateActivityBtn={customerQueryType == '1'}
              />)
             }
             {
               customerList.includes('Exports') && (
              <Exports {...selectDatas} displayColumns={columns} queryParameter={queryParameter} />
               )
              }
            </div>
            <div style={{ float: 'right', margin: '1rem', fontSize: '1.3rem' }}>
              <Checkbox checked={containSeedPeople} onChange={this.handleIscontainSeedPeople} >包含种子人群</Checkbox>
            </div>
            <Col span={16} style={{ padding: '0 1rem', position: 'relative' }}>
              <BasicDataTable
                {...tableProps}
              />
              <span style={{ fontSize: '1.3rem' }}> 覆盖: <span style={{ color: '#f7b432' }}>{total}</span>个客户</span>
              {/* {
                tableData.length === 0 ? <Empty className={styles.forEmpty} loading={loading} /> : null
              } */}
              {/* {
                (loading && tableData.length === 0) ? <div className={styles.forSpin}><Spin /></div> : null
              } */}
            </Col>
          </div>
        </Card>
      </React.Fragment>
    );
  }
}

export default Form.create()(connect(({ global }) => ({
  authorities: global.authorities,
}))(GroupSpread));

