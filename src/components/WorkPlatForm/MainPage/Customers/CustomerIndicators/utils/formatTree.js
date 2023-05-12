import { cloneDeep } from 'lodash';
//树型数据转为一维数组
export function treeToFlat (data) {
  if (!Array.isArray(data)) return [];
  let newArr = [];
  data.length > 0 && data.forEach(item => {
    if (item.children) {
      newArr.push(item);
      if (item.children.length > 0) {
        newArr.push(...treeToFlat(item.children));
      }
    } else {
      newArr.push(item);
    }
  });
  return newArr;
};
//一维数组转为tree
export function flatToTree (arr = [], rootId = [], id = 'id', parentId = 'parentId') {
  const tempArr = cloneDeep(arr);
  const newData = tempArr.filter(item => {
    const childArr = tempArr.filter(items =>items[parentId] === item[id]);
    childArr.length && (item.children = childArr);
    return rootId.includes(item[id]);
  });
  return newData;
}

