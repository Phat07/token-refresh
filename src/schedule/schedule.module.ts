import { forwardRef, Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { SalonModule } from 'src/salon/salon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, Salon]),
    forwardRef(() => SalonModule),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
