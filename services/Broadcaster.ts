import { DefinitionsService } from '@typeswarm/cli';

export interface BroadcasterOptions {
    tag: string;
    redis: string;
    telegram: string;
}

export const Broadcaster = ({
    redis,
    tag,
    telegram,
}: BroadcasterOptions): DefinitionsService => ({
    image: `docker.pkg.github.com/my1562/telegram-broadcaster/my1562-telegram-broadcaster:${tag}`,
    environment: {
        REDIS: redis,
        TELEGRAM_APITOKEN: telegram,
    },
});
