import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Table, message, Pagination } from 'antd';
import { history as router } from 'umi';
import { QueryLevelBenefit } from '$services/newProduct';
import { clickSensors, viewSensors } from './util';
import styles from './index.less';

export default class index extends Component {
  state = {
    dataSource: [],
    pageSize: 10,
    loading: false,
    current: 1,
    total: 0,
  }
  componentDidMount() {
    this.fetchData();
    viewSensors('客户等级与权益');
  }
  fetchData = () => {
    this.setState({
      loading: true,
    });
    const { current, pageSize } = this.state;
    QueryLevelBenefit().then(res => {
      let data = res.records;
      let levelData = data.map(item =>
        item.benefitDetial?.map(item1 => {
          return { level: item.level, custNum: item.custNum, ...item1 };
        })
      ).flat().sort((a, b) => b.level - a.level);
      // console.log(levelData);
      this.setState({
        loading: false,
        dataSource: levelData.slice((current - 1) * pageSize, current * pageSize).map((item, index) => { return { key: index, ...item }; }),
        total: levelData.length,
      });
    }).catch(err => message.error(err.note || err.message));
  }
  getColumns = () => {
    const { dataSource } = this.state;
    const typeMap = {
      0: '交易特权',
      1: '理财特权',
      2: '服务特权',
    };
    const statusMap = {
      0: '未上架',
      1: '已上架',
      2: '已停用',
    };
    const conditionMap = {
      0: '注册',
      1: '开户',
      2: '当月日均资产≥1000元或近12个月贡献≥60元',
      3: '当月日均资产≥5万元或近12个月贡献≥300元',
      4: '当月日均资产≥15万元或近12个月贡献≥1200元',
      5: '当月日均资产≥30万元或近12个月贡献≥4000元',
      6: '当月日均资产≥100万元或近12个月贡献≥1万元',
      7: '当月日均资产≥500万元或近12个月贡献≥3万元',
    };
    return [
      {
        title: '等级',
        key: '等级',
        width: 65,
        dataIndex: 'level',
        render: (value, row, index) => {
          const obj = {
            children: 'V' + value,
            props: {},
          };
          let keys = [];
          dataSource.forEach((item, index1) => {
            if (item.level === value) {
              keys.push(index1);
            }
          });
          if (index === keys[0]) {
            obj.props.rowSpan = keys.length;
            keys.shift();
          }
          if (keys.includes(index)) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '达标条件',
        key: '达标条件',
        dataIndex: 'condition',
        width: 190,
        render: (value, row, index) => {
          const obj = {
            children: conditionMap[row.level],
            props: {},
          };
          let keys = [];
          dataSource.forEach((item, index1) => {
            if (item.level === row.level) {
              keys.push(index1);
            }
          });
          if (index === keys[0]) {
            obj.props.rowSpan = keys.length;
            keys.shift();
          }
          if (keys.includes(index)) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '当前客户数',
        key: '当前客户数',
        // width: 150,
        dataIndex: 'custNum',
        render: (value, row, index) => {
          const obj = {
            children: 
            <Link
              to={this.handlerSearch(row)}
              title={value}
            >
              <span style={{ color: '#244FFF', cursor: 'pointer' }} >{value}</span>
            </Link>,
            props: {},
          };
          let keys = [];
          dataSource.forEach((item, index1) => {
            if (item.level === row.level) {
              keys.push(index1);
            }
          });
          if (index === keys[0]) {
            obj.props.rowSpan = keys.length;
            keys.shift();
          }
          if (keys.includes(index)) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: '具体名称',
        key: '具体名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        key: '类型',
        dataIndex: 'privilegeType',
        render: (text) => typeMap[text],
      },
      {
        title: '标签',
        key: '标签',
        dataIndex: 'tag',
      },
      {
        title: '价值',
        key: '价值',
        dataIndex: 'price',
      },
      {
        title: '是否已在客户端上架',
        key: '是否已在客户端上架',
        dataIndex: 'benefitPackageStatus',
        render: (text) => statusMap[text],
      },
    ];
  }
  handlePagerSizeChange = (current, pageSize) => this.handlePageChange(1, pageSize)
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  };

  handlerSearch = (row) => {
    const url = `/newProduct/customerList?state=${row.level}`;
    return url;
  }

  render() {
    const { pageSize, current, total, dataSource, loading } = this.state;
    let columns = this.getColumns() || [];
    const tableProps = {
      loading,
      rowKey: 'key',
      dataSource: dataSource,
      columns,
      pagination: false,
    };
    const paginationProps = {
      size: 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      pageSize: pageSize,
      current: current,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handlePagerSizeChange,
      total: total,
    };
    return (
      <div style={{ padding: '25px 16px', overflow: 'auto', background: '#fff' }}>
        <Table {...tableProps} bordered />
        <Pagination {...paginationProps} className={`${styles.pagination} ${styles.smallPagination}`} />
      </div >
    );
  }
}
