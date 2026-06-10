import { Module } from '@nestjs/common';
import { ContestantsController } from './contestants.controller';
import { ContestantsService } from './contestants.service';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [ContestantsController],
  providers: [ContestantsService],
  exports: [ContestantsService],
})
export class ContestantsModule {}
