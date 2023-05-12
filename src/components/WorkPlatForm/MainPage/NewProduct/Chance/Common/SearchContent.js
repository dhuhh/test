import React, { Component } from 'react';
import styles from '../index.less';
import { Button,Divider,DatePicker,Input,InputNumber ,message ,TreeSelect , Tooltip , Icon,Popover } from 'antd';
import moment from 'moment';
import { QueryChannelAuthorityDepartment,QueryTag } from '$services/newProduct';
import TreeUtils from '$utils/treeUtils';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import MultipleSearchInput from './MultipleSearchInput';

export default class SearchContent extends Component {
  state ={
    allYyb: [],
    departments: [],
    // visible1:false,
    // visible2:false,
    clickType: 0,
  }
  componentDidMount(){
    this.getDepartments();
  }
  componentDidUpdate(){
    let that = this;
    document.onclick = function (param) {
      if (!param.target) {
        return;
      }
      const { setStateChange } = that.props;
      if (param.target.id !== 'custRank') {
        setStateChange({ rankVisible: false });
      }
      if (param.target.id !== 'scene') {
        setStateChange({ sceneVisible: false });
      }
      if (param.target.id !== 'riskValue') {
        setStateChange({ riskVisible: false });
      }
      if (param.target.id !== 'historyProd') {
        setStateChange({ prodVisible: false });
      }
      if (param.target.id !== 'bussiOpen') {
        setStateChange({ openVisible: false });
      }
      if (param.target.id !== 'tag') {
        setStateChange({ tagsVisible: false });
      }
      if (param.target.id !== 'custGrup') {
        setStateChange({ custVisible: false });
      }
      if (param.target.id !== 'qkImportance') {
        setStateChange({ qkVisible: false });
      }
      if (param.target.id !== 'bussGkbin') {
        setStateChange({ bussGkVisible: false });
      }
      if (param.target.id !== "newIsTrade") {
        setStateChange({ newIsTradeVisible: false });
      }
    };
  }

