
import { Module } from '@nestjs/common';
import { OrchestratorModule } from './agents/orchestrator.module';
import { PublicApiModule } from './api/v1/public-api.module';

@Module({
  imports: [OrchestratorModule, PublicApiModule],
})
export class AppModule {}
