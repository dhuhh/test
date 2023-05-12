import React from 'react';
import moment from 'moment';
import { Collapse, Form, Row, Col, Cascader, Input, DatePicker, Select, Radio, Alert, Icon } from 'antd';
// import TagChecked from './TagChecked';
import styles from './index.less';
// import errorStyles from './error.less';
import MyItem from './Item';
import { getDictKey } from '../../../utils/dictUtils';
import { EncryptBase64 } from '../../Common/Encrypt';
import FileUploadButton from '../../Common/FileUploadButton';
// import KcyInfo from './KcyInfo';

const { Panel } = Collapse;
const { Item: FormItem } = Form;
const { TextArea } = Input;
const idDatas = [];

// const RadioGroup = Radio.Group;
class ServiceRecord extends React.Component {
  state ={
    gdfw: [{ id: 0, xcfw: false }], // 更多服务
    serviceProject: { 0: [] }, // 服务项目
    fwqdProject: { 0: [] }, // 服务渠道
    xcServiceProject: { 0: [] }, // 下次服务项目
    xcFwqdProject: { 0: [] }, // 下次服务渠道
    fileList: [],
    fileMd5: [],
  }
  addStep = () => { // 新增更多服务
    const { gdfw } = this.state;
    gdfw.push({
      id: gdfw.length + 1,
    });
    this.setState({
      gdfw,
      serviceProject: {
        ...this.state.serviceProject,
        [gdfw.length]: [],
      },
      fwqdProject: {
        ...this.state.fwqdProject,
        [gdfw.length]: [],
      },
      xcServiceProject: {
        ...this.state.xcServiceProject,
        [gdfw.length]: [],
      },
      xcFwqdProject: {
        ...this.state.xcFwqdProject,
        [gdfw.length]: [],
      },
    });
  }
  zjjlChange = (value = []) => { // 最近记录切换
    if (value.length > 0) {
      const { setFieldsValue } = this.props.form;
      const flId = value[0];
      setFieldsValue({
        fl: flId,
      });
    }
  }
  FalbChange = (value, id) => { // 方案类别切换
    const { serviceProject } = this.props;
    const { setFieldsValue } = this.props.form;
    const serviceProjects = [];
    serviceProject.forEach((item) => {
      const { fid } = item;
      if (value === fid) {
        serviceProjects.push({
          ...item,
        });
      }
    });
    this.setState({
      serviceProject: {
        ...this.state.serviceProject,
        [id]: serviceProjects,
      },
    });
    setFieldsValue({
      [`${id}_fwxm`]: [],
    });
  }
  xcFalbChange = (value, id) => { // 下次方案类别切换
    const { serviceProject } = this.props;
    const { setFieldsValue } = this.props.form;
    const xcServiceProjects = [];
    serviceProject.forEach((item) => {
      const { fid } = item;
      if (value === fid) {
        xcServiceProjects.push({
          ...item,
        });
      }
    });
    this.setState({
      xcServiceProject: {
        ...this.state.xcServiceProject,
        [id]: xcServiceProjects,
      },
    });
    setFieldsValue({
      [`${id}_xcfwxm`]: [],
    });
  }
  FwqdChange = (value, id) => { // 方案类别切换
    const { fwqdProject } = this.props;
    const { setFieldsValue } = this.props.form;
    const fwqdProjects = [];
    fwqdProject.forEach((item) => {
      const { fid } = item;
      if (value === fid) {
        fwqdProjects.push({
          ...item,
        });
      }
    });
    this.setState({
      fwqdProject: {
        ...this.state.fwqdProject,
        [id]: fwqdProjects,
      },
    });
    setFieldsValue({
      [`${id}_fwqd`]: [],
    });
  }
  xcFwqdChange = (value, id) => { // 下次方案类别切换
    const { fwqdProject } = this.props;
    const { setFieldsValue } = this.props.form;
    const xcFwqdProjects = [];
    fwqdProject.forEach((item) => {
      const { fid } = item;
      if (value === fid) {
        xcFwqdProjects.push({
          ...item,
        });
      }
    });
    this.setState({
      xcFwqdProject: {
        ...this.state.xcFwqdProject,
        [id]: xcFwqdProjects,
      },
    });
    setFieldsValue({
      [`${id}_xcfwqd`]: [],
    });
  }
  xcFwChange = (e, id) => {
    const { gdfw } = this.state;
    this.setState({
      gdfw: gdfw.map((item) => {
        if (item.id === id) {
          Object.defineProperty(item, 'xcfw', { value: e.target.value, writable: true });
          // item.xcfw = e.target.value;
        }
        return item;
      }),
    });
  }
  changeObjectForm = (list, gjz = 'CODE', xszd = 'NAME', fid = 'PARENT') => { // 组装对象字典
    const dataList = [];
    list.forEach((item) => {
      const { [gjz]: CODE, [xszd]: NAME, [fid]: FID } = item;
      dataList.push({
        key: CODE,
        value: CODE,
        label: NAME,
        fid: FID,
      });
    });
    return dataList;
  }
  changeDataForm = (datas) => { // 组装字典项目
    const tempDatas = [];
    datas.forEach((element) => {
      const { note: label, ibm: value, ibm: key } = element;
      tempDatas.push({
        label,
        value,
        key,
      });
    });
    return tempDatas;
  };
  disabledDate = (current) => {
    return current < moment().add(-1, 'day');
  }
  handleDeleteGdfw = (targetId) => {
    const { gdfw = [] } = this.state;
    gdfw.map((item = {}, index) => {
      const { id } = item;
      if (id === targetId) {
        gdfw.splice(index, 1);
        return true;
      }
      return false;
    });
    this.setState({ gdfw });
  }

