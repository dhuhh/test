/* eslint-disable space-before-blocks */
/* eslint-disable no-restricted-properties */
/* eslint-disable indent */
/**
* @Author: zhaoflin
* @Date: 2021-03-12
* @Last Modified by: zhaoflin
* @Last Modified time: 2021-03-12
* @description 此处存放针对数字的通用处理方法
*/
import _ from 'lodash';
import { thousandInteger, thousandDecimal } from './regexp';
// 百
const HUNDRED = 100;
// 千
const THOUSAND = 1000;
// 万
const WAN = 10000;
// 百万
const MILLION = 1000000;
// 千万
const TEN_MILLION = 10000000;
// 亿
const YI = 100000000;
// 十亿
const BILLION = 100000000;
// 千亿
const TEN_BILLION = 100000000000;
// 万亿
const TRILLION = 1000000000000;
// 百分号
const PERCENT = '%';
// 千分号
const PERMILLAGE = '\u2030';
// 单位与值的对应
const unitToValue = [
    {
        unit: '元',
        value: 1,
    },
    {
        unit: '万元',
        value: 10000,
    },
    {
        unit: '亿元',
        value: 100000000,
    },
    {
        unit: '万亿元',
        value: 1000000000000,
    },
];

/**
* 判断一个数值是否整数
* @param {Number} value
*/
function isInt(value) {
    return _.isNumber(value) && value % 1 === 0;
}

/**
* 数字格式化
* @author sunweibin
* @param {String|Number} no 需要进行千分位格式化的数字或者数字字符串
* @param {Boolean} decimalNeedFormat=true 小数部分是否进行格式化
* @param {String} thousandSeq=',' 千分位格式化符号
* @param {Boolean} isRemoveZero=false 小数部分多余的0是否移除
* @returns {String|null} 格式化后的字符串
*/
function thousandFormat(no = 0, decimalNeedFormat = true, thousandSeq = ',', isRemoveZero) {
    let numberString = String(no);
    if (isRemoveZero) {
        if (/\./.test(numberString)) {
            numberString = numberString.replace(/0*$/, '').replace(/\.$/, '');
        }
    }
    const replacement = `$1${thousandSeq}`;
    // 将数字差分成整数部分和小数部分
    const nArr = numberString.split('.');
    const itegerF = nArr[0].replace(thousandInteger, replacement);
    let decimalF = !_.isEmpty(nArr[1]) && nArr[1].replace(thousandDecimal, replacement);
    if (!decimalNeedFormat) {
        decimalF = !_.isEmpty(nArr[1]) && nArr[1];
    }
    if (!decimalF) {
        decimalF = '';
    } else {
        decimalF = `.${decimalF}`;
    }
    return `${itegerF}${decimalF}`;
}

/**
* 数字取小数点后几位
* @author Liujianshu
* @param {String|Number} 需要操作的数字
* @param {String|Number} 需要取小数点后几位，默认为两位
* @returns {String} 格式化后的字符串
*/
function toFixed(value = '', length = 2) {
    let newValue = _.toNumber(value);
    if (_.isNumber(newValue)) {
        newValue = newValue.toFixed(length);
        // 数字过小时，取两位小数可能等于 0 ，等于 0 时，显示 0.00
        if (Math.abs(newValue) === 0) {
            const fillZero = _.fill(Array(length), 0);
            newValue = `0.${fillZero.join('')}`;
        }
    }
    return newValue;
}

/**
* @author LiuJianShu
* @description 对小数格式化是否四舍五入
* @param {String|Number} 需要操作的数字
* @param {Number} 保留小数点后几位
* @param {Boolean} 是否四舍五入
* @returns {String} 格式化后的数字
*/
function formatRound(num = 0, floatLength = 2, isRound = true) {
    let newNumber = num;
    if (window.isNaN(newNumber)) {
        return num;
    }
    // 对小数做处理
    const numberArray = String(newNumber).split('.');
    if (!_.isEmpty(numberArray[1])) {
        // 是否四舍五入
        if (isRound) {
            newNumber = newNumber.toFixed(floatLength);
        } else if (numberArray[1].length >= floatLength) {
            // 如果小数部分长度大于等于要保留的位数
            newNumber = `${numberArray[0]}.${numberArray[1].substring(0, floatLength)}`;
        }
    }
    return newNumber;
}

