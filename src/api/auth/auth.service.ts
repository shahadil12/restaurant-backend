import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDTO } from './dto/login-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RoleName } from '../role/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(credentials: LoginUserDTO): Promise<any> {
    const { user, isAdmin } = await this.findUser(credentials.userName);

    await this.validatePassword(credentials.password, user.password);

    const payload: JwtPayload = {
      sub: user.id,
      roleId: user.roleId,
      regionId: user.regionId,
      isAdmin,
    };

    const token =  await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    })

    return {
      token,
      user: {
        id: user.id,
        userName: user.userName,
        roleName:user.role.roleName,
        regionName:user.region.regionName,
        allowedFeatures:user.role.roleFeatures.map(x => x.feature.featureName)
      },
    };
  }

  private async findUser(userName: string) {
    try {
      const user = await this.userService.findOne({
        userName,
      });

      const isAdmin = user.role.roleName === RoleName.ADMIN;

      return { user, isAdmin };
    } catch (error) {
      throw new UnauthorizedException('Invalid user name or password');
    }
  }

  private async validatePassword(enteredPassword: string, storedPassword: string) {
    const isPasswordValid = await bcrypt.compare(enteredPassword, storedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
