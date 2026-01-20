import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { FEATURE_KEY } from 'src/api/auth/decorators/feature.decorator';
import { Repository } from 'typeorm';
import { RoleFeature } from '../role/entities/role-feature.entity';
import { FeatureName } from '../feature/entities/feature.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    
    @InjectRepository(RoleFeature)
    private roleFeatureRepo: Repository<RoleFeature>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    request.user = await this.getPayload(token);

    const requiredFeature = this.reflector.get<FeatureName>(FEATURE_KEY, context.getHandler());

    if (!requiredFeature) return true;

    const hasAccess = await this.findRoleFeature(request.user.roleId, requiredFeature);

    if (!hasAccess) throw new ForbiddenException('Feature access denied');

    return true;
  }

  private async getPayload(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT.secret'),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private findRoleFeature(roleId: number, featureName: FeatureName) {
    return this.roleFeatureRepo.findOne({
      where: {
        roleId,
        feature: {
          featureName,
        },
      },
      relations: {
        feature: true,
      },
    });
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
