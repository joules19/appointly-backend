import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment]),
        UserModule,
    ],
    providers: [AppointmentService],
    controllers: [AppointmentController],
    exports: [AppointmentService],
})
export class AppointmentModule { }