const prefix = '/single';
export default [
  {
    path: `${prefix}/`,
    models: () => [
      import('../../../models/workPlatform/singlePage'),
    ],
    component: () => import('../../../components/WorkPlatform/SinglePage/PageLayout'),
  },
  { // 文档批量下载
    path: `${prefix}/attachmentDownload`,
    component: () => import('../../../routes/workPlatform/singlePage/attachmentDownload'),
  },
];
