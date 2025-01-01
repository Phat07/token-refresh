import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]), // Register Token entity
  ],
  controllers: [TokenController],
  providers: [TokenService]
})
export class TokenModule {}
