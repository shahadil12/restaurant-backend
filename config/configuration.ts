import { ConfigObject } from "@nestjs/config";
import { readFileSync } from "fs";
import * as yaml from 'js-yaml';
import { join } from "path";

const CONFIG_FILENAME = 'dev.yaml';

type ConfigObjectType = {
    PORT: number,
    BASE_PATH: string,
    sessionSecret: string,
    expiry: number,
    NODE_ENV: string,
    saltRounds: number,
    DB: {
        host: string,
        user: string,
        password: string,
        database: string,
        port: string,
        synchronize: boolean,
        logging: string[],
        connectionLimit: number
    },
    JWT: {
        secret: string,
        expiry: string
    }
}

export default (): ConfigObject => {
    const config = yaml.load(
        readFileSync(join(__dirname, CONFIG_FILENAME), 'utf-8')
    )
    return config as ConfigObjectType
}