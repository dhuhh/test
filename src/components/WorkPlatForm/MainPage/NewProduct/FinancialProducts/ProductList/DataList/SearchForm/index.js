import React from 'react';
import { Row, Divider, message, Checkbox } from 'antd';
import lodash from 'lodash';
import { FetchProductCommonSearch } from '../../../../../../../../services/newProduct';
import styles from '../../index.less';

class SearchForm extends React.Component {
  state = {
    serchTerms: [], // 查询条件
  }

  componentDidMount() {
    const { payload: { queryType = '', excludeFunds = false } } = this.props;
    this.fetchData({ queryType, excludeFunds });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { payload: { queryType: preType = '', excludeFunds: preExcludeFunds = false } } = this.props;
    const { payload: { queryType: aftType = '', excludeFunds: aftExcludeFunds = false } } = nextProps;
    if (preType !== aftType || preExcludeFunds !== aftExcludeFunds) {
      this.fetchData({ queryType: aftType, excludeFunds: aftExcludeFunds });
    }
  }

  componentDidUpdate = (prevProps) => {
    const { serchTerms = [] } = this.state;
    const { payload: { productState: oldProductState = '' } } = prevProps;
    const { count = 0, payload: { productState = '' } } = this.props;
    const { count: oldCount } = prevProps;
    if (productState === '6' && oldCount !== count) {
      if (serchTerms.length) {
        if (lodash.get(serchTerms, '[0].clOpts[1].optNm', '')) {
          serchTerms[0].clOpts[1].optNm = `我的(${count})`;
          this.setState({ serchTerms });
        }
      }
    } else if (oldProductState === '6' && productState !== '6') {
      if (serchTerms.length) {
        if (lodash.get(serchTerms, '[0].clOpts[1].optNm', '')) {
          serchTerms[0].clOpts[1].optNm = '我的';
          this.setState({ serchTerms });
        }
      }
    }
  }

