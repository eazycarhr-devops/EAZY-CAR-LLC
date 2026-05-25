
import { Module } from '@nestjs/common';
import { OrchestratorModule } from './agents/orchestrator.module';

@Module({
  imports: [OrchestratorModule],
})
export class AppModule {}
