import { DefinitionsService } from 'enxame';
import md5 from 'md5';

export interface AuthGatewayOptions {
    upstream: string;
    githubTeam: string;
    githubOrg: string;
    clientId: string;
    clientSecret: string;
}

export const AuthGateway = (
    options: AuthGatewayOptions
): DefinitionsService => ({
    image: 'bitnami/oauth2-proxy:5.1.1',
    command: [
        `-email-domain=*`,
        `-http-address=0.0.0.0:4180`,
        `-upstream=${options.upstream}`,
        `-github-team=${options.githubTeam}`,
        `-github-org=${options.githubOrg}`,
        `-client-id=${options.clientId}`,
        `-client-secret=${options.clientSecret}`,
        `-cookie-secret=${md5(options.clientId + options.clientSecret)}`,
        `-provider=github`,
    ],
});
