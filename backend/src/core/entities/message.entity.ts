import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Session } from './session.entity';

export enum MessageType {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export enum ChatType {
  GENERAL = 'general',
  MASTER = 'master',
}

@Entity('messages')
@Index(['session_id', 'timestamp'])
@Index(['session_id', 'chat_type'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  sender_id: string;

  @Column({ type: 'uuid', nullable: false })
  session_id: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.USER,
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.GENERAL,
  })
  chat_type: ChatType;

  @Column({ type: 'uuid', nullable: true })
  reply_to: string | null;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  // Relacionamentos
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Session, { nullable: false })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'reply_to' })
  replyToMessage: Message | null;
} 