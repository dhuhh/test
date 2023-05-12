import React from 'react';
import { Popover, Card, List, message } from 'antd';
import CardContent from './CardContent';
import { CloseOutlined } from '@ant-design/icons';
import { FetchSearchProviceCity } from '../../../../../../services/incidentialServices';
// 省市选择组件
class PopoverAndCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 手机所属地控件显示, 初进页面时为false
      titleShow: '城市中文名称或者首字母', // 提示文字显示
      tabList: [], // 标签页数组
      key: '1', //标签页，默认第一页
      contentList: {}, //标签页内容
      zmlist: [],
      data: [],
    };
  }

  componentWillReceiveProps(props) {

  }

    fetchTitle = (gjz) => {
      if (gjz !== '') {
        this.setState({ titleShow: '如需缩小范围，请输入更多条件。', tabList: [] });
        this.fetchGjzContent(gjz);
        this.handleVisibleChange(true);
      } else {
        this.setState({ titleShow: '城市中文名称或者首字母' });
        this.fetchTab(this.props.sjsdType);
        if (this.state.key === '1') {
          this.setState({ data: [] }, () => { this.fetchContent(this.props.sjsdType); });
        } else {
          this.setState({ data: [] }, () => { this.fetchLetterContent(this.state.key); });
        }

      }
    }

    fetchTab = (sjsdType) => {
      const zmlist = [{ key: 'ABCD', tab: 'ABCD' }, { key: 'EFGH', tab: 'EFGH' }, { key: 'IJKLM', tab: 'IJKLM' },
        { key: 'NOPRS', tab: 'NOPRS' }, { key: 'TUVWX', tab: 'TUVWX' }, { key: 'YZ', tab: 'YZ' }];
      let tabList = [];
      if (sjsdType === '1') {
        tabList = [
          { key: '1', tab: '热门' },
          ...zmlist,
        ];
      } else {
        tabList = [
          { key: '1', tab: '所有省份' },
          ...zmlist,
        ];
      }
      this.setState({ tabList, zmlist });
    }

    fetchContent = (sjsdType) => {
      const { contentList } = this.state;
      const params = {
        qrySrc: sjsdType === '1' ? '2' : '1', // 1|省份；2|城市
        keyWord: '', // 关键字
        seleItem: '', // 选择项
      };
      FetchSearchProviceCity({
        ...params,
      }).then((ret = {}) => {
        const { records = [], code = 0 } = ret || {};
        if (code > 0) {
          const content1 = <CardContent data={records} setData={this.props.setData} onClose={this.handleVisibleChange}></CardContent>;
          const dataList = {
            ...contentList,
            '1': content1,
          };
          this.setState({ contentList: dataList });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    fetchLetterContent = (key) => {
      const { data } = this.state;
      if (data.length > 0) {
        this.setLetterContent(key);
      } else {
        const params = {
          qrySrc: this.props.sjsdType === '1' ? '2' : '1', // 1|省份；2|城市
          keyWord: '', // 关键字
          seleItem: key, // 选择项
        };
        FetchSearchProviceCity({
          ...params,
        }).then((ret = {}) => {
          const { records = [], code = 0 } = ret || {};
          if (code > 0) {
            this.setState({ data: records }, () => { this.setLetterContent(key); });
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      }
    }

    setLetterContent = (key) => {
      const { data, contentList } = this.state;
      const Data = [];
      for (let i = 0; i < key.length; i++) {
        const szm = key.substr(i, 1);
        const szmData = data.filter(item => item.note === szm);
        Data.push({ szm, data: szmData });
      }
      const content = Data.map((i) => {
        return <CardContent sequence={i.szm} data={i.data} setData={this.props.setData} onClose={this.handleVisibleChange}></CardContent>;
      });
      const dataList = {
        ...contentList,
        'ABCD': key === 'ABCD' ? content : '',
        'EFGH': key === 'EFGH' ? content : '',
        'IJKLM': key === 'IJKLM' ? content : '',
        'NOPRS': key === 'NOPRS' ? content : '',
        'TUVWX': key === 'TUVWX' ? content : '',
        'YZ': key === 'YZ' ? content : '',
      };
      this.setState({ contentList: dataList });
    }

    fetchGjzContent = (gjz) => {
      const { contentList } = this.state;
      const params = {
        qrySrc: this.props.sjsdType === '1' ? '2' : '1', // 1|省份；2|城市
        keyWord: gjz, // 关键字
        seleItem: '', // 选择项
      };
      FetchSearchProviceCity({
        ...params,
      }).then((ret = {}) => {
        const { records = [], code = 0 } = ret || {};
        if (code > 0) {
          let content1 = '';
          const reg = /^[A-Z]+$/;
          const szm = reg.test(gjz);
          if (szm) {
            const data = [
              { szm: gjz, data: records },
            ];
            content1 = data.map((i) => {
              return <CardContent sequence={i.szm} data={i.data} setData={this.props.setData} onClose={this.handleVisibleChange}></CardContent>;
            });
          } else {
            const cityData = [];
            records.forEach((item) => {
              cityData.push({
                ...item,
                type: this.props.sjsdType === '1' ? '城市' : '省份', // 1|省份；2|城市
              });
            });
            content1 = (
              <List
                itemLayout="vertical"
                dataSource={cityData}
                className="m-bss-card-list"
                size='small'
                split={false}
                renderItem={item => (
                  <List.Item
                    extra={item.type}
                    onClick={() => this.onClick(item)}
                  >
                    {item.cityPro}
                  </List.Item>
                )}
              />
            );
          }
          const dataList = {
            ...contentList,
            '1': content1,
          };
          this.setState({ contentList: dataList });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    onClick = (item) => {
      this.handleVisibleChange(false);
      this.props.setData('sjsd', item.cityPro);
      this.props.setData('sjsdId', item.id);
    }

    handleVisibleChange = (visible) => {
      this.setState({ visible, key: '1' });
    };

    onTabChange = (key, type) => {
      console.log(key)
      this.setState({ [type]: key });
      if (key === '1') {
        this.fetchContent(this.props.sjsdType);
      } else {
        this.fetchLetterContent(key);
      }
    };

    render() {
      const { visible, titleShow, key, tabList, contentList } = this.state;
      const title = (
        <div style={{ color: '#959CBA' }}>{titleShow}</div>
      );
      const content = (
        <Card
          className='m-card-popover'
          title={title}
          tabList={tabList}
          activeTabKey={key}
          onTabChange={key => { this.onTabChange(key, 'key'); }}
          extra={<CloseOutlined onClick={() => this.handleVisibleChange(false)} />}
        >
          {contentList[key]}
        </Card>
      );
      return (
        <Popover
          content={content}
          visible={visible}
          placement="bottom"
          trigger='click'
          onVisibleChange={this.handleVisibleChange}
        >
          {this.props.children}
        </Popover>
      );
    }
}
export default PopoverAndCard;
