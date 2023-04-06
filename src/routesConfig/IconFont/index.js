import { prefix } from '../../utils/config';

export default [
  {
    path: `${prefix}/iconFont`,
    component: () => import('../../components/Common/IconFont'),
  },
];