  // 上传附件
  handleFileListChange = (params) => { // 处理附件变化
    const { fileList, id } = params;
    const { fileList: oldFilst = [] } = this.state;
    let strToObj = '';
    if (fileList.length === 0) {
      const jsonStr = `{"${id}":""}`;
      strToObj = JSON.parse(jsonStr);
      oldFilst.push(strToObj);
    } else {
      fileList.forEach((file) => {
        const { response: tempResponse = {} } = file;
        const { data = {} } = tempResponse;
        const { md5 = '' } = data || {};
        const jsonStr = `{"${id}":"${md5}"}`;
        strToObj = JSON.parse(jsonStr);
        oldFilst.push(strToObj);
      });
    }
    const newObj = {};
    oldFilst.forEach((item) => { Object.assign(newObj, item); });
    this.setState({
      fileMd5: newObj,
    });
    const { getfileMd5 } = this.props;
    if(getfileMd5){
      getfileMd5(newObj);
    }
  }
  getIddatas =(datas) =>{
    datas.forEach(item => {
        if(item.child && item.child.length > 0){
            this.getIddatas(item.child);
        }
        idDatas.push(item.id);
    })
  }
  /** 处理背景资料指标数据 */

  handleDatas=(datas)=>{
      const fidArr = [];
      datas.forEach(item => {
          fidArr.push(item.fid);
      })
      const newfidArr = new Set(fidArr); // 去重
      const parentData = []; // 层级数据
      datas.forEach(item => {
          newfidArr.forEach(ele => {
              if(item.id === ele){
                  parentData.push({...item, child: []});
              }
          })
      })
      datas.forEach(item => {
          parentData.forEach(element => {
              if(element.id === item.fid){
                  element.child.push(item);
              }
          })
      })
      this.getIddatas(parentData);
      return parentData;
  }

