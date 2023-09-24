import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateAuthDto){
    return await this.authService.register(createUserDto);
  }
  
  @Post('login')
  async login(@Body() createUserDto: CreateAuthDto){
    return await this.authService.login(createUserDto);
  }

  @Get('logout/:username')
  async logout(@Param('username') username: string) {
    return this.authService.logout(username);
  }

}
