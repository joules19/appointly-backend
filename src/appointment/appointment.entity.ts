import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @ManyToOne(() => User, (user) => user.appointments, { cascade: false })
    user: User;
}