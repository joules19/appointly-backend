import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({ where: { username } });
        return user ?? undefined;
    }

    async createUser(username: string, password: string, role: string = 'user'): Promise<User> {
        // Check if the user already exists
        const existingUser = await this.findOne(username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = this.userRepository.create({
            username,
            password: hashedPassword,
            role,
        });

        return this.userRepository.save(user);
    }
}