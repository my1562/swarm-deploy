import { DefinitionsService } from 'enxame';

export interface APIOptions {
    tag: string;
    dbUser: string;
    dbPassword: string;
    dbName: string;
    dbHost: string;
    port?: number;
    redis: string;
    publishPort?: number;
}

export const API = ({
    tag,
    dbName,
    dbPassword,
    dbUser,
    redis,
    dbHost,
    publishPort,
    port = 8000,
}: APIOptions): DefinitionsService => ({
    image: `docker.pkg.github.com/my1562/api/my1562api:${tag}`,
    environment: {
        DB_CONNECTION: `${dbUser}:${dbPassword}@tcp(${dbHost})/${dbName}?charset=utf8mb4&parseTime=True&loc=Local`,
        DB_DRIVER: 'mysql',
        PORT: port,
        REDIS: redis,
    },
    ports: publishPort ? [{ published: publishPort, target: port }] : [],
});