/**
* @author LiuJianShu
* @description 数字转化为单位显示
* @param {Object} 参数对象
* @param {Number|String} num 需要处理的数字
* @param {Boolean} isThousandFormat 是否需要千分符
* @param {Number} floatLength 小数保留位数
* @param {String} unit 单位
* @param {Boolean} needMark 是否需要+-符号
* @param {Boolean} isRound 是否需要四舍五入
* @returns {String} 处理后的数字
*/
function formatToUnit({
    // 传入的数字
    num = 0,
    // 是否格式化千分符
    isThousandFormat = true,
    // 小数部分长度
    floatLength = 0,
    // 单位
    unit = '',
    // 是否需要符号
    needMark = false,
    // 是否四舍五入
    isRound = true,
    // 返回的格式 object 返回对象格式 默认是字符串型
    returnType = 'string',
}) {
    // 是否是数字
    let newNum = Number(num);
    const result = {};
    if (window.isNaN(newNum)) {
        return num;
    }
    // 单位常量
    const UNIT = unit;
    const UNIT_WAN = `万${unit}`;
    const UNIT_YI = `亿${unit}`;
    const UNIT_WANYI = `万亿${unit}`;

    // 符号
    result.mark = needMark ? '+' : '';
    // 传入的有符号则输出有符号
    result.mark = String(num)[0] === '+' ? '+' : result.mark;
    // 负数
    if (newNum < 0) {
        result.mark = '-';
    }
    newNum = Math.abs(newNum);
    if (newNum >= TRILLION) {
        result.number = newNum / TRILLION;
        result.unit = UNIT_WANYI;
    } else if (newNum >= YI) {
        result.number = newNum / YI;
        result.unit = UNIT_YI;
    } else if (newNum >= WAN) {
        result.number = newNum / WAN;
        result.unit = UNIT_WAN;
    } else {
        result.number = newNum;
        result.unit = UNIT;
    }
    // 对小数做处理
    result.number = formatRound(result.number, floatLength, isRound);
    // 千位符处理
    if (isThousandFormat) {
        result.number = thousandFormat(Number(String(result.number)), true, ',', false);
    }
    if (returnType === 'object') {
        return { mark: result.mark, number: result.number, unit: result.unit };
    }
    return `${result.mark}${result.number}${result.unit}`;
}

/**
* 将比率数字转化成百分比字符串
* @param {Number} rate 比率的数字
* @param {Boolean} isRemoveZero 小数部分多余的0是否移除
*/
function convertRate(rate, isRemoveZero = false) {
    if (_.isNumber(rate)) {
        let rate100 = (rate * 100).toFixed(2);
        if (isRemoveZero) {
            rate100 = parseFloat(rate100);
        }
        return `${rate100}%`;
    }
    return '';
}

/**
* 将千分比的数据转换成字符串
* @param {Number} rate 比率的数字
*/
function convertPermillage(rate) {
    if (_.isNumber(rate)) {
        const rate100 = (rate * 1000).toFixed(2);
        return `${rate100}${PERMILLAGE}`;
    }
    return '';
}

/**
* 数字根据指定分隔显示不同单位
* @param {Object} 参数对象
* @param {Number|String} num 需要处理的数字
* @param {Array} borders 分隔边界
* @param {Array} units 单位常量
* @param {Boolean} isThousandFormat 是否需要千分符
* @param {Number} floatLength 小数保留位数
* @param {Boolean} needMark 是否需要+-符号
* @param {Boolean} isRound 是否需要四舍五入
* @returns {String} 处理后的数字
*/
function formatByBorders({
    // 传入的数字
    num = 0,
    // 分隔边界数组
    borders = [THOUSAND, TEN_MILLION, TEN_BILLION],
    // 单位常量数组，长度比borders的多1
    units = ['元', '万元', '亿元', '万亿元'],
    // 是否格式化千分符
    isThousandFormat = true,
    // 小数部分长度
    floatLength = 2,
    // 是否需要符号
    needMark = false,
    // 是否四舍五入
    isRound = false,
}) {
    // 是否是数字
    let newNum = Number(num);
    const result = {};
    if (Number.isNaN(newNum)) {
        return num;
    }
    // 符号
    result.mark = needMark ? '+' : '';
    // 传入的有符号则输出有符号
    result.mark = String(num)[0] === '+' ? '+' : result.mark;
    // 负数
    if (newNum < 0) {
        result.mark = '-';
    }
    newNum = Math.abs(newNum);

    const index = _.findIndex(borders, item => item > newNum);
    const unitName = index !== -1 ? units[index] : units[units.length - 1];
    const unitValue = _.find(unitToValue, { unit: unitName });
    result.number = newNum / (unitValue.value || 1);
    result.unit = unitName;

    // 对小数做处理
    result.number = formatRound(result.number, floatLength, isRound);
    // 千位符处理
    if (isThousandFormat) {
        result.number = thousandFormat(Number(String(result.number)), true, ',', false);
    }
    return `${result.mark}${result.number}${result.unit}`;
}

/**
* 金额转换为带单元的处理，并且小数部分去0显示
* 数值小于1000单位用元，大于等于1000单位用万元，大于等于10000万元用亿元表示
* @param {Number|String} value 需要处理的数字
* @returns {Object} 处理后数字和单位对象
*/
function transformUnitByAmount(value) {
    if (value === '' || _.isNil(value)) {
        return {
            newValue: '--',
            newUnit: '',
        };
    }
    let newUnit = '元';
    let newValue = Number(value);
    if (newValue >= YI) {
        newUnit = '亿元';
        newValue = parseFloat((newValue / YI).toFixed(2));
    } else if (newValue >= THOUSAND) {
        newUnit = '万元';
        newValue = parseFloat((newValue / WAN).toFixed(2));
    }
    return {
        newValue,
        newUnit,
    };
}

const number = {
    HUNDRED,
    THOUSAND,
    WAN,
    MILLION,
    YI,
    BILLION,
    TRILLION,
    PERCENT,
    PERMILLAGE,
    isInt,
    thousandFormat,
    toFixed,
    formatRound,
    formatToUnit,
    convertRate,
    convertPermillage,
    formatByBorders,
    transformUnitByAmount,
};

export default number;
