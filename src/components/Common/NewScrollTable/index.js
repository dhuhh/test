import { Affix, Table } from 'antd';
import React, { Component } from 'react';
// import renderTable from './data';
import styles from './index.less';

let scrollBar = null; // 表格滑动条
let fisTable = null; // 隐藏表头滚动条
let bottomScroll = null; // 底部滚动条
let scrollLength = null; // 底部滚动条长度
export default class index extends Component {
    state={
      isHide: true,
    }

    componentDidMount(){
      const scrollBarArr = document.getElementsByClassName('ant-table-body');
      if (scrollBarArr.length > 1) {
        scrollBar = scrollBarArr[scrollBarArr.length - 1];
        scrollBar.addEventListener('scroll', this.tableScroll1);
      }
      fisTable = document.getElementsByClassName('ant-table-body')[0];
      scrollLength = fisTable.length;
      bottomScroll = document.getElementById('bottomScroll');
      bottomScroll.addEventListener('scroll', this.tableScroll2);
    }
    tableScroll1 = () => {
      if (scrollBar && fisTable && bottomScroll) {
        fisTable.scrollLeft = scrollBar.scrollLeft;
        bottomScroll.scrollLeft = scrollBar.scrollLeft;
      }
    }

    tableScroll2 = () => {
      if(bottomScroll && scrollBar && fisTable){
        fisTable.scrollLeft = bottomScroll.scrollLeft;
        scrollBar.scrollLeft = bottomScroll.scrollLeft;
      }
    }

    contentScroll = (affixed) => {
      // console.info('affixed:', affixed);
      if (!affixed) {
        this.setState({ isHide: true });
      } else if (affixed) {
        this.setState({ isHide: false });
      }
    }
    render() {
      const { columns, dataSource = [], pagination, className, onChange, loading = false, bordered = false } = this.props;
      const fisTableLength = document.getElementsByClassName('ant-table-fixed')[0] || {};
      if(fisTableLength){
        scrollLength = fisTableLength.clientWidth; // 65为card的内边距和竖向滚动条宽度之和
      }
      const tableProps = {
        bordered,
        columns,
        dataSource,
        className,
        onChange,
        loading,
        pagination: {
          ...pagination,
        },
        scroll: { x: 'max-content' },
      };
      return (
        <React.Fragment>
          <Affix offsetTop={0}>
            <div className={styles['m-table']}>
              <Table 
                columns={columns}
                dataSource={dataSource.length > 0 ? [dataSource[0]] : []}
                pagination={false}
                scroll={{ x: 'max-content' }}
                className={className}
                // getPopupContainer={() => document.getElementById('scrollTable')}
              />
            </div>
          </Affix>
          <div style={{ zIndex: 1, transform: 'translateY(-60px)' }}> {/** 此处的60为表格头部的height */}
            <Table 
              {...tableProps}
              // getPopupContainer={() => document.getElementById('scrollTable')}
            />
          </div>
          {<Affix style={{ position: 'absolute', bottom: '100px', visibility: this.state.isHide ? "hidden" : '' }} offsetBottom={0} onChange={this.contentScroll}>
            <div id="bottomScroll" style={{ overflow: 'auto', width: 'calc(100vw - 65px)' }}>
              <div style={{ width: scrollLength, height: '2rem' }} />
            </div>
          </Affix>}
        </React.Fragment>
      );
    }
}
