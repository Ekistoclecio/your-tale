import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { SessionMember } from './session-member.entity';
import { Character } from './character.entity';
import { Message } from './message.entity';
import { Note } from './note.entity';
import { Expose } from 'class-transformer';

export enum SessionStatus {
  NOT_STARTED = 'not_started',
  ACTIVE = 'active',
  ENDED = 'ended',
}

@Entity()
@Unique(['join_code'])
export class Session {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column({ nullable: true })
  description?: string;

  @Expose()
  @Column({ default: false })
  is_public: boolean;

  @Column({ default: false })
  join_after_start: boolean;

  @Column()
  player_limit: number;

  @Expose()
  @Column({ default: false })
  is_ai_master: boolean;

  @Column()
  start_date: Date;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.NOT_STARTED,
  })
  status: SessionStatus;

  @Expose()
  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column({ unique: true })
  join_code: string;

  @Column({ default: 0 })
  current_players: number;

  @Column({ type: 'json', nullable: true })
  settings?: Record<string, any>;

  @Column({ nullable: true })
  last_activity?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  history_theme?: string;

  @Column({ nullable: true })
  history_description?: string;

  @Column({ nullable: true })
  narrative_style?: string;

  @OneToMany(() => SessionMember, (member) => member.session)
  members: SessionMember[];

  @OneToMany(() => Character, (character) => character.session)
  characters: Character[];

  @OneToMany(() => Message, (message) => message.session)
  messages: Message[];

  @OneToMany(() => Note, (note) => note.session)
  notes: Note[];
}
