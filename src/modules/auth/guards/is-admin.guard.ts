import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const isAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  await authStore.checkAuthStatus();

  authStore.isAdmin
    ? // El next es que lo dejemos pasar a la ruta que quiere ir
      next()
    : next({ name: 'home' });
};

export default isAdminGuard;
