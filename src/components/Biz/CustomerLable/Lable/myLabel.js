import React from 'react';
import { Row, Col, Input, Tag, Spin, Modal, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { FetchMyCusLable } from '../../../../services/customerbase/customerListHandle';
import { fetchManagingMyLable } from '../../../../services/customerbase/managingMyLable';
import { FetchManagingMyLable } from '../../../../services/customerbase';

// const { Search } = Input;

class MyLable extends React.Component {
  state={
    addTag: false,
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
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handelInputChange=(e) => {
    const { value } = e.target;
    this.setState({
      myTagText: value,
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
    const { addLabel } = this.props;
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
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
        // 新增标签加入已选
        if (addLabel) {
          const bq = JSON.parse(note);
          addLabel(bq);
        }
      } else {
        Modal.info({ content: note });
        this.setState({
          disabled: false,
        });
      }
    }).catch((error) => {
      this.setState({
        disabled: false,
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
  delTag = (e, bqid, bqmc) => {
    // const { handleClear } = this.props;
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const _this = this;
    Modal.confirm({
      title: '删除标签',
      content: <p>确定要删除标签【{bqmc}】吗</p>,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        return FetchManagingMyLable({ bqid, czlx: 2 }).then((response) => {
          const { code = -1, note = '' } = response;
          if (code > 0) {
            // 刷新我的标签
            FetchMyCusLable({
              paging: 1,
              current: 1,
              pageSize: 10000,
              total: -1,
              sort: '',
              bqlx: 1,
            }).then((responseData) => {
              const { records = [] } = responseData;
              _this.setState({
                myCusLable: records,
                disabled: false,
                addTag: false,
                myTagText: '',
              });
            }).catch((error) => {
              message.error(!error.success ? error.message : error.note);
            });
            // if (handleClear) {
            //   handleClear();
            // }
            // if (handleSearch) {
            //   handleSearch();
            // }
          } else {
            message.error(note);
          }
        }).catch((error) => {
          _this.setState({
            disabled: false,
          });
          message.error(!error.success ? error.message : error.note);
        });
      },
      onCancel() { },
    });
  }
  render() {
    const { selectedLable = [], handleTagSelect } = this.props;
    return (
      <div>
        <Row className="m-row-tag" style={{ background: '#fff' }}>
          <Col sm={24} lg={8}>
            <Input
              placeholder="请输入标签名"
              className="m-input-search-form"
              onChange={this.searchChange}
              // onSearch={value => this.handelSearch(value)}
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
                        <span className="">{bqmc}</span>
                        <i className="iconfont icon-close-small" style={{ color: '#484747', display: !selectedLable.includes(bqid) ? 'inline-block' : 'none' }} onClick={e => this.delTag(e, bqid, bqmc)} />
                      </span>
                    </Tag.CheckableTag>
                  );
                })
              }
              <div
                className="m-tag-popup m-tag-add ant-tag"
                title="新建标签"
                style={{ display: this.state.addTag ? 'none' : '' }}
                onClick={() => {
                  this.setState({
                    addTag: true,
                  });
                }}
              >
                <span className="ant-tag-text">
                  <i className="iconfont icon-add" />
                </span>
              </div>
              <div className="m-tag-popup m-tag-add-input ant-tag" style={{ display: this.state.addTag ? 'inline-block' : 'none' }}>
                <span className="ant-tag-text">
                  <input placeholder="请输入新标签名" value={this.state.myTagText} onChange={this.handelInputChange} type="text" />
                </span>
                {this.state.disabled ? <Spin className="m-tag-add-input-right" /> : <div className="m-tag-add-input-right" onClick={this.creatTage}>新建标签</div> }
              </div>
            </Col>
          </Scrollbars>
        </Row>
      </div>
    );
  }
}
export default MyLable;
