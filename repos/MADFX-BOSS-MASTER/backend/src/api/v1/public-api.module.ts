import { Module } from '@nestjs/common';
import { PublicApiController } from './controllers/public-api.controller';
import { PublicApiService } from './services/public-api.service';

@Module({
  controllers: [PublicApiController],
  providers: [PublicApiService],
})
export class PublicApiModule {}
