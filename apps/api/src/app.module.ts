import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndustriesController } from './industries/industries.controller';
import { SymbolsController } from './symbols/symbols.controller';
import { EventsController } from './events/events.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    IndustriesController,
    SymbolsController,
    EventsController,
  ],
  providers: [AppService],
})
export class AppModule {}
