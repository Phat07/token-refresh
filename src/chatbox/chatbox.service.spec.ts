import { Test, TestingModule } from '@nestjs/testing';
import { ChatboxService } from './chatbox.service';

describe('ChatboxService', () => {
  let service: ChatboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatboxService],
    }).compile();

    service = module.get<ChatboxService>(ChatboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
