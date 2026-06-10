import { Module } from '@nestjs/common';
import { GuestVotesController } from './guest-votes.controller';
import { GuestVotesService } from './guest-votes.service';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [GatewayModule],
  controllers: [GuestVotesController],
  providers: [GuestVotesService],
  exports: [GuestVotesService],
})
export class GuestVotesModule {}
