import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('appointments')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: any, @Req() req) {
        const { startTime, endTime } = body;
        return this.appointmentService.createAppointment(req.user, startTime, endTime);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    // @Roles('admin', 'user')
    async findAll() {
        return this.appointmentService.findAll();
    }
}