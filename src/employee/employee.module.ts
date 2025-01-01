import { forwardRef, Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonModule } from 'src/salon/salon.module';
import { Salon } from 'src/salon/entities/salon.entity';
import { Service } from 'src/service/entities/service.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { ServiceModule } from 'src/service/service.module';
import { UsersService } from 'src/users/services/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Salon, Service, User, Role]),
    forwardRef(() => SalonModule), // Đảm bảo module này được import
    CloudinaryModule,
    RolesModule,
    forwardRef(() => UsersModule),
    ServiceModule     
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, UsersService],
})
export class EmployeeModule {}
