import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Session } from './session.entity';
import { User } from './user.entity';
import { Character } from './character.entity';

@Entity('session_players')
export class SessionPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'player_id' })
  playerId: string;

  @Column({ name: 'character_id', nullable: true })
  characterId?: string;

  @Column({ name: 'is_master', default: false })
  isMaster: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Session, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'player_id' })
  player: User;

  @ManyToOne(() => Character, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'character_id' })
  character?: Character;
} 