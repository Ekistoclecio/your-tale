import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../entities/character.entity';
import { CharacterController } from 'src/api/controllers/character.controller';
import { CharacterService } from '../services/character.service';

@Module({
  imports: [TypeOrmModule.forFeature([Character])],
  controllers: [CharacterController],
  providers: [CharacterService],
  exports: [TypeOrmModule, CharacterService],
})
export class CharactersModule {} 