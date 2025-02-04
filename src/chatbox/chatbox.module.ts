import { Module } from '@nestjs/common';
import { ChatboxController } from './chatbox.controller';
import { ChatboxService } from './chatbox.service';
import { NLPService } from './nlp.service';
import { DatabaseService } from './database.service';
import { GeminiService } from './gemini.service';
@Module({
  controllers: [ChatboxController],
  providers: [ChatboxService, NLPService, DatabaseService, GeminiService],
})
export class ChatboxModule {}
