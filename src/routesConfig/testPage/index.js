import { prefix } from '../../utils/config';

const prefixUrl = `${prefix}/testPage`;
export default [
  {
    path: `${prefixUrl}/`,
    component: () => import('../../components/TestPage/PageLayout'),
  },
  {
    path: `${prefixUrl}/basicDataTable`,
    component: () => import('../../routes/testPage/basicDataTable'),
  },
  {
    path: `${prefixUrl}/dataTable`,
    component: () => import('../../routes/testPage/dataTable'),
  },
  {
    path: `${prefixUrl}/test2`,
    component: () => import('../../routes/testPage/test2'),
  },
  {
    path: `${prefixUrl}/memberSingleSelect`,
    component: () => import('../../routes/testPage/memberSingleSelect'),
  },
  {
    path: `${prefixUrl}/vTable`,
    component: () => import('../../routes/testPage/vTable'),
  },
  {
    path: `${prefixUrl}/test3`,
    models: () => [import('../../models/testPage/test3')],
    component: () => import('../../routes/testPage/test3'),
  },
  {
    path: `${prefixUrl}/form`,
    component: () => import('../../routes/testPage/form'),
  },
];
