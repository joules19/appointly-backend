import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: string;

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];
}