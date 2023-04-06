import { prefix } from '../../../utils/config';

export default [
  {
    path: `${prefix}/`,
    models: () => [
      import('../../../models/workPlatform/mainPage'),
    ],
    component: () => import('../../../components/WorkPlatform/MainPage/PageLayout'),
  },
  { // 首页
    path: `${prefix}/index`,
    component: () => import('../../../routes/workPlatform/mainPage/homePage'),
  },
  { // 进度跟踪
    path: `${prefix}/businessWizard`,
    component: () => import('../../../routes/workPlatform/mainPage/businessWizard'),
  },
  { // 文档批量下载
    path: `${prefix}/attachmentDownload`,
    component: () => import('../../../routes/workPlatform/singlePage/attachmentDownload'),
  },
  { // 流程导航
    path: `${prefix}/processNavigation`,
    component: () => import('../../../routes/workPlatform/mainPage/processNavigation'),
  },
  { // 运营日历
    path: `${prefix}/operation/perateManagement`,
    component: () => import('../../../routes/workPlatform/mainPage/operationCenter'),
  },
];
