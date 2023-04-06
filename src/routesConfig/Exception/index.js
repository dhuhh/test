import { prefix } from '../../utils/config';

export default [
  {
    path: `${prefix}/403`,
    component: () => import('../../routes/Exception/403'),
  },
  {
    path: `${prefix}/404`,
    component: () => import('../../routes/Exception/404'),
  },
  {
    path: `${prefix}/500`,
    component: () => import('../../routes/Exception/500'),
  },
  {
    path: `${prefix}/noAuthority`,
    component: () => import('../../routes/Exception/noAuthority'),
  },
];
