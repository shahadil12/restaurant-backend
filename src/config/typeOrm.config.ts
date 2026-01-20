import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import path from "path";
import { LogLevel } from "typeorm";

type DBConfig = {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    synchronize: boolean,
    logging: LogLevel[]
}

export const typeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    try {
        const dbConfig = configService.get<DBConfig>('DB');

        if (!dbConfig) {
            throw new Error('db config configuration is undefined');
        }

        return {
            type: 'mysql',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            entities: [path.join(__dirname, "../api/**/**/*.entity.js")],
            synchronize: dbConfig.synchronize,
            logging: dbConfig.logging
        }
    } catch (error) {
        console.error('Error in typeOrmConfig:', error);
        throw new Error('Failed to load database configuration');
    }
}