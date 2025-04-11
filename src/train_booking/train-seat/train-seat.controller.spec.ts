import { Test, TestingModule } from '@nestjs/testing';
import { TrainSeatController } from './train-seat.controller';
import { TrainSeatService } from './train-seat.service';

describe('TrainSeatController', () => {
  let controller: TrainSeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainSeatController],
      providers: [TrainSeatService],
    }).compile();

    controller = module.get<TrainSeatController>(TrainSeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
