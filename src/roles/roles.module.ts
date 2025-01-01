import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [TypeOrmModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
