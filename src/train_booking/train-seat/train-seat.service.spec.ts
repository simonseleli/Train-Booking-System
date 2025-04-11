import { Test, TestingModule } from '@nestjs/testing';
import { TrainSeatService } from './train-seat.service';

describe('TrainSeatService', () => {
  let service: TrainSeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainSeatService],
    }).compile();

    service = module.get<TrainSeatService>(TrainSeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
