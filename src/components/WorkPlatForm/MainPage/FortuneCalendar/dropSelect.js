import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { TreeSelect } from 'antd';
import Down from '$assets//newProduct/chance/arrow_down.png';
import Up from '$assets/newProduct/chance/arrow_up.png';
import './dropSelect.css'
import { useRef } from 'react';
const { SHOW_PARENT } = TreeSelect;
function DropSelect(props, ref) {
    const [value, setValue] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue,setSearchValue] = useState('');
    const [isBlur,setIsBlur] = useState(false)
    const box = useRef()
    useEffect(() => {
        const { showValue } = props
        setValue(showValue)

    }, [])
    const onChange = (newValue,_,node) => {
        setValue(newValue);
        props.getSelect(newValue)
        if(node?.allCheckedNodes&&props.tid=='productName'){
           box.current.focus()
        }
    };
    const chance = (value) => {
        return <span style={{ fontWeight: 400, color: '#FF6E30' }}>...等{2 + value.length}项</span>
    }
    const getPopupContainer = ()=>{
        return document.getElementsByClassName(props.tid)[0]
      }

    const reset = (value) => {
        setValue(value)
    }
    const onSearchInDrop = (value)=>{
        console.log(value,'value');
        if(!value&&isBlur&&props.tid=='productName'){

        }else{
            setSearchValue(value)
        }
    }
    const onBlur = ()=>{
        setIsBlur(true)
    }
    const onFocus = ()=>{
        setIsBlur(false)
    }
    useImperativeHandle(ref, () => ({
        reset
    }))
    const { treeData = [], isShowAll = false, showSearch = true, isRadio = false } = props
    //console.log(treeData,'treeDatatreeData');
    const tProps = {
        allowClear: isShowAll,
        treeData,
        value,
        onChange,
        treeCheckable: !isRadio,
        showArrow: false,
        treeDefaultExpandAll: true,
        dropdownMatchSelectWidth:true,
        dropdownClassName: `common-treeselect ${isShowAll ? 'all-select' : 'radio-select'}`,
        getPopupContainer,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: '请输入',
        className: `${props.tid} dropSelectDown ${showSearch ? 'isShow' : 'notShow'}`,
        maxTagTextLength: 3,
        maxTagCount: 2,
        searchValue:searchValue,
        maxTagPlaceholder: chance,
        treeNodeFilterProp:props.tid=='productName'?'searchValue':'value',
        onSearch:onSearchInDrop,
        treeNodeFilterProp:'title',
        onDropdownVisibleChange: (open) => { setIsOpen(open) },
        showSearch: showSearch,
        style: {
            marginBottom:'12px',
            minWidth:'250px',
            marginRight:'32px',
        },
    };
    return <div style={{ display: 'inline-block', position: 'relative' }}>
        <TreeSelect ref={box} {...tProps} onBlur={onBlur} onFocus={onFocus}/>
        <img src={isOpen ? Up : Down} style={{ position: 'absolute', right: '42px', top: '8px', width: '16px' }} />
    </div>;
}

export default forwardRef(DropSelect)
