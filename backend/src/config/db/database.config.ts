import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `${process.env.DB_HOST}`,
    port: `${process.env.DB_PORT}`,
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    entities: process.env.ENTITIES_PATH && process.env.TYPEORM_CLI != 'true' ? [process.env.ENTITIES_PATH] : ["src/core/entities/*.entity.{ts,js}"],
    migrations: process.env.MIGRATIONS_PATH && process.env.TYPEORM_CLI != 'true' ? [process.env.MIGRATIONS_PATH] : ["src/config/db/migrations/*.{ts,js}"],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);