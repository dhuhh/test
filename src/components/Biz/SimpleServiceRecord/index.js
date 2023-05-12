import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Radio, Input, Button, message, DatePicker } from 'antd';
import Select from '../../../components/Common/Form/Select';
import BetweenDatePicker from '../../../components/Common/Form/BetweenDatePicker';
import { fetchObject } from '../../../services/sysCommon';
import { getDictKey } from '../../../utils/dictUtils';
import { FetchSysCommonTable } from '$services/sysCommon';
import { serverLogsSeniorFunc } from '../../../services/customersenior/serverLogsSenior';

/**
 * Component: SimpleServiceRecord
 * Description: 通用记录服务日志简易表单
 * Author: WANGQI
 * Date: 2018/11/05
 * Remarks: 注释的代码都不要删，可能会用到
 */
class SimpleServiceRecord extends React.Component {
  static propTypes = {
    scrollElement: PropTypes.node,
    sceneId: PropTypes.number.isRequired,
    unSelectCusCodesArr: PropTypes.array,
    dictionary: PropTypes.object.isRequired,
  }

  static defaultProps = {
    scrollElement: null,
    unSelectCusCodesArr: [],
  }

  state = {
    loading: false,
    fwlbs: [],
    fwxms: [],
    jrhmd: '2',
    viewfwfs: true,
    // fileList: [],
    xcfw: false,
    fwqdProject: [],
  }

  componentDidMount() {
    this.fetchData();
  }

  onFwlbChange = (value) => {
    if (value === '23') {
      this.setState({ viewfwfs: false });
    } else {
      // 服务项目
      this.setState({ viewfwfs: true });
      this.fetchFwxmData(value);
    }
  }