  // 获取管辖营业部的数据
  getDepartments = () => {
    fetchUserAuthorityDepartment().then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      this.setState({ departments, allYyb: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }
  // 格式化treeSelectValue
  formatValue = (dept) => {
    const { allYyb = [] } = this.state;
    return dept.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val)?.yybmc }));
  }

  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYyb = [] } = this.state;
    const util = (fid, title) => {
      if (fid === '0') return false;
      for (let item of allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
  }
  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let { dept } = this.props;
    if (value.length) {
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (dept.indexOf(item) === -1) dept.push(item);
        });
      } else {
        array.forEach(item => {
          if (dept.indexOf(item) > -1) dept.splice(dept.indexOf(item), 1);
        });
      }
    } else {
      dept = [];
    }
    this.props.setStateChange({ deptSearch: this.props.deptSearch, dept });
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
  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.props.setStateChange({
      deptSearch: value,
    });
  }
  qkShowTooltip = () =>{
    return (
      <div>
        <div>1.判断逻辑：“强烈”、“较高”、“一般”三个推荐程度由“潜力模型”打分对应，未纳入评分范围内的已开通未交易客户显示为“较低”，已交易展示推荐程度为空，刚开通未交易未更新展示“暂无”</div>
        <div>2.更新频率：每周日更新一次</div>
        <div>3.潜力模型原理：“潜力模型”针对港股通已开通未交易客户，利用交易、持仓、资产、App浏览等数据因子，利用机器学习模型评估激活客户交易港股通可能性。强烈推荐的客户指模型得分高且仅1个月有App港股通浏览行为，是强烈建议服务的客群，转化率高。</div>

      </div>
    );
  }

  gkShowTooltip = () =>{
    return (
      <div>
        <div>得分客户范围: 港股通首次交易日期为当年,且港股通交易量达到1万元。</div>
        <div>具体分值:</div>
        <div>①个人: 港股通开通日期为当年之前(1分)  港股通开通日期为当年(2分)</div>
        <div>②机构: 港股通开通日期为当年之前(2分)  港股通开通日期为当年(4分)</div>
      </div>
    );
  }

  render() {
    const { departments } = this.state;
    const {
      //选项参数
      custRange,
      custRank,rankVisible,
      ktDate,
      scene,sceneVisible,
      activedDate,
      rjDate,rjDateKey,
      activePotential,
      netAssetMin,netAssetMax,
      financialAssetMin,financialAssetMax,
      fundMin,fundMax,
      outAssetMin,outAssetMax,
      signDate,
      isTrade,
      newIsTrade,
      gudongka,
      firstDate,
      isSatisfy,
      tenAssetMin,tenAssetMax,
      twentyAssetMin,twentyAssetMax,
      dept,deptSearch,handleYybSearch,handleYybChange,
      custKind,
      bailValue,
      khDate,khDateKey,
      tradeExpDate,tradeExpDateKey,
      riskValue,riskVisible,
      assetsPeak,
      turnoverValue,//成交量
      tradingValue,//累计交易量
      qkImportance,qkVisible,
      bussGkbin,bussGkVisible,
      gkRankTop,
      ggtTradingMin,
      ggtTradingMax,
      ggtNetCommissionMin,
      ggtNetCommissionMax,
      commission,
      loginDate,
      historyProd,prodVisible,
      bussiOpen,openVisible,
      tags,tagsVisible,
      custGrup,custVisible,
      //其他参数
      setStateChange,
      setImpoChange,
      handleClick,
      reset,
      queryData,
      qkShowTooltip,
      gkShowTooltip,
      IconSure,
      visible1,
      visible2,
      newIsTradeVisible,
    } = this.props;

    return (
      <div>
        <div className={styles.searchBox}>
          <div className={styles.searchItem}>
            <span className={styles.label}>客户范围</span>
            <div className={custRange === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ custRange: 0 });}}>直属</div>
            <div className={custRange === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ custRange: 1 });}}>所辖</div>
            <div className={custRange === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ custRange: 2 });}}>所有</div>
          </div>
          <div className={styles.searchItem}>
            <span className={styles.label}>客户级别</span>
            <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: true,sceneVisible: false,riskVisible: false,prodVisible: false,openVisible: false,tagsVisible: false,custVisible: false ,qkVisible: false , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 }} id='custRank'>
              <MultipleSearchInput value={custRank} onChange={(custRank)=>{setStateChange({ custRank });}} source='query' visible={rankVisible} api='custRank'/>
            </div>
          </div>
          {
            ktDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >开通时间</span>
                <DatePicker.RangePicker
                  allowClear={true}
                  value={ktDate}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  style={{ width: '264px' }}
                  placeholder={['请选择', '请选择']}
                  format="YYYY-MM-DD"
                  separator='至'
                  disabledDate={(current) => current && current > moment().endOf('day')}
                  onChange={ktDate => setStateChange({ ktDate })}
                />
              </div>
            )
          }
          {
            this.props.hasOwnProperty('scene') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>场景</span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: true,riskVisible: false,prodVisible: false,openVisible: false,tagsVisible: false,custVisible: false , qkVisible: false , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 }} id='scene'>
                  <MultipleSearchInput value={scene} onChange={(scene)=>{setStateChange({ scene });}} source='query' visible={sceneVisible} api='scene'/>
                </div>
              </div>
            )
          }
          {
            activedDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >激活时间</span>
                <DatePicker.RangePicker
                  allowClear={true}
                  value={activedDate}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  style={{ width: '264px' }}
                  placeholder={['请选择', '请选择']}
                  format="YYYY-MM-DD"
                  separator='至'
                  disabledDate={(current) => current && current > moment().endOf('day')}
                  onChange={activedDate => setStateChange({ activedDate })}
                />
              </div>
            )
          }
          {
            rjDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >最近入金时间</span>
                <div className={rjDateKey === 0 ? styles.activeButton : ''} onClick={()=>handleClick(0,'rjDateKey')}>全部</div>
                <div className={rjDateKey === 1 ? styles.activeButton : ''} onClick={()=>handleClick(1,'rjDateKey')}>近一个月</div>
                <div className={rjDateKey === 2 ? styles.activeButton : ''} onClick={()=>handleClick(2,'rjDateKey')}>今年</div>
                <div className={rjDateKey === 999 ? styles.activeButton : ''} onClick={()=>handleClick(999,'rjDateKey')}>自定义</div>
                {rjDateKey === 999 && (
                  <DatePicker.RangePicker
                    allowClear={true}
                    value={rjDate}
                    className={styles.rangePicker}
                    dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                    style={{ width: '264px' }}
                    placeholder={['请选择', '请选择']}
                    format="YYYY-MM-DD"
                    separator='至'
                    disabledDate={(current) => current && current > moment().endOf('day')}
                    onChange={(rjDate)=>{setStateChange({ rjDate });}}
                  />
                )}
              </div>
            )
          }
          {
            this.props.hasOwnProperty('activePotential') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>激活潜力{IconSure ? (
                  <Popover placement="bottomLeft" overlayClassName={styles.isShowPover} content={<span style={{ whiteSpace: 'pre-wrap' }}>
                  无效户激活潜力筛选：通过结合高价值潜客预测模型和种子人群放大模型，对全量无效户进行评分，筛选出与已激活无效户具有相似特征的高潜力客户或周内新增无效户并识别客户潜力资产。<br/>更新频率：每周日更新一次。</span>} trigger="click">
                    <span id='isWant' style={{ position: 'relative', display: 'inline-block', width: '16px', left: '-10px',top: '0px', margin: '0 4px' }}><img src={IconSure} alt='' style={{ cursor: 'pointer',position: 'absolute',top: '-13px',left: '11px' }} onClick={()=>{this.props.changeClick(1);}}/></span>
                  </Popover>
                )
                  : ''}</span>
                <div className={activePotential === 3 ? styles.activeButton : ''} onClick={()=>{setStateChange({ activePotential: 3 });}}>全部</div>
                <div className={activePotential === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ activePotential: 0 });}}>高潜力</div>
                <div className={activePotential === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ activePotential: 1 });}}>中潜力</div>
                <div className={activePotential === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ activePotential: 2 });}}>低潜力</div>
                <div className={activePotential === 4 ? styles.activeButton : ''} onClick={()=>{setStateChange({ activePotential: 4 });}}>暂无</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('netAssetMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>当前净资产(万元)</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={netAssetMin} onChange={(value)=>{setStateChange({ netAssetMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={netAssetMax} onChange={(value)=>{setStateChange({ netAssetMax: value });}} min={netAssetMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('financialAssetMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>当前理财资产(万元)</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={financialAssetMin} onChange={(value)=>{setStateChange({ financialAssetMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={financialAssetMax} onChange={(value)=>{setStateChange({ financialAssetMax: value });}} min={financialAssetMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('fundMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>基金投顾市值</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={fundMin} onChange={(value)=>{setStateChange({ fundMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={fundMax} onChange={(value)=>{setStateChange({ fundMax: value });}} min={fundMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('outAssetMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>外部市值(万元)</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={outAssetMin} onChange={(value)=>{setStateChange({ outAssetMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={outAssetMax} onChange={(value)=>{setStateChange({ outAssetMax: value });}} min={outAssetMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            signDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >签约时间</span>
                <DatePicker.RangePicker
                  allowClear={true}
                  value={signDate}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  style={{ width: '264px' }}
                  placeholder={['请选择', '请选择']}
                  format="YYYY-MM-DD"
                  separator='至'
                  disabledDate={(current) => current && current > moment().endOf('day')}
                  onChange={signDate => setStateChange({ signDate })}
                />
              </div>
            )
          }
          {
            this.props.hasOwnProperty('isTrade') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>是否交易</span>
                <div className={isTrade === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ isTrade: 0 });}}>全部</div>
                <div className={isTrade === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ isTrade: 1 });}}>已交易</div>
                <div className={isTrade === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ isTrade: 2 });}}>未交易</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('newIsTrade') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>是否交易</span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: false,prodVisible: false,openVisible: false,tagsVisible: false,custVisible: false , qkVisible: false , bussGkVisible: false ,newIsTradeVisible: true }); }} style={{ padding: 0 ,border: 0 }} id='newIsTrade'>
                  <MultipleSearchInput value={newIsTrade} onChange={(newIsTrade)=>{setStateChange({ newIsTrade });}} source='query' visible={newIsTradeVisible} api='newIsTrade' />
                </div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('gudongka') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>是否有股东卡</span>
                <div className={gudongka === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ gudongka: 0 });}}>全部</div>
                <div className={gudongka === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ gudongka: 1 });}} style={{ padding: '0 11px' }}>是</div>
                <div className={gudongka === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ gudongka: 2 });}} style={{ padding: '0 11px' }}>否</div>
              </div>
            )
          }
          {
            firstDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >首次交易时间</span>
                <DatePicker.RangePicker
                  allowClear={true}
                  value={firstDate}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  style={{ width: '264px' }}
                  placeholder={['请选择', '请选择']}
                  format="YYYY-MM-DD"
                  separator='至'
                  disabledDate={(current) => current && current > moment().endOf('day')}
                  onChange={firstDate => setStateChange({ firstDate })}
                />
              </div>
            )
          }
          {
            this.props.hasOwnProperty('qkImportance') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>未交易潜客推荐程度
                  <Tooltip title={qkShowTooltip} overlayStyle={{ minWidth: '400px' }}>
                    <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
                  </Tooltip>
                </span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: false,prodVisible: false,openVisible: false,tagsVisible: false,custVisible: false , qkVisible: true , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 }} id='qkImportance'>
                  <MultipleSearchInput value={qkImportance} onChange={(qkImportance)=>{setStateChange({ qkImportance });}} source='query' visible={qkVisible} api='qkImportance'/>
                </div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('isSatisfy') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>满足开通条件</span>
                <div className={isSatisfy === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ isSatisfy: 1 });}} style={{ padding: '5px 11px' }}>是</div>
                <div className={isSatisfy === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ isSatisfy: 0 });}} style={{ padding: '5px 11px' }}>否</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('tenAssetMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>10日日均资产(万元)</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={tenAssetMin} onChange={(value)=>{setStateChange({ tenAssetMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={tenAssetMax} onChange={(value)=>{setStateChange({ tenAssetMax: value });}} min={tenAssetMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('twentyAssetMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>20日日均资产(万元)</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={twentyAssetMin} onChange={(value)=>{setStateChange({ twentyAssetMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={twentyAssetMax} onChange={(value)=>{setStateChange({ twentyAssetMax: value });}} min={twentyAssetMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            dept && (
              <div className={styles.searchItem}>
                <span className={styles.label}>开户营业部</span>
                <TreeSelect
                  showSearch
                  className={styles.treeSelect}
                  value={this.formatValue(dept)}
                  treeData={departments}
                  // dropdownMatchSelectWidth={false}
                  dropdownClassName='m-bss-treeSelect'
                  style={{ marginLeft: 8 }}
                  dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                  filterTreeNode={this.filterTreeNode}
                  placeholder="营业部"
                  allowClear
                  multiple
                  searchValue={deptSearch}
                  // autoClearSearchValue={false}
                  treeDefaultExpandAll
                  maxTagCount={3}
                  maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                  maxTagTextLength={5}
                  treeCheckable={true}
                  onChange={this.handleYybChange}
                  onSearch={this.handleYybSearch}
                  treeCheckStrictly={true}
                  // showCheckedStrategy={TreeSelect.SHOW_ALL}
                />
              </div>
            )
          }
          {
            this.props.hasOwnProperty('custKind') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>客户类型</span>
                <div className={custKind === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ custKind: 0 });}}>全部</div>
                <div className={custKind === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ custKind: 1 });}}>个人</div>
                <div className={custKind === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ custKind: 2 });}}>机构</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('gkRankTop') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>当年月日均港股通市值峰值</span>
                <div className={gkRankTop === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ gkRankTop: 0 });}}>全部</div>
                <div className={gkRankTop === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ gkRankTop: 1 });}}>1万以下</div>
                <div className={gkRankTop === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ gkRankTop: 2 });}}>1万(含)以上</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('bailValue') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>保证金余额</span>
                <div className={bailValue === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ bailValue: 0 });}}>全部</div>
                <div className={bailValue === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ bailValue: 1 });}}>1万以下</div>
                <div className={bailValue === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ bailValue: 2 });}}>1-10万</div>
                <div className={bailValue === 3 ? styles.activeButton : ''} onClick={()=>{setStateChange({ bailValue: 3 });}}>10-50万</div>
                <div className={bailValue === 4 ? styles.activeButton : ''} onClick={()=>{setStateChange({ bailValue: 4 });}}>50万以上</div>
              </div>
            )
          }
          {
            khDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >开户时间</span>
                <div className={`${styles.button} ${khDateKey === 0 ? styles.activeButton : ''}`} onClick={()=>handleClick(0,'khDateKey')}>全部</div>
                <div className={`${styles.button} ${khDateKey === 1 ? styles.activeButton : ''}`} onClick={()=>handleClick(1,'khDateKey')}>六个月以上</div>
                <div className={`${styles.button} ${khDateKey === 2 ? styles.activeButton : ''}`} onClick={()=>handleClick(2,'khDateKey')}>两年以上</div>
                <div className={`${styles.button} ${khDateKey === 999 ? styles.activeButton : ''}`} onClick={()=>handleClick(999,'khDateKey')}>自定义</div>
                {khDateKey === 999 && (
                  <DatePicker.RangePicker
                    allowClear={true}
                    value={khDate}
                    className={styles.rangePicker}
                    dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                    style={{ width: '264px' }}
                    placeholder={['请选择', '请选择']}
                    format="YYYY-MM-DD"
                    separator='至'
                    disabledDate={(current) => current && current > moment().endOf('day')}
                    onChange={(khDate)=>setStateChange({ khDate })}
                  />
                )}
              </div>
            )
          }
          {
            tradeExpDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >交易经验</span>
                <div className={`${styles.button} ${tradeExpDateKey === 0 ? styles.activeButton : ''}`} onClick={()=>handleClick(0,'tradeExpDateKey')}>全部</div>
                <div className={`${styles.button} ${tradeExpDateKey === 1 ? styles.activeButton : ''}`} onClick={()=>handleClick(1,'tradeExpDateKey')}>六个月以上</div>
                <div className={`${styles.button} ${tradeExpDateKey === 2 ? styles.activeButton : ''}`} onClick={()=>handleClick(2,'tradeExpDateKey')}>两年以上</div>
                <div className={`${styles.button} ${tradeExpDateKey === 999 ? styles.activeButton : ''}`} onClick={()=>handleClick(999,'tradeExpDateKey')}>自定义</div>
                {tradeExpDateKey === 999 && (
                  <DatePicker.RangePicker
                    allowClear={true}
                    value={tradeExpDate}
                    className={styles.rangePicker}
                    dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                    style={{ width: '264px' }}
                    placeholder={['请选择', '请选择']}
                    format="YYYY-MM-DD"
                    separator='至'
                    disabledDate={(current) => current && current > moment().endOf('day')}
                    onChange={(tradeExpDate)=>setStateChange({ tradeExpDate })}
                  />
                )}
              </div>
            )
          }
          {
            this.props.hasOwnProperty('riskValue') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>风险测评</span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: true,prodVisible: false,openVisible: false,tagsVisible: false,custVisible: false , qkVisible: false , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 ,prodVisible: false,openVisible: false }} id='riskValue'>
                  <MultipleSearchInput value={riskValue} onChange={(riskValue)=>{setStateChange({ riskValue });}} source='query' visible={riskVisible} api='riskValue'/>
                </div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('assetsPeak') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>资产峰值(近一年)</span>
                <div className={assetsPeak === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ assetsPeak: 0 });}}>全部</div>
                <div className={assetsPeak === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ assetsPeak: 1 });}}>10万以下</div>
                <div className={assetsPeak === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ assetsPeak: 2 });}}>10-50万</div>
                <div className={assetsPeak === 3 ? styles.activeButton : ''} onClick={()=>{setStateChange({ assetsPeak: 3 });}}>50-100万</div>
                <div className={assetsPeak === 4 ? styles.activeButton : ''} onClick={()=>{setStateChange({ assetsPeak: 4 });}}>100万以上</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('turnoverValue') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>成交量(近一年)</span>
                <div className={turnoverValue === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ turnoverValue: 0 });}}>全部</div>
                <div className={turnoverValue === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ turnoverValue: 1 });}}>10万以下</div>
                <div className={turnoverValue === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ turnoverValue: 2 });}}>10-50万</div>
                <div className={turnoverValue === 3 ? styles.activeButton : ''} onClick={()=>{setStateChange({ turnoverValue: 3 });}}>50-100万</div>
                <div className={turnoverValue === 4 ? styles.activeButton : ''} onClick={()=>{setStateChange({ turnoverValue: 4 });}}>100万以上</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('tradingValue') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>累计交易量</span>
                <div className={tradingValue === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ tradingValue: 0 });}}>全部</div>
                <div className={tradingValue === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ tradingValue: 1 });}}>1万以下</div>
                <div className={tradingValue === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ tradingValue: 2 });}}>1-10万</div>
                <div className={tradingValue === 3 ? styles.activeButton : ''} onClick={()=>{setStateChange({ tradingValue: 3 });}}>10-50万</div>
                <div className={tradingValue === 4 ? styles.activeButton : ''} onClick={()=>{setStateChange({ tradingValue: 4 });}}>50万以上</div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('ggtTradingMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>本年度港股通成交金额</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={ggtTradingMin} onChange={(value)=>{setStateChange({ ggtTradingMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={ggtTradingMax} onChange={(value)=>{setStateChange({ ggtTradingMax: value });}} min={ggtTradingMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('ggtTradingMin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>本年度港股通净佣金</span>
                <InputNumber placeholder='最低' className={styles.rangeInput} value={ggtNetCommissionMin} onChange={(value)=>{setStateChange({ ggtNetCommissionMin: value });}} min={0} precision={2}/>
                <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
                <InputNumber placeholder='最高' className={styles.rangeInput} value={ggtNetCommissionMax} onChange={(value)=>{setStateChange({ ggtNetCommissionMax: value });}} min={ggtNetCommissionMin} precision={2}/>
                <span style={{ color: '#959CBA',marginLeft: 8 }}>(万元)</span>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('commission') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>累计佣金</span>
                <div className={commission === 0 ? styles.activeButton : ''} onClick={()=>{setStateChange({ commission: 0 });}}>全部</div>
                <div className={commission === 1 ? styles.activeButton : ''} onClick={()=>{setStateChange({ commission: 1 });}}>1万以下</div>
                <div className={commission === 2 ? styles.activeButton : ''} onClick={()=>{setStateChange({ commission: 2 });}}>1-10万</div>
                <div className={commission === 3 ? styles.activeButton : ''} onClick={()=>{setStateChange({ commission: 3 });}}>10-50万</div>
                <div className={commission === 4 ? styles.activeButton : ''} onClick={()=>{setStateChange({ commission: 4 });}}>50万以上</div>
              </div>
            )
          }
          {
            loginDate && (
              <div className={styles.searchItem}>
                <span className={styles.label} >手机证券最近登录时间</span>
                <DatePicker.RangePicker
                  allowClear={true}
                  value={loginDate}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  style={{ width: '264px' }}
                  placeholder={['请选择', '请选择']}
                  format="YYYY-MM-DD"
                  separator='至'
                  disabledDate={(current) => current && current > moment().endOf('day')}
                  onChange={loginDate => setStateChange({ loginDate })}
                />
              </div>
            )
          }
          {
            this.props.hasOwnProperty('historyProd') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>历史签约产品</span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: false,prodVisible: true,openVisible: false,tagsVisible: false,custVisible: false , qkVisible: false , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 }} id='historyProd'>
                  <MultipleSearchInput value={historyProd} onChange={(historyProd)=>{setStateChange({ historyProd });}} source='query' visible={prodVisible} api='historyProd'/>
                </div>
              </div>
            )
          }
          {
            this.props.hasOwnProperty('bussiOpen') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>业务开通{IconSure ? (
                  <Popover placement="bottomLeft" overlayClassName={styles.isShowPover} content={<span style={{ whiteSpace: 'pre-wrap' }}>
                  选项之间的关系为或</span>} trigger="click">
                    <span style={{ position: 'relative', display: 'inline-block', width: '16px', left: '-10px',top: '0px', margin: '0 4px' }}><img src={IconSure} alt='' onClick={()=>{this.props.changeClick(2);}} style={{ cursor: 'pointer',position: 'absolute',left: '11px',top: '-13px' }}/></span>
                  </Popover>
                )
                  : ''}</span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: false,prodVisible: false,openVisible: true,tagsVisible: false,custVisible: false , qkVisible: false , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 }} id='bussiOpen'>
                  <MultipleSearchInput value={bussiOpen} onChange={(bussiOpen)=>{setStateChange({ bussiOpen });}} source='query' visible={openVisible} api='bussiOpen'/>
                </div>
              </div>
            )
          }
          {
            tags && (
              <div className={styles.searchItem}>
                <span className={styles.label}>标签</span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: false,prodVisible: false,openVisible: false,tagsVisible: true,custVisible: false , qkVisible: false , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 }} id='tag'>
                  <MultipleSearchInput value={tags} onChange={(tags)=>{setStateChange({ tags });}} source='query' visible={tagsVisible} api='tag'/>
                </div>
              </div>
            )
          }
          {
            custGrup && (
              <div className={styles.searchItem}>
                <span className={styles.label}>客户群</span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: false,prodVisible: false,openVisible: false,tagsVisible: false,custVisible: true , qkVisible: false , bussGkVisible: false ,newIsTradeVisible: false }); }} style={{ padding: 0 ,border: 0 }} id='custGrup'>
                  <MultipleSearchInput value={custGrup} onChange={(custGrup)=>{setStateChange({ custGrup });}} source='query' visible={custVisible} api='custGrup' maxTagTextLength={6}/>
                </div>
              </div>
            )
          }
          {/* {
            this.props.hasOwnProperty('bussGkbin') && (
              <div className={styles.searchItem}>
                <span className={styles.label}>业务渗透-港股通积分
                  <Tooltip title={gkShowTooltip} overlayStyle={{ minWidth: '460px' }}>
                    <Icon style={{ marginLeft: 5, color: 'rgb(178 181 191)' }} type="question-circle" />
                  </Tooltip>
                </span>
                <div onClick={e => { e.stopPropagation(); setStateChange({ rankVisible: false,sceneVisible: false,riskVisible: false,prodVisible: false,openVisible: false,tagsVisible: false,custVisible: false , qkVisible: false , bussGkVisible: true }); }} style={{ padding: 0 ,border: 0 }} id='bussGkbin'>
                  <MultipleSearchInput value={bussGkbin} onChange={(bussGkbin)=>{setImpoChange({ bussGkbin },'bussGkbin');}} source='query' visible={bussGkVisible} api='bussGkbin'/>
                </div>
              </div>
            )
          } */}


          <div style={{ margin: '0px 36px 16px 10px', display: 'flex', alignItems: 'center' }}>
            <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginRight: 16 ,borderRadius: 2 }} className='m-btn-radius ax-btn-small' type="button" onClick={reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius: 2,boxShadow: 'none' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={queryData}>查询</Button>
          </div>
        </div>
      </div>
    );
  }
}
