import { tesloApi } from '@/api/tesloApi';
import { isAxiosError } from 'axios';
import type { AuthResponse } from '../interfaces';
import type { LoginError, LoginSuccess } from './login.actions';

export const registerActions = async (
  fullName: string,
  email: string,
  password: string,
): Promise<LoginSuccess | LoginError> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password,
    });
    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 400) {
      return {
        ok: false,
        message:
          typeof error.response.data.message === 'string'
            ? error.response.data.message
            : error.response.data.message[0],
      };
    }
    throw new Error('No se pudo realizar la peticion');
  }
};
