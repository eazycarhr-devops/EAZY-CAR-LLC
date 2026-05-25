import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { PublicApiService } from '../services/public-api.service';
import { ApiKeyGuard } from '../middleware/api-key.guard';

@Controller('api/v1')
@UseGuards(ApiKeyGuard)
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @Get('signals')
  async getSignals() {
    return this.publicApiService.getLatestSignals();
  }

  @Get('signals/:pair')
  async getSignalByPair(@Param('pair') pair: string) {
    const signal = await this.publicApiService.getSignalByPair(pair);
    if (!signal) {
      return { status: 'error', message: 'Pair not found' };
    }
    return signal;
  }

  @Get('strategies')
  async getStrategies() {
    return this.publicApiService.getHighWinRateStrategies();
  }

  @Get('gainers')
  async getGainers() {
    return this.publicApiService.getTopGainers();
  }

  @Get('blog')
  async getBlog() {
    return this.publicApiService.getLatestBlogPosts();
  }

  @Post('webhook')
  async registerWebhook(@Body() body: any) {
    return this.publicApiService.registerWebhook(body);
  }
}
