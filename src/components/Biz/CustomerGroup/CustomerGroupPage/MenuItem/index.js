import React from 'react';
import { Popconfirm, Input, message } from 'antd';
import { funcManagingCusGroup } from '../../../../../services/customerbase/managingCusGroup';
import styles from './index.less';

class MenuItem extends React.Component {
  constructor(props) {
    super();
    this.state = {
      khqmc: props.khqmc,
      isEdit: false,
    };
  }
  // 点击修改
  onEditClick = () => {
    this.setState({ isEdit: true });
  }
  handleEditSubmit = (e, khqid) => {
    const { khqlx } = this.props;
    const khqmc = e.target.value.trim();
    if (!khqmc) {
      this.setState({ isEdit: false });
      return;
    }
    this.managingCusGroup({
      czlx: 2,
      khqlx,
      khqmc,
      khqid,
    });
    this.setState({ isEdit: false });
  }
  // 创建/修改/删除客户群
  managingCusGroup = (params) => {
    funcManagingCusGroup(params).then((result) => {
      const { note = '修改成功!' } = result;
      message.success(note);
      this.setState({ khqmc: params.khqmc });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  render() {
    const { isEdit, khqmc } = this.state;
    const { khqid = '', canEdit = false, canDel = false, onDelClick } = this.props;
    return (
      <a href="#" onClick={(e) => { e.preventDefault(); }} title={khqmc}>
        {isEdit ? <Input style={{ width: '8rem' }} placeholder={khqmc} maxLength="20" onBlur={e => this.handleEditSubmit(e, khqid)} /> : <span className={styles.overflow}>{khqmc}</span>}
        {
          (canEdit || canDel) && (
            <span className="action " onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              { canEdit && <i className="iconfont icon-editLine1 orange" title="修改" onClick={() => this.onEditClick()} /> }
              { canDel && (
                <Popconfirm
                  title={`是否确认删除客户群【${khqmc}】？`}
                  onConfirm={e => onDelClick(e, khqid)}
                >
                  <i className="iconfont icon-del pink" title="删除" />
                </Popconfirm>
              ) }
            </span>
          )
        }
      </a>
    );
  }
}

export default MenuItem;
