import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            const { username, password, role } = createUserDto;
            return await this.userService.createUser(username, password, role);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException('Username already exists');
            }
            throw error;
        }
    }
}