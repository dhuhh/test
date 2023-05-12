export default [
  {
    code: '110001',
    key: 'sysDictionary',
    url: '/commonbase/v1/sysDictionary',
    dis: '系统通用  获取指定数据字典',
  },
  {
    code: '110002',
    key: 'userBasicInfo',
    url: '/commonbase/v1/userBasicInfo',
    dis: '系统通用  获取用户基本信息',
  },
  {
    code: '110003',
    key: 'userSysRole',
    url: '/commonbase/v1/userSysRole',
    dis: '系统通用  获取用户基础应用平台业务角色(1|营销;2|服务;3|团队长;4|营销总监;5|后台管理岗)',
  },
  {
    code: '110004',
    key: 'userBusinessRole',
    url: '/commonbase/v1/userBusinessRole',
    dis: '系统通用  获取用户系统授权业务角色',
  },
  {
    code: '110007',
    key: 'userAuthorityDepartment',
    url: '/commonbase/v1/userAuthorityDepartment',
    dis: '系统通用  获取数据权限营业部数据',
  },
  {
    code: '111100',
    key: 'userAuthorityDepartmentType',
    url: '/AppRetrofit/v1/userAuthorityDepartment',
    dis: '系统通用客户标签  获取数据权限营业部数据',
  },
  {
    code: '110101',
    key: 'workFlowNavigation',
    url: '/commonbase/v1/workFlowNavigation',
    dis: '系统通用  获取人员流程导航数据',
  },
  { code: '501007', key: 'userNoticeList', url: '/commonbase/v1/userNoticeList', dis: '系统首页  获取公司公告' },
  { code: '501008', key: 'userNoticeDtl', url: '/commonbase/v1/userNoticeDtl', dis: '系统首页  获取公告详情' },
  { code: '501009', key: 'userMsgRmdList', url: '/commonbase/v1/userMsgRmdList', dis: '系统首页  获取消息提醒' },
  { code: '501010', key: 'userReadMsgRmd', url: '/commonbase/v1/userReadMsgRmd', dis: '系统首页  阅读消息提醒' },
  { code: '501013', key: 'userUnreadMsgNum', url: '/commonbase/v1/userUnreadMsgNum', dis: '系统首页  未读消息提醒数' },
  { code: '', key: 'getNotification', url: '/motbase/v1/getNotification', dis: '系统首页  是否有未读消息' },
  {
    code: '501020',
    key: 'sysVersionNum',
    url: '/commonbase/v1/sysVersionNum',
    dis: '获取系统当前版本号',
  },
  {
    code: '501021',
    key: 'sysVersionList',
    url: '/commonbase/v1/sysVersionList',
    dis: '获取系统版本信息列表',
  },
  {
    code: '501022',
    key: 'sysDescription',
    url: '/commonbase/v1/sysDescription',
    dis: '获取系统说明',
  },
  { code: '501025', key: 'sysParam', url: '/commonbase/v1/sysParam', dis: '获取几个平台rul' },
  { code: '501026', key: 'userMenuProject', url: '/commonbase/v1/userMenuProject', dis: '获取菜单方案' },
  { code: '501027', key: 'userDefaultProject', url: '/commonbase/v1/userDefaultProject', dis: '获取默认菜单' }, // 废弃
  { code: '501027', key: 'userShortcutMenuConfig', url: '/commonbase/v1/userShortcutMenuConfig', dis: '查询用户快捷菜单配置' },
  { code: '501028', key: 'userProjectUpdate', url: '/commonbase/v1/userProjectUpdate', dis: '更新用户最近方案' },
  { code: '501029', key: 'userSuggest', url: '/commonbase/v1/userSuggest', dis: '用户意见反馈' },
  { code: '501031', key: 'queryShortcutMenu', url: '/commonbase/v1/queryShortcutMenu', dis: '查询所有的快捷菜单' },
  { code: '501032', key: 'updateShortcutMenu', url: '/commonbase/v1/updateShortcutMenu', dis: '更新用户快捷菜单配置' },
  { code: '', key: 'userWorkflowList', url: '/commonbase/v1/userWorkflowList', dis: '工作--获取待办流程' },
  // HT整合 -----------------------------------------------------------------------------------------------
  { code: '501024', key: 'optionalUserList', url: '/commonbase/v1/optionalUserList', dis: '综合通用  获取可选人员列表' },
  { code: '', key: 'excStaffList', url: '/customerpotential/v1/excStaffList', dis: '获取可选人员列表 伴随式服务执行人员需求修改专用' },
  { code: '', key: 'excStaffListCus', url: '/AppRetrofit/v1/excStaffList', dis: '获取可选人员列表 客户标签需求修改专用' },
  { code: '501033', key: 'achieveAuthCode', url: '/commonbase/v1/achieveAuthCode', dis: '获取短信验证码' },
  { code: '501034', key: 'resetPassword', url: '/commonbase/v1/resetPassword', dis: '重置登录密码' },
  // HT整合 -----------------------------------------------------------------------------------------------
  { code: '', key: 'qryLoginPageConf', url: '/commonbase/v1/qryLoginPageConf', dis: '查询登录页面配置' },
  { code: '', key: 'queryOtherUsers', url: '/commonbase/v1/queryOtherUsers', dis: '查询当前用户的其他用户' },
  { code: '', key: 'uploadProto', url: '/commonbase/v1/uploadProto', dis: '上传头像' },
  { code: '', key: 'checkWhtLstIP', url: '/commonbase/v1/checkWhtLstIP', dis: '判断IP是否在白名单' },
  // 系统监控 start
  { code: 'queryOnlineUserInfo', key: 'queryOnlineUserInfo', url: '/commonbase/v1/monitor/queryOnlineUserInfo', dis: '在线用户数--趋势图' },
  { code: 'monitorTopologyInfoForEdit', key: 'monitorTopologyInfoForEdit', url: '/commonbase/v1/monitorTopologyInfo', dis: '监控-查询拓扑图详情--编辑界面' },
  { code: 'monitorTopologyInfoForView', key: 'monitorTopologyInfoForView', url: '/commonbase/v2/monitorTopologyInfo', dis: '监控-查询拓扑图详情--视图界面' },
  { code: 'saveMonitorTopologyInfo', key: 'saveMonitorTopologyInfo', url: '/commonbase/v1/saveMonitorTopologyInfo', dis: '监控-保存拓扑图信息' },
  // 系统监控 end
  { code: '', key: 'webserviceFrontEndConfig', url: '/commonbase/v1/webserviceFrontEndConfig', dis: '微前端子服务信息' },
  // token的AES加密接口(用于C4C5测试)
  { code: '', key: 'tokenAESEncode', url: '/app/v1/tokenAESEncode', dis: 'token的AES加密接口' },
  // AES加密(用于小安问答跳转)
  { code: '', key: 'encryptAES', url: '/app/v1/encryptAES', dis: 'AES加密' },
  // 返回菜单路由(用于判断是否有页面权限)
  { code: '', key: 'getUrlAccessControl', url: '/AppRetrofit/v1/getUrlAccessControl', dis: '菜单路由' },
  // 获取非admin用户是否拥有登录权限
  { code: '', key: 'QueryLoginPageConf', url: '/staffCommon/v1/QueryLoginPageConf', dis: '非admin用户登录权限' },
];
