import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { DecryptBase64 } from '../../../../../../components/Common/Encrypt';
import NewPositionSearchComponent from '../../../../../../components/WorkPlatForm/MainPage/Customer/NewCustomerAggregated/PositionSearch';

class NewPositionSearch extends React.Component {
      getParams = (str) => {
        if (str === 'workplateform') {
          return '3';
        }
        let params = null;
        try {
          // 把base64格式的变成字符串
          const parseStr = DecryptBase64(str);
          // 字符串转JSON格式
          params = JSON.parse(parseStr);
        } catch (error) {
          message.error('未知错误,无法查看客户汇总信息');
        }
        return params;
      }
      render() {
        const { dispatch, dictionary, authorities, match: { params: { queryParams = '' } } } = this.props;
        let tempType = '';
        let tempParams = {};
        if (queryParams !== '') {
          const params = this.getParams(queryParams);
          if (params) {
            tempParams = params;
            const { queryParameter = {} } = params;
            const { customerQueryType = '' } = queryParameter;
            if (`${customerQueryType}` === '1' || `${customerQueryType}` === '2') {
              tempType = '1';
            } else if (`${customerQueryType}` === '3') {
              tempType = '2';
            } else {
              tempType = '3';
            }
          }
        } else {
          tempType = '1';
        }
        return (
          <NewPositionSearchComponent isSkip={queryParams !== 'workplateform'} type={tempType} dispatch={dispatch} params={tempParams} dictionary={dictionary} authorities={authorities} />
        );
      }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
  dictionary: global.dictionary,
}))(NewPositionSearch);
