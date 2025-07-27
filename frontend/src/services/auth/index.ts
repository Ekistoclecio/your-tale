import { User } from '@/schemas/entities/user';
import { SignInFormData } from '@/schemas/form-validation/signInForm';
import { SignUpFormData } from '@/schemas/form-validation/signUpForm';
import { ApiService } from '@/services/client';

class AuthService extends ApiService {
  constructor() {
    super('auth/');
  }

  create = async (user: Omit<SignUpFormData, 'confirmPassword'>) => {
    const { data } = await this.post<User>('register', { ...user });
    return data;
  };

  login = async (user: SignInFormData) => {
    const { data } = await this.post<{
      token: string;
      user: User;
    }>('login', { ...user });
    return data;
  };
}

export const authService = new AuthService();
