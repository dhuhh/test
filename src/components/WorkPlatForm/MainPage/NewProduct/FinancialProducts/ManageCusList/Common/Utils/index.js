export function formatThousands(val) {
  if (!val) return '--';
  let str = val + '';
  let dw = str.replace(/[0-9.]/ig, '');
  if (dw.indexOf('-') !== -1) {
    return dw.substr(0, 1) + str.replace(/[^0-9.]/ig, '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + dw.slice(1);
  }
  return str.replace(/[^0-9.]/ig, '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + dw;
}
