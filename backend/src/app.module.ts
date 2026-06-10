import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { GatewayModule } from './gateway/gateway.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ContestantsModule } from './contestants/contestants.module';
import { JudgesModule } from './judges/judges.module';
import { CategoriesModule } from './categories/categories.module';
import { ScoresModule } from './scores/scores.module';
import { GuestVotesModule } from './guest-votes/guest-votes.module';
import { CompetitionModule } from './competition/competition.module';
import { SeedService } from './seed/seed.service';

const staticModule = process.env.NODE_ENV === 'production'
  ? [ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'dist', 'queen-of-queens-app', 'browser'),
      exclude: ['/api/(.*)', '/socket.io/(.*)'],
      serveStaticOptions: { fallthrough: true },
    })]
  : [];

@Module({
  imports: [
    ...staticModule,
    PrismaModule,
    GatewayModule,
    AuthModule,
    EventsModule,
    ContestantsModule,
    JudgesModule,
    CategoriesModule,
    ScoresModule,
    GuestVotesModule,
    CompetitionModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
