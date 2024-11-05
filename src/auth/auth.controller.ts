import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/modules/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/modules/users/users.interface';
//import { RolesService } from 'src/roles/roles.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, //private rolesService: RolesService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  @ResponseMessage('Login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/register')
  @Public()
  @ResponseMessage('Register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  // @Get('/account')
  // @ResponseMessage('Get user')
  // async getAccount(@Req() request: Request, @User() user: IUser) {
  //   // const temp: any = await this.rolesService.findOne(user.role._id);
  //   // user.permissions = temp.permissions;
  //   const refreshToken = request.cookies['refresh_token'];
  //   return this.authService.findUserByToken(refreshToken); //{ ...user };
  // }

  @Get('/account')
  @ResponseMessage('Get user')
  async getAccount(@User() user: IUser) {
    // const temp: any = await this.rolesService.findOne(user.role._id);
    // user.permissions = temp.permissions;
    return this.authService.findUser(user); //{ ...user };
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage('Get user by refresh token')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refreshToken'];

    return this.authService.processNewToken(refreshToken, response);
  }

  @Public()
  @Post('/logout')
  @ResponseMessage('Logout User')
  handleLogout(
    //@User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(response);
  }
}
