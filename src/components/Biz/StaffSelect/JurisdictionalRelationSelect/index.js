import React from 'react';
import classnames from 'classnames';
import { Row, Col, TreeSelect, Select, message } from 'antd';
import TreeUtils from '../../../../utils/treeUtils';
import { fetchUserAuthorityDepartment } from '../../../../services/commonbase/userAuthorityDepartment';
import { getStaffDepartmentList, getStaffTeamList } from '../../../../services/staffrelationship/common';

// 管辖关系下拉级联组件
class JurisdictionalRelationSelect extends React.Component {
  state = {
    gxyyb: {
      isloading: true,
      dataLoaded: false,
      searchValue: '',
      datas: [],
      selected: this.props.value && this.props.value.gxyyb ? this.props.value.gxyyb : [],
    },
    gxbm: {
      isloading: true,
      dataLoaded: false,
      searchValue: '',
      datas: [],
      selected: this.props.value && this.props.value.gxbm ? this.props.value.gxbm : [],
    },
    gxtd: {
      isloading: true,
      dataLoaded: false,
      searchValue: '',
      datas: [],
      selected: this.props.value && this.props.value.gxtd ? this.props.value.gxtd : [],
    },
    // gxry: {
    //   searchValue: '',
    //   datas: [],
    //   selected: [],
    // },
  }
  componentDidMount() {
    const {
      gxyyb = { show: true },
      gxbm = { show: true },
      gxtd = { show: true },
    } = this.props;
    const {
      gxyyb: gxyybInstate = {},
      gxbm: gxbmInstate = {},
      gxtd: gxtdInstate = {},
    } = this.state;
    this.fetchDatas({
      showGxyyb: gxyyb.show,
      showGxbm: gxbm.show,
      showGxtd: gxtd.show,
      gxyyb: gxyybInstate,
      gxbm: gxbmInstate,
      gxtd: gxtdInstate,
    });
  }
  componentWillReceiveProps(nextProps) {
    const { gxyyb, gxbm, gxtd } = this.state;
    const {
      gxyyb: gxyybNext = { show: true },
      gxbm: gxbmNext = { show: true },
      gxtd: gxtdNext = { show: true },
      value: nextValue = {},
    } = nextProps;
    const { gxyyb: gxyybSelected = [], gxbm: gxbmSelected = [], gxtd: gxtdSelected = [] } = nextValue;
    gxyyb.selected = gxyybSelected;
    gxbm.selected = gxbmSelected;
    gxtd.selected = gxtdSelected;
    this.fetchDatas({
      showGxyyb: gxyybNext.show,
      showGxbm: gxbmNext.show,
      showGxtd: gxtdNext.show,
      gxyyb,
      gxbm,
      gxtd,
    });
  }
  // 判断要获取哪些的数据
  fetchDatas = ({ showGxyyb = true, showGxbm = true, showGxtd = true, gxyyb = this.state.gxyyb, gxbm = this.state.gxbm, gxtd = this.state.gxtd }) => {
    const { dataLoaded: gxyybDataLoaded = false, isLoading: gxyybIsloading = true } = gxyyb;
    this.setState({ gxyyb });
    if (showGxyyb && !gxyybDataLoaded && gxyybIsloading) {
      const gxyybCurent = {
        ...gxyyb,
        isLoading: false,
      };
      this.setState({ gxyyb: gxyybCurent });
      this.fetchGxyybList(gxyybCurent);
    }
    this.setState({ gxbm });
    const { dataLoaded: gxbmDataLoaded = false, isLoading: gxbmIsloading = true } = gxbm;
    if (showGxbm && !gxbmDataLoaded && gxbmIsloading) {
      const gxbmCurent = {
        ...gxbm,
        isLoading: false,
      };
      this.setState({ gxbm: gxbmCurent });
      this.fetchGxbmList(gxbmCurent);
    }
    this.setState({ gxtd });
    const { dataLoaded: gxtdDataLoaded = false, isLoading: gxtdIsloading = true } = gxtd;
    if (showGxtd && !gxtdDataLoaded && gxtdIsloading) {
      const gxtdCurent = {
        ...gxtd,
        isLoading: false,
      };
      this.setState({ gxtd: gxtdCurent });
      this.fetchGxtdList(gxtdCurent);
    }
  }
  // 获取管辖营业部的数据
  fetchGxyybList = (gxyyb = this.state.gxyyb) => {
    const gxyybCurrent = gxyyb;
    fetchUserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.setState({ gxyyb: gxyybCurrent });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 获取管辖部门的数据
  fetchGxbmList = (gxbm = this.state.gxbm) => {
    const gxbmCurent = gxbm;
    getStaffDepartmentList({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '', yybid: '', ryid: '' }).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        gxbmCurent.datas.push(...records);
        gxbmCurent.dataLoaded = true;
        this.setState({ gxbm: gxbmCurent });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  fetchGxtdList = (gxtd = this.state.gxtd) => {
    const gxtdCurrent = gxtd;
    getStaffTeamList({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '', yybid: '', bmid: '', ryid: '' }).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        gxtdCurrent.datas.push(...records);
        gxtdCurrent.dataLoaded = true;
        this.setState({ gxtd: gxtdCurrent });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleGxyybChange = (value) => {
    const { gxyyb, gxbm, gxtd } = this.state;
    // 保存之前选择的部门信息
    const { selected: OldGxyybSelected = [] } = gxyyb;
    gxyyb.selected = value;
    // 判断两次的值是否有变化,如果 有变化,那么就需要清空团队的选择项
    if (OldGxyybSelected.length !== gxyyb.selected.length) {
      gxbm.selected = [];
      gxtd.selected = [];
    }
    this.setState({ gxyyb, gxbm, gxtd });
    this.triggerChange({
      gxyyb: gxyyb.selected,
      gxbm: gxbm.selected,
      gxtd: gxtd.selected,
    });
  }
  handleGxbmChange = (value) => {
    const { gxyyb, gxbm, gxtd } = this.state;
    const {
      gxbm: gxbmInprops = {},
      // gxry: gxryInprops = {},
    } = this.props;
    // 保存之前选择的部门信息
    const { selected: OldGxbmSelected = [] } = gxbm;
    // 判断是多选还是单选,并设置选中的key
    const { mode = 'multiple' } = gxbmInprops;
    if (mode === '-') {
      if (value === undefined) {
        gxbm.selected = [];
      } else {
        gxbm.selected = [];
        gxbm.selected.push(value);
      }
    } else if (mode === 'multiple') {
      gxbm.selected = value;
    }
    // 判断两次的值是否有变化,如果 有变化,那么就需要清空团队的选择项
    if (OldGxbmSelected.length !== gxbm.selected.length) {
      gxtd.selected = [];
    }
    this.setState({ gxbm, gxtd });
    this.triggerChange({
      gxyyb: gxyyb.selected,
      gxbm: gxbm.selected,
      gxtd: gxtd.selected,
    });
  }
  handleGxtdChange = (value) => {
    const { gxyyb, gxbm, gxtd } = this.state;
    const {
      gxyyb: gxyybInprops = {},
      // gxry: gxryInprops = {},
    } = this.props;
    // 判断是多选还是单选
    const { mode = 'multiple' } = gxyybInprops;
    if (mode === '-') {
      if (value === undefined) {
        gxtd.selected = [];
      } else {
        gxtd.selected = [];
        gxtd.selected.push(value);
      }
    } else {
      gxtd.selected = value;
    }
    this.setState({ gxtd });
    this.triggerChange({
      gxyyb: gxyyb.selected,
      gxbm: gxbm.selected,
      gxtd: gxtd.selected,
    });
  }
  triggerChange = (value = {}) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...value });
    }
  }
  render() {
    const { gxyyb: gxyybInstate, gxbm: gxbmInstate, gxtd: gxtdInstate } = this.state;
    const {
      className,
      gxyyb: gxyybInprops = {},
      gxbm: gxbmInprops = {},
      gxtd: gxtdInprops = {},
      // gxry: gxryInprops = {},
    } = this.props;
    // 管辖营业部
    const { selected: gxyybSelected } = gxyybInstate;
    const gxyyb = {
      show: true,
      ...gxyybInprops,
      ...gxyybInstate,
    };
    // 管辖部门
    const { gxbmSearchValue = '', datas: gxbmDatas = [] } = gxbmInstate;
    const gxbm = {
      show: true,
      ...gxbmInprops,
      ...gxbmInstate,
      datas: gxyybSelected.length === 0 && gxbmSearchValue === '' ? gxbmDatas : gxbmDatas.filter((item) => {
        const { yyb, bmmc } = item;
        // 当有选择关系营业部的时候,要根据已选的营业部筛选出该营业部下面的部门
        if (gxyybSelected.length === 0) {
          return false;
        } else if (gxbmSearchValue === '') {
          return gxyybSelected.includes(yyb);
        }
        return gxyybSelected.includes(yyb) && bmmc.includes(gxbmSearchValue);
      }),
    };
    // 管辖团队
    const { gxtdSearchValue = '', datas: gxtdDatas = [] } = gxtdInstate;
    const gxtd = {
      show: true,
      ...gxtdInprops,
      ...gxtdInstate,
      datas: gxyybSelected.length === 0 && gxtdSearchValue === '' ? gxtdDatas : gxtdDatas.filter((item) => {
        const { yyb, tdmc = '' } = item;
        // 当有选择 管辖营业部 要根据选择的营业部来筛选出符合条件的团队
        if (gxyybSelected.length === 0) {
          return false;
        } else if (gxtdSearchValue === '') {
          return gxyybSelected.includes(yyb);
        }
        return gxyybSelected.includes(yyb) && tdmc.includes(gxtdSearchValue);
      }),
    };
    return (
      <Row className={classnames(className)} gutter={5}>
        {
          gxyyb.show && (
            <Col span={gxyyb.span || 8}>
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                value={gxyyb.selected}
                treeData={gxyyb.datas}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                treeNodeFilterProp="title"
                placeholder="请选择管辖营业部"
                allowClear
                multiple
                treeDefaultExpandAll
                {...gxyyb}
                onChange={this.handleGxyybChange}
              />
            </Col>
          )
        }
        {
          gxbm.show && (
            <Col span={gxbm.span || 8}>
              <Select
                mode="multiple"
                disabled={gxyyb.selected.length === 0}
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                value={gxbm.selected}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                placeholder="请选择管辖部门"
                allowClear
                treeDefaultExpandAll
                {...gxbm}
                onChange={this.handleGxbmChange}
              >
                { gxbm.datas.map(data => <Select.Option key={data.bmid} value={data.bmid}>{data.bmmc}</Select.Option>) }
              </Select>
            </Col>
          )
        }
        {
          gxtd.show && (
            <Col span={gxtd.span || 8}>
              <Select
                mode="multiple"
                disabled={gxyyb.selected.length === 0}
                showSearch
                optionFilterProp="children"
                style={{ width: '100%' }}
                value={gxtd.selected}
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                placeholder="请选择管辖团队"
                allowClear
                treeDefaultExpandAll
                {...gxtd}
                onChange={this.handleGxtdChange}
              >
                { gxtd.datas.map(data => <Select.Option key={data.tdid} value={data.tdid}>{data.tdmc}</Select.Option>) }
              </Select>
            </Col>
          )
        }
      </Row>
    );
  }
}
export default JurisdictionalRelationSelect;
