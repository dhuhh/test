import React, { Component } from 'react';
import { Row, Col, Table, message, Popover } from 'antd';
import InputCheckbox from './InputCheckbox';
import { QueryOtherListDisplayColumn } from '../../../../../services/newProduct';
import styles from '../index.less';

class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      columnExtraTitle: {}, // 红色小字
      //checkDatas: this.props.tableProps.dataSource,
    };
    const { getInstance } = this.props;
    if (getInstance) {
      getInstance(this);
    }
  }

  componentDidMount() {
    // this.assembleColumns();
    this.fetchColumns();
  }

  componentDidUpdate(nextProps, nextState) {
    const { customerType: preCustomerType = '' } = this.props;
    const { customerType: aftCustomerType = '' } = nextProps;
    const { columnExtraTitle: reColumnExtraTitle = {} } = this.state;
    const { columnExtraTitle: aftColumnExtraTitle = {} } = nextState;
    if (preCustomerType !== aftCustomerType || JSON.stringify({ ...reColumnExtraTitle }) !== JSON.stringify({ ...aftColumnExtraTitle })) {
      this.fetchColumns();
    }
  }

  handleSetPayload = (payload) => {
    this.setState(payload);
  }

  //获取动态列
  fetchColumns = async () => {
    const { columnExtraTitle = {} } = this.state;
    const { filters = [], handleFormChange } = this.props;
    const tableHeaderCodes = [];
    const headerInfo = [];
    await QueryOtherListDisplayColumn({ srchScene: 2 }).then((res) => {
      const { records = [] } = res;
      if (records.length > 0) {
        let index = 0;
        let item = {};
        const { customerType = '' } = this.props;
        const columnsData = records.map((i, o) => {
          tableHeaderCodes.push(i.colCode);
          headerInfo.push(i.dispCol);
          if (customerType === '12') {
            if (i.dispCol === '交易金额(万)') {
              headerInfo.splice(headerInfo.indexOf('交易金额(万)'), 1, '销售金额(万)');
              index = o;
              item = {
                title: '销售金额(万)',
                dataIndex: i.colCode.toLowerCase(),
                key: i.colCode,
                className: 'm-black',
                sorter: i.isOrd === '1' ? true : false,
                sortDirections: i.isOrd === '1' ? ['descend', 'ascend'] : null,
                filtered: filters.includes(i.colCode),
                filterDropdown: i.valObjsivTp === '3' ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => <InputCheckbox handleFormChange={this.props.handleFormChange} title={i.dispCol} dataIndex={i.colCode} confirm={confirm} clearFilters={clearFilters} getInstance={(childrenThis) => { this.childrenThis = childrenThis; }} checkDatas={this.props.checkDatas} getData={this.props.getData} /> : null,
                onFilterDropdownVisibleChange: i.valObjsivTp === '3' ? visible => {
                  if (visible) {
                    this.childrenThis.setState({ loading: true });
                    const { getData } = this.props;
                    if (getData) {
                      getData({ srchTp: 2 });
                    }
                    this.childrenThis.setState({ loading: false });
                  }
                } : null,
                render: (text) => this.renderColumns(text, i.ftFmtTp, i.colCode),
              };
            }
          } else {
            if (i.dispCol === '交易金额(万)') {
              index = o;
              item = {
                title: '交易金额(万)',
                dataIndex: i.colCode.toLowerCase(),
                key: i.colCode,
                className: 'm-black',
                sorter: i.isOrd === '1' ? true : false,
                sortDirections: i.isOrd === '1' ? ['descend', 'ascend'] : null,
                filtered: filters.includes(i.colCode),
                filterDropdown: i.valObjsivTp === '3' ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => <InputCheckbox handleFormChange={this.props.handleFormChange} title={i.dispCol} dataIndex={i.colCode} confirm={confirm} clearFilters={clearFilters} getInstance={(childrenThis) => { this.childrenThis = childrenThis; }} checkDatas={this.props.checkDatas} getData={this.props.getData} /> : null,
                onFilterDropdownVisibleChange: i.valObjsivTp === '3' ? visible => {
                  if (visible) {
                    this.childrenThis.setState({ loading: true });
                    const { getData } = this.props;
                    if (getData) {
                      getData({ srchTp: 2 });
                    }
                    this.childrenThis.setState({ loading: false });
                  }
                } : null,
                render: (text) => this.renderColumns(text, i.ftFmtTp, i.colCode),
              };
            }
          }
          return {
            title: (
              <div style={{ position: 'relative', top: `${i.title || columnExtraTitle[i.colCode] ? '.483rem' : ''}` }}>
                <div>{i.dispCol}</div>
                <div style={{ color: '#ff6e30', fontSize: '12px', lineHeight: '1' }}>
                  {
                    i.title ? `(${i.title})` : ''
                  }
                </div>
                {
                  columnExtraTitle[i.colCode] && (
                    <div
                      className={styles.textOverFlow}
                      style={{ fontSize: '12px', fontWeight: '500', textAlign: 'left', color: '#ff6e30', lineHeight: '1' }}
                      title={columnExtraTitle[i.colCode]}
                    >
                      {filters.includes(i.colCode) ? (columnExtraTitle[i.colCode]) : ''}
                    </div>
                  )
                }
              </div>
            ),
            dataIndex: i.colCode,
            key: i.colCode,
            className: 'm-black',
            sorter: i.isOrd === '1' ? true : false,
            sortDirections: i.isOrd === '1' ? ['descend', 'ascend'] : null,
            filtered: filters.includes(i.colCode),
            filterDropdown: i.valObjsivTp === '3' ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => <InputCheckbox sort={this.props.sort} handleSetFilter={this.handleSetFilter} handleSetPayload={this.handleSetPayload} columnExtraTitle={this.state.columnExtraTitle} handleFormChange={this.props.handleFormChange} title={i.dispCol} dataIndex={i.colCode} confirm={confirm} clearFilters={clearFilters} getInstance={(childrenThis) => { this.childrenThis = childrenThis; }} checkDatas={this.props.checkDatas} getData={this.props.getData} /> : null,
            onFilterDropdownVisibleChange: i.valObjsivTp === '3' ? visible => {
              if (visible) {
                this.childrenThis.setState({ loading: true });
                const { getData } = this.props;
                if (getData) {
                  getData({ srchTp: 2 });
                }
                this.childrenThis.setState({ loading: false });
              }
            } : null,
            render: (text) => this.renderColumns(text, i.ftFmtTp, i.colCode),
          };
        });
        const xh = {
          title: '序号',
          width: 100,
          dataIndex: 'no',
          key: 'no',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text || '--'}</div>,
        };
        columnsData.splice(0, 0, xh);
        columnsData.splice(4, 1);
        columnsData.splice(3, 0, item);
        // const columnsData = [
        //   {
        //     title: '序号',
        //     width: 100,
        //     dataIndex: 'no',
        //     key: 'no',
        //     className: 'm-black',
        //     render: text => <div className='m-darkgray'>{text || '--'}</div>,
        //   },
        // ];
        // records.forEach(i => {
        //   columnsData.push({
        //     title: i.dispCol,
        //     dataIndex: i.colCode,
        //     key: i.colCode,
        //     className: 'm-black',
        //     sorter: i.isOrd === '1' ? true : false,
        //     sortDirections: i.isOrd === '1' ? ['descend', 'ascend'] : null,
        //     filtered: filters.includes(i.colCode),
        //     filterDropdown: i.valObjsivTp === '3' ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => <InputCheckbox handleFormChange={this.props.handleFormChange} title={i.dispCol} dataIndex={i.colCode} confirm={confirm} clearFilters={clearFilters} getInstance={(childrenThis) => { this.childrenThis = childrenThis; }} checkDatas={this.props.checkDatas} getData={this.props.getData} /> : null,
        //     onFilterDropdownVisibleChange: i.valObjsivTp === '3' ? visible => {
        //       if (visible) {
        //         this.childrenThis.setState({ loading: true });
        //         const { getData } = this.props;
        //         if (getData) {
        //           getData({ srchTp: 2 });
        //         }
        //         this.childrenThis.setState({ loading: false });
        //       }
        //     } : null,
        //     render: text => this.renderColumns(text, i.ftFmtTp),
        //   });
        // });
        handleFormChange({ tableHeaderCodes, headerInfo });
        this.setState({
          columns: columnsData,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  renderColumns = (text, type, colCode) => { // ftFmtTp 1直接展示；2|正红负绿
    // if (type === '1') {
    //   return <div className='m-darkgray'>{text}</div>;
    // } else if (Number(text) > 0) {
    //   return <Popover content={<span className={Number.parseFloat(text) > 0 ? 'pink' : 'green'}></span>}><div style={{ color: 'red' }}>{text}</div></Popover>;
    // } else {
    //   // return <div style={{ color: 'green' }}>{text}</div>;
    // }
    if(text.includes('.')) { //如果是浮点数
      let textArr = text.split('.');
      let textOne = textArr[0];
      let textSecond = text.substring(text.indexOf('.') + 1, text.indexOf('.') + 3);
      if (type === '1') {
        if (colCode !== 'cus_no' ) {;
          return <Popover content={<span className='m-darkgray'>{text}</span>}><span className='m-darkgray'>{textOne + '.' + textSecond}</span></Popover>;
        } else {
          return <div className='m-darkgray'>{text}</div>;
        }
      } else {
        if (colCode !== 'cus_no' ) {;
          return <Popover content={<span className={text.includes('-') > 0 ? 'green' : 'pink'}>{text}</span>}><span className={text.includes('-') > 0 ? 'pink' : 'green'}>{textOne + '.' + textSecond}</span></Popover>;
        } else {
          return <div className='m-darkgray'>{text}</div>;
        }
      }
    } else {
      return <div className='m-darkgray'>{text}</div>;
    }

  }

  // handleSetFilter = (filters) => {
  //   this.setState(filters);
  // }




  render() {
    const { tableProps } = this.props;
    const { columns = [] } = this.state;
    return (
      <Row style={{ marginTop: '1.5rem' }}>
        <Col>
          <Table {...tableProps} columns={columns} />
        </Col>
      </Row>
    );
  }

}

export default SearchTable;
