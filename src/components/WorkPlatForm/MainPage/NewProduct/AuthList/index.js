import React ,{ useEffect,useState }from 'react';
import { Divider ,Table ,message } from 'antd';
import TreeUtils from '$utils/treeUtils';
import authIcon from '$assets/newProduct/icon_duihao@2x.png';
import expandedIcon from '$assets/newProduct/icon／tongyong／_arrow_shense_down@2x.png';
import collapsedIcon from '$assets/newProduct/icon／tongyong／_arrow_shense_left@2x.png';
import pointIcon from '$assets/newProduct/icon_point@2x.png';
import styles from './index.less';

import { QueryRolePowerList } from '$services/newProduct';

export default function AuthList() {
  const [authTitle,setAuthTitle] = useState([]);
  const [roleTitle,setRoleTitle] = useState([]);
  const [authList,setAuthList] = useState([]);
  const [loading,setLoading] = useState(false);
  useEffect(()=>{
    queryRolePowerList();
  },[]);
  const queryRolePowerList = ()=>{
    setLoading(true);
    QueryRolePowerList().then(res=>{
      const datas = TreeUtils.toTreeData(res?.powerListRecords, { keyName: 'funId', pKeyName: 'funParentId', titleName: 'funName', normalizeTitleName: 'title', normalizeKeyName: 'key' }, true);
      let authTitle = [];
      datas.forEach((item) => {
        const { children } = item;
        authTitle.push(...children);
      });
      console.log(authTitle);
      setAuthTitle(authTitle);
      setRoleTitle(res?.roleListRecords);
      setAuthList(res?.records);
      setLoading(false);
    }).catch(error => {
      message.error(error.note || error.success);
    });
  };
  const getColumns = ()=>{
    let mainTitle = new Set(roleTitle.map(item=>item.categoryName));
    let columns = mainTitle.map(item=>{
      return {
        title: <div style={{ fontWeight: 'bold' }}>{item}</div>,
        className: item,
        children: roleTitle.filter(item1=>item1.categoryName === item).map(item2=>{
          return {
            title: <div style={{ textAlign: 'left' ,color: '#4B516A' }}>{item2.roleName}</div>,
            dataIndex: item2.roleName,
            className: item,
            render: (value,row)=>{
              return authList.filter(item3=>item3.funId === row.key).find(item4=>{
                return item4.roleName === item2.roleName;
              })?.assigned && <img src={authIcon} alt='' style={{ width: 32 }}/>;
            },
          };
        }),
      };
    });
    return [
      {
        title: <div style={{ fontWeight: 'bold' }}>菜单权限</div>,
        dataIndex: 'title',
        fixed: 'left',
        width: ((Math.max(...authList.map(item=>item.grade))) - 1) * 40,
        render: (value)=><div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{value}</div>,
      },
      ...columns,
    ];
  };
  const tableProps = {
    // key: 'value',
    loading,
    columns: getColumns(),
    dataSource: authTitle,
    bordered: true,
    pagination: false,
    scroll: { x: roleTitle.length * 130,y: 'calc(100vh - 400px)' },
    className: `${styles.table} m-Card-Table`,
    expandRowByClick: true,
    indentSize: 16,
    // expandIcon: (props)=>{
    //   console.log(props);
    //   if(props.record?.children?.length > 0){
    //     if (props.expanded) {
    //       return (
    //         <img style={{ width: 16 }} src={expandedIcon} alt='' onClick={e => {
    //           props.onExpand(props.record, e);
    //         }}/>
    //       );
    //     } else {
    //       return (
    //         <img style={{ width: 16 }} src={collapsedIcon} alt='' onClick={e => {
    //           props.onExpand(props.record, e);
    //         }}/>
    //       );
    //     }
    //   }else if(props.record?.key){
    //     return <img style={{ width: 16 }} src={pointIcon} alt=''/>;
    //   }else{
    //     return ;
    //   }
    // },
  };
  return (
    <div style={{ background: '#fff',padding: '16px 24px' }}>
      <div style={{ color: '#1A2243',fontSize: 16 ,fontWeight: 'bold' }}>
        权限查询表单
        <Divider style={{ margin: '16px 0' }}/>
      </div>
      <Table {...tableProps} />
      <style jsx>
        {
          [...new Set(roleTitle.map(item=>item.categoryName))].map(item=>`.m-Card-Table thead .${item} {
            background:#${roleTitle.find(item1=>item1.categoryName === item)?.categoryColor} !important;
            border-bottom: 4px solid #${roleTitle.find(item1=>item1.categoryName === item)?.frameColor};
        }`)
        }
      </style>
    </div>
  );
}
