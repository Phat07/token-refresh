import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonService } from './salon.service';
import { SalonController } from './salon.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Salon } from './entities/salon.entity';
import { EmployeeModule } from 'src/employee/employee.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Salon, Schedule]), // Đăng ký repository
    forwardRef(() => EmployeeModule),
    CloudinaryModule, // Import Cloudinary module
  ],
  controllers: [SalonController],
  providers: [SalonService],
  exports: [SalonService],
})
export class SalonModule {}
