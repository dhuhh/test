import { message } from 'antd';
import React, { Fragment, useEffect, useRef, useState, forwardRef, useImperativeHandle, use } from 'react';
import './editContent.less';

/**
 * 计算公式可编辑div
 */

// const defaultValue = `<input class="select-tag" value="${'这是在测试'}" name="这是在测试" type="button"/>`;

const EditContent = forwardRef(({ defaultValue = '',editable, showWarn, onChange }, ref) => {
  useImperativeHandle(ref, () => ({
    handleAddElement,
  }));

  const [value, setValue] = useState(defaultValue);
  const [savedRange, setSavedRange] = useState(null);
  const divRef = useRef();
  const dom = document.getElementById('edit');
  const text = dom ? dom.innerHTML : '';

  const handleSelectionChange = () => {
    let sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount) {
      setSavedRange(sel.getRangeAt(0));
    }
  };
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange, false);
    //document.getElementById('edit').addEventListener('textInput', handleInput, false);
    document.getElementById('edit').addEventListener('textInput', handleInput);
  }, []);
  
  /* useEffect(() => {
    const handleInput = (e) => {
      if (editable) return;
      const event = e || window.event;
      event.preventDefault();
    };
    document.getElementById('edit').addEventListener('textInput', handleInput);
    return document.getElementById('edit').removeEventListener('textInput', handleInput);
  }, [editable]); */

  useEffect(()=> {
    console.log(text);
    setValue(text);
  } ,[text]);

  useEffect(() => {
    const filterValue = value.replace(new RegExp('<input class="select-tag" value=\"(.+?)\"', 'g'), '')
      .replace(new RegExp('<input class="btn-tag" value=\"(.+?)\"', 'g'), '')
      .replace(new RegExp('type="button">', 'g'), '')
      .replace(new RegExp('type="button"/>', 'g'), '')
      .replace(new RegExp('name="|"', 'g'), '');
      // .replace(new RegExp(' ', 'g'), '');
      console.log(filterValue,'经过处理过后的默认计算公式数据');
    const calcObj = { calcFormula: filterValue, calcDescr: value };
    (typeof onChange === 'function') && onChange(calcObj);
    // if (filterValue.length > 500) message.error('计算公式最多输入500个字符');
  }, [value]);
  
  //禁止手动输入 1
 /*  const handleInput = (e) => {
    const event = e || window.event;
    event.preventDefault();
  }; */
  const handleInput = (e) => {
    if (editable) return ;
    const event = e || window.event;
    event.preventDefault();
  };

  //禁止手动输入 2
  const handleKeyDown = (e) => {
    if (editable) return ;
    if(e.keyCode !== 8) {
      divRef.current.blur();
      e.preventDefault();
    }
  };

  // 添加公式(type仅限 select,btn)
  const handleAddElement = (obj, type = 'select')=> {
    const { value = '', key = '' } = obj || {};
    const className = `${type}-tag`;
    const element = `<input
        class="${className}"
        value="${value}"
        name="${key}"
        type="button"
      />`;
    insertElement(element);
  };
  // 获取光标，插入html
  const insertElement = (html)=> {
    let sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel && sel.rangeCount === 0 && savedRange !== null) sel.addRange(savedRange); // 保留光标在文字中间插入的最后位置
      if (sel && sel.rangeCount) range = sel.getRangeAt(0);
      if (['', null, undefined].includes(range)) {
        // 如果div没有光标，则在div内容末尾插入
        range = resetCursor(true).getRangeAt(0);
      } else {
        const contentRange = document.createRange();
        contentRange.selectNode(divRef.current);
        // 对比range，检查光标是否在输入范围内
        const compareStart = range.compareBoundaryPoints(Range.START_TO_START, contentRange);
        const compareEnd = range.compareBoundaryPoints(Range.END_TO_END, contentRange);
        const compare = compareStart !== -1 && compareEnd !== 1;
        if (!compare) range = resetCursor(true).getRangeAt(0);
      }
      let input = range.createContextualFragment(html);
      let lastNode = input.lastChild; // 记录插入input之后的最后节点位置
      range.insertNode(input);
      if (lastNode) { // 如果有最后的节点
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (document['selection'] && document['selection'].type !== 'Control') {
      document['selection'].createRange().pasteHTML(html);
    }
  };
  // 将光标重新定位到内容最后 isReturn 是否要将range实例返回
  const resetCursor = (isReturn)=> {
    if (window.getSelection) {
      divRef.current.focus();
      let sel = window.getSelection(); // 创建range
      sel.selectAllChildren(divRef.current); // range 选择obj下所有子内容
      sel.collapseToEnd(); // 光标移至最后
      if (isReturn) return sel;
    } else if (document['selection']) {
      let sel = document['selection'].createRange(); // 创建选择对象
      sel.moveToElementText(divRef.current); // range定位到编辑器
      sel.collapse(false);// 光标移至最后
      sel.select();
      if (isReturn) return sel;
    }
  };

  return (
    <Fragment>
      <div
        className='edit-div'
        id="edit"
        ref={divRef}
        contenteditable="plaintext-only"
        placeholder="请输入"
        style={{ borderColor: showWarn && '#f5222d' }}
        dangerouslySetInnerHTML={{ __html: defaultValue }}
        onKeyDown={handleKeyDown}
      ></div>
    </Fragment>
  );
});
export default EditContent;
