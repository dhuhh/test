import { prefix } from '../../utils/config';

export default [
  {
    path: `${prefix}/ssoLogin`,
    component: () => import('../../components/LoginPage/PageLayoutSsoLogin'),
  },
];
