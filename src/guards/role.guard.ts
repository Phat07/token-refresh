import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { ROLES_KEY } from 'src/users/decorators/roles.decorator';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('Required Roles: ', requiredRoles);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const currentUser = request.currentUser;
    console.log("curr", currentUser);
    
    if (!currentUser || !currentUser.roleId) {
      return false;
    }    

    // Fetch the user's role from the database
    const userRole = await this.roleRepository.findOne({ where: { id: currentUser.roleId } });
    if (!userRole) {
      return false;
    }
    console.log('User Role: ', userRole);

    // Check if the user's role is in the allowed roles
    return requiredRoles
      .map(role => role.toLowerCase())
      .includes(userRole.role.toLowerCase());
  }
}
