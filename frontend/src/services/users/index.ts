import { User } from '@/schemas/entities/user';
import { ApiService } from '@/services/client';

class UserService extends ApiService {
  constructor() {
    super('users/');
  }

  update = async (user: { name?: string; email?: string }) => {
    const { data } = await this.patch<User>('me', { ...user });
    return data;
  };
}

export const userService = new UserService();
