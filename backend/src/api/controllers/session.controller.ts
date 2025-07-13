import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SessionService } from '../../core/services/session.service';
import { Session } from 'src/core/entities/session.entity';
import { SessionPlayerDto } from '../dto/user.dto';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(@Body() sessionData: { hasIAMaster: boolean; masterId?: string }): Promise<Session> {
    return await this.sessionService.create(sessionData);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Session | undefined> {
    return await this.sessionService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Session>): Promise<Session | undefined> {
    return await this.sessionService.update(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.sessionService.delete(id);
  }

  // Endpoints para SessionPlayer
  @Post(':sessionId/players')
  async addPlayerToSession(
    @Param('sessionId') sessionId: string,
    @Body() playerData: { playerId: string; characterId?: string; isMaster: boolean }
  ): Promise<SessionPlayerDto> {
    return await this.sessionService.addPlayerToSession({
      sessionId,
      ...playerData
    });
  }

  @Delete(':sessionId/players/:playerId')
  async removePlayerFromSession(
    @Param('sessionId') sessionId: string,
    @Param('playerId') playerId: string
  ): Promise<void> {
    return await this.sessionService.removePlayerFromSession(sessionId, playerId);
  }

  @Get(':sessionId/players')
  async findSessionPlayers(@Param('sessionId') sessionId: string): Promise<SessionPlayerDto[]> {
    return await this.sessionService.findSessionPlayers(sessionId);
  }

  @Get('player/:playerId')
  async findPlayerSessions(@Param('playerId') playerId: string): Promise<SessionPlayerDto[]> {
    return await this.sessionService.findPlayerSessions(playerId);
  }

  @Get('player/:playerId/details')
  async findPlayerSessionsWithDetails(@Param('playerId') playerId: string): Promise<{
    session: Session;
    sessionPlayers: {
      player: {
        id: string;
        name: string;
        email: string;
      };
      character?: {
        id: string;
        attributes: Record<string, any>;
      };
      isMaster: boolean;
    }[];
  }[]> {
    return await this.sessionService.findPlayerSessionsWithDetails(playerId);
  }
} 