  fetchData = (p) => {
    let { queryType = '', excludeFunds = false } = p;
    excludeFunds = excludeFunds ? 1 : 0;
    FetchProductCommonSearch({
      srchScene: queryType,
      isDelete: excludeFunds,
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        let serchTerms = records.sort((x, y) => x.dispOrd - y.dispOrd);
        const { payload: { productState = '' } } = this.props;
        if (productState !== '6') {
          serchTerms[0].clOpts[1].optNm = '我的';
        }
        this.setState({ serchTerms });
        this.handleTermInit(serchTerms, queryType);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleTypeChange = (key) => {
    const { handleFormChange } = this.props;
    // 需要重置表头筛选条件
    if (handleFormChange) {
      handleFormChange({ queryType: key, attrConditionModels: [] });
    }
  }

  // 初始化条件状态
  handleTermInit = (terms, queryType) => {
    // isEsnlChc：1必选 0非必选
    const { handleFormChange, changeIsSearchTermsLoaded } = this.props;
    // 处理是否必选，必选的话初始选中第一个
    terms.forEach((m) => {
      const { id = '', clOpts = [], isEsnlChc = '' } = m;
      if (id === (terms[0] || {}).id) {
        // 产品状态
        let tps = '';
        if (isEsnlChc === '1') {
          tps = (clOpts[0] || {}).optId || '';
        }
        handleFormChange({ productState: tps }, () => {
          if (changeIsSearchTermsLoaded) {
            changeIsSearchTermsLoaded(true);
          }
        });
      } else if (id === (terms[1] || {}).id) {
        // 客户类型
        let tct = '';
        // “个人”页签下，客户类型默认选中“销售关系”（optId === '3'）
        // if (queryType === '1') {
        //   tct = '12';
        // } else {
        if (isEsnlChc === '1') {
          if (queryType === '3') { //如果选中营业部则默认选中全部客户
            tct = (clOpts[4] || {}).optId || '';
          } else {
            tct = (clOpts[0] || {}).optId || '';
          }
          // tct = (clOpts[0] || {}).optId || '';
        }
        // }
        handleFormChange({ customerType: tct }, () => {
          if (changeIsSearchTermsLoaded) {
            changeIsSearchTermsLoaded(true);
          }
        });
      }
    });
  }

  // 获取产品状态/客户类型选中id数组
  getSelectedTermsIds = (groupId) => {
    const { serchTerms = [] } = this.state;
    const { payload = {} } = this.props;
    const { productState = '', customerType = '' } = payload;
    // 产品状态和客户类型选中数组
    let arr = [];
    // groupId: 1产品状态 2客户类型
    if (groupId === (serchTerms[0] || {}).id) {
      arr = productState ? productState.split(',') : [];
    } else if (groupId === (serchTerms[1] || {}).id) {
      arr = customerType ? customerType.split(',') : [];
    }
    return arr;
  }

  handleTermChange = (group, data) => {
    const { serchTerms = [] } = this.state;
    const { handleFormChange, payload = {} } = this.props;
    const { customerType = '', productState = '', pagerModel } = payload;
    // 查询时需要重置页码
    const newPager = { ...pagerModel, pageNo: 1 };
    const selectAllCusType = () => {
      // 特殊处理，产品状态选择“我的”的时候，客户类型必选，如果没选，默认选中全部
      if (!customerType) {
        const cusTypeTerm = serchTerms.find(m => m.id === (serchTerms[1] || {}).id) || {};
        const optIds = (cusTypeTerm.clOpts || []).map(m => m.optId);
        return { customerType: optIds.join(',') };
      }
      return {};
    };
    // 产品状态单选，客户类型多选
    let selectedArr = this.getSelectedTermsIds(group.id);
    if (group.id === (serchTerms[0] || {}).id) { // 产品状态 -----------------------------
      if (selectedArr.includes(data.optId)) {
        // 必选的话，至少选中一个
        if (group.isEsnlChc === '1' && selectedArr.length === 1) {
          message.warning(`【${group.clNm}】必须选中！`);
          return;
        }
      }
      selectedArr = [data.optId];
      let otherState = {};
      // 产品状态为“我的”
      if (data.optId === '6') {
        otherState = selectAllCusType();
      }
      if (handleFormChange) {
        handleFormChange({ productState: selectedArr.join(','), pagerModel: newPager, ...otherState, sort: [], attrConditionModels: [] });
      }
    } else if (group.id === (serchTerms[1] || {}).id) { // 客户类型 -----------------------------
      if (selectedArr.includes(data.optId)) {
        // 必选的话，至少选中一个；产品状态为“我的”也必选
        if ((productState === '6' || group.isEsnlChc === '1') && selectedArr.length === 1) {
          message.warning(`【${group.clNm}】必须选中！`);
          return;
        }
        selectedArr = selectedArr.filter(m => m !== data.optId);
      } else {
        selectedArr.push(data.optId);
      }
      // ----------------------------------------------
      // 销售关系（12）和其他条件互斥
      if (data.optId === '0') { // 如果是全部客户,则和其他所有关系互斥
        if (!customerType.split(',').includes('0')) {
          selectedArr = ['0'];
        }
      } else {
        if (data.optId === '12') { // 点选的是销售关系
          if (!customerType.split(',').includes('12')) { // 没有
            selectedArr = ['12'];
          }
        } else { // 点选的不是销售关系
          if (customerType.split(',').includes('12') || customerType.split(',').includes('0')) { // 已有
            selectedArr = selectedArr.filter(m => m !== '12' && m !== '0');
          }
        }
      }

      // ----------------------------------------------
      if (handleFormChange) {
        handleFormChange({ customerType: selectedArr.join(','), pagerModel: newPager, sort: [], attrConditionModels: [] });
      }
    }
  }

  getTabDic = () => {
    const { teamPmsn = '0', authorities = {} } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    let tabDic = [
      { key: '1', title: '个人' },
    ];
    if (teamPmsn === '1') {
      tabDic.push({ key: '2', title: '团队' });
    }
    if (productPanoramaAuth.includes('yyb')) {
      tabDic.push({ key: '3', title: '营业部' });
    }

    return tabDic;
  }

  render() {
    const { serchTerms = [] } = this.state;
    const { payload = {}, excludeFunds, handleExcludeFundsChange } = this.props;
    const { queryType = '' } = payload;
    const tabDic = this.getTabDic();
    return (
      <div>
        <div className={styles.mTypeTab}>
          {
            tabDic.length !== 1 &&
              tabDic.map(m => <div key={m.key} className={m.key === queryType && 'active'} onClick={() => { this.handleTypeChange(m.key); }}>{m.title}</div>)
          }
          <div style={{ cssFloat: tabDic.length !== 1 ? 'right' : 'none', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ padding: 0 }}>
              <Checkbox className='m-select-checkbox m-circle-checkb' checked={excludeFunds} onChange={handleExcludeFundsChange}>剔除货基/天利宝/证金宝/新户理财</Checkbox>
            </div>
          </div>
        </div>
        <Divider style={{ margin: '0 0 20px 0', background: '#eaeef2' }} />
        {
          serchTerms.map((m, i) => (
            <Row key={m.id} style={{ marginTop: i !== 0 && '12px' }}>
              <span style={{ width: '1rem', display: 'inline-block', textAlign: 'center' }}>
                {<span className={styles.requiredIcon}>*</span>}
              </span>
              <span className="ax-label-name">{m.clNm || '--'}</span>
              {
                (m.clOpts || []).sort((x, y) => x.dispOrd - y.dispOrd).map((n, j) => (
                  <React.Fragment>
                    <span
                      className={this.getSelectedTermsIds(m.id).includes(n.optId) ? `${styles.productActive}` : styles.productItem}
                      onClick={() => this.handleTermChange(m, n)}
                    >
                      {n.optNm || '--'}
                    </span>
                    {
                      i === 1 && j === 0 && (
                        <span style={{ borderRight: '1px solid #d5d5d5', marginLeft: '0.866rem' }} />
                      )
                    }
                  </React.Fragment>
                ))
              }
            </Row>
          ))
        }
      </div>
    );
  }
}

export default SearchForm;
