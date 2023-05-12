export function regFilter (str = '') {
  let newStr = str;
  newStr = str.replace(new RegExp('<input', 'g'), '')
    .replace(new RegExp('class="select-tag"', 'g'), '')
    .replace(new RegExp("class='select-tag'", 'g'), '')
    .replace(new RegExp('class="btn-tag"', 'g'), '')
    .replace(new RegExp("class='btn-tag'", 'g'), '')
    .replace(new RegExp('type="button"', 'g'), '')
    .replace(new RegExp("type='button'", 'g'), '')
    .replace(new RegExp('type="button"', 'g'), '')
    .replace(new RegExp('/>', 'g'), '')
    .replace(new RegExp("/>", 'g'), '')
    .replace(new RegExp('value="\.*"', 'g'), '')
    .replace(new RegExp('">', 'g'), '')
    .replace(new RegExp("'> ", 'g'), '')
    .replace(new RegExp("> ", 'g'), '');
  return newStr;
}
// replace(/[$S{}C]/g, '')
{/* <input key=${'这是在测试'} class="select-tag" type="button" value=${'这是在测试'}></input> */}