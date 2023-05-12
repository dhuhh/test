import React from 'react';
import { Row, Col, Input, Tag, Spin, Modal, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { FetchMyCusLable } from '../../../../services/customerbase/customerListHandle';
import { fetchManagingMyLable } from '../../../../services/customerbase/managingMyLable';
import styles from './myLabel.less';

// const { Search } = Input;

class MyLable extends React.Component {
  state={
    // addTag: false,
    addTag: true, // 标签查询页面不需要新增标签功能 20190415
    myTagText: '',
    searchText: '',
    disabled: false,
    myCusLable: [],
  }
  componentDidMount() {
    FetchMyCusLable({
      paging: 1,
      current: 1,
      pageSize: 10000,
      total: -1,
      sort: '',
      bqlx: 1,
    }).then((response) => {
      const { records = [] } = response;
      this.setState({
        myCusLable: records,
      });
    });
  }
  handelInputChange=(e) => {
    const { value } = e.target;
    this.setState({
      myTagText: value.trim(),
    });
  }
  creatTage = () => {
    if (!this.state.myTagText) {
      message.error('标签名不能为空！');
      return;
    }
    const length = this.state.myTagText.replace(/[^\u0000-\u00ff]/g, 'aa').length;// eslint-disable-line
    if (length > 30) {
      message.error('标签名长度超限！');
      return;
    }
    this.setState({
      addTag: true,
      disabled: true,
    });
    fetchManagingMyLable({ bqmc: this.state.myTagText, czlx: 1 }).then((response) => {
      const { code = -1, note = '' } = response;
      if (code > 0 && code !== 2) {
        FetchMyCusLable({
          paging: 1,
          current: 1,
          pageSize: 10000,
          total: -1,
          sort: '',
          bqlx: 1,
        }).then((responseData) => {
          const { records = [] } = responseData;
          this.setState({
            myCusLable: records,
            disabled: false,
            addTag: false,
            myTagText: '',
          });
        });
      } else {
        Modal.info({ content: note });
        this.setState({
          disabled: false,
        });
      }
    }).catch((error) => {
      this.setState({
        disabled: false,
        myTagText: '',
      });
      message.error(!error.success ? error.message : error.note);
    });
  }
  // handelSearch = (value) => {
  //   this.setState({
  //     searchText: value,
  //   });
  // }
  searchChange =(e) => {
    const { value } = e.target;
    this.setState({
      searchText: value,
    });
  }
  render() {
    const { selectedLable = [], handleTagSelect } = this.props;
    return (
      <div>
        <Row className="m-row-tag" style={{ background: '#fff', height: '30rem' }}>
          <Col sm={24} lg={8}>
            <Input
              placeholder="请输入关键字"
              className="m-input-search-form"
              onChange={this.searchChange}
              style={{ width: '30rem', marginBottom: '1.333rem' }}
            />
          </Col>
          <Scrollbars autoHide style={{ width: '100%', height: '20rem' }} >
            <Col sm={24}>
              {
                this.state.myCusLable.map((item) => {
                  const { bqid, bqmc } = item;
                  let tempClassName = `${selectedLable.includes(bqid) ? 'm-tag-popup m-tag-blue' : 'm-tag-popup'}`;
                  if (this.state.searchText && bqmc.indexOf(this.state.searchText) >= 0) {
                    tempClassName = `${tempClassName} m-tag-orange`;
                  }
                  return (
                    <Tag.CheckableTag
                      className={tempClassName}
                      key={bqid}
                      title={bqmc}
                      checked={selectedLable.includes(bqid)}
                      onChange={checked => handleTagSelect(checked, bqid, bqmc)}
                    >
                      <span className="ant-tag-text">
                        <span className={styles.overflow}>{bqmc}</span>
                      </span>
                    </Tag.CheckableTag>
                  );
                })
              }
              <div
                className="m-tag-popup m-tag-add ant-tag"
                style={{ display: this.state.addTag ? 'none' : '' }}
                onClick={() => this.setState({
                addTag: true,
              })}
              >
                <span className="ant-tag-text">
                  <i className="iconfont icon-add" />
                </span>
              </div>
              <div className="m-tag-popup m-tag-add-input ant-tag" style={{ display: this.state.addTag ? 'none' : 'inline-block' }}>
                <span className="ant-tag-text">
                  <input value={this.state.myTagText} onChange={this.handelInputChange} type="text" />
                </span>
                { this.state.disabled ? <Spin className="m-tag-add-input-right" /> : <div className="m-tag-add-input-right" onClick={this.creatTage}>贴上</div> }
              </div>
            </Col>
          </Scrollbars>
        </Row>
      </div>
    );
  }
}
export default MyLable;
