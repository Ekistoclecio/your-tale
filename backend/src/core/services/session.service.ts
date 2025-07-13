import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { SessionPlayer } from '../entities/session-player.entity';
import { Chat, ChatType } from '../entities/chat.entity';
import { UserDto, SessionPlayerDto, UserPublicDto, UserPrivateDto } from '../../api/dto/user.dto';
import { CharacterListDto } from '../../api/dto/character.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
    @InjectRepository(SessionPlayer)
    private sessionPlayersRepository: Repository<SessionPlayer>,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async create(sessionData: { hasIAMaster: boolean; masterId?: string }): Promise<Session | undefined> {
    const session = this.sessionsRepository.create(sessionData);
    const savedSession = await this.sessionsRepository.save(session);

    // Criar chat geral automaticamente
    const generalChat = this.chatsRepository.create({
      sessionId: savedSession.id,
      type: ChatType.GENERAL,
      name: 'Chat Geral',
      description: 'Chat geral da sessão para todos os jogadores'
    });

    const savedGeneralChat = await this.chatsRepository.save(generalChat);

    // Atualizar a sessão com o chat geral
    await this.sessionsRepository.update(savedSession.id, { 
      chatId: savedGeneralChat.id 
    });

    // Se tem mestre humano, criar chat de anotações
    if (sessionData.masterId) {
      const annotationsChat = this.chatsRepository.create({
        sessionId: savedSession.id,
        type: ChatType.MASTER_ANNOTATIONS,
        name: 'Anotações do Mestre',
        description: 'Chat privado do mestre para anotações e conversas com IA'
      });

      const savedAnnotationsChat = await this.chatsRepository.save(annotationsChat);

      // Atualizar a sessão com o chat de anotações
      await this.sessionsRepository.update(savedSession.id, { 
        masterAnnotationsChatId: savedAnnotationsChat.id 
      });
    }

    // Retornar a sessão atualizada
    return this.findById(savedSession.id) || savedSession;
  }

  private mapUserToPublicDto(user: any): UserPublicDto {
    return {
      id: user.id,
      name: user.name,
    };
  }

  private mapUserToPrivateDto(user: any): UserPrivateDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private mapCharacterToDto(character: any): CharacterListDto {
    return {
      id: character.id,
      playerId: character.playerId,
      attributes: character.attributes,
      player: {
        id: character.player.id,
        name: character.player.name,
      },
    };
  }

  private mapSessionPlayerToDto(sessionPlayer: SessionPlayer): SessionPlayerDto {
    return {
      id: sessionPlayer.id,
      sessionId: sessionPlayer.sessionId,
      playerId: sessionPlayer.playerId,
      characterId: sessionPlayer.characterId,
      isMaster: sessionPlayer.isMaster,
      createdAt: sessionPlayer.createdAt,
      updatedAt: sessionPlayer.updatedAt,
      player: this.mapUserToPublicDto(sessionPlayer.player),
      character: sessionPlayer.character ? this.mapCharacterToDto(sessionPlayer.character) : undefined,
    };
  }

  async findById(id: string): Promise<Session | undefined> {
    const session = await this.sessionsRepository.findOne({ 
      where: { id },
      relations: ['sessionPlayers', 'sessionPlayers.player', 'sessionPlayers.character']
    });
    
    if (!session) return undefined;
    
    // Limitar dados dos usuários
    if (session.sessionPlayers) {
      session.sessionPlayers = session.sessionPlayers.map(sp => ({
        ...sp,
        player: this.mapUserToPublicDto(sp.player),
      } as any));
    }
    
    return session;
  }

  async update(id: string, updateData: Partial<Session>): Promise<Session | undefined> {
    await this.sessionsRepository.update(id, updateData);
    const session = await this.findById(id);
    return session || undefined;
  }

  async delete(id: string): Promise<void> {
    await this.sessionsRepository.delete(id);
  }

  // Métodos para SessionPlayer
  async addPlayerToSession(sessionPlayerData: {
    sessionId: string;
    playerId: string;
    characterId?: string;
    isMaster: boolean;
  }): Promise<SessionPlayer> {
    const sessionPlayer = this.sessionPlayersRepository.create(sessionPlayerData);
    return this.sessionPlayersRepository.save(sessionPlayer);
  }

  async removePlayerFromSession(sessionId: string, playerId: string): Promise<void> {
    await this.sessionPlayersRepository.delete({ sessionId, playerId });
  }

  async findSessionPlayers(sessionId: string): Promise<SessionPlayerDto[]> {
    const sessionPlayers = await this.sessionPlayersRepository.find({
      where: { sessionId },
      relations: ['player', 'character']
    });
    
    return sessionPlayers.map(sp => this.mapSessionPlayerToDto(sp));
  }

  async findPlayerSessions(playerId: string): Promise<SessionPlayerDto[]> {
    const sessionPlayers = await this.sessionPlayersRepository.find({
      where: { playerId },
      relations: ['session', 'character']
    });
    
    return sessionPlayers.map(sp => this.mapSessionPlayerToDto(sp));
  }

  async findPlayerSessionsWithDetails(playerId: string): Promise<{
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
    // Buscar todas as sessões onde o jogador participa
    const playerSessions = await this.sessionPlayersRepository.find({
      where: { playerId },
      relations: ['session']
    });

    const sessionsWithDetails = await Promise.all(
      playerSessions.map(async (playerSession) => {
        // Buscar todos os jogadores da sessão
        const sessionPlayers = await this.sessionPlayersRepository.find({
          where: { sessionId: playerSession.sessionId },
          relations: ['player', 'character']
        });

        return {
          session: playerSession.session,
          sessionPlayers: sessionPlayers.map(sp => ({
            player: {
              id: sp.player.id,
              name: sp.player.name,
              email: sp.player.email,
            },
            character: sp.character ? {
              id: sp.character.id,
              attributes: sp.character.attributes,
            } : undefined,
            isMaster: sp.isMaster,
          })),
        };
      })
    );

    return sessionsWithDetails;
  }
} 