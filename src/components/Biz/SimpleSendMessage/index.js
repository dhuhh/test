import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Button, message, Popover } from 'antd';
import classnames from 'classnames';
import { connect } from 'dva';
import CommonSelect from '../../Common/Form/Select';
// import { fetchObject } from '../../../services/sysCommon';
import { getDictKey } from '../../../utils/dictUtils';
import { fetchMessageSend } from '../../../services/customersenior/messageSend';
import { fetchMsgSndCusBlackList } from '../../../services/basicservices';
import { FetchSysCommonTable } from '../../../services/sysCommon';
import BlackList from './BlackList';
import styles from './index.less';

/**
 * Component: SimpleSendMessage
 * Description: 通用发消息简易表单
 * Author: WANGQI
 * Date: 2018/11/05
 * Remarks: 注释的代码不要删
 */
class SimpleSendMessage extends React.Component {
  static propTypes = {
    scrollElement: PropTypes.node,
    sceneId: PropTypes.number.isRequired,
    unSelectCusCodesArr: PropTypes.array,
    khids: PropTypes.array,
    dictionary: PropTypes.object.isRequired,
  }

  static defaultProps = {
    scrollElement: null,
    unSelectCusCodesArr: [],
    khids: [],
  }

  state = {
    loading: false,
    fwlbs: [],
    fwxms: [],
    fwlb: '',
    blackListData: [],
  }
  componentDidMount() {
    this.fetchData();
  }
  componentWillReceiveProps(nextProps) {
    const { sjids: preSjids, isAllSel: preAllSel } = this.props;
    const { sjids: nowSjids, isAllSel: nowAllSel } = nextProps;
    if (preAllSel !== nowAllSel || JSON.stringify(preSjids) !== JSON.stringify(nowSjids)) {
      this.getBlackList(nextProps);
    }
  }
  componentWillUnmount() {
    // 卸载组件时清除所有的定时器,避免内存泄漏
    if (this.blackListTimers && this.blackListTimers.length > 0) {
      this.blackListTimers.forEach((blackListTimer) => {
        clearTimeout(blackListTimer);
      });
      this.blackListTimers = null;
    }
  }
  onFwlbChange = (value) => {
     // 服务项目
     FetchSysCommonTable({
      // condition: '',
      condition: {},
      objectName: 'TFWLBXF',
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
    this.setState({ fwlb: value });
    this.getBlackList(this.props, value);
  }

  /**
   * 获取黑名单列表
   * */
  getBlackList = (props, fwlb = this.state.fwlb) => {
    // 清除所有的定时器,避免重复调用(某些情况下,同一个fwlb,函数会被多次触发)
    if (this.blackListTimers && this.blackListTimers.length > 0) {
      this.blackListTimers.forEach((blackListTimer) => {
        clearTimeout(blackListTimer);
      });
      this.blackListTimers.length = 0;
    }
    // 未选中fwlb时,清除黑名单
    if (!fwlb) {
      this.setState({ blackListData: [] });
      return false;
    }
    // 如果未选中任何记录,那么就不要查询了,并清除黑名单数
    const { isAllSel, uuid = '', sjids = [], sceneId = -1 } = props;
    if (!isAllSel && sjids.length === 0) {
      this.setState({ blackListData: [] });
      return false;
    }
    // 调用接口,获取黑名单
    const blackListTimer = setTimeout(() => {
      // fetchMsgSndCusBlackList
      fetchMsgSndCusBlackList({
        khh_json: JSON.stringify({
          CHC_ID: sjids.join(','),
          WTHR_ALL: isAllSel,
          QRY_SQL_ID: uuid,
        }),
        opr_sc: sceneId,
        fwlb,
      }).then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0 && this.blackListTimers.includes(blackListTimer)) { // 如果在本次调用后,又有其它定时器触发,那么就忽略此次的值,以最新的为准
          this.setState({ blackListData: records });
        }
      });
    }, 100);
    // 将定时器存在this中,当做一个公共变量
    if (!this.blackListTimers) {
      this.blackListTimers = [];
    }
    this.blackListTimers.push(blackListTimer);
  }

  /**
   * unSelectCusCodesArr: 入参id数组
   * limitFormPayload: 可以指定入参预定值，例如主题(zt) => limitFormPayload = { xxzt: '' }
   * uuid: 全选查询返回查询条件的uuid
   * sceneId: 场景ID，1|客户列表  2|MOT 3|任务中心  4|持续服务
   * isAllSel: 是否全选，0.非全选，1全选，2单个客户含有背景资料和客户需求
   */
  handleSubmit = () => {
    const { khids, sjids, unSelectCusCodesArr = [], limitFormPayload = { xxzt: '' }, uuid = '', isAllSel = 0, sceneId, sceneJsonObj = {}, taskID = '', type } = this.props;
    if (isAllSel === 0) {
      if (!unSelectCusCodesArr || unSelectCusCodesArr.length === 0) {
        message.warn('您未选中任何选项！');
        return false;
      }
    }
    let opr_sc = '';
    if(type === 1){
      opr_sc = '9'
    }else if(type === 2){
      opr_sc = '7'
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const { xxzt,  fwxm, fwlb, xxnr } = { ...limitFormPayload, ...values } || {};

        if ((!xxzt && xxzt !== 0) || xxzt.length === 0) {
          message.info('消息主题必填!');
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
        } else if ((!xxnr && xxnr !== 0) || xxnr.length === 0) {
          message.info('请填写消息内容!');
          this.setState({ loading: false });
          return false;
        }
        fetchMessageSend({
          taskid: taskID,
          sjid: sjids.join(','),
          operateButtonSelModel: {
            scene: sceneId,
            selectAll: isAllSel ? 1 : 0,
            selectCode: sjids.join(','),
            sceneJsonObj: JSON.stringify(sceneJsonObj),
          },
          sendMessageParamModel: {
            att: '', // 附件
            att_path: '', // 附件类型
            czcj: 0,
            idev_flg: 1, // 个性化标志
            mod_id: '', // 模板ID
            msg_chnl: '8', // 消息渠道
            msg_col: fwxm, // 对应项目
            msg_tp: fwlb, // 对应服务类型
            ntfy_flg: 1, // 通知标志
            opr_bt: 2, // 操作按钮 1|保存;2|发送
            opr_sc,
            opr_sc_id: 0,
            opr_tp: 2, // 操作类型 默认传2 （1|自动配送;2|人工发送）
            oprr_ip: '', // 操作人IP
            pcs_pro: '', // 流程启动过程
            pre_snd_tm: '', // 预发送时间
            pri: 1, // 优先级
            rcvr_tp: 1, // 收件人类型
            rcvr_id: uuid, // uuid
            rvw_tp: 2, // 审核类型 默认传2 （1|不需审核;2|单步审核;3|流程审核）
            sbj: xxzt, // 主题
            snd_to_ms: '',
            snd_tp: 0,
            snd_way: isAllSel ? '1' : '2', // 1.单发 2.群发
            src_id: '', // 来源ID
            src_obj: '', // 来源对象
            sttg_id: '', // 策略ID
            tx: JSON.stringify({ 8: xxnr }),
            tx_html: '', // 带格式的正文
          },
          // mod_type: '1', // 模板类型
        }).then((result) => {
          const { note = '操作成功!' } = result;
          message.success(note);
          this.setState({ loading: false });
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
    // 服务类别
    const { dictionary = {} } = this.props;
    const fwlbDic = dictionary[getDictKey('fwlb')] || [];
    const fwlbs = [];
    fwlbDic.forEach((item) => {
      fwlbs.push({
        value: item.ibm,
        label: item.note,
      });
    });
    this.setState({ fwlbs }, () => {
      if (fwlbs.length > 0) {
        const { setFieldsValue } = this.props.form;
        if (setFieldsValue) {
          const fwlb = (fwlbs[0] || {}).value || '';
          setFieldsValue({ fwlb });
          this.setState({ fwlb });
          this.getBlackList(this.props, fwlb);
          this.onFwlbChange(fwlb);
        }
      }
    });
  }
  render() {
    const { loading, blackListData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { scrollElement, sceneId, unSelectCusCodesArr = [], buttonStyle = {}, selectCount = -1, disabled: disabledProp = false} = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const codeLength = selectCount === -1 ? unSelectCusCodesArr.length : selectCount; // 有全选的时候必须要传入selectCount,以此判断选中记录条数
    const disabled = disabledProp || codeLength < 1;
    return (
      <Form className={classnames('m-form')}>
        {
          sceneId === 4 && (
            <Form.Item {...formItemLayout} label="消息主题">
              {getFieldDecorator('xxzt', {
                rules: [
                  { required: true, message: '请输入消息主题!' },
                  { max: 50, message: '不能超过50个字符！' },
                ],
              })(<Input placeholder="请输入消息主题"  disabled={disabled} />)}
            </Form.Item>
          )
        }

        <Form.Item {...formItemLayout} label="服务类别">
          {
            getFieldDecorator('fwlb', {
              rules: [{ required: true, message: '请选择服务类别!' }],
            })(<CommonSelect style={{ minWidth: '18rem' }} datas={this.state.fwlbs} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children" getPopupContainer={scrollElement ? () => scrollElement : null} onChange={this.onFwlbChange}  disabled={disabled} />)
          }
        </Form.Item>

        <Form.Item {...formItemLayout} label="服务项目">
          {
            getFieldDecorator('fwxm', {
              rules: [{ required: true, message: '请选择服务项目!' }],
            })(<CommonSelect style={{ minWidth: '18rem' }} datas={this.state.fwxms} dropdownMatchSelectWidth allowClear showSearch optionFilterProp="children" getPopupContainer={scrollElement ? () => scrollElement : null}  disabled={disabled} />)
          }
        </Form.Item>

        <Form.Item {...formItemLayout} label="消息内容">
          {
            getFieldDecorator('xxnr', {
              rules: [{ required: true, message: '请填写消息内容!' }],
            })(<Input.TextArea rows={4}  disabled={disabled} />)
          }
        </Form.Item>

        {
          blackListData.length > 0 && (
            <Form.Item {...formItemLayout} label="黑名单客户数" style={{ marginTop: '-1.166rem' }}>
              <Popover overlayClassName={styles.blackListPopover} content={<BlackList dataSource={blackListData} />}>
                <div style={{ paddingTop: '0.216rem', cursor: 'pointer', display: 'inline-block' }}>
                  <span style={{ color: 'rgb(64, 144, 247)' }}>{blackListData.length}</span>
                  <span style={{ margin: '0 0.466rem' }}>个</span>
                </div>
              </Popover>
            </Form.Item>
          )
        }

        <Form.Item>
          <Row>
            <Col offset={6} span={14} style={{ ...buttonStyle, textAlign: 'center' }}>
              <Button className={`m-btn-radius m-btn-headColor ${disabled && 'm-btn-disable'}`} loading={loading} onClick={this.handleSubmit}  disabled={disabled} > 提交 </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(connect(({ global }) => ({
  dictionary: global.dictionary,
}))(SimpleSendMessage));
