import { Test, TestingModule } from '@nestjs/testing';
import { ChatboxController } from './chatbox.controller';

describe('ChatboxController', () => {
  let controller: ChatboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatboxController],
    }).compile();

    controller = module.get<ChatboxController>(ChatboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
