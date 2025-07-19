import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from './user.entity';
import { Session } from './session.entity';

@Entity('characters')
@Unique(['name', 'session_id'])
export class Character {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Expose()
  @Column({ type: 'json', nullable: true })
  status: Record<string, any> | null;

  @Expose()
  @Column({ type: 'json', nullable: true })
  character_sheet: Record<string, any> | null;

  @Expose()
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Expose()
  @Column({ type: 'varchar', length: 50, nullable: true })
  character_class: string | null;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => Session, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @Column({ type: 'uuid', nullable: false })
  session_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
} 