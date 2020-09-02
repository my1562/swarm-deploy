import { DefinitionsService } from 'enxame';

export interface MariaDBOptions {
    password: string;
    publishPort?: number;
    volume: string;
}

export const MariaDB = ({
    password,
    publishPort,
    volume,
}: MariaDBOptions): DefinitionsService => ({
    image: 'mariadb:10.4.12',
    command: [
        '--character-set-server=utf8mb4',
        '--collation-server=utf8mb4_unicode_ci',
    ],
    environment: {
        MYSQL_ROOT_PASSWORD: password,
    },
    ports: publishPort ? [{ published: publishPort, target: 3306 }] : [],
    volumes: [`${volume}:/var/lib/mysql`],
});
