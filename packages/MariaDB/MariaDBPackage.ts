import { ComposeSpecification, DefinitionsConfig } from 'enxame';
import { MariaDBOptions, MariaDB } from './MariaDB';
import { DatabaseCreatorOptions, DatabaseCreator } from './DatabaseCreator';

export type MariaDBPackageOptions = MariaDBOptions &
    DatabaseCreatorOptions & {
        serviceName: string;
    };

export const MariaDBPackage = (
    options: MariaDBPackageOptions
): ComposeSpecification => {
    const dbService = MariaDB(options);

    const dbCreatorConfig = DatabaseCreator(options);
    const dbCreatorConfigName = `${options.serviceName}_initsql`;

    dbService.configs = dbService.configs || [];
    dbService.configs.push({
        source: dbCreatorConfigName,
        target: '/createDatabases.sql',
    });
    dbService.command = ['--init-file', '/createDatabases.sql'];

    const spec: ComposeSpecification = {
        services: {
            [options.serviceName]: dbService,
        },
        configs: {
            [dbCreatorConfigName]: dbCreatorConfig,
        },
    };

    return spec;
};
