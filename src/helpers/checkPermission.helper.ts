import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export class Permission {
  static check(id: number, currentUser: User) {
    // if (id === currentUser.id) return;
    // if (currentUser.role === 'ADMIN') return;

    throw new ForbiddenException('User can not perform action');
  }
}
