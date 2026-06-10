import { Module } from '@nestjs/common';
import { JudgesController } from './judges.controller';
import { JudgesService } from './judges.service';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [JudgesController],
  providers: [JudgesService],
  exports: [JudgesService],
})
export class JudgesModule {}
