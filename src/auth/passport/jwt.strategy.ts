import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/modules/users/users.interface';
//import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, //private rolesService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN'),
    });
  }

  async validate(payload: IUser) {
    const { _id, fullName, email, role, avatar } = payload;
    //const userRole = role as unknown as { _id: string; name: string };
    //const temp: any = await this.rolesService.findOne(userRole._id);

    return {
      _id,
      fullName,
      email,
      role,
      avatar,

      //permissions: temp?.permissions ?? [],
    };
  }
}
