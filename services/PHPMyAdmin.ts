import { DefinitionsService } from '@typeswarm/cli';

export interface PHPMyAdminOptions {
    publishPort?: number;
}

export const PHPMyAdmin = ({
    publishPort,
}: PHPMyAdminOptions): DefinitionsService => ({
    image: 'phpmyadmin/phpmyadmin:5.0.2',
    ports: publishPort ? [{ published: publishPort, target: 80 }] : [],
});
