import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Message } from './message.entity';
import { Session } from './session.entity';

export enum ChatType {
  GENERAL = 'general',
  MASTER_ANNOTATIONS = 'master_annotations'
}

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ 
    name: 'type',
    type: 'enum',
    enum: ChatType,
    default: ChatType.GENERAL
  })
  type: ChatType;

  @Column({ name: 'name', nullable: true })
  name?: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @ManyToOne(() => Session, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];
} 