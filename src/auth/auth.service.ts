import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Response, response } from 'express';
import ms from 'ms';
import { async } from 'rxjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
//import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { RegisterUserDto } from 'src/modules/users/dto/create-user.dto';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
import { IUser } from 'src/modules/users/users.interface';
import { UsersService } from 'src/modules/users/users.service';
//import { USER_ROLE } from 'src/databases/sample';
//import { RolesService } from 'src/roles/roles.service';

export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    //private rolesService: RolesService,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>, //@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        //const userRole = user.role as unknown as { _id: string; name: string };
        //const temp: any = await this.rolesService.findOne(userRole?._id);

        const objUser = {
          ...user.toObject(),
          //permissions: temp?.permissions ?? [],
        };

        return objUser;
      }
    }
    return null;
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  };

  async login(user: any, response: Response) {
    const { _id, fullName, email, role, phone, avatar } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      fullName,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    await this.updateUserToken(refresh_token, _id);
    //set refresh as cookies
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_ACCES_EXPIRE')) * 1000,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: { _id, email, role, fullName, phone, avatar },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const hashPassword = this.getHashPassword(registerUserDto.password);

    const isExist = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email is exist');
    }

    //const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    return await this.userModel.create({
      email: registerUserDto.email,
      password: hashPassword,
      role: 'CUSTOMER',
    });
  }

  createRefreshToken = (payload) => {
    const refresh = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh;
  };

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
    );
  };

  processNewToken = async (refreshToken: string, response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });
      let user = await this.findUserByToken(refreshToken);
      if (user) {
        const { _id, fullName, email, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          fullName,
          email,
          role,
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.updateUserToken(refresh_token, _id.toString());
        const userRole = user.role as unknown as { _id: string; name: string };
        //const temp: any = await this.rolesService.findOne(userRole._id);

        //set refresh as cookies
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_ACCES_EXPIRE')) * 1000,
        });

        const a = {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            fullName,
            email,
            role,
            //permissions: temp?.permissions ?? [],
          },
        };

        return a;
      } else {
        throw new BadRequestException(`Refresh token het han vui long login`);
      }
    } catch (err) {
      throw new BadRequestException(`Refresh token het han vui long login`);
    }
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
    // .populate({
    //   path: 'role',
    //   select: { name: 1 },
    // })
  };

  findUser = async (user: IUser) => {
    let { _id, fullName, email, role, phone, avatar } =
      await this.userModel.findOne({ _id: user._id });
    return { user: { _id, email, role, fullName, phone, avatar } };
    // .populate({
    //   path: 'role',
    //   select: { name: 1 },
    // })
  };

  logout = async (response: Response) => {
    //await this.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  };
}
