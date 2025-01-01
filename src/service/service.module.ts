import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Salon } from 'src/salon/entities/salon.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Salon]), CloudinaryModule],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
