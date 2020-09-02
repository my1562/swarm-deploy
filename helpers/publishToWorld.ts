import { DefinitionsService } from 'enxame';
import immer from 'immer';

export interface PublishToWorldOptions {
    host: string;
    port: number;
    proto: 'http' | 'https';
    proxyNetwork?: string;
}

export const publishToWorld = (options: PublishToWorldOptions) => (
    service: DefinitionsService
): DefinitionsService => {
    return immer(service, (service: DefinitionsService) => {
        if (!service.environment) {
            service.environment = {};
        }
        if (Array.isArray(service.environment)) {
            throw new Error('service.environment should be an object');
        }

        service.environment.LETSENCRYPT_HOST = options.host;
        service.environment.VIRTUAL_HOST = options.host;
        service.environment.VIRTUAL_PORT = `${options.port}`;
        service.environment.VIRTUAL_PROTO = options.proto;

        if (!options.proxyNetwork) {
            return;
        }

        if (!service.networks) {
            service.networks = [];
        }
        if (Array.isArray(service.networks)) {
            if (!service.networks.includes('default')) {
                service.networks.push('default');
            }
            service.networks.push(options.proxyNetwork);
        } else {
            service.networks[options.proxyNetwork] =
                service.networks[options.proxyNetwork] ?? null;
        }
    });
};
