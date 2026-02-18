import { Module } from '@nestjs/common';
import { WeightService } from './weight.service';
import { WeightController } from './weight.controller';

@Module({
    controllers: [WeightController],
    providers: [WeightService],
    exports: [WeightService],
})
export class WeightModule { }
