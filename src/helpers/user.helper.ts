import { User } from "src/users/entities/user.entity";


export class UserHelper {
  static generateUserPayload(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return payload;
  }
}
