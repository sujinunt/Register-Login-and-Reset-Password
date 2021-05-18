import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-users.dto';
import { ResetUserDto } from './dto/reset-users-password.dto';
import { User, UsersDocument } from './schemas/users.schema';
import nodemailer = require('nodemailer');
import sha256 = require("crypto-js/sha256");

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async resetPass(resetUserDto: ResetUserDto){
    try {
      var check = await this.userModel.find({email:resetUserDto.email});
      const filter = { _id: check[0]._id };
      var Pass = sha256(resetUserDto.email+check[0]._id).toString()
      var Passed = sha256(Pass)
      const UserBody={
        password:Passed.toString(),
        repassword:Passed.toString()
      }
      await this.userModel.findOneAndUpdate(filter, UserBody);


//*********************************************************************************************** */
      // setup mail transporter service
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '', // your email
          pass: ''              // your password
        }
      });


//************************************************************************************************** */
      // setup email data with unicode symbols
      const mailOptions = {
        from: '',              // sender
        to: check[0].email,              // list of receivers
        subject: 'New Password',            // Mail subject
        html: Pass // HTML body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)});
      return 'The new password is sending to your email'
      
    } catch (error) {
      return 'Something incorrect'
    }
    
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  
  
}
