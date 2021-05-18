import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { LoginUserDto } from './dto/login-users.dto';
import { ResetUserDto } from './dto/reset-users-password.dto';
import { User, UsersDocument } from './schemas/users.schema';
import sha256 = require("crypto-js/sha256");

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const FindEmail = await this.userModel.find({email:createUserDto.email});
      if(FindEmail[0].email==createUserDto.email){
        return 'This email is already exist, try another email'
      }
    } catch (error) {
      var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,64}$/;
    if(createUserDto.password.match(passw)){
      if(createUserDto.password != createUserDto.repassword){
        return 'Your Password and Repeat Password does not match'
      }else{
        createUserDto.password = sha256(createUserDto.password).toString();
        createUserDto.repassword = sha256(createUserDto.repassword).toString();
        await this.usersService.create(createUserDto);
        return 'You created user successful'
      }
    }else{
      return 'Password must have at least 12 character which contain at least one numeric digit, one uppercase and one lowercase letter'
    }
    }
    
  }

  @Post('login')
  async Login(@Body() loginUserDto: LoginUserDto) {
    try {
      const FindEmail = await this.userModel.find({email:loginUserDto.email});
      loginUserDto.password=sha256(loginUserDto.password).toString();
      
      if(loginUserDto.password==FindEmail[0].password){
        return 'You are Login'
      }else{
        return 'Your password is incorrect'
      }
    } catch (error) {
      return 'No user exist'
    }
  }

  @Post('resetpassword')
  async Reset(@Body() resetUserDto: ResetUserDto) {
    await this.usersService.resetPass(resetUserDto);
    return 'The new password is sending to your email'
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

}
