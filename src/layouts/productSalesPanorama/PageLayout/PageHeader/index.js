import React from 'react';
import { Layout, Input, AutoComplete, Icon, message } from 'antd';
import { Link } from 'dva/router';
import classnames from 'classnames';
import styles from './index.less';
// import { HighLightKeyword } from '../../../../components/Common/TextHandler/HtmlToText';
import { EncryptBase64 } from '../../../../components/Common/Encrypt';

const Option = AutoComplete.Option; // eslint-disable-line
const OptGroup = AutoComplete.OptGroup; // eslint-disable-line
export default class PageHeader extends React.PureComponent {
  state = {
    productList: [],
    productCount: 0,
    fillValue: '',
    width: '30rem',
  }
  handleOnFocus () {
    this.setState({ width: '30rem' });
  }
  handleOnBlur () {
    this.setState({ width: '30rem' });
  }
  // handleSearch = (value) => {
  //   const valueFormat = value.replace(/'/g, '');
  //   this.setState({
  //     // fetching: true,
  //     productList: [],
  //     fillValue: valueFormat,
  //   });
  //   this.handleSearchProductList(valueFormat);
  // }
  // handleAutoCompleteSelect = (value, option) => {
  //   if (value && value !== ' ') {
  //     const url = option.props.children.props.to;
  //     window.open(`/#${url}`);
  //     this.setState({ fillValue: value.trim() });
  //   } else {
  //     this.setState({ fillValue: '' });
  //   }
  // }
  // handleSearchProductList = (value) => {
  //   if (value !== '') {
  //     FetchQueryProductTips({
  //       paging: 1,
  //       current: 1,
  //       pageSize: 10,
  //       total: -1,
  //       sort: '',
  //       keyword: value,
  //     }).then((response) => {
  //       const { records = [], total = 0 } = response;
  //       const dataSource = [];
  //       records.forEach((item) => {
  //         dataSource.push({
  //           key: item.cpid,
  //           value: item.cpdm,
  //           title: item.cpmc,
  //           highLightValue: HighLightKeyword(item.cpdm, value, false),
  //         });
  //       });
  //       this.setState({
  //         productList: dataSource,
  //         productCount: total,
  //       });
  //     }).catch((error) => {
  //       message.error(!error.success ? error.message : error.note);
  //     });
  //   }
  // }
  // renderTitle = (title) => {
  //   return (
  //     <span>
  //       {title.name}
  //       <span className="blue" style={{ float: 'right' }}>共{title.count}条</span>
  //     </span>
  //   );
  // }
  // renderChlidren = (list) => {
  //   const result = [];
  //   list.forEach((item) => {
  //     result.push({
  //       title: item.title,
  //       key: item.key,
  //     });
  //   });
  //   return result;
  // }
  render () {
    const { toggleCollapsed, prodMoreInfo, collapsed = false } = this.props;
    const sfzdzx = '0' //  是否重点在销 1:是|0:非
    const sfrx = '0' // 是否热销 1"是|0：非

    const { productCount = 0, productList, width = 0 } = this.state;
    // const dataSource = [];
    // if (productCount) {
    //   dataSource.push({
    //     key: 1,
    //     title: {
    //       name: '产品',
    //       count: productCount,
    //     },
    //     children: productList,
    //   });
    // }
    // if (!productCount) {
    //   dataSource.push({
    //     key: '#',
    //     title: {
    //       name: '无结果',
    //       count: 0,
    //     },
    //     children: [{
    //       title: '',
    //       key: '',
    //       value: '换个关键词试试',
    //     }],
    //   });
    // }
    // const options = dataSource.map((group, index) => (
    //   <OptGroup
    //     key={index}
    //     label={this.renderTitle(group.title)}
    //   >
    //     {group.children.map((opt) => {
    //       return (
    //         <Option key={`${group.key}-${opt.key}-${opt.title}`} value={`${opt.key}  ${opt.title}`.trim()}>
    //           {group.key === 1 ? <Link to={`/productPanorama/index/${EncryptBase64(opt.key)}`} target="_blank" style={{ color: '#2daae4', width: '100%', display: 'block' }}><span dangerouslySetInnerHTML={{ __html: opt.highLightValue }} />{opt.key}&nbsp;&nbsp;{opt.title}</Link> :
    //             <p style={{ color: '#2daae4', width: '100%', display: 'block' }}>{opt.key}&nbsp;{opt.title}</p>
    //           }
    //         </Option>
    //       );
    //     })}
    //   </OptGroup>
    // ));
    return (
      <Layout.Header className="m-header m-header360 " style={{ width: '100%', height: '5rem',background: '#54a9df', paddingLeft: collapsed ? '5rem' : '17.666rem' }}>
        <div>
          {
            !collapsed && <span className="menu-list" onClick={toggleCollapsed}><i className="iconfont icon-menu" /></span>
          }
          <span className="">
            <span className={sfzdzx === '0' ? 'm-header-left' : 'm-header-left m-header-left-active'}>
              <i className="iconfont icon-rate" />
              <span>重点在销</span>
            </span>
            <span className={sfrx === '0' ? 'm-header-left' : 'm-header-left m-header-left-active'}>
              <i className="iconfont icon-hot" />
              <span>热销</span>
            </span>
          </span>
          <AutoComplete
            allowClear
            className={classnames('certain-category-search', styles.searchInput)}
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: '17rem', zIndex: 1, position: 'fixed' }}
            style={{ width, color: '#6E6E6E', display: 'inline-block', margin: '1.2rem 5rem 0 0', float: 'right' }}
            // dataSource={options}
            placeholder="产品代码/产品名称"
            optionLabelProp="value"
            // onSearch={(value) => { this.handleSearch(value); }}
            // onSelect={(value, option) => { this.handleAutoCompleteSelect(value, option); }}
            onFocus={() => { this.handleOnFocus(); }}
            onBlur={() => { this.handleOnBlur(); }}
          >
            <Input
              suffix={this.state.fillValue ? <span /> : <Icon type="search" className="certain-category-icon" style={{ fontSize: '2rem' }} />}
              style={{ display: 'inline-block', float: 'right', width }}
            />
          </AutoComplete>
        </div>
      </Layout.Header>
    );
  }
}
