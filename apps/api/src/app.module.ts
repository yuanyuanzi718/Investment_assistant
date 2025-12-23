import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndustriesController } from './industries/industries.controller';
import { SymbolsController } from './symbols/symbols.controller';

@Module({
  imports: [],
  controllers: [AppController, IndustriesController, SymbolsController],
  providers: [AppService],
})
export class AppModule {}
