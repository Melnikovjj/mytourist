import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MealsService } from './meals.service';

@ApiTags('Meals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meals')
export class MealsController {
    constructor(private mealsService: MealsService) { }

    @Get('project/:projectId')
    getMeals(@Param('projectId') projectId: string) {
        return this.mealsService.getMealsForProject(projectId);
    }

    @Post('project/:projectId')
    createMeal(@Param('projectId') projectId: string, @Body() data: any) {
        return this.mealsService.createMeal(projectId, data);
    }

    @Delete(':id')
    deleteMeal(@Param('id') id: string) {
        return this.mealsService.deleteMeal(id);
    }

    @Post(':mealId/products')
    addProduct(@Param('mealId') mealId: string, @Body() data: any) {
        return this.mealsService.addProduct(mealId, data);
    }

    @Patch('products/:productId')
    updateProduct(@Param('productId') productId: string, @Body() data: any) {
        return this.mealsService.updateProduct(productId, data);
    }

    @Delete('products/:productId')
    deleteProduct(@Param('productId') productId: string) {
        return this.mealsService.deleteProduct(productId);
    }

    @Get('project/:projectId/nutrition')
    getNutrition(@Param('projectId') projectId: string) {
        return this.mealsService.getNutritionSummary(projectId);
    }
}
