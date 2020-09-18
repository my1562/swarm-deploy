import { DefinitionsService } from '@typeswarm/cli';
import immer from 'immer';

export const bindToNodeWithLabel = (label: string) => (
    service: DefinitionsService
): DefinitionsService => {
    return immer(service, (service: DefinitionsService) => {
        if (!service.deploy) {
            service.deploy = {};
        }
        if (!service.deploy.placement) {
            service.deploy.placement = {};
        }
        if (!service.deploy.placement.constraints) {
            service.deploy.placement.constraints = [];
        }
        service.deploy.placement.constraints.push(`node.labels.${label}==true`);
    });
};
