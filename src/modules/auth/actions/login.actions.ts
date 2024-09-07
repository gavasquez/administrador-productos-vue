import { tesloApi } from '@/api/tesloApi';
import { type AuthResponse, type User } from '../interfaces';
import { isAxiosError } from 'axios';

export interface LoginError {
  ok: false;
  message: string;
}

export type LoginSuccess = {
  ok: true;
  user: User;
  token: string;
};

export const loginActions = async (
  email: string,
  password: string,
): Promise<LoginError | LoginSuccess> => {
  try {
    const { data } = await tesloApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 410) {
      return {
        ok: false,
        message: 'Usuario o contraseña incorrectos',
      };
    }
    console.log(error);
    throw new Error('No se pudo realizar la peticion');
  }
};
