import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Role } from 'src/roles/entities/role.entity';
import { RolesModule } from 'src/roles/roles.module';
import { Salon } from 'src/salon/entities/salon.entity';
import { SalonModule } from 'src/salon/salon.module';
import { Service } from 'src/service/entities/service.entity';
import { ServiceModule } from 'src/service/service.module';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

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
  providers: [EmployeeService],
})
export class EmployeeModule {}
