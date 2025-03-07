import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './appointment.entity';
import { User } from '../user/user.entity';
import * as moment from 'moment';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createAppointment(userData: any, startTime: string, endTime: string) {
        const user = await this.userRepository.findOne({ where: { id: userData.userId } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        this.validateBookingTime(start, end);

        const existingBooking = await this.checkUserBookingForDay(user.id, start);
        if (existingBooking) {
            throw new ConflictException('User can only have one booking per day');
        }

        const conflict = await this.appointmentRepository.findOne({
            where: {
                startTime: Between(start, end),
                endTime: Between(start, end),
            },
        });

        if (conflict) {
            throw new ConflictException('Time slot already booked');
        }

        const appointment = this.appointmentRepository.create({
            startTime: start,
            endTime: end,
            user,
        });

        return this.appointmentRepository.save(appointment);
    }

    async findAll() {
        return this.appointmentRepository.find({
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    username: true,
                    role: true,
                },
            },
        });
    }

    private validateBookingTime(start: Date, end: Date) {
        const now = new Date();
        const currentMonthStart = moment().startOf('month').toDate();
        const currentMonthEnd = moment().endOf('month').toDate();

        // Check if the booking is in the current month
        if (start < currentMonthStart || end > currentMonthEnd) {
            throw new BadRequestException('Bookings can only be made for the current month');
        }

        // Check if the booking is between Monday and Friday
        const dayOfWeek = moment(start).day();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            throw new BadRequestException('Bookings can only be made from Monday to Friday');
        }

        // Check if the booking is between 8:00 AM and 5:00 PM
        const startHour = moment(start).hour();
        const endHour = moment(end).hour();
        if (startHour < 8 || endHour > 17) {
            throw new BadRequestException('Bookings can only be made between 8:00 AM and 5:00 PM');
        }

        // Check if the booking is in 30-minute slots
        const duration = moment(end).diff(moment(start), 'minutes');
        if (duration !== 30) {
            throw new BadRequestException('Bookings must be exactly 30 minutes long');
        }
    }

    private async checkUserBookingForDay(userId: number, date: Date): Promise<boolean> {
        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();

        const existingBooking = await this.appointmentRepository.findOne({
            where: {
                user: { id: userId },
                startTime: Between(startOfDay, endOfDay),
            },
        });

        return !!existingBooking;
    }
}