  fetchFwxmData = (value) => {
    fetchObject('TFWLBXF', {
      condition: '',
      queryOption: {
        batchNo: 1,
        batchSize: 1000,
        orderBy: 'ID ASC',
        queryCount: true,
        queryId: '',
        valueOption: 0,
      },
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        const fwxmDic = records.filter(item => item.FWLB === value) || [];
        const fwxms = [];
        fwxmDic.forEach((item) => {
          fwxms.push({
            value: item.ID,
            label: item.FWLBXF,
          });
        });
        this.setState({ fwxms }, () => {
          if (fwxms.length > 0) {
            const { setFieldsValue } = this.props.form;
            if (setFieldsValue) {
              const fwxm = (fwxms[0] || {}).value || '';
              setFieldsValue({ fwxm });
            }
          }
        });
      }
    });
  }
  //获取服务渠道livebos对象
  fetchFwqdProject = () => {
    FetchSysCommonTable({
      condition: {},
      objectName: 'tFWQDXF',
      queryOption: {
        batchNo: 1,
        batchSize: 1000,
        orderBy: 'ID ASC',
        queryCount: true,
        queryId: '',
        valueOption: 0,
      }
    }).then(res => {
      const { success, records = [] } = res || {};
      const fwqdProject = [];
      if (success && Array.isArray(records)) {
        for (let i = 0; i < records.length; i++) {
          const { ID, HDLX, FWQDXF } = records[i];
          fwqdProject.push({
            key: ID,
            fid: HDLX,
            label: FWQDXF,
            value: ID,
          });
        }
      }
      this.setState({ fwqdProject }, () => {
        if (fwqdProject.length > 0) {
          const { setFieldsValue } = this.props.form;
          if (setFieldsValue) {
            const fwfs = (fwqdProject[0] || {}).value || '';
            setFieldsValue({ fwfs });
          }
        }
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // handleFileListChange = (fileList) => { // 处理附件变化
  //   this.setState({
  //     fileList, // eslint-disable-line
  //   });
  // }

  /**
   * unSelectCusCodesArr: 入参id数组
   * limitFormPayload: 可以指定入参预定值，例如主题(zt) => limitFormPayload = { zt: '' }
   * uuid: 全选查询返回查询条件的uuid
   * sceneId: 场景ID，1|客户列表  2|MOT 3|任务中心  4|持续服务
   * isAllSel: 是否全选，0.非全选，1全选，2单个客户含有背景资料和客户需求
   */
  handleSubmit = () => {
    const { unSelectCusCodesArr = [], uuid = '', limitFormPayload = {}, sceneId, isAllSel = 0, khids = [], sjids = [], taskID = '', sceneJsonObj = {} } = this.props;
    if (isAllSel === 0) {
      if (!unSelectCusCodesArr || unSelectCusCodesArr.length === 0) {
        message.warn('您未选中任何选项！');
        return false;
      }
      // if (unSelectCusCodesArr && unSelectCusCodesArr.length > 1) {
      //   message.error('不能批量填写服务记录！');
      //   return false;
      // }
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const { zt, fwxm, fwlb, fwfs, xxnr, jrhmd, szhmd, xcfwxq = '', xcfwsj = '', ly = '' } = { ...limitFormPayload, ...values } || {};
        if ((!zt && zt !== 0) || zt.length === 0) {
          message.info('主题必填!');
          this.setState({ loading: false });
          return false;
        } else if ((!fwlb && fwlb !== 0) || fwlb.length === 0) {
          message.info('服务类别必填!');
          this.setState({ loading: false });
          return false;
        } else if ((!fwxm && fwxm !== 0) || fwxm.length === 0) {
          message.info('服务项目必填!');
          this.setState({ loading: false });
          return false;
        } else if (((!fwfs && fwfs !== 0) || fwfs.length === 0) && this.state.viewfwfs === true) {
          message.info('请选择服务方式!');
          this.setState({ loading: false });
          return false;
        } else if ((!xxnr && xxnr !== 0) || xxnr.length === 0) {
          message.info('请填写服务内容!');
          this.setState({ loading: false });
          return false;
        } else if ((this.state.jrhmd === '1') && ((!ly && ly !== 0) || ly.length === 0)) {
          message.info('请填写加入灰名单理由!');
          this.setState({ loading: false });
          return false;
        }
        let ksrq = '';
        let jsrq = '';
        // 设置灰名单时间
        if (jrhmd === '1' && szhmd) {
          const { leftValue, rightValue } = szhmd || {};
          ksrq = moment.isMoment(leftValue) ? leftValue.format('YYYYMMDD') : '';
          jsrq = moment.isMoment(rightValue) ? rightValue.format('YYYYMMDD') : '';
        }
        // 调用接口
        serverLogsSeniorFunc({
          taskid: taskID,
          sjid: sjids.join(','),
          operateButtonSelModel: {
            scene: sceneId,
            selectAll: isAllSel,
            selectCode: khids.join(','),
            sceneJsonObj: JSON.stringify(sceneJsonObj),
          },
          serverLogsList: [{
            fwqd: fwfs,
            fwlb,
            fwxm,
            xxnr,
            khlx: '0',
            hmdkssj: ksrq,
            hmdjssj: jsrq,
            ly,
            xcfwxq,
            txsj: xcfwsj !== '' ? xcfwsj.format('YYYYMMDD') : '', // 下次服务时间
            fwzt: zt,
            uuid,
            hdlx: '1',
          }],
        }).then((result) => {
          const { note = '操作成功!' } = result;
          message.success(note);
          this.setState({ loading: false, xcfw: false, jrhmd: '2' });
          if (this.props.form && this.props.form.resetFields) this.props.form.resetFields();
          if (this.props.onRefresh && typeof this.props.onRefresh === 'function') this.props.onRefresh();
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
          this.setState({ loading: false });
        });
      }
    });
  }

  fetchData = () => {
    const { sceneId = '2' } = this.props;
    // 服务类别
    const { dictionary = {} } = this.props;
    const fwlbDic = dictionary[getDictKey('fwlb')] || [];
    debugger
    const fwlbs = [];
    fwlbDic.forEach((item) => {
      fwlbs.push({
        value: item.ibm,
        label: item.note,
      });
    });
    if (sceneId === '3') {
      fwlbs.push({
        value: '23',
        label: '无法服务',
      });
    }
    this.setState({ fwlbs }, () => {
      if (fwlbs.length > 0) {
        const { setFieldsValue } = this.props.form;
        if (setFieldsValue) {
          setFieldsValue({ fwlb: fwlbs[0].value });
        }
        this.fetchFwxmData(fwlbs[0].value);
        this.fetchFwqdProject();
      }
    });
  }

  disabledDate = (current) => {
    return current < moment().add(-1, 'day');
  }

  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const { scrollElement, dictionary = {}, sceneId, servicePhoneNumber, unSelectCusCodesArr = [], buttonStyle = {}, selectCount = -1, disabled: disabledProp = false } = this.props;
    // const fwfss = dictionary[getDictKey('FWFS')] || [];
    const { loading, jrhmd, fwqdProject } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const values = getFieldsValue();
    // 新增selectCount,防止全选列表后,钩除并剩下一条记录的情况,不传则按原方式取unSelectCusCodesArr长度
    const codeLength = selectCount === -1 ? unSelectCusCodesArr.length : selectCount; // 有全选的时候必须要传入selectCount,以此判断选中记录条数
    const disabled = disabledProp || codeLength < 1;
    return (
      <Form className={classnames('m-form')} style={{ margin: 0 }}>
        {/* {
          this.state.viewfwfs && (
            <Form.Item {...formItemLayout} label="服务渠道">
              {getFieldDecorator('fwfs', {
                rules: [{ required: true }],
                initialValue: '1',
              })( // eslint-disable-line
                <Radio.Group disabled={disabled}>
                  {
                    fwfss.filter(item => item.ibm !== '5').map(item => (<Radio key={item.ibm} value={item.ibm}> {item.note} </Radio>))
                  }
                </Radio.Group>)}
              {
                values.fwfs === '1' && servicePhoneNumber && !disabled && <span className="m-phone-item"><i className="iconfont icon-phone" />{servicePhoneNumber}</span>
              }
            </Form.Item>
          )
        } */}
        {
          this.state.viewfwfs && (
            <Form.Item {...formItemLayout} wrapperCol={{ span: 10 }} label="服务渠道">
              {getFieldDecorator('fwfs', {
                rules: [{ required: true, message: '请选择服务渠道!' }],
              })(<Select style={{ minWidth: '10rem' }}
                datas={this.state.fwqdProject}
                dropdownMatchSelectWidth
                allowClear
                showSearch
                optionFilterProp="children"
                getPopupContainer={scrollElement ? () => scrollElement : null}
                disabled={disabled} />)}
            </Form.Item>
          )
        }

        {
          sceneId === 4 && (
            <Form.Item {...formItemLayout} wrapperCol={{ span: 10 }} label="主题">
              {getFieldDecorator('zt', {
                rules: [{ required: true, message: '请填写主题!' }, { max: 50, message: '不能超过50个字符！' }],
              })(<Input placeholder="请填写主题" disabled={disabled} />)}
            </Form.Item>
          )
        }

        <Form.Item {...formItemLayout} wrapperCol={{ span: 10 }} label="服务类别">
          {getFieldDecorator('fwlb', {
            rules: [{ required: true, message: '请选择服务类别!' }],
          })(<Select style={{ minWidth: '10rem' }}
            datas={this.state.fwlbs}
            dropdownMatchSelectWidth
            allowClear
            showSearch
            optionFilterProp="children"
            getPopupContainer={scrollElement ? () => scrollElement : null}
            onChange={this.onFwlbChange}
            disabled={disabled} />)}
        </Form.Item>

        {
          this.state.viewfwfs && (
            <Form.Item {...formItemLayout} wrapperCol={{ span: 10 }} label="服务项目">
              {getFieldDecorator('fwxm', {
                rules: [{ required: true, message: '请选择服务项目!' }],
              })(<Select style={{ minWidth: '10rem' }}
                datas={this.state.fwxms}
                dropdownMatchSelectWidth
                allowClear
                showSearch
                optionFilterProp="children"
                getPopupContainer={scrollElement ? () => scrollElement : null}
                disabled={disabled} />)}
            </Form.Item>
          )
        }

        <Form.Item {...formItemLayout} label="内容">
          {getFieldDecorator('xxnr', {
            rules: [{ required: true, message: '请填写内容!' }],
          })(<Input.TextArea rows={3} disabled={disabled} maxLength="2000" />)}
        </Form.Item>

        {/* <Form.Item>
          <Row>
            <Col offset={6} span={14}>
              <FileUploadButton onChange={this.handleFileListChange} />
            </Col>
          </Row>
        </Form.Item> */}

        {
          sceneId === 2 && (
            <React.Fragment>
              <Form.Item {...formItemLayout} label="加入灰名单">
                {getFieldDecorator('jrhmd', {
                  rules: [{ required: true }],
                  initialValue: '2',
                })( // eslint-disable-line
                  <Radio.Group onChange={(e) => { this.setState({ jrhmd: e.target.value }); }} disabled={disabled}>
                    <Radio value="1"> 是 </Radio>
                    <Radio value="2"> 否 </Radio>
                  </Radio.Group>)}
                <span style={{ color: 'rgba(0, 0, 0, 0.25)', fontSize: '1.166rem' }}>对自动类MOT任务不生效</span>
              </Form.Item>

              {
                jrhmd === '1' && (
                  <Form.Item {...formItemLayout} label="设置灰名单">
                    {getFieldDecorator('szhmd', {
                      rules: [{ required: true }],
                    })(<BetweenDatePicker type={2} disabled={disabled} />)}
                  </Form.Item>
                )
              }

              {
                jrhmd === '1' && (
                  <Form.Item {...formItemLayout} label="理由">
                    {getFieldDecorator('ly', {
                      rules: [{ required: true }],
                    })(<Input disabled={disabled} />)}
                  </Form.Item>
                )
              }
            </React.Fragment>
          )
        }

        <React.Fragment>
          <Form.Item {...formItemLayout} label="下次服务提醒">
            {getFieldDecorator('xcfw', {
              rules: [{ required: true }],
              initialValue: '2',
            })( //eslint-disable-line
              <Radio.Group style={{ width: '100%' }} onChange={(e) => { this.setState({ xcfw: e.target.value }); }} disabled={disabled}>
                <Radio value="1"> 是 </Radio>
                <Radio value="2"> 否 </Radio>
              </Radio.Group>)}
          </Form.Item>
          {
            this.state.xcfw === '1' && (
              <React.Fragment>
                <Form.Item {...formItemLayout} label="下次服务需求" wrapperCol={{ span: 12 }}>
                  {getFieldDecorator('xcfwxq', {
                    rules: [{ required: true, message: '请填写下次服务需求!' }],
                    initialValue: '',
                  })(<Input />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="下次服务时间" wrapperCol={{ span: 12 }} >
                  {getFieldDecorator('xcfwsj', {
                    rules: [{ required: true, message: '请填写下次服务时间!' }],
                    initialValue: '',
                  })(<DatePicker disabledDate={this.disabledDate} />)}
                </Form.Item>
              </React.Fragment>
            )
          }
        </React.Fragment>

        <Form.Item>
          <Row>
            <Col span={24} style={{ ...buttonStyle, textAlign: 'center' }}>
              <Button loading={loading} className={`m-btn-radius m-btn-headColor ${disabled && 'm-btn-disable'}`} onClick={this.handleSubmit} disabled={disabled}> 提交 </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(SimpleServiceRecord));
