import React from 'react';
import { connect } from 'dva';
import { Button, Input, message, Modal, Select } from 'antd';
import lodash from 'lodash';
import BasicModal from '../../../Common/BasicModal';
import Content from '../AdvanceFilter';
// import jsonData from '../JSON/json';
import translateStr from '../../../WorkPlatForm/MainPage/Customer/MyCustomer/translateStr';
import { FetchSearchSchemeDetail, FetchSaveSearchScheme } from '../../../../services/customerbase/mySearchScheme';
// import styles from './index.less';

class MoreCondition extends React.Component {
  constructor(props) {
    super(props);
    const { GroupArr = [], noGroupArr = [], labelArr = [], nolabelArr = [], valueArray = [], refmodel, currentKey = '0' } = props; // 平安特殊处理，支持传入currentKey，设置tab值
    if (refmodel) refmodel(this);
    this.state = {
      valueArray, // 传递出去的参数
      visible: false,
      famcVisible: false,
      currentKey,
      currentStep: 1,
      steps: [{ key: 1, indicators: [] }],
      famc: '',
      confirmLoading: false,
      labelArr,
      nolabelArr,
      GroupArr,
      noGroupArr,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { valueArray = [] } = nextProps;
    if (valueArray.length === 0) {
      this.setState({
        valueArray: [],
      });
    } else {
      this.setState({
        valueArray,
      });
    }
  }
  onChangeLabel= (labelArr, nolabelArr) => {
    this.setState({
      labelArr,
      nolabelArr,
    });
  }
  onChangeGroup= (GroupArr, noGroupArr) => {
    this.setState({
      GroupArr,
      noGroupArr,
    });
  }
    onClean=() => { // 清空条件
      this.setState({
        steps: [{ key: 1, indicators: [] }],
        labelArr: [],
        nolabelArr: [],
        GroupArr: [],
        noGroupArr: [],
      });
    }
    onDelet = async (fkey, subKey, type = '1') => { // 删除待选指标const keys = this.getMoreConditionID();
      const keys = this.getMoreConditionID();
      const { validateFieldsAndScroll } = this.props.form;
      await validateFieldsAndScroll(keys, (err, values) => {
        const tempSteps = [];
        let flagIndex = -1;
        let flagKey = '';
        let currentStepKey = 0;
        const { steps } = this.state;
        const currentStep = steps[fkey - 1];
        const { indicators = [] } = currentStep;
        // const constuctSteps = this.deFormatval(this.onDeleteConstuctData(steps, values));
        if (indicators.findIndex((indicator) => { return indicator.key === subKey.substring(subKey.indexOf('&&') + 2); }) >= 0) {
          flagKey = subKey;
          flagIndex = indicators.findIndex((indicator) => { return indicator.key === subKey.substring(subKey.indexOf('&&') + 2); });
          indicators.splice(indicators.findIndex((indicator) => { return indicator.key === subKey.substring(subKey.indexOf('&&') + 2); }), 1);
        }
        if (indicators.length === 0) {
          if (steps.length > 1) {
            // steps.splice(steps - 1, 1);
            steps.splice(fkey - 1, 1);
          }
        }
        steps.forEach((item, index) => {
          const temp = { ...item, key: index + 1 };
          tempSteps.push(temp);
          currentStepKey = index + 1;
        });
        if (type === '1') {
          this.setState({
            // steps: tempSteps,
            steps: this.deFormatval(this.onDeleteConstuctData(values, flagIndex, flagKey)),
            currentStep: currentStepKey,
          });
        } else {
          this.setState({
            steps: tempSteps,
          });
        }
      });
    }
    onDeleteConstuctData = (values, flagIndex, flagKey) => {
      const { advanceFilterJson } = this.props;
      const valueArray = [];// 高级筛选输出的条件
      this.state.steps.forEach((step) => {
        const { indicators, key } = step;
        const stepValues = []; // 单个步骤的值（单个步骤可以包括若干个‘或’条件）
        indicators.forEach((indicator, index) => {
          const valueForm = {}; // 单个查询条件的值
          const mainEncode = indicator.key.substring(indicator.key.indexOf('&&') + 2);
          const jsonindicator = advanceFilterJson[advanceFilterJson.findIndex((item) => { return item.code === mainEncode; })] || { more: {} };
          let { more: { strFormat } } = jsonindicator;
          const { extra = [] } = jsonindicator;
          if (strFormat) {
            if (index === 0) {
              strFormat = `(${strFormat}`;
            }
            if (index === indicators.length - 1) {
              strFormat = `${strFormat})`;
            }
          }
          extra.forEach((item) => {
            const { encode = '' } = item;
            let itemKey = `查询条件${key}&&${index}&&${mainEncode.split('.').join('=')}&&${encode.split('.').join('=')}`;
            if (flagKey !== '' && parseInt(flagKey.substring(0, flagKey.indexOf('&&')), 10) === key && flagIndex !== -1 && flagIndex <= index) {
              itemKey = `查询条件${key}&&${index + 1}&&${mainEncode.split('.').join('=')}&&${encode.split('.').join('=')}`;
            }
            valueForm[encode] = values[itemKey] || values[itemKey] === 0 ? values[itemKey] : '';
            if (Array.isArray(valueForm[encode])) {
              valueForm[encode] = valueForm[encode].join(',');
            }
            if (encode.indexOf('range') >= 0) {
              strFormat = strFormat.replace('range', values[itemKey] || values[itemKey] === 0 ? values[itemKey] : '');
            } else {
              strFormat = strFormat.replace(encode, this.translateStr(values[itemKey] || values[itemKey] === 0 ? values[itemKey] : '', encode, jsonindicator));
            }
          });
          valueForm.strFormat = strFormat;
          valueForm.code = mainEncode;
          stepValues.push(valueForm);
        });
        valueArray.push(stepValues);
      });
      return valueArray;
    }
    onIndicatorsClick=(key) => { // 新增‘或’条件
      const temp = this.state.steps;
      const currentStep = temp[parseInt(key, 10) - 1];
      const { indicators = [] } = currentStep;
      indicators.push({
        key: '-1',
        values: [],
      });
      currentStep.indicators = indicators;
      temp[parseInt(key, 10) - 1] = currentStep;
      this.setState({
        steps: temp,
        currentStep: key,
      });
    }
    onMenuClick = (encode, type) => { // 在左侧目录上 选择待指标 的点击事件
      // value 是指标的encode
      if (type === '2') { // 新增‘且’条件
        let temp = this.state.steps;
        if (this.state.steps.length === 1 && this.state.steps[0].indicators.length === 0) {
          temp = [{ key: 1, indicators: [{ key: `0&&${encode}`, values: {} }] }];
        } else {
          temp.push({ key: this.state.steps.length + 1, indicators: [{ key: `0&&${encode}`, values: {} }] });
        }
        this.setState({
          currentStep: this.state.steps.length,
          steps: temp,
        });
      } else { // 新增‘或’条件
        const temp = this.state.steps;
        const currentStep = temp[this.state.currentStep - 1];
        const { indicators = [] } = currentStep;
        indicators.push({
          key: `${indicators.length}&&${encode}`,
          values: [],
        });
        currentStep.indicators = indicators;
        temp[this.state.currentStep - 1] = currentStep;
        this.setState({
          steps: temp,
        });
      }
    }
    onPlanClick = async (value, famc) => { // 选择方案
      const falx = this.state.currentKey;
      const { userBusinessRole } = this.props;
      this.state.faid = value;
      this.setState({
        famc,
        faid: value,
      });
      await FetchSearchSchemeDetail({
        faid: value,
        falx,
        xtjs: userBusinessRole,
      }).then((response) => {
        const { records = [] } = response || {};
        let steps = [];
        let { cxyj = '' } = records[0];
        Promise.resolve().then(() => {
          cxyj = cxyj === '' ? '{}' : cxyj;
          cxyj = JSON.parse(cxyj);
          const { customerListSeniorAndQuickModel = {} } = cxyj;
          const {
            tagsConditionAnti: nolabelArr,
            tagsCondition: labelArr,
            peopleCondition: GroupArr,
            peopleConditionAnti: noGroupArr,
          } = customerListSeniorAndQuickModel;
          const templogicOrCondition = cxyj.logicOrCondition || customerListSeniorAndQuickModel.logicOrCondition || [];
          steps = templogicOrCondition.length > 0 ? this.deFormatval(templogicOrCondition) : [{ key: 1, indicators: [] }];
          // this.setState({
          //   steps: [{ key: 1, indicators: [] }],
          // });
          this.setState({
            steps,
            labelArr,
            nolabelArr,
            GroupArr,
            noGroupArr,
          });
        }).then().catch((error) => { return error; });
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
    // 获取高级筛选所有控件的id
    getMoreConditionID = () => {
      const ids = [];// 所有控件id;
      const { advanceFilterJson } = this.props;
      this.state.steps.forEach((step) => {
        const { key, indicators } = step;
        indicators.forEach((indicator) => {
          const { key: subKey } = indicator;
          const dataCode = subKey.substring(subKey.indexOf('&&') + 2);
          const tempadvanceFilterJson = advanceFilterJson[advanceFilterJson.findIndex((item) => { return item.code === dataCode; })] || {};
          const { extra = [] } = tempadvanceFilterJson; // 获取模板
          extra.forEach((item) => {
            const { encode = '' } = item;
            ids.push(`查询条件${key}&&${subKey.split('.').join('=')}&&${encode.split('.').join('=')}`);
          });
        });
      });
      return ids;
    }
    showModal = () => {
      if (this.state.valueArray.length > 0) {
        const steps = this.deFormatval(this.state.valueArray);
        if (steps.length === 0) {
          steps.push({ key: 1, indicators: [] });
        }
        this.setState({
          visible: true,
          // currentKey: '0',
          steps,
        });
      } else {
        this.setState({
          steps: [{ key: 1, indicators: [] }],
          visible: true,
          // currentKey: '0',
        });
      }
      const { GroupArr = [], noGroupArr = [], labelArr = [], nolabelArr = [] } = this.props;
      this.setState({
        labelArr: [...labelArr],
        nolabelArr: [...nolabelArr],
        GroupArr: [...GroupArr],
        noGroupArr: [...noGroupArr],
      });
    }
    deFormatval = (valueArray) => { // 根据模板 解析条件字符串
      const tempSteps = [];
      valueArray.forEach((step, index) => {
        const tempIndicators = [];
        step.forEach((indicator, i) => {
          tempIndicators.push({
            key: `${i}&&${indicator.code}`,
            values: indicator,
          });
        });
        tempSteps.push({
          key: index + 1,
          indicators: tempIndicators,
        });
      });
      return tempSteps;
    }
    formatVal = (values) => { // 根据模板 格式化输出查询条件 并 翻译查询条件
      const { advanceFilterJson } = this.props;
      const valueArray = [];// 高级筛选输出的条件
      this.state.steps.forEach((step) => {
        const { indicators, key } = step;
        const stepValues = []; // 单个步骤的值（单个步骤可以包括若干个‘或’条件）
        indicators.forEach((indicator, index) => {
          const valueForm = {}; // 单个查询条件的值
          const mainEncode = indicator.key.substring(indicator.key.indexOf('&&') + 2);
          const jsonindicator = advanceFilterJson[advanceFilterJson.findIndex((item) => { return item.code === mainEncode; })] || { more: {} };
          let { more: { strFormat } } = jsonindicator;
          const { extra = [] } = jsonindicator;
          if (strFormat) {
            if (index === 0) {
              strFormat = `(${strFormat}`;
            }
            if (index === indicators.length - 1) {
              strFormat = `${strFormat})`;
            }
          }
          extra.forEach((item) => {
            const { encode = '' } = item;
            const itemKey = `查询条件${key}&&${index}&&${mainEncode.split('.').join('=')}&&${encode.split('.').join('=')}`;
            valueForm[encode] = values[itemKey] || values[itemKey] === 0 ? values[itemKey] : '';
            if (Array.isArray(valueForm[encode])) {
              valueForm[encode] = valueForm[encode].join(',');
            }
            if (encode.indexOf('range') >= 0) {
              strFormat = strFormat.replace('range', values[itemKey] || values[itemKey] === 0 ? values[itemKey] : '');
            } else {
              strFormat = strFormat.replace(encode, this.translateStr(values[itemKey] || values[itemKey] === 0 ? values[itemKey] : '', encode, jsonindicator));
            }
          });
          valueForm.strFormat = strFormat;
          valueForm.code = mainEncode;
          stepValues.push(valueForm);
        });
        valueArray.push(stepValues);
      });
      return valueArray;
    }
    translateStr = (value = '', key, indicatorMB) => { // 根据字典将值翻译成中文
      const { dictionary, objectDictionary } = this.props;
      const { extra = [] } = indicatorMB;
      for (const item of extra) {
        const { tableName, encode } = item;
        if (encode === key) {
          let { data = [] } = item;
          if (data.length === 0) {
            data = dictionary[tableName] || [];
            if (data.length === 0) {
              data = objectDictionary[tableName] || [];
            }
          }
          if (data.length > 0) {
            const values = typeof value === 'string' ? value.split(',') : value;
            if (!Array.isArray(values)) {
              return values;
            }
            const valuesArray = [];
            values.forEach((temp) => {
              valuesArray.push(data.findIndex((tempData) => { return tempData.ibm === temp || tempData.value === temp; }) >= 0 ? data[data.findIndex((tempData) => { return tempData.ibm === temp || tempData.value === temp; })].note : temp);
            });
            return valuesArray.join(',');
          }
        }
      }
      return value;
    }

    handleOk = () => { // 点击确定按钮
      const keys = this.getMoreConditionID();
      const { validateFieldsAndScroll } = this.props.form;
      const { onChangeValue } = this.props;
      const { labelArr = [], nolabelArr = [], GroupArr = [], noGroupArr = [] } = this.state;
      validateFieldsAndScroll(keys, (err, values) => {
        if (this.state.steps[0].indicators.length <= 0) {
          this.setState({
            valueArray: [],
            visible: false,
          });
          const valueStr = this.changeArrayToStr([], labelArr, nolabelArr, GroupArr, noGroupArr); // 将高级查询的翻译也更新
          onChangeValue([], valueStr, [...labelArr], [...nolabelArr], [...GroupArr], [...noGroupArr] );
        } else if (!err) {
          const errArr = Object.keys(values).filter(item => item.indexOf('range') >= 0 && lodash.get(values, item, '') === '') || [];
          if (errArr.length === 0) {
            const valueArray = this.formatVal(values);
            this.setState({
              valueArray,
              visible: false,
            });
            const valueStr = this.changeArrayToStr(valueArray, labelArr, nolabelArr, GroupArr, noGroupArr); // 将高级查询的翻译也更新
            onChangeValue(valueArray, valueStr, [...labelArr], [...nolabelArr], [...GroupArr], [...noGroupArr]);
          } else {
            Modal.info({ content: '区间类条件至少输入一项！' });
          }
        } else {
          Modal.info({ content: '请输入查询条件配置必填项！' });
        }
      });
    }
    handleSave=() => { // 保存方案按钮
      const { validateFieldsAndScroll } = this.props.form;
      const { queryParameter } = this.props; // 获取外部参数
      const validkeys = this.getMoreConditionID();
      queryParameter.totalAssetsEnd = queryParameter.totalAssetsEnd === '' ? '' : queryParameter.totalAssetsEnd * 10000;
      queryParameter.totalAssetsStart = queryParameter.totalAssetsStart === '' ? '' : queryParameter.totalAssetsStart * 10000; // 总资产下限
      validateFieldsAndScroll(validkeys, (err, values) => {
        if (!err) {
          const errArr = Object.keys(values).filter(item => item.indexOf('range') >= 0 && lodash.get(values, item, '') === '') || [];
          if (errArr.length === 0) {
            const keys = Object.keys(values);
            const cxtj = []; // 查询条件的key
            keys.forEach((key) => {
              if (key.indexOf('查询条件') >= 0) {
                cxtj.push(key);
              }
            });
            // 高级保存方案只保存高级筛选的条件
            const valueArray = this.formatVal(values);
            const {
              labelArr = [],
              nolabelArr = [],
              GroupArr = [],
              noGroupArr = [],
            } = this.state;
            const newObj = {
              customerListBasicModel: {
              //   stockCode: queryParameter.stockCode, // 股票代码
              //   customerGroups: queryParameter.customerGroups, // 客户群代码
              //   customerGroupsTitles: queryParameter.customerGroupsTitles, // 客户群名称 保存历史
                customerQueryType: queryParameter.customerQueryType, // 查询类型
              //   customerTags: queryParameter.customerTags, // 标签
              //   customerTagTitles: queryParameter.customerTagTitles, // 标签名称
              //   financialProductCode: queryParameter.financialProductCode, // 持仓代码
              //   keyword: queryParameter.keyword ? `${queryParameter.lx ? queryParameter.lx : '0'}||${queryParameter.keyword}` : '',
              //   totalAssetsEnd: !isNaN(parseFloat(queryParameter.totalAssetsEnd)) ? queryParameter.totalAssetsEnd * 10000 : '',
              //   totalAssetsStart: isNaN(parseFloat(queryParameter.totalAssetsStart)) ? '' : queryParameter.totalAssetsStart * 10000, // 总资产下限
              //   departmentIds: queryParameter.departmentIds, // 部门id
              },
              customerListSeniorAndQuickModel: {
                // quickOrCondition: queryParameter.quickOrCondition,
                logicOrCondition: valueArray,
                tagsConditionAnti: nolabelArr,
                tagsCondition: labelArr,
                peopleCondition: GroupArr,
                peopleConditionAnti: noGroupArr,
              },
            };
            this.faStr = JSON.stringify(newObj);
            if (cxtj.length === 0) {
              this.chinaFastr = translateStr({ ...newObj.customerListBasicModel, logicOrCondition: valueArray, logicOrConditionStr: '---' });
            } else {
              const titleStrs = this.changeArrayToStr(valueArray, labelArr, nolabelArr, GroupArr, noGroupArr);
              this.chinaFastr = translateStr({ ...newObj.customerListBasicModel, logicOrCondition: valueArray, logicOrConditionStr: titleStrs });
            }
            this.setState({
              famcVisible: true,
            });
          } else {
            Modal.info({ content: '区间类条件至少输入一项！' });
          }
        } else {
          Modal.info({ content: '请输入查询条件配置必填项！' });
        }
      });
    }
    handleCancel = () => {
      // 取消按钮的操作
      this.setState({
        visible: false,
      });
    }

    handleTabsChange= (key) => {
      this.setState({
        currentKey: key,
        famc: '',
      });
    }
    handleClick=(key) => {
      this.setState({
        currentStep: key,
      });
    }
    handleFamcChange = (e) => {
      const { value } = e.target;
      this.setState({
        famc: value,
      });
    }
    saveTitle= async (czlx) => { // 保存方案按钮的点击事件
      const { displayColumns = [], queryParameter = {} } = this.props;
      const { customerQueryType = '1' } = queryParameter;
      const xszd = []; // 显示字段
      displayColumns.forEach((column) => {
        xszd.push(column.id);
      });
      const { famc } = this.state;
      if (!famc) {
        message.error('方案名称不能为空');
        return false;
      }
      if (famc.length > 15) {
        message.error('方案名称长度不能超过15个字');
        return false;
      }
      if (
          !lodash.get(JSON.parse(this.faStr), 'customerListSeniorAndQuickModel.logicOrCondition[0][0]', '')
          &&
          !lodash.get(JSON.parse(this.faStr), 'customerListSeniorAndQuickModel.tagsCondition[0][0]', '')
          &&
          !lodash.get(JSON.parse(this.faStr), 'customerListSeniorAndQuickModel.tagsConditionAnti[0][0]', '')
          &&
          !lodash.get(JSON.parse(this.faStr), 'customerListSeniorAndQuickModel.peopleCondition[0][0]', '')
          &&
          !lodash.get(JSON.parse(this.faStr), 'customerListSeniorAndQuickModel.peopleConditionAnti[0][0]', '')
         )
          { // 判断条件为空则提示 20200508修改,新增判断所有体系
            message.error('请添加条件');
            return false;
          }
      this.setState({
        confirmLoading: true,
      });
      await FetchSaveSearchScheme({
        famc: this.state.famc,
        cxyj: this.faStr,
        xszd: xszd.join(','),
        faid: this.state.faid,
        cxfy: this.chinaFastr,
        khfw: customerQueryType,
        czlx,
      }).then((response) => {
        const { code = -1, note = '' } = response;
        if (code > 0) {
          this.setState({
            currentKey: '2',
            famcVisible: false,
            confirmLoading: false,
            faid: code,
            // famc: '',
          });
          const { dispatch, userBusinessRole, onSaveScheme } = this.props;
          if (dispatch) {
            dispatch({
              type: 'myTags/fetchMyCommonSearch',
              payload: {
                xtjs: userBusinessRole || 1,
                khfw: customerQueryType,
              },
            });
          }
          // 外部保存后调用的方法
          if (onSaveScheme) {
            onSaveScheme();
          }
        } else {
          message.error(note);
          return false;
        }
      }).catch((error) => {
        this.setState({
          // currentKey: '2',
          confirmLoading: false,
        });
        message.error(!error.success ? error.message : error.note);
      });
    }
    changeArrayToStr = (valueArray, labelArr = [], nolabelArr = [], GroupArr = [], noGroupArr = []) => { // 将数组拼接成翻译后的字段
      const valueArrayStrs = [];
      valueArray.forEach((item) => {
        const values = Array.isArray(item) ? item : [];
        const valueStrs = [];
        values.forEach((value) => {
          const { strFormat = '' } = value;
          valueStrs.push(strFormat);
        });
        valueArrayStrs.push(valueStrs.join('或'));
      });
      let valueStr = valueArrayStrs.join(' 且 '); // 待选指标翻译结果
      const labelArrResult = this.changeArrayToStrByGroupOrLabel(labelArr);
      const nolabelArrResult = this.changeArrayToStrByGroupOrLabel(nolabelArr);
      const GroupArrResult = this.changeArrayToStrByGroupOrLabel(GroupArr);
      const noGroupArrResult = this.changeArrayToStrByGroupOrLabel(noGroupArr);
      const labelArrStr = labelArrResult.length > 0 ? (valueArrayStrs.length > 0 ? '且(' : '(') + labelArrResult.join('且') + ')' : '';
      const nolabelArrStr = nolabelArrResult.length > 0 ? '排除(' + nolabelArrResult.join('且') + ')' : '';
      const GroupArrStr = GroupArrResult.length > 0 ? '(' + GroupArrResult.join('且') + ')' : '';
      const noGroupArrStr = noGroupArrResult.length > 0 ? '排除(' + noGroupArrResult.join('且') + ')' : '';
      valueStr = valueStr + labelArrStr + nolabelArrStr + GroupArrStr + noGroupArrStr;
      return valueStr;
    }
    changeArrayToStrByGroupOrLabel = (array) => {
      const valueArrayStrs = [];
      array.forEach((item) => {
        const values = Array.isArray(item) ? item : [];
        const valueStrs = [];
        values.forEach((value) => {
          const { strFormat = '' } = value;
          valueStrs.push(strFormat);
        });
        valueArrayStrs.push(valueStrs.join('或'));
      });
      return valueArrayStrs; // 待选指标翻译结果
    }
    // 渲染已选条件
    renderIndicator = (valueArray = []) => {
      const { type = 'default' } = this.props;
      const {
        labelArr = [],
        nolabelArr = [],
        GroupArr = [],
        noGroupArr = [],
      } = this.state;
      if (valueArray.length !== 0 || labelArr.length > 0 || nolabelArr.length > 0 || GroupArr.length > 0 || noGroupArr.length > 0) {
        const valueStr = this.changeArrayToStr(valueArray, labelArr, nolabelArr, GroupArr, noGroupArr);
        return type === 'Input' ? valueStr : <p className="m-item-info blue" onClick={() => { this.showModal(); }}>{valueStr}</p>;
      }
      return type === 'Input' ? '点击选择更多条件' : <p className="m-item-info blue" onClick={() => { this.showModal(); }}>点击选择更多条件</p>;
    }

    // type为Select时返回children用于显示默认值
    getSelectChidren = () => {
      const children = [];
      const { valueArray = [] } = this.state;

      valueArray.forEach((item, index) => {
        let strFormatStr = '';
        item.forEach((element) => {
          const { strFormat = '' } = element;
          if (strFormatStr.length !== 0) {
            strFormatStr = strFormatStr.concat('或');
          }
          strFormatStr = strFormatStr.concat(strFormat);
        });
        strFormatStr = `规则${index + 1}: ${strFormatStr}`;
        children.push(<Select.Option key={JSON.stringify(item)} value={JSON.stringify(item)}>{strFormatStr}</Select.Option>);
      });
      return children;
    }

    // type为select时返回defaultValue
    getSelectDefaultValues = () => {
      const defaultValue = [];
      const { valueArray = [] } = this.state;
      valueArray.forEach((item) => {
        defaultValue.push(JSON.stringify(item));
      });
      return defaultValue;
    }

    // type为Select时delete操作
    handelSelectDelete = (DeleteValueStr) => {
      const { valueArray, labelArr = [], nolabelArr = [], GroupArr = [], noGroupArr = [] } = this.state;
      const newValueArray = [];
      for (const item of valueArray) {
        if (JSON.stringify(item) !== DeleteValueStr) {
          newValueArray.push(item);
        }
      }
      const valueStr = this.changeArrayToStr(newValueArray, labelArr, nolabelArr, GroupArr, noGroupArr); // 将高级查询的翻译也更新
      this.setState({ valueArray: newValueArray }, this.props.onChangeValue(newValueArray, valueStr, labelArr, nolabelArr, GroupArr, noGroupArr));
    }

    render() {
      const { labelArr = [], nolabelArr = [], GroupArr = [], noGroupArr = [] } = this.state;
      const { dispatch, form, userBusinessRole, dictionary, objectDictionary, queryParameter, type = 'default', mySearchSchemeService, searchSchemeDetailService, seniorMenuService } = this.props;
      return (
        <React.Fragment>
          {type === 'Input' && (
          <Input
            onClick={() => { this.showModal(); }}
            value={this.renderIndicator(this.state.valueArray)}
            placeholder="点击选择更多条件"
          />)}
          {type === 'Select' && (
          <Select
            mode="tags"
            onDropdownVisibleChange={() => { this.showModal(); }}
            dropdownStyle={{ display: 'none' }}
            defaultValue={this.getSelectDefaultValues()}
            value={this.getSelectDefaultValues()}
            onDeselect={this.handelSelectDelete}
            // placeholder="点击选择更多条件2"
            placeholder={<p style={{ textAlign: 'center' }} className="m-color">点击选择更多条件</p>}
          >
            {this.getSelectChidren()}
          </Select>)}
          {type === 'default' && (
          <div className="ant-card-body m-hight-search-body">
            <div className="m-list-item">
              <div className="m-list-title">已选条件</div>
              <ul className="m-list-cont">
                <li className="m-list-form m-form ant-form ">
                  <div className="m-list-select m-list-current">
                    <span className="ant-checkbox-wrapper ant-checkbox-wrapper-checked">
                      {this.renderIndicator(this.state.valueArray)}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>)}
          <BasicModal
            style={{
            top: '2rem',
          }}
            height="60rem"
            width="110rem"
            destroyOnClose
            title="高级筛选"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={
              <div>
                <button type="button" onClick={this.handleOk} className="m-btn-radius m-btn-headColor ant-btn"><span>确定</span></button>
                <button type="button" onClick={this.handleSave} className="m-btn-radius ant-btn"><span>保存方案</span></button>
                <button type="button" onClick={this.handleCancel} className="m-btn-radius ant-btn"><span>取消</span></button>
                <button type="button" onClick={this.onClean} className="m-btn-radius ant-btn m-btn-gray"><span>清空条件</span></button>
              </div>
        }
          >
            <Content
              labelArr={labelArr}
              nolabelArr={nolabelArr}
              onChangeLabel={this.onChangeLabel}
              GroupArr={GroupArr}
              noGroupArr={noGroupArr}
              onChangeGroup={this.onChangeGroup}
              faid={this.state.faid}
              onIndicatorsClick={this.onIndicatorsClick}
              queryParameter={queryParameter}
              userBusinessRole={userBusinessRole}
              objectDictionary={objectDictionary}
              onPlanClick={this.onPlanClick}
              addStep={this.addStep}
              steps={this.state.steps}
              onDelet={this.onDelet}
              currentStep={this.state.currentStep}
              handleClick={this.handleClick}
              onMenuClick={this.onMenuClick}
              currentKey={this.state.currentKey}
              handleTabsChange={this.handleTabsChange}
              dictionary={dictionary}
              authorities={this.props.authorities}
              userBasicInfo={this.props.userBasicInfo}
              form={form}
              dispatch={dispatch}
              mySearchSchemeService={mySearchSchemeService}
              searchSchemeDetailService={searchSchemeDetailService}
              seniorMenuService={seniorMenuService}
              onSaveScheme={this.props.onSaveScheme}
            />
          </BasicModal>
          <BasicModal
            title="填写方案名称"
            visible={this.state.famcVisible}
            onCancel={() => { this.setState({ famcVisible: false }); }}
            footer={[
              <Button key="back" onClick={() => { this.setState({ famcVisible: false }); }}>取消</Button>,
              <Button key="submit1" style={{ display: this.state.faid && this.state.currentKey === '2' ? '' : 'none' }} type="primary" loading={this.state.confirmLoading} onClick={() => this.saveTitle(2)}>
            修改方案
              </Button>,
              <Button key="submit2" type="primary" loading={this.state.confirmLoading} onClick={() => this.saveTitle(1)}>
            新增方案
              </Button>,
        ]}
          >
            <span style={{ marginLeft: '1rem' }} >方案名称：</span>
            <Input style={{ marginTop: '1rem', marginBottom: '1rem', width: '60%' }} className="m-input" onChange={(e) => { this.handleFamcChange(e); }} value={this.state.famc} />
          </BasicModal>
        </React.Fragment>
      );
    }
}

export default connect(({ myCustomer, global }) => ({
  advanceFilterJson: myCustomer.advanceFilterJson,
  objectDictionary: myCustomer.objectDictionary,
  dictionary: global.dictionary,
  authorities: global.authorities,
  userBasicInfo: global.userBasicInfo,
}))(MoreCondition);

