import React from 'react';
import { Select, Pagination, AutoComplete, Input, Tooltip, Icon } from 'antd';
import debounce from 'lodash.debounce';

const { Option, OptGroup } = Select;
class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = debounce(this.handleSearch, 400);// 强制一个函数在某个连续时间段内只执行一次 win10自带输入法输入慢会有问题 待解决
    this.state = {
      seleValue: '',
      current: 1,
      pageSize: 20,
    };
  }
  handleSearch = (value) => {
    let valueFormat = '';
    const { handleFormChange } = this.props;
    if (value !== '' && value !== undefined) {
      valueFormat = value.replace(/'/g, '');
    }
    if (handleFormChange) {
      handleFormChange({ selectData: [], loading: true });
    }
    if (this.props.parentThis.fetchData) {
      this.props.parentThis.fetchData({ current: 1, filter: [], cusInfo: valueFormat });
    }
    // this.setState({ seleValue: valueFormat });
    this.setState({ current: 1 });
  }
  handleInputChange = (value) => {
    this.setState({ seleValue: value });
  }
  renderTitle = (total) => {
    return (
      <span>
        <span className="blue" style={{ float: 'right' }}>共{total}条</span>
      </span>
    );
  }

  handlePageChange = (page) => { //分页
    const { seleValue } = this.state;
    this.setState({
      current: page,
    }, this.props.parentThis.fetchData({ current: page, cusInfo: seleValue })
    );
  }
  handleClick = () => {
    this.setState({ seleValue: '' });
  }
  render() {
    const { seleValue, current, pageSize } = this.state;
    const { selectData = [], total, loading } = this.props;
    const dataSource = [];
    const maxCount = total > 10000 ? 10000 : total;
    if (total > 0) {
      dataSource.push({
        key: 2,
        title: {
          count: total,
        },
        children: selectData,
      });
    } else {
      dataSource.push({
        key: '#',
        title: {
          count: 0,
        },
        children: [{
          title: '!',
          key: '换个关键词试试',
        }],
      });
    }
    let options = [];
    options = dataSource.map((group, index) => (
      <OptGroup
        key={index}
        label={this.renderTitle(group.title.count)}
      >
        {group.children.map(opt => (
          <Option key={`${group.key}-${opt.cus_no}-${opt.cus_nm}`} value={`${opt.cus_no}`.trim()} disabled={opt.key === '换个关键词试试'}>
            {`${opt.cus_no || ''}  ${opt.cus_nm || ''}`}
          </Option>
        ))}
        <Option key="paging" disabled style={{ cursor: 'auto' }}>
          <Pagination
            // showQuickJumper
            total={maxCount}
            current={current}
            // className="m-paging"
            onChange={this.handlePageChange}
            pageSize={pageSize}
            size="small"
            // simple={true}
            showLessItems={true}
            // style={{ paddingLeft: '0.666rem' }}
          />
        </Option>
      </OptGroup>
    ));
    if (selectData.length === 0) {
      options = loading ? [<Option key="spin" disabled><span className="m-color"><Icon type="loading" />&nbsp;&nbsp;查询中...</span></Option>] : [<Option key=" " disabled>查询不到该客户记录</Option>];
    }


    return (
      <div>
        <AutoComplete id="product"
          // allowClear={true}
          dataSource={options}
          placeholder="请输入客户姓名或客户号"
          onSearch={(value) => { this.handleSearch(value); }}
          onChange={(value) => { this.handleInputChange(value); }}
          value={seleValue}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          <Input
            // placeholder="请输入客户姓名或客户号"
            // suffix={
            //   <span>
            //     {
            //       seleValue !== '' && (
            //         <Tooltip title="清空">
            //           <Icon type="close" style={{ color: 'rgba(0,0,0,.45)' }} onClick={this.handleClick} />
            //         </Tooltip>
            //       )
            //     }
            //   </span>
            // }
            suffix={
              <span>
                {
                  seleValue !== '' && (
                    <Tooltip title="清空">
                      <Icon type="close" style={{ color: 'rgba(0,0,0,.45)' }} onClick={this.handleClick} />
                    </Tooltip>
                  )
                }
              </span>
            }
            maxLength={20}
          />
        </AutoComplete >
      </div>
    );
  }
}
export default SearchInput;
