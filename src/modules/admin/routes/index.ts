import isAdminGuard from '@/modules/auth/guards/is-admin.guard';
import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard';
import type { RouteRecordRaw } from 'vue-router';

export const AdminRoutes: RouteRecordRaw = {
  path: '/admin',
  name: 'admin',
  beforeEnter: [isAuthenticatedGuard, isAdminGuard],
  redirect: { name: 'admin-dashboard' },
  component: () => import('../layouts/AdminLayout.vue'),
  children: [
    {
      path: 'dashboard',
      name: 'admin-dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: 'products',
      name: 'admin-products',
      component: () => import('../views/ProductsView.vue'),
    },
    {
      path: 'products/:productId',
      name: 'admin-product',
      props: true,
      component: () => import('../views/ProductView.vue'),
    },
  ],
};
