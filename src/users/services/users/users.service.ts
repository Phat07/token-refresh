import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Role } from 'src/roles/entities/role.entity';
import { RegisterUserDto } from 'src/users/dto/registerUser.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}
  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }
  async findAll({ page, limit }: { page: string; limit: string }) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const [users, total] = await this.userRepo.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    return {
      data: users,
      total,
      page: pageNumber,
      pageCount: Math.ceil(total / limitNumber),
    };
  }
  async findUserWithRole(userId: string) {
    // return this.userRepo.findOne({
    //   where: { id: userId },
    //   relations: ['role'], // Liên kết với bảng role
    //   // relations: ['role', 'token'],
    // });
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    return plainToInstance(User, user);
  }
  async create(requestBody: RegisterUserDto) {
    // Validate role exists
    const role = await this.roleRepo.findOneBy({ role: requestBody.roleName });
    if (!role) {
      throw new Error(`Role ${requestBody.roleName} not found`);
    }

    // Create new user with role
    const user = this.userRepo.create({
      email: requestBody.email,
      password: requestBody.password,
      name: requestBody.name,
      role: role, // TypeORM sẽ tự động lấy role.id để gán vào roleId
    });

    return await this.userRepo.save(user);
  }
}
