import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Appointment } from './appointment/appointment.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Password1',
      database: 'appointment_system',
      entities: [User, Appointment],
      synchronize: false, // Disable synchronize to avoid automatic schema updates
      //logging: true, // Log all SQL queries to the console
    }),
    UserModule,
    AuthModule,
    AppointmentModule,
  ],
  providers: [],
})
export class AppModule { }