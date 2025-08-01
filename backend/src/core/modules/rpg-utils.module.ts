import { Module } from '@nestjs/common';
import { RpgUtilsController } from '../controllers/rpg-utils.controller';
import { RpgUtilsService } from '../providers/rpg-utils.service';

@Module({
  controllers: [RpgUtilsController],
  providers: [RpgUtilsService],
  exports: [RpgUtilsService],
})
export class RpgUtilsModule {} 