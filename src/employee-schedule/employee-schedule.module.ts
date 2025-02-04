import { Module } from '@nestjs/common';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { EmployeeScheduleService } from './employee-schedule.service';
import { EmployeeSchedule } from './entities/employeeSchedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeSchedule])],
  controllers: [EmployeeScheduleController],
  providers: [EmployeeScheduleService],
})
export class EmployeeScheduleModule {}
