import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WeightService } from './weight.service';

@ApiTags('Weight')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weight')
export class WeightController {
    constructor(private weightService: WeightService) { }

    @Get('project/:projectId')
    getWeightReport(@Param('projectId') projectId: string) {
        return this.weightService.getWeightReport(projectId);
    }
}