  setItemValue = (name, value) => {
      const { setFieldsValue } = this.props.form;
      setFieldsValue({
        name: value,
      })
  }
  render() {
    const selelProps = {
      getPopupContainer: () => document.getElementById('customerlist_modal_ServiceRecord'),
    };
    const { getFieldDecorator } = this.props.form;
    const { gdfw = [] } = this.state;
    const {
      sceneId = '1', cusBasicInfo = {}, selectedCount = 0, selectAll = false, selectedRowKeys = [], dictionary,
      fetchCusKYCInfo, requirementTypeList, recentRequirementType, cusKYCInfo, opeType = '0' } = this.props; // eslint-disable-line
    let { [getDictKey('fwlb')]: fwlbList = [], [getDictKey('hdlx')]: hdlxList = [] /* , [getDictKey('jhfwfs')]: fwfsList = [] */ } = dictionary;
    let { khxm = '--' } = cusBasicInfo;
    if (parseInt(selectedCount, 10) > 1) {
      khxm = `已选${selectedCount}个客户`;
    }
    fwlbList = this.changeDataForm(fwlbList);
    hdlxList = this.changeDataForm(hdlxList);
    // fwfsList = this.changeDataForm(fwfsList);
    let showBackgroundInfo = false;
    let showCusRequirements = false;
    // 如果是正式客户的单客户的话,就展示'背景信息'和'客户需求'
    if ((sceneId === '1' || sceneId === 1) && selectedCount === 1 && !selectAll && selectedRowKeys.length === 1) {
      showBackgroundInfo = true;
      showCusRequirements = true;
    }
    const parentData = this.handleDatas(cusKYCInfo);
    const normalData = [] // 普通数据
    cusKYCInfo.forEach(item => {
        if(idDatas.indexOf(item.id) < 0){
            normalData.push(item);
        }
    })
    return (
      <div>
        <Collapse className="m-collapse m-collapse-border" defaultActiveKey={[]}>
          <Panel header="背景资料" key="1" style={showBackgroundInfo ? {} : { display: 'none' }}>
            <div className="ant-collapse-content-box">
              <div className="m-oper-box">
                <i className="blue" onClick={() => { fetchCusKYCInfo(selectedRowKeys[0]); }}><i style={{ cursor: 'pointer' }} className="iconfont icon-refresh" />&nbsp;换一批</i>
              </div>
              <Form className="m-form-default ant-advanced-search-form">
                {/* {cusKYCInfo.map((item, index) => {
                  if (index % 2 === 0) {
                    const { zbmc, zbbm, kjlx } = item;
                    const { zbmc: zbmc2, zbbm: zbbm2, kjlx: kjlx2 } = cusKYCInfo[index + 1];
                    let { zbz } = item;
                    let { zbz: zbz2 } = cusKYCInfo[index + 1];
                    if (kjlx === '4') {
                      if (zbz && zbz !== '') {
                        zbz = moment(zbz, 'YYYYMMDD');
                      }
                    }
                    if (kjlx2 === '4') {
                      if (zbz2 && zbz2 !== '') {
                        zbz2 = moment(zbz2, 'YYYYMMDD');
                      }
                    }
                    return (
                      <Row key={zbbm}>
                        <Col sm={24} md={12} xxl={12} >
                          <FormItem labelCol={{ span: 14 }} className={`m-form-item ${styles.m_form}`} label={zbmc} wrapperCol={{ span: 10 }}>
                            {getFieldDecorator(zbbm, { initialValue: zbz })(<MyItem handleUpdatachange={this.handleFileListChange} changeObjectForm={this.changeObjectForm} changeDataForm={this.changeDataForm} item={item} dictionary={dictionary} />)}
                          </FormItem>
                        </Col>
                        <Col sm={24} md={12} xxl={12} >
                          <FormItem labelCol={{ span: 14 }} wrapperCol={{ span: 10 }} className={`m-form-item ${styles.m_form}`} label={zbmc2}>
                            {getFieldDecorator(zbbm2, { initialValue: zbz2 })(<MyItem handleUpdatachange={this.handleFileListChange} changeObjectForm={this.changeObjectForm} changeDataForm={this.changeDataForm} item={cusKYCInfo[index + 1]} dictionary={dictionary} />)}
                          </FormItem>
                        </Col>
                      </Row>
                    );
                  }
                  return null;
                })} */}
                <Row>
                { normalData.map((item, index) => {
                    const { name, attrCode: zbbm, controlType: kjlx, active } = item;
                    let { attrValue } = item;
                    if (kjlx === '4') {
                      if (attrValue && attrValue !== '') {
                          attrValue = moment(attrValue, 'YYYYMMDD');
                      }
                    }
                    if(active && active === '0') return null;
                    else {
                      return (
                        <Col sm={24} md={12} xxl={12} >
                          <FormItem labelCol={{ span: 14 }} className={`m-form-item ${styles.m_form}`} label={name} wrapperCol={{ span: 10 }}>
                          {getFieldDecorator(zbbm, { initialValue: attrValue })(<MyItem zbbm={zbbm} setItemValue={this.setItemValue} dictionary={dictionary} handleUpdatachange={this.handleFileListChange} changeObjectForm={this.changeObjectForm} changeDataForm={this.changeDataForm} item={item} />)}
                          </FormItem>
                        </Col>
                      );
                    }
                })}
                </Row>
                {
                    parentData.map(item => {
                      const { id, name, child = [] } = item;
                        return(
                          <div key={id} style={{ width: '100%' }}>
                            <Alert
                              type="info"
                              message={<span style={{ color: '#03A9F4' }}><Icon type="pushpin" /> {name}</span>}
                              style={{ marginBottom: '.866rem' }}
                            />
                            <Row>
                              {
                                child.map((item, index) => {
                                  const { name, attrCode: zbbm, controlType: kjlx, active } = item;
                                  // const zbbm = attrCode.toLocaleLowerCase();
                                  let { attrValue } = item;
                                  if (kjlx === '4') {
                                    if (attrValue && attrValue !== '') {
                                        attrValue = moment(attrValue, 'YYYYMMDD');
                                    }
                                  }
                                  if(active && active === '0') return null;
                                  else {
                                    return (
                                      <Col sm={24} md={12} xxl={12} >
                                        <FormItem labelCol={{ span: 14 }} className={`m-form-item ${styles.m_form}`} label={name} wrapperCol={{ span: 10 }}>
                                        {getFieldDecorator(zbbm, { initialValue: attrValue })(<MyItem zbbm={zbbm} setItemValue={this.setItemValue} dictionary={dictionary} handleUpdatachange={this.handleFileListChange} changeObjectForm={this.changeObjectForm} changeDataForm={this.changeDataForm} item={item} />)}
                                        </FormItem>
                                      </Col>
                                    );
                                  }
                              })}
                            </Row>
                          </div>
                        )
                    })
                }
                {/* <KcyInfo cusKYCInfo={cusKYCInfo} dictionary={dictionary} getFieldDecorator={getFieldDecorator} /> */}
              </Form>
              <div className="m-oper-box">
                <button type="button" className="m-btn-tag m-btn-tag-pink ant-btn ">
                  <span>提示</span>
                </button>
                <span style={{ padding: '0 0.5rem' }}>所提示的资料均由系统计算获得，如果您愿意进一步完善资料，可以点击</span>
                <a href={`/#/customerPanorama/kyc/${EncryptBase64(selectedRowKeys[0])}`} target="blank" className="pink">完善资料</a>
              </div>
            </div>
          </Panel>
        </Collapse>
        <Collapse style={showCusRequirements ? {} : { display: 'none' }} className="m-collapse m-collapse-border" defaultActiveKey={[]}>
          <Panel header="客户需求" key="1">
            <div className="ant-collapse-content-box">
              <Form className="m-form-default ant-advanced-search-form">
                {/* <Row>
                  <Col sm={24} md={24} xxl={24} >
                    <FormItem labelCol={{ span: 12 }} className="m-form-item" label="最近记录" wrapperCol={{ span: 12 }}>
                      {getFieldDecorator('zjjl')(<TagChecked onChange={this.zjjlChange} recentRequirementType={recentRequirementType} />)}
                    </FormItem>
                  </Col>
                </Row> */}
                <Row>
                  <Col sm={24} md={12} xxl={8} >
                    <FormItem labelCol={{ span: 12 }} className="m-form-item" label="分类" wrapperCol={{ span: 12 }}>
                      {getFieldDecorator('fl')(<Cascader {...selelProps} showSearch placeholder="请选择" options={requirementTypeList} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={24} xxl={24} >
                    <FormItem labelCol={{ span: 12 }} className="m-form-item" label="内容" wrapperCol={{ span: 12 }}>
                      {getFieldDecorator('nr')(<TextArea placeholder="请输入内容" autosize={{ minRows: 4 }} />)}
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </div>
          </Panel>
        </Collapse>
        {gdfw.map((item) => {
          const { id, xcfw = false } = item;
          return (
            <Form key={id} className="m-form-default ant-advanced-search-form" style={{ paddingTop: '2rem' }}>
              <Row>
                <Col sm={12} md={12} xxl={12} style={{ display: opeType === '0' ? '' : 'none' }} >
                  <FormItem labelCol={{ span: 12 }} className="m-form-item" label="客户" wrapperCol={{ span: 12 }}>
                    {getFieldDecorator(`${id}_khxm`)(<span className="ant-form-text pink">{khxm}<i className="iconfont icon-customerList" /></span>)}
                  </FormItem>
                </Col>
                {
                  gdfw.length > 1 ?
                    (
                      <Col sm={12} md={12} xxl={12} style={{ textAlign: 'right', paddingRight: '2.5rem' }} >
                        <div onClick={() => { this.handleDeleteGdfw(id); }} style={{ cursor: 'pointer' }}><i className="iconfont icon-del pink" /></div>
                      </Col>
                    ) : null
                }
              </Row>
              <Row>
                <Col sm={24} md={24} xxl={24} >
                  <FormItem labelCol={{ span: 12 }} className="m-form-item" label="服务主题" wrapperCol={{ span: 12 }}>
                    {getFieldDecorator(`${id}_fwzt`, { rules: [{ required: true, message: '请输入主题' }] })(<Input placeholder="请输入主题" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={12} xxl={8} >
                  <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="服务类别">
                    {
                      getFieldDecorator(`${id}_fwlb`, { rules: [{ required: true, message: '请选择类别' }] })(<Select {...selelProps} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={value => this.FalbChange(value, id)} placeholder="请选择">{fwlbList.map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                    }
                  </FormItem>
                </Col>
                <Col sm={24} md={12} xxl={8} >
                  <FormItem labelCol={{ span: 12 }} className="m-form-item" label="服务项目" wrapperCol={{ span: 12 }}>
                    {
                      getFieldDecorator(`${id}_fwxm`, { rules: [{ required: true, message: '请选择项目' }] })(<Select {...selelProps} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="请选择">{this.state.serviceProject[id].map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={12} xxl={8} >
                  <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="活动类型">
                    {
                      getFieldDecorator(`${id}_hdlx`, { rules: [{ required: true, message: '请选择类型' }] })(<Select {...selelProps} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={value => this.FwqdChange(value, id)} placeholder="请选择">{hdlxList.map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                    }
                  </FormItem>
                </Col>
                <Col sm={24} md={12} xxl={8} >
                  <FormItem labelCol={{ span: 12 }} className="m-form-item" label="服务渠道" wrapperCol={{ span: 12 }}>
                    {
                      getFieldDecorator(`${id}_fwqd`, { rules: [{ required: true, message: '请选择渠道' }] })(<Select {...selelProps} mode="multiple" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="请选择">{this.state.fwqdProject[id].map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={24} xxl={24} >
                  <FormItem labelCol={{ span: 12 }} className="m-form-item" label="详细内容" wrapperCol={{ span: 12 }}>
                    {getFieldDecorator(`${id}_xxnr`, { rules: [{ required: true, message: '请输入内容' }] })(<TextArea placeholder="请输入内容" autosize={{ minRows: 4 }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={24} xxl={24} >
                  <FormItem labelCol={{ span: 12 }} className="m-form-item" label="是否下次服务" wrapperCol={{ span: 12 }}>
                    {getFieldDecorator(`${id}_xcfw`, {
                      initialValue: xcfw,
                    })( // eslint-disable-line
                      <Radio.Group style={{ width: '100%' }} onChange={e => this.xcFwChange(e, id)}>
                        <Radio value> 是 </Radio>
                        <Radio value={false}> 否 </Radio>
                      </Radio.Group>)}
                  </FormItem>
                </Col>
              </Row>
              {
                xcfw && (
                  <React.Fragment>
                    <Row>
                      <Col sm={24} md={24} xxl={24} >
                        <FormItem labelCol={{ span: 12 }} className="m-form-item" label="下次服务需求" wrapperCol={{ span: 12 }}>
                          {getFieldDecorator(`${id}_xcfwxq`)(<Input />)}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={24} md={12} xxl={8} >
                        <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="下次服务类别">
                          {
                            getFieldDecorator(`${id}_xcfwlb`)(<Select {...selelProps} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={value => this.xcFalbChange(value, id)} placeholder="请选择">{fwlbList.map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                          }
                        </FormItem>
                      </Col>
                      <Col sm={24} md={12} xxl={8} >
                        <FormItem labelCol={{ span: 12 }} className="m-form-item" label="下次服务项目" wrapperCol={{ span: 12 }}>
                          {
                            getFieldDecorator(`${id}_xcfwxm`)(<Select {...selelProps} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="请选择">{this.state.xcServiceProject[id].map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                          }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={24} md={12} xxl={8} >
                        <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} className="m-form-item" label="下次活动类型">
                          {
                            getFieldDecorator(`${id}_xchdlx`)(<Select {...selelProps} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} onChange={value => this.xcFwqdChange(value, id)} placeholder="请选择">{hdlxList.map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                          }
                        </FormItem>
                      </Col>
                      <Col sm={24} md={12} xxl={8} >
                        <FormItem labelCol={{ span: 12 }} className="m-form-item" label="下次服务渠道" wrapperCol={{ span: 12 }}>
                          {
                            getFieldDecorator(`${id}_xcfwqd`)(<Select {...selelProps} mode="multiple" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="请选择">{this.state.xcFwqdProject[id].map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)
                          }
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={24} md={12} xxl={8} >
                        <FormItem labelCol={{ span: 12 }} className="m-form-item" label="下次服务时间" wrapperCol={{ span: 12 }} >
                          {getFieldDecorator(`${id}_xcfwsj`)(<DatePicker disabledDate={this.disabledDate} />)}
                        </FormItem>
                      </Col>
                      {/* <Col sm={24} md={12} xxl={8} >
                        <FormItem labelCol={{ span: 12 }} className="m-form-item" label="服务方式" wrapperCol={{ span: 12 }}>
                          {getFieldDecorator(`${id}_fwfs`)(<Select allowClear {...selelProps} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} placeholder="请选择">{fwfsList.map((tempitem) => { return <Select.Option key={tempitem.key} value={tempitem.value}>{tempitem.label}</Select.Option>; })}</Select>)}
                        </FormItem>
                      </Col> */}
                    </Row>
                  </React.Fragment>
              )}
              {
                selectedCount === 1 && (
                  <Row>
                    <Col sm={24} md={24} xxl={24} >
                      <FormItem labelCol={{ span: 12 }} className="m-form-item" label="附件&ensp;&thinsp;" wrapperCol={{ span: 12 }} >
                        {getFieldDecorator(`${id}_fj`)(<FileUploadButton />)}
                      </FormItem>
                    </Col>
                  </Row>
                )}
              <hr className="m-hr" />
            </Form>
          );
        })}
        <div onClick={this.addStep} className={`${styles.m_addStep} m-add-step`} style={{ marginLeft: '1rem', marginTop: '-1.5rem', display: opeType === '0' ? '' : 'none' }}><i className="iconfont icon-add" /><span>更多服务</span></div>
      </div>
    );
  }
}
export default Form.create({
  onValuesChange(props, changedValues, allValues) {
    props.handleFormChange(changedValues, allValues);
  },
})(ServiceRecord);
