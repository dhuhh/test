import React from 'react';
import lodash from 'lodash';
import { Row, Col } from 'antd';
import styles from './index.less';

class SettingContent extends React.Component {
  state={
    themesData: [
      {
        title: 'header白色主题',
        darkSideTheme: [
          {
            key: 'default-dark-theme',
            title: '中国红',
          },
          {
            key: 'blue-lightgray-theme',
            title: '灰蓝',
          },
          {
            key: 'blue-dark-theme',
            title: '晴空蓝',
          },
          {
            key: 'blue-distant-theme',
            title: '远山蓝',
          },
          {
            key: 'blue-change-theme',
            title: '金色',
          },
        ],
      },
    ],
  }

  handleThemeClick = (e, key) => {
    const { theme } = this.props;
    if (theme !== key) {
      // 改变当前的选中效果
      if (this.props.handleThemeChange) {
        this.props.handleThemeChange(key);
      }
    }
    e.preventDefault();// 阻止链接跳转行为
  }

  render() {
    const { themesData } = this.state;
    const { theme } = this.props;
    return (
      <div>
        <div className={`${styles.m_side} m-right-sidebar m-shw-rside`} style={{ width: '100%' }}>
          <div className="m-r-panel-body" style={{ width: '100%' }}>
            {
              themesData.map((keys, index) => {
                const listData = lodash.get(keys, 'darkSideTheme', []);
                return (
                  <Row key={index} style={{ margin: '0.866rem' }}>
                    <Col span={6} style={{ padding: '.866rem 2.866rem', textAlign: 'right' }}><span>{keys.title}</span></Col>
                    <Col span={18}>
                      <ul>
                        {
                          listData.map(item => (
                            <li key={item.key}>
                              <a href="#" className={`${item.key} ${item.key === theme ? 'working' : ''}`} onClick={e => this.handleThemeClick(e, item.key)}>{item.title}</a>
                              <p className="m-theme-name">{`${item.title}`}</p>
                            </li>
                          ))
                        }
                      </ul>
                    </Col>
                  </Row>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default SettingContent;
