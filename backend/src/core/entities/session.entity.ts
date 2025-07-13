import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { SessionPlayer } from './session-player.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'has_ai_master', default: false })
  hasIAMaster: boolean;

  @Column({ name: 'master_id', nullable: true })
  masterId?: string;

  // TODO: Implementar quando a entidade Chat for criada
  // @Column({ name: 'chat_id' })
  // chatId: string;

  // TODO: Implementar quando a entidade Chat for criada
  // @Column({ name: 'master_annotations_id', nullable: true })
  // masterAnnotationsId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamento com SessionPlayer
  @OneToMany(() => SessionPlayer, sessionPlayer => sessionPlayer.session)
  sessionPlayers: SessionPlayer[];
} 