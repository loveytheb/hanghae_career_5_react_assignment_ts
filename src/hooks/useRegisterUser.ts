import { registerUserAPI } from '@/api/auth';
import { IUser } from '@/types/authType';
import { useMutation } from '@tanstack/react-query';

interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
}

export const useRegisterUser = () => {
  return useMutation<IUser, string, RegisterUserPayload>({
    mutationFn: async (payload: RegisterUserPayload): Promise<IUser> => {
      return await registerUserAPI(payload);
    },
    onSuccess: (data) => {
      console.log('Registration Successful:', data);
    },
    onError: (error) => {
      console.error('Registration Error:', error);
    },
  });
};
