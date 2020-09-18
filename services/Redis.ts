import { DefinitionsService } from '@typeswarm/cli';

export interface RedisOptions {
    publishPort?: number;
    volume: string;
}

export const Redis = ({
    publishPort,
    volume,
}: RedisOptions): DefinitionsService => ({
    image: `redis:6.0.1`,
    ports: publishPort ? [{ published: publishPort, target: 6379 }] : [],
    volumes: [`${volume}:/data`],
});
