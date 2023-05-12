import React from 'react';
import { Row, Col, Input, message } from 'antd';
import { getCusLabelClassification } from '../../../../../services/customerbase/cusLabelClassification';
import FirstLevelLabel from './FirstLevelLabel';

class SystemLabel extends React.Component {
  state = {
    allLabelData: [],
    firstLevelDatas: {},
    secondLevelDatas: {},
    thirdLevelDatas: {},
    searchText: '',
  }
  componentDidMount() {
    this.fetchData();
  }
  handleLevelDatas = (records) => {
    this.handleFirstLevel(records);
  }
  handleFirstLevel = (records) => {
    const handler = this.handleObjData(records, 'fxlx', 'fxlxmc', 0, 1);
    const { object: tmplObj, data: tmplData } = handler;
    const objVals = Object.values(tmplObj) || [];
    this.setState({
      firstLevelDatas: {
        records: objVals,
        datas: tmplData,
      },
    });
    this.handleSecondLevel(tmplData);
  }
  handleSecondLevel = (datas) => {
    const objKeys = Object.keys(datas);
    let secondLevelArr = [];
    let secondLevelObj = {};
    objKeys.forEach((key) => {
      const records = datas[key] || [];
      const handler = this.handleObjData(records, 'bqlx', 'bqmc', key, 2);
      const { object: tmplObj, data: tmplData } = handler;
      const objVals = Object.values(tmplObj) || [];
      secondLevelArr = secondLevelArr.concat(objVals);
      secondLevelObj = { ...secondLevelObj, ...tmplData };
    });
    this.setState({
      secondLevelDatas: {
        records: secondLevelArr,
        datas: secondLevelObj,
      },
    });
    this.handleThirdLevel(secondLevelObj);
  }
  handleThirdLevel = (datas) => {
    const objKeys = Object.keys(datas);
    let thirdLevelArr = [];
    let thirdLevelObj = {};
    objKeys.forEach((key) => {
      const records = datas[key] || [];
      const tmplObj = {};
      const tmplData = {};
      records.forEach(((item) => {
        const { bqzid, bqzmc } = item;
        if (!tmplObj[bqzid]) {
          tmplObj[bqzid] = [];
          tmplData[bqzid] = [];
        }
        tmplObj[bqzid].push({
          id: bqzid,
          name: bqzmc,
          pid: key,
          level: 3,
        });
        tmplData[bqzid].push(item);
      }));
      const objVals = Object.values(tmplObj) || [];
      thirdLevelArr = thirdLevelArr.concat(objVals);
      thirdLevelObj = { ...thirdLevelObj, ...tmplData };
    });
    this.setState({
      thirdLevelDatas: {
        records: thirdLevelArr,
        datas: thirdLevelObj,
      },
    });
  }
  handleObjData = (records, idmc, namemc, pid, level) => {
    const tmplObj = {};
    const tmplData = {};
    records.forEach(((item) => {
      if (!tmplObj[item[idmc]]) {
        tmplObj[item[idmc]] = {
          id: item[idmc],
          name: item[namemc],
          pid,
          level,
        };
        tmplData[item[idmc]] = [];
      }
      tmplData[item[idmc]].push(item);
    }));
    return { object: tmplObj, data: tmplData };
  }
  fetchData = () => {
    getCusLabelClassification({
      fxlx: '',
      bqlx: '',
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        this.setState({
          allLabelData: records,
        });
        this.handleLevelDatas(records);
        // this.leafDatas(records);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // leafDatas = (records = []) => {
  //   const leaf = new Map();
  //   let result = new Map();
  //   records.forEach((item) => {
  //     leaf.set(item.fxlx, { fxlx: item.fxlx, fxlxmc: item.fxlxmc });
  //   });
  //   result = this.constuctsFirstLeaf(leaf, records);
  //   console.info(result, 11);
  // }
  // constuctsFirstLeaf = (parentLeaf, records) => {
  //   const tempResult = new Map();
  //   Object.keys(parentLeaf).forEach((key) => {
  //     records.forEach((data) => {
  //       if (data.fxlx === key) {
  //         tempResult.set(key, {
  //           ...parentLeaf.get(key),
  //           secondLeaf: [
  //             ...tempResult.get(key).secondLeaf || [], { bqlx: data.bqlx, bqmc: data.bqmc },
  //           ],
  //         });
  //       }
  //     });
  //   });
  //   return tempResult;
  // }
  searchChange = (e) => {
    const { value } = e.target;
    this.setState({
      searchText: value,
    });
    const { allLabelData } = this.state;
    if (!value || value === '') {
      this.handleFirstLevel(allLabelData);
      return;
    }
    const results = [];
    allLabelData.forEach((item) => {
      const { bqzmc = '', bqmc = '', fxlxmc = '' } = item || {};
      if (bqzmc.indexOf(value) >= 0 || bqmc.indexOf(value) >= 0 || fxlxmc.indexOf(value) >= 0) {
        results.push(item);
      }
    });
    this.handleFirstLevel(results);
  }
  render() {
    const { selectedLable = [], handleTagSelect } = this.props;
    const { firstLevelDatas, secondLevelDatas, thirdLevelDatas, searchText } = this.state;
    return (
      <Row className="m-row-tag" style={{ background: '#fff', padding: '0', height: '30rem' }}>
        <Col sm={24} lg={8}>
          <Input
            placeholder="请输入关键字"
            className="m-input-search-form"
            onChange={this.searchChange}
            style={{ width: '30rem', marginLeft: '2rem', marginTop: '2rem' }}
          />
        </Col>
        <Col sm={24}>
          <FirstLevelLabel searchText={searchText} selectedLable={selectedLable} handleTagSelect={handleTagSelect} firstLevelDatas={firstLevelDatas} secondLevelDatas={secondLevelDatas} thirdLevelDatas={thirdLevelDatas} />
        </Col>
      </Row>
    );
  }
}

export default SystemLabel;
