import Login from "./page/login";
import Register from "./page/register";
import Index from "./page/index";
import Detail from "./page/detail";
import Edit from './page/edit'
import ChangePassword from './page/changePassword'
import Share from './page/share'

export default [
  {
    name: 'index',
    path: '/',
    component: Index,
  },
  {
    name: 'detail',
    path: '/detail',
    component: Detail,
  },
  {
    name: 'share',
    path: '/share',
    component: Share,
  },
  {
    name: 'edit',
    path: '/edit',
    component: Edit,
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
  {
    name: 'register',
    path: '/register',
    component: Register,
  },
  {
    name: 'changePassword',
    path: '/change-password',
    component: ChangePassword,
  },
]