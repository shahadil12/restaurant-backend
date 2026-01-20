import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

type jwtConfig = {
    secret: string
    expiry: string
}

export const jwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
    try {
        const jwtConfig = configService.get<jwtConfig>('JWT');

        if (!jwtConfig) {
            throw new Error('JWT configuration is undefined');
        }

        return {
            global: true,
            secret: jwtConfig.secret,
            signOptions: { expiresIn: jwtConfig.expiry }
        }
    } catch (error) {
        console.error('Error in jwtConfig:', error);
        throw new Error('Failed to load jwt configuration');
    }
}