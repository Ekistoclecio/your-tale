import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { SessionPlayer } from './session-player.entity';
import { Chat } from './chat.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'has_ai_master', default: false })
  hasIAMaster: boolean;

  @Column({ name: 'master_id', nullable: true })
  masterId?: string;

  @Column({ name: 'chat_id', nullable: true })
  chatId?: string;

  @Column({ name: 'master_annotations_chat_id', nullable: true })
  masterAnnotationsChatId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @OneToMany(() => SessionPlayer, sessionPlayer => sessionPlayer.session)
  sessionPlayers: SessionPlayer[];

  @ManyToOne(() => Chat, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'chat_id' })
  generalChat?: Chat;

  @ManyToOne(() => Chat, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'master_annotations_chat_id' })
  masterAnnotationsChat?: Chat;
} 