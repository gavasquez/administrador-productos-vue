import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthStatus, type User } from '../interfaces';
import { checkAuthAction, loginActions, registerActions } from '../actions';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', () => {
  // Authenticated, unAuthenticated, Checking
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await loginActions(email, password);
      if (!loginResponse.ok) {
        logout();
        return false;
      }
      user.value = loginResponse.user;
      token.value = loginResponse.token;
      authStatus.value = AuthStatus.Authenticated;
      return true;
    } catch (error) {
      console.log(error);
      return logout();
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const stateResp = await checkAuthAction();
      if (!stateResp.ok) {
        logout();
        return false;
      }
      authStatus.value = AuthStatus.Authenticated;
      user.value = stateResp.user;
      token.value = stateResp.token;
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const logout = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    localStorage.removeItem('token');
    return false;
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<{ ok: boolean; message?: string }> => {
    try {
      const registerResponse = await registerActions(fullName, email, password);
      if (!registerResponse.ok) {
        logout();
        return {
          ok: false,
          message: registerResponse.message,
        };
      }
      user.value = registerResponse.user;
      token.value = registerResponse.token;
      authStatus.value = AuthStatus.Authenticated;
      return {
        ok: true,
      };
    } catch (error) {
      logout();
      return {
        ok: false,
        message: 'No se puedo realizar la peticion',
      };
    }
  };

  return {
    user,
    token,
    authStatus,
    // Getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    // Todo: Saber si es administrador
    isAdmin: computed(() => user.value?.roles.includes('admin') ?? false),
    username: computed(() => user.value?.fullName),
    // Acciones
    login,
    register,
    checkAuthStatus,
    logout,
  };
});
