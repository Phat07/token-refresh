import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { Owner } from './entities/owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}
