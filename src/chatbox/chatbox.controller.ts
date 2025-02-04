import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { NLPService } from './nlp.service';
import { DatabaseService } from './database.service';
import { GeminiService } from './gemini.service';

@ApiTags('Chatbot') // Gắn tag cho Swagger UI
@Controller('chatbot')
export class ChatboxController {
  constructor(
    private readonly nlpService: NLPService,
    private readonly dbService: DatabaseService,
    private readonly aiService: GeminiService,
  ) {}

  @Get('ask')
  @ApiOperation({
    summary: 'Trả lời câu hỏi từ người dùng dựa trên dữ liệu MySQL',
  })
  @ApiQuery({
    name: 'question',
    type: String,
    description: 'Câu hỏi cần được AI trả lời',
  })
  @ApiResponse({
    status: 200,
    description: 'Trả về câu trả lời của AI dựa vào dữ liệu từ MySQL.',
    schema: {
      example: {
        answer: 'Hiện tại có voucher SUMMER50 giảm 50% và WINTER30 giảm 30%.',
      },
    },
  })
  async ask(@Query('question') question: string) {
    const query = await this.nlpService.generateSQL(question);
    const result = await this.dbService.executeSQL(query.trim());
    const data = JSON.stringify(result);
    const answer = await this.aiService.askGemini(question, data);

    return { answer };
  }
}
