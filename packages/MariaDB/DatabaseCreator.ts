import { DefinitionsConfig } from '@typeswarm/cli';

export interface UserPasswordDatabase {
    user: string;
    password?: string;
    database: string;
}

export interface DatabaseCreatorOptions {
    credentials: UserPasswordDatabase[];
}

const createScript = (upds: UserPasswordDatabase[]) =>
    upds
        .map((upd) => {
            return [
                upd.user === 'root'
                    ? null
                    : `CREATE USER IF NOT EXISTS '${upd.user}'@'%' ${
                          upd.password ? `IDENTIFIED BY '${upd.password}'` : ''
                      };`,
                `CREATE DATABASE IF NOT EXISTS ${upd.database};`,
                `GRANT ALL ON ${upd.database}.* TO '${upd.user}'@'%';`,
            ]
                .filter((_) => _)
                .join('\n');
        })
        .join('\n\n') + '\n';

export const DatabaseCreator = (
    options: DatabaseCreatorOptions
): DefinitionsConfig => {
    return {
        data: createScript(options.credentials),
    };
};
