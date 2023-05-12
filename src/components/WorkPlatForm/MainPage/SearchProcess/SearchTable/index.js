import React, { Component } from 'react';
import { Col, Row, Table , Tooltip} from 'antd';
import FilterColumn from './FilterColumn';
import { history, Link } from 'umi';
import { getQueryDictionary } from '$services/searchProcess';
import styles from '../index.less';
class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      YWLC_ZTList: [] ,//状态--option
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);
    }
  }
  componentDidMount() {
    this.getAllQueryDictionary();
  }
  getAllQueryDictionary= ()=>{
    let payload = [{ dictionaryType: "YWLC_ZT",List: 'YWLC_ZTList' }];
    for(let i = 0;i < payload.length;i++){
      getQueryDictionary(payload[i]).then(res=>{
        const { records = [] } = res;
        this.setState({ [payload[i].List]: records });
      });
    }
  }

  filterText = (value) => {
    let len = value.length;
    return (
      <div>
        {
          len > 10 ? <Tooltip title={value}><span style={{ cursor: 'pointer' }}>{value.slice(0,10)}...</span> </Tooltip> : 
            <span style={{ color: value === '完成' ? '#00B280' : value === '受理' ? '#4B516A' : value === '待审核' ? '#FF6E2F' : '#4B516A' }}>{value || '--'}</span>  
        } 
      </div>
    );
  }

  // 表格列
  getColumns = () => {
    const { YWLC_ZTList } = this.state;
    return [
      {
        title: '序号',
        dataIndex: 'no',
        className: `${styles.noLcaltion} m-black`,
        key: 'no',
        fixed: 'left',
        width: 65,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '客户',
        dataIndex: 'khxm',
        className: `columnLine m-black`,
        key: 'khxm',
        fixed: 'left',
        width: 100,
        render: (text,record) => <Link to={`/customerPanorama/customerInfo?customerCode=${record.khh}`} target='_blank'><div style={{ color: '#244fff', cursor: 'pointer' }}>{text || '--'}</div></Link> ,
      },
      {
        title: '客户号',
        dataIndex: 'khh',
        className: `columnLine m-black`,
        key: 'khh',
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '证件号码',
        className: `columnLine m-black`,
        dataIndex: 'zjhm',
        key: 'zjhm',
        width: 180,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '资金账号',
        className: 'columnLine m-black',
        dataIndex: 'zjzh',
        key: 'zjzh',
        width: 120,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '业务名称',
        className: 'columnLine m-black',
        dataIndex: 'ywmc',
        key: 'ywmc',
        width: 260,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '处理状态',
        className: 'columnLine',
        dataIndex: 'clzt',
        key: 'clzt',
        width: 185,
        // ellipsis: true,
        filterDropdown: ({ confirm }) => <FilterColumn parentThis={this} getInstence={(searchTabelThis) => { this.searchTabelThis = searchTabelThis; }} YWLC_ZTList={YWLC_ZTList} confirm={confirm} />,
        render: text => <div>{ this.filterText(text)}</div>,
      },
      {
        title: '登录渠道',
        className: 'columnLine m-black',
        dataIndex: 'dlqd',
        key: 'dlqd',
        width: 240,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '关系类型',
        className: 'columnLine m-black',
        dataIndex: 'gxlx',
        key: 'gxlx',
        // width: 260,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '客户所属机构',
        className: 'columnLine m-black',
        dataIndex: 'khssjg',
        key: 'khssjg',
        width: 260,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '操作时间',
        className: 'columnLine m-black',
        dataIndex: 'czsj',
        key: 'czsj',
        width: 160,
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
      {
        title: '备注信息',
        className: 'columnLine m-black',
        dataIndex: 'bzxx',
        key: 'bzxx',
        render: text => <div className='m-darkgray-g' >{text || '--'}</div>,
      },
    ];
  }



  
  render() {
    const { tableProps } = this.props;
    return (
      <Row style={{ padding: '0' }}>
        <Col>
          <Table {...tableProps} columns={this.getColumns()} ></Table>
        </Col>
      </Row>
    );
  }
}

export default SearchTable;
