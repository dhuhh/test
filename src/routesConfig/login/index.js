import { prefix } from '../../utils/config';

export default [
  {
    path: `${prefix}/login`,
    models: () => [import('../../models/login')],
    component: () => import('../../components/LoginPage/PageLayout'),
  },
